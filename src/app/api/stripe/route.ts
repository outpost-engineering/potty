import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/libs/auth";
import { stripe } from "~/libs/stripe";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, slug, description } = await req.json();

    const customer = await stripe.customers.create({
      email: session.user.email,
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.STRIPE_BASE_PLAN_PRICE_ID }],
      expand: ["items.data"],
    });

    const usagePrice = await stripe.prices.create({
      unit_amount: 150,
      currency: "usd",
      recurring: {
        interval: "month",
        usage_type: "metered",
      },
      product: subscription.items.data[0].price.product as string,
    });

    const usageItem = await stripe.subscriptionItems.create({
      subscription: subscription.id,
      price: usagePrice.id,
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [{ price: process.env.STRIPE_BASE_PLAN_PRICE_ID }],
      success_url: `${process.env.BASE_URL}/${slug}?created=true`,
      cancel_url: `${process.env.BASE_URL}/kitchen/create`,
      metadata: {
        name,
        slug,
        description,
        userId: session.user.id,
        customerId: customer.id,
        subscriptionId: subscription.id,
        usageItemId: usageItem.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}

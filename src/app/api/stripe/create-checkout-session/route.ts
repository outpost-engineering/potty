import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getBody } from "~/libs/server";
import { stripe } from "~/libs/stripe";

const createKitchenSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(255).optional(),
  image: z.string().url().optional(),
  website: z.string().url().optional(),
  location: z.string().max(100).optional(),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    console.log("in checkout session");
    const parsed = await getBody(req, createKitchenSchema);
    if (!parsed.data) return parsed.response;

    console.log("req data:", parsed.data);

    const { name, slug, description, image, website, location, email } =
      parsed.data;

    const customer = await stripe.customers.create({ email });

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
        description: description || "",
        image: image || "",
        website: website || "",
        location: location || "",
        email,
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

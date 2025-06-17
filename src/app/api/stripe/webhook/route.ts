import { NextRequest } from "next/server";
import { prisma } from "~/libs/prisma";
import { stripe } from "~/libs/stripe";

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const rawBody = await req.arrayBuffer();
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;

      // Attach metered price item to subscription
      const usagePriceId = process.env.STRIPE_USAGE_PRICE_ID!; // $1.50 per 50k feedbacks

      const usageItem = await stripe.subscriptionItems.create({
        subscription: subscriptionId,
        price: usagePriceId,
      });

      await prisma.kitchen.create({
        data: {
          name: session.metadata!.name!,
          slug: session.metadata!.slug!,
          description: session.metadata!.description!,
          customerId,
          subscriptionId,
          usageItemId: usageItem.id,
          lastBilledUsageBlock: 0,
          spendingLimit: 20,
          memberships: {
            create: {
              uid: "TODO", // resolve from session.metadata or lookup by email
              role: "Owner",
            },
          },
        },
      });
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("[Webhook Error]", err);
    return new Response("Webhook error", { status: 400 });
  }
}

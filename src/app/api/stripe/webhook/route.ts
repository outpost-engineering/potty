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

      await prisma.kitchen.create({
        data: {
          name: session.metadata?.name!,
          slug: session.metadata?.slug!,
          description: session.metadata?.description!,
          customerId: session.metadata?.customerId!,
          subscriptionId: session.metadata?.subscriptionId!,
          usageItemId: session.metadata?.usageItemId!,
          lastBilledUsageBlock: 0,
          spendingLimit: 20,
          memberships: {
            create: {
              uid: session.metadata?.customerId!,
              role: "Owner",
            },
          },
        },
      });
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    return new Response("Webhook error", { status: 400 });
  }
}

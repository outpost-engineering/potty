import { NextRequest } from "next/server";
import { prisma } from "~/libs/prisma";
import { stripe } from "~/libs/stripe";

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  console.log("WEBHOOK");
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

      const pendingKitchenId = session.metadata?.pendingKitchenId;
      if (!pendingKitchenId) {
        console.error("Missing pendingKitchenId in metadata.");
        return new Response("Missing metadata", { status: 400 });
      }

      const pending = await prisma.pendingKitchen.findUnique({
        where: { id: pendingKitchenId },
      });
      if (!pending) {
        console.error("Pending kitchen not found:", pendingKitchenId);
        return new Response("Not found", { status: 400 });
      }

      const existing = await prisma.kitchen.findFirst({
        where: { slug: pending.slug },
      });
      if (existing) {
        console.warn("Kitchen already exists:", pending.slug);
        return new Response("Already exists", { status: 200 });
      }

      if (!session.subscription || !session.customer) {
        console.error("Missing subscription/customer in session");
        return new Response("Missing Stripe data", { status: 400 });
      }

      const kitchen = await prisma.kitchen.create({
        data: {
          name: pending.name,
          slug: pending.slug,
          description: pending.description,
          image: pending.image,
          website: pending.website,
          location: pending.location,
          customerId: session.customer as string,
          subscriptionId: session.subscription as string,
          usageItemId: "not-used",
          lastBilledUsageBlock: 0,
          spendingLimit: 20,
          memberships: {
            create: {
              uid: pending.userId,
              role: "Owner",
            },
          },
        },
      });

      await prisma.pendingKitchen.delete({ where: { id: pendingKitchenId } });
      console.log("Kitchen created:", kitchen.id);
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("[Webhook Error]", err);
    return new Response("Webhook error", { status: 400 });
  }
}

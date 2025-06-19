"use server";

import { z } from "zod";
import { auth, signOut } from "./auth";
import { prisma } from "./prisma";
import { stripe } from "./stripe";

const impressionSchema = z.object({
  note: z.string().min(1).max(1500),
  emotion: z.enum(["😍", "😁", "😟", "😭"]).optional(),
});

export async function logout() {
  await signOut({ redirectTo: "/" });
}

export async function addImpression(note: string, emotion?: string) {
  try {
    const session = await auth();

    if (!session) {
      return false;
    }

    const result = impressionSchema.safeParse({ note, emotion });

    if (!result.success) {
      return false;
    }

    const response = await fetch(`${process.env.BASE_URL}/api/impression`, {
      method: "POST",
      body: JSON.stringify({
        note,
        emotion,
        email: session.user!.email,
      }),
      headers: {
        Authorization: `Bearer ${process.env.POTTY_IMPRESSION_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function isKitchenSlugAvailable(slug: string) {
  try {
    const session = await auth();

    if (!session) {
      return false;
    }

    const kitchen = await prisma.kitchen.findUnique({
      where: {
        slug,
      },
    });

    return kitchen === null;
  } catch {
    return false;
  }
}

export async function startKitchenCheckout(
  name: string,
  slug: string,
  description?: string,
  image?: string,
  website?: string,
  location?: string,
) {
  try {
    const session = await auth();
    if (!session) return false;

    const userId = session.user?.id;
    const email = session.user?.email;
    if (!userId || !email) return false;

    const pending = await prisma.pendingKitchen.create({
      data: {
        userId,
        name,
        slug,
        description: description || "",
        image: image || "",
        website: website || "",
        location: location || "",
        stripeSessionId: "asdf",
      },
    });

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_BASE_PLAN_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/${slug}`,
      cancel_url: `${process.env.BASE_URL}/kitchen/create`,
      metadata: {
        pendingKitchenId: pending.id,
      },
    });

    // Needed for db querying in webhook to avoid duplicate kitchens etc.
    await prisma.pendingKitchen.update({
      where: { id: pending.id },
      data: { stripeSessionId: stripeSession.id },
    });

    return stripeSession.url;
  } catch {
    return false;
  }
}

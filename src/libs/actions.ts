"use server";

import { z } from "zod";
import { auth, signOut } from "./auth";
import { prisma } from "./prisma";

const impressionSchema = z.object({
  note: z.string().min(1).max(1500),
  emotion: z.enum(["😍", "😁", "😟", "😭"]).optional(),
});

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

    const email = session.user?.email;
    const result = createKitchenSchema.safeParse({
      name,
      slug,
      email,
      description,
      image,
      website,
      location,
    });
    if (!result.success) return false;

    const res = await fetch(
      `${process.env.BASE_URL}/api/stripe/create-checkout-session`,
      {
        method: "POST",
        body: JSON.stringify({
          name,
          slug,
          email,
          description,
          image,
          website,
          location,
        }),
      },
    );

    const data = await res.json();

    console.log("response", data);

    if (!res.ok || !data.url) return false;

    return data.url;
  } catch {
    return false;
  }
}

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

export async function createKitchen(name: string, slug: string) {
  try {
    const session = await auth();

    if (!session) {
      return false;
    }

    const result = createKitchenSchema.safeParse({ name, slug });

    if (!result.success) {
      return false;
    }

    const kitchen = await prisma.kitchen.create({
      data: {
        name,
        slug,
        memberships: {
          create: {
            uid: session.user!.id!,
            role: "Owner",
          },
        },
      },
    });

    return kitchen !== null;
  } catch {
    return false;
  }
}

"use server";

import { z } from "zod";
import { auth, signOut } from "./auth";

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

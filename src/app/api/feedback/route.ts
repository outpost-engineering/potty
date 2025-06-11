import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "~/libs/prisma";
import { error, forbidden, getBearerToken, unauthorized } from "~/libs/server";

const feedbackSchema = z.object({
  note: z
    .string()
    .min(1, "Note is required")
    .max(1500, "Note must be 1500 characters or fewer"),
  email: z.string().email("Invalid email").optional(),
  url: z.string().url("Invalid URL").optional(),
  emotion: z
    .string()
    // Emoji might be 2 UTF-16 code units
    .max(2, "Emotion must be a single emoji")
    .optional(),
  label: z.string().max(50, "Label must be 50 characters or fewer").optional(),
});

export async function POST(req: NextRequest) {
  const token = getBearerToken(req);

  if (!token) {
    return unauthorized("Token is missing");
  }

  const appToken = await prisma.appToken.findUnique({
    where: { token },
    include: { app: true },
  });

  if (!appToken) {
    return forbidden("Invalid token");
  }

  if (appToken.expiresAt && appToken.expiresAt < new Date()) {
    return forbidden("Token expired");
  }

  const body = await req.json();
  const parse = feedbackSchema.safeParse(body);

  if (!parse.success) {
    return error("Invalid request body", 400, {
      issues: parse.error?.flatten(),
    });
  }

  await prisma.feedback.create({
    data: {
      ...parse.data,
      aid: appToken.aid,
    },
  });

  return NextResponse.json({}, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "~/libs/prisma";
import {
  forbidden,
  getBearerToken,
  getBody,
  unauthorized,
} from "~/libs/server";

const impressionSchema = z.object({
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
  try {
    const token = getBearerToken(req);

    if (!token) {
      return unauthorized("Token is missing");
    }

    const potToken = await prisma.potToken.findUnique({
      where: { token },
      include: { pot: true },
    });

    if (!potToken) {
      return forbidden("Invalid token");
    }

    if (potToken.expiresAt && potToken.expiresAt < new Date()) {
      return forbidden("Token expired");
    }

    const parsed = await getBody(req, impressionSchema);

    if (!parsed.data) {
      return parsed.response;
    }

    await prisma.impression.create({
      data: {
        ...parsed.data,
        pid: potToken.pid,
      },
    });

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}

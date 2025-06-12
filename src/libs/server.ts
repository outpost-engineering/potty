import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";

export function error(
  message: string,
  status: number = 400,
  additional: object = {},
) {
  return NextResponse.json(
    { error: message, statusCode: status, ...additional },
    { status },
  );
}

export function unauthorized(message: string) {
  return error(message, 401);
}

export function forbidden(message: string) {
  return error(message, 403);
}

export function getBearerToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split("Bearer ")[1].trim();
}

export async function getBody<T>(
  req: NextRequest,
  schema: ZodSchema<T>,
): Promise<{ data?: T; response?: Response }> {
  let json: unknown;

  try {
    json = await req.json();
  } catch {
    return {
      response: error("Request body must be valid JSON", 400),
    };
  }

  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return {
      response: error("Invalid request body", 400, {
        issues: parsed.error.flatten(),
      }),
    };
  }

  return { data: parsed.data };
}

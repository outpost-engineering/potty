import { NextRequest, NextResponse } from "next/server";

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

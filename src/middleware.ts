import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "~/libs/auth";

export async function middleware(req: NextRequest) {
  const session = await auth();

  if (session?.user && req.nextUrl.pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/overview";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

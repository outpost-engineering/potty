import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "~/libs/auth";

export async function middleware(req: NextRequest) {
  const session = await auth();

  if (req.nextUrl.pathname === "/") {
    if (session?.user) {
      const url = req.nextUrl.clone();
      url.pathname = "/overview";
      return NextResponse.redirect(url);
    }

    const url = req.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

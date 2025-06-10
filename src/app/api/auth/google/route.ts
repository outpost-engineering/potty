import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createSession } from "~/libs/auth";
import { prisma } from "~/libs/prisma";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const cookieStore = await cookies();
  const redirect = cookieStore.get("potty.redirect_uri")?.value ?? "/test";
  await cookieStore.delete("potty.redirect_uri");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.AUTH_GOOGLE_ID!,
      client_secret: process.env.AUTH_GOOGLE_SECRET!,
      redirect_uri: `${process.env.BASE_URL}/api/auth/google`,
      grant_type: "authorization_code",
    }),
  }).then((res) => res.json());

  if (!tokenRes.access_token) {
    return NextResponse.json(
      { error: "Token exchange failed" },
      { status: 400 },
    );
  }

  const accessToken = tokenRes.access_token;

  const userInfo = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  ).then((res) => res.json());

  const { email, name, picture } = userInfo;

  if (!email) {
    return NextResponse.json(
      { error: "Email not found in Google profile" },
      { status: 400 },
    );
  }

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: nanoid(),
        email,
        name: name || "No Name",
        picture,
      },
    });
  }

  await createSession(user);
  return NextResponse.redirect(`${process.env.BASE_URL}/${redirect}`);
}

import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/utils/prisma";
import { createSession } from "~/utils/session";

interface GithubProfile {
  name: string;
  avatar_url: string;
}

interface GithubEmail {
  email: string;
  primary: boolean;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const cookieStore = await cookies();
  const redirect = cookieStore.get("potty.redirect_uri") ?? "/~";
  await cookieStore.delete("potty.redirect_uri");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const accessToken = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.AUTH_GITHUB_ID!,
        client_secret: process.env.AUTH_GITHUB_SECRET!,
        code,
      }),
    },
  )
    .then((res) => res.json())
    .then((json) => json.access_token)
    .catch(() => null);

  if (!accessToken) {
    return NextResponse.json(
      { error: "Token exchange failed" },
      { status: 400 },
    );
  }

  const email = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  })
    .then((res) => res.json() as unknown as GithubEmail[])
    .then((emails) => emails.find((e) => e.primary)?.email)
    .catch(() => null);

  if (!email) {
    return NextResponse.json(
      { error: "Email retrieval failed" },
      { status: 400 },
    );
  }

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const profile = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json() as unknown as GithubProfile)
      .catch(() => null);

    if (!profile) {
      return NextResponse.json(
        { error: "User retrieval failed" },
        { status: 400 },
      );
    }

    user = await prisma.user.create({
      data: {
        id: nanoid(),
        email,
        name: profile.name,
        picture: profile.avatar_url,
      },
    });
  }

  await createSession(user);
  return NextResponse.redirect(process.env.BASE_URL! + redirect);
}

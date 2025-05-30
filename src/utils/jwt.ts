import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  picture: string | null;
}

interface Session {
  user: User;
}

export async function createAccessToken(user: User) {
  const accessToken = await jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    },
  );

  const cookieStore = await cookies();
  cookieStore.set("potty_access_token", accessToken, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("potty_access_token")?.value;

  if (!token) return null;

  try {
    const decoded = (await jwt.verify(
      token,
      process.env.JWT_SECRET!,
    )) as JWTPayload;

    return {
      user: {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      },
    } as Session;
  } catch {
    return null;
  }
}

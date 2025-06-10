import { User } from "@prisma/client";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "~/config/cookies";

export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  picture: string | null;
}

export interface Session {
  user: User;
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE);

  if (!token) return null;

  try {
    const { payload } = await jwtVerify<TokenPayload>(token.value, secret);
    return {
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      },
    } as Session;
  } catch {
    return null;
  }
}

export async function createSession(user: User) {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
    picture: user.picture,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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

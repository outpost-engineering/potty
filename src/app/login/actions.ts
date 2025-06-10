"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginWith(provider: string, redirectUrl: string) {
  const cookieStore = await cookies();
  await cookieStore.set("potty.redirect_uri", redirectUrl ?? "/space");

  const callback = `${process.env.BASE_URL}/api/auth/${provider.toLowerCase()}`;

  switch (provider) {
    case "Github":
      redirect(
        `https://github.com/login/oauth/authorize?client_id=${process.env.AUTH_GITHUB_ID}&scope=read:user user:email&redirect_uri=${callback}`,
      );
    case "Google":
      redirect(
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.AUTH_GOOGLE_ID}&response_type=code&scope=openid email profile&redirect_uri=${callback}`,
      );
  }
}

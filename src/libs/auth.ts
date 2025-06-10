import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import {
  AUTH_COOKIE,
  CALLBACK_URL_COOKIE,
  CSRF_TOKEN_COOKIE,
} from "~/config/cookies";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub, Google],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: AUTH_COOKIE,
    },
    csrfToken: {
      name: CSRF_TOKEN_COOKIE,
    },
    callbackUrl: {
      name: CALLBACK_URL_COOKIE,
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      return session;
    },
  },
});

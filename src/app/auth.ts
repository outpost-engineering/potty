import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  cookies: {
    csrfToken: {
      name: "potty.csrf-token",
    },
    sessionToken: {
      name: "potty.session-token",
    },
    callbackUrl: {
      name: "potty.callback-url",
    },
  },
  callbacks: {
    session: ({ session, token, user }) => ({
      ...session,
      user: {
        ...user,
        id: token.sub!,
      },
    }),
  },
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
});

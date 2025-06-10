"use server";

import { auth } from "~/libs/auth";
import { prisma } from "~/libs/prisma";

export async function isTeamSlugAvailable(slug: string) {
  try {
    const session = await auth();

    if (!session) {
      return false;
    }

    const team = await prisma.team.findUnique({
      where: {
        slug,
      },
    });

    return team === null;
  } catch {
    return false;
  }
}

export async function createTeam(name: string, slug: string) {
  try {
    const session = await auth();

    if (!session) {
      return false;
    }

    const team = await prisma.team.create({
      data: {
        name,
        slug,
        memberships: {
          create: {
            uid: session.user!.id!,
            role: "Owner",
          },
        },
      },
    });

    return team !== null;
  } catch {
    return false;
  }
}

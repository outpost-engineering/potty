"use server";

import { Team } from "@prisma/client";
import { getSession } from "~/libs/auth";
import { prisma } from "~/libs/prisma";

export async function isAppNameAvailable(team: Team, name: string) {
  try {
    if (!(await isUserTeamAdmin(team))) return false;

    console.log("WE GET HERE");
    const app = await prisma.app.findUnique({
      where: {
        tid_name: {
          tid: team.id,
          name: name,
        },
      },
    });

    return app === null;
  } catch {
    return false;
  }
}

export async function createApp(
  team: Team,
  name: string,
  description: string | undefined,
) {
  try {
    if (!(await isUserTeamAdmin(team))) return false;

    const app = await prisma.app.create({
      data: {
        name,
        description,
        team: {
          connect: {
            id: team.id,
          },
        },
      },
    });

    return app !== null;
  } catch {
    return false;
  }
}

export async function createApiKey(
  team: Team,
  appId: string,
  expiresAt?: string,
) {
  try {
    if (!(await isUserTeamAdmin(team))) return false;
  } catch {
    return false;
  }
}

async function isUserTeamAdmin(team: Team) {
  const session = await getSession();
  if (!session) return null;

  const membership = await prisma.membership.findUnique({
    where: {
      uid_tid: {
        uid: session.user.id,
        tid: team.id,
      },
    },
  });

  return membership?.role === "Admin" || membership?.role === "Owner";
}

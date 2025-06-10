"use server";

import { Team } from "@prisma/client";
import { getSession } from "~/libs/auth";
import { prisma } from "~/libs/prisma";

export async function isAppNameAvailable(team: Team, name: string) {
  try {
    const session = await getSession();

    if (!session) {
      return false;
    }

    const membership = await prisma.membership.findUnique({
      where: {
        uid_tid: {
          uid: session.user.id,
          tid: team.id,
        },
      },
    });

    if (!membership) {
      return false;
    }

    const role = membership.role;

    if (role === "Member") {
      return false;
    }

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
    const session = await getSession();

    if (!session) {
      return false;
    }

    const membership = await prisma.membership.findUnique({
      where: {
        uid_tid: {
          uid: session.user.id,
          tid: team.id,
        },
      },
    });

    if (!membership) {
      return false;
    }

    const role = membership.role;

    if (role === "Member") {
      return false;
    }

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

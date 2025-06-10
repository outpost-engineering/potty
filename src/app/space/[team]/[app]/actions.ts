"use server";

import { Team } from "@prisma/client";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { getSession } from "~/libs/auth";
import { prisma } from "~/libs/prisma";

export async function isAppNameAvailable(team: Team, name: string) {
  try {
    const { session, membership } = await getMembership(team);
    if (!session || membership?.role === "Member") return false;

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
    const { session, membership } = await getMembership(team);
    if (!session || membership?.role === "Member") return false;

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
    const { session, membership } = await getMembership(team);
    if (!session || membership?.role === "Member") return false;

    const key = `api_${nanoid(32)}`;

    const apiKey = await prisma.apiKey.create({
      data: {
        key,
        aid: appId,
        uid: session.user.id,
        expiresAt: expiresAt ?? null,
      },
    });

    revalidatePath(`/teams/${team.id}/apps/${appId}`);
    return apiKey != null;
  } catch {
    return false;
  }
}

async function getMembership(team: Team) {
  const session = await getSession();
  if (!session) return { session: null, membership: null };

  const membership = await prisma.membership.findUnique({
    where: {
      uid_tid: {
        uid: session.user.id,
        tid: team.id,
      },
    },
  });

  return { session, membership };
}

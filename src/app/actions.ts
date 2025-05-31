"use server";

import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { prisma } from "~/app/prisma";
import { getSession } from "~/utils/jwt";

export async function createTeam(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const team = await prisma.team.create({
    data: {
      id: nanoid(),
      slug: formData.get("slug")?.toString() ?? "",
      name: formData.get("slug")?.toString() ?? "",
      description: formData.get("description")?.toString() || undefined,
      website: formData.get("website")?.toString() || undefined,
      location: formData.get("location")?.toString() || undefined,
      memberships: {
        create: {
          uid: session.user.id,
          role: "Owner",
        },
      },
    },
  });

  redirect(`/${team.slug}`);
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "~/libs/prisma";

interface Params {
  team: string;
}

interface Props {
  params: Promise<Params>;
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const team = await prisma.team.findUnique({
    where: { slug: params.team },
  });

  if (!team) {
    return notFound();
  }

  return {
    title: team.name,
    description: team.description,
  } as Metadata;
}

export default async function Team(props: Props) {
  const params = await props.params;
  const team = await prisma.team.findUnique({
    where: { slug: params.team },
  });

  if (!team) {
    return notFound();
  }

  return <div></div>;
}

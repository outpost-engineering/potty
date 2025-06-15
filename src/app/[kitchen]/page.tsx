import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "~/libs/prisma";

interface Params {
  kitchen: string;
}

interface Props {
  params: Promise<Params>;
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const kitchen = await prisma.kitchen.findUnique({
    where: { slug: params.kitchen },
  });

  if (!kitchen) {
    return notFound();
  }

  return {
    title: kitchen.name,
    description: kitchen.description,
  } as Metadata;
}

export default async function Kitchen(props: Props) {
  const params = await props.params;
  const kitchen = await prisma.kitchen.findUnique({
    where: { slug: params.kitchen },
  });

  if (!kitchen) {
    return notFound();
  }

  return <div></div>;
}

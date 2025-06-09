import { GlobeAltIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/avatar";
import { prisma } from "~/utils/prisma";

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

  return (
    <div className="mt-6">
      <div className="flex w-full gap-5">
        <Avatar className="size-20 rounded-none sm:size-24">
          <AvatarImage src={team.picture!} />
          <AvatarFallback className="rounded-md text-3xl">
            {team.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-lg font-medium sm:text-2xl">{team.name}</h1>
          <p className="text-muted-foreground text-xs sm:mt-2 sm:text-base">
            {team.description ?? "No description"}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:gap-6">
            {team.location && (
              <div className="text-muted-foreground flex items-center gap-0.5 overflow-hidden text-xs text-ellipsis whitespace-nowrap sm:gap-1 sm:text-sm">
                <MapPinIcon className="size-4 sm:size-5" />
                {team.location}
              </div>
            )}
            {team.website && (
              <div className="text-muted-foreground flex items-center gap-0.5 overflow-hidden text-xs text-ellipsis whitespace-nowrap sm:gap-1 sm:text-sm">
                <GlobeAltIcon className="size-4 sm:size-5" />
                {team.website}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-10 w-full"></div>
    </div>
  );
}

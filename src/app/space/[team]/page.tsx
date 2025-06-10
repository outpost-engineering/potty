import { GlobeAltIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/avatar";
import { Button } from "~/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/card";
import { CreateAppDialog } from "~/components/create-app-dialog";
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
    include: { apps: true },
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
      {/* <Card className="mt-10">
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-between">
            Getting Started
            <div className="text-muted-foreground hover:text-foreground transition-all">
              <XMarkIcon className="size-5" />
            </div>
          </CardTitle>
          <CardDescription>There is still some stuff missing</CardDescription>
        </CardHeader>
      </Card> */}
      <div className="mt-10 flex items-center justify-between">
        <h1 className="text-2xl font-medium">All Apps</h1>
        <CreateAppDialog team={team}>
          <Button size="sm">New app</Button>
        </CreateAppDialog>
      </div>
      <div className="gird-cols-1 mt-5 grid md:grid-cols-2 lg:grid-cols-3">
        {team.apps.map((a) => (
          <Link
            key={a.id}
            href={`/${team.slug}/${a.name}`}
            className="shrink-0 overflow-hidden"
          >
            <Card className="w-xs">
              <CardHeader className="flex items-center gap-2">
                <Avatar className="size-12 rounded-none">
                  <AvatarImage src={a.picture!} />
                  <AvatarFallback className="rounded-md text-lg">
                    {a.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="line-clamp-1 flex flex-row items-center gap-2">
                    {a.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-1 max-w-[12rem] overflow-hidden text-ellipsis">
                    {a.description ?? "No description"}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardFooter className="border-t">
                <p className="text-muted-foreground text-sm">10000 reports</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      {/* <div className="mt-10 h-20 w-full">
        <div className="border-primary w-fit border-b px-4 py-2">
          Getting Started
        </div>
      </div> */}
    </div>
  );
}

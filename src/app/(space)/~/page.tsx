import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/card";
import { ScrollArea, ScrollBar } from "~/common/scroll-area";
import { prisma } from "~/utils/prisma";
import { getSession } from "~/utils/session";

export default async function MyOverview() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const memberships = await prisma.membership.findMany({
    where: { uid: session.user.id },
    include: {
      team: {
        include: {
          apps: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="mt-6 flex items-center justify-between">
        <h1 className="text-2xl font-medium">Your Teams</h1>
        <Link
          href="/~/settings/teams"
          className="text-primary flex w-fit items-center text-sm"
        >
          Show all teams
          <ArrowLongRightIcon className="size-5" />
        </Link>
      </div>
      {memberships.length !== 0 && (
        <ScrollArea className="mt-5 w-full whitespace-nowrap">
          <div className="flex w-max space-x-3">
            {memberships.map((m) => (
              <Link
                key={m.tid}
                href={`/${m.team.slug}`}
                className="shrink-0 overflow-hidden"
              >
                <Card className="w-xs">
                  <CardHeader className="flex items-center gap-2">
                    <Avatar className="size-12 rounded-none">
                      <AvatarImage src={m.team.picture!} />
                      <AvatarFallback className="rounded-md text-lg">
                        {m.team.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="line-clamp-1 flex flex-row items-center gap-2">
                        {m.team.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-1 max-w-[12rem] overflow-hidden text-ellipsis">
                        {m.team.description ?? "No description"}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter className="border-t">
                    <p className="text-muted-foreground text-sm">
                      {m.team.apps.length === 0 && "No Apps"}
                      {m.team.apps.length !== 0 && `${m.team.apps.length} Apps`}
                    </p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
      {memberships.length === 0 && (
        <div className="mt-14 flex w-full items-center justify-center">
          <div className="text-muted-foreground w-full text-center">
            You&apos;re not on any teams yet — create or join one to get
            started. <br />
            (Psst... click your profile in the top right ↗️.)
          </div>
        </div>
      )}
    </div>
  );
}

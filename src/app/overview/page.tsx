import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { Metadata } from "next";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { auth } from "~/libs/auth";
import { prisma } from "~/libs/prisma";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function Overview() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const memberships = await prisma.membership.findMany({
    where: { uid: session.user!.id },
    include: {
      kitchen: true,
    },
  });

  return (
    <div>
      <div className="mt-6 flex items-center justify-between">
        <h1 className="text-2xl font-medium">Your Kitchens</h1>
        <Link
          href="/settings/kitchens"
          className="text-primary flex w-fit items-center text-sm"
        >
          Show all kitchens
          <ArrowLongRightIcon className="size-5" />
        </Link>
      </div>
      {memberships.length !== 0 && (
        <ScrollArea className="mt-5 w-full whitespace-nowrap">
          <div className="flex w-max space-x-3">
            {memberships.map((m) => (
              <Link
                key={m.kid}
                href={`/${m.kitchen.slug}`}
                className="shrink-0 overflow-hidden"
              >
                <Card className="w-xs">
                  <CardHeader className="flex items-center gap-2">
                    <Avatar className="size-12 rounded-none">
                      <AvatarImage src={m.kitchen.image!} />
                      <AvatarFallback className="rounded-md text-lg">
                        {m.kitchen.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="line-clamp-1 flex flex-row items-center gap-2">
                        {m.kitchen.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-1 max-w-[12rem] overflow-hidden text-ellipsis">
                        {m.kitchen.description ?? "No description"}
                      </CardDescription>
                    </div>
                  </CardHeader>
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
            You&apos;re not in any kitchens yet — create or join one to get
            started. <br />
            (Psst... click your profile in the top right ↗️.)
          </div>
        </div>
      )}
    </div>
  );
}

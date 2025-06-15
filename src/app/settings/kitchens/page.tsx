import { Metadata } from "next";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { auth } from "~/libs/auth";
import { prisma } from "~/libs/prisma";

export const metadata: Metadata = {
  title: "Kitchens - Account Settings",
};

export default async function KitchensSettings() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const memberships = await prisma.membership.findMany({
    where: { uid: session.user!.id },
    include: { kitchen: true },
  });

  return (
    <div className="space-y-5">
      {memberships.length == 0 && (
        <div className="text-muted-foreground w-full text-center">
          You&apos;re not in any kitchens yet — create or join one to start
          cooking up some feedback. started.
        </div>
      )}
      {memberships.map((m) => (
        <Card key={m.kid}>
          <CardHeader className="flex items-center gap-2">
            <Avatar className="size-12 rounded-none">
              <AvatarImage src={m.kitchen.image!} />
              <AvatarFallback className="rounded-md text-lg">
                {m.kitchen.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex flex-row items-center gap-2">
                <Link href={`/${m.kitchen.slug}`} className="hover:underline">
                  {m.kitchen.name}
                </Link>
                <Badge variant="secondary">{m.role}</Badge>
              </CardTitle>
              <CardDescription className="line-clamp-1">
                {m.kitchen.description ?? "No description"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardFooter className="border-t">
            <p className="text-muted-foreground text-sm">
              Joined{" "}
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
              }).format(new Date(m.createdAt))}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

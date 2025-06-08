import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/avatar";
import { Badge } from "~/common/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/card";
import { prisma } from "~/utils/prisma";
import { getSession } from "~/utils/session";

export default async function TeamsSettings() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const memberships = await prisma.membership.findMany({
    where: { uid: session.user.id },
    include: { team: true },
  });

  return (
    <div className="space-y-5">
      {memberships.length == 0 && (
        <div className="text-muted-foreground w-full text-center">
          Looks like you&apos;re flying solo — create or join a team to get
          started.
        </div>
      )}
      {memberships.map((m) => (
        <Card key={m.tid}>
          <CardHeader className="flex items-center gap-2">
            <Avatar className="size-12 rounded-none">
              <AvatarImage src={m.team.picture!} />
              <AvatarFallback className="rounded-md text-lg">
                {m.team.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex flex-row items-center gap-2">
                <Link href={`/${m.team.slug}`} className="hover:underline">
                  {m.team.name}
                </Link>
                <Badge variant="secondary">{m.role}</Badge>
              </CardTitle>
              <CardDescription className="line-clamp-1">
                {m.team.description ?? "No description"}
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

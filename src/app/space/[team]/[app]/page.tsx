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
import { CreateAppTokenDialog } from "~/components/create-app-token-dialog";
import { prisma } from "~/libs/prisma";

interface Params {
  team: string;
  app: string;
}

interface Props {
  params: Promise<Params>;
}

export default async function App(props: Props) {
  const params = await props.params;

  const team = await prisma.team.findUnique({
    where: { slug: params.team },
  });

  if (!team) return notFound();

  const app = await prisma.app.findUnique({
    where: {
      tid_name: {
        name: params.app,
        tid: team.id,
      },
    },
    include: {
      tokens: true,
    },
  });

  if (!app) return notFound();

  return (
    <div className="mt-6">
      <div className="flex w-full gap-5">
        <Avatar className="size-20 rounded-none sm:size-24">
          <AvatarImage src={app.picture!} />
          <AvatarFallback className="rounded-md text-3xl">
            {app.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-lg font-medium sm:text-2xl">{app.name}</h1>
          <p className="text-muted-foreground text-xs sm:mt-2 sm:text-base">
            {app.description ?? "No description"}
          </p>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h1 className="text-2xl font-medium">App Tokens</h1>
        <CreateAppTokenDialog team={team} appId={app.id}>
          <Button size="sm">New App Tokens</Button>
        </CreateAppTokenDialog>
      </div>

      <div className="gird-cols-1 mt-5 grid md:grid-cols-2 lg:grid-cols-3">
        {app.tokens.map((k) => (
          <Card key={k.id} className="w-xs">
            <CardHeader>
              <CardTitle className="text-sm break-all">{k.token}</CardTitle>
              <CardDescription className="text-xs">
                Expires:{" "}
                {k.expiresAt ? new Date(k.expiresAt).toLocaleString() : "Never"}
              </CardDescription>
            </CardHeader>
            <CardFooter className="text-muted-foreground border-t text-xs">
              Created at {new Date(k.createdAt).toLocaleString()}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

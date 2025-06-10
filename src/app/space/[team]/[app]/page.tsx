import { notFound } from "next/navigation";
import { prisma } from "~/libs/prisma";
import { createApiKey } from "./actions";

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
    include: { apps: true },
  });

  if (!team) {
    return notFound();
  }

  const app = await prisma.app.findUnique({
    where: {
      tid_name: {
        name: params.app,
        tid: team.id,
      },
    },
  });

  if (!app) {
    return notFound();
  }

  await createApiKey(team, app.id);

  return (
    <main>
      <h1>App</h1>
    </main>
  );
}

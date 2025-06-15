import { notFound } from "next/navigation";
import { DashboardLayout } from "~/components/layouts/dashboard-layout";
import { getTeamMenu } from "~/content/menu";
import { prisma } from "~/libs/prisma";

interface Params {
  team: string;
}

interface Props {
  params: Promise<Params>;
  children: React.ReactNode;
}

export default async function TeamLayout(props: Props) {
  const params = await props.params;
  const team = await prisma.team.findUnique({
    where: { slug: params.team },
  });

  if (!team) {
    return notFound();
  }

  return (
    <DashboardLayout menu={getTeamMenu(team)} team={team}>
      {props.children}
    </DashboardLayout>
  );
}

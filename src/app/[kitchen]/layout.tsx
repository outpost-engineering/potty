import { notFound } from "next/navigation";
import { DashboardLayout } from "~/components/layouts/dashboard-layout";
import { getKitchenMenu } from "~/content/menu";
import { prisma } from "~/libs/prisma";

interface Params {
  kitchen: string;
}

interface Props {
  params: Promise<Params>;
  children: React.ReactNode;
}

export default async function KitchenLayout(props: Props) {
  const params = await props.params;
  const kitchen = await prisma.kitchen.findUnique({
    where: { slug: params.kitchen },
  });

  if (!kitchen) {
    return notFound();
  }

  return (
    <DashboardLayout menu={getKitchenMenu(kitchen)} kitchen={kitchen}>
      {props.children}
    </DashboardLayout>
  );
}

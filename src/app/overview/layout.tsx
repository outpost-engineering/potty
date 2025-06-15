import { PropsWithChildren } from "react";
import { DashboardLayout } from "~/components/layouts/dashboard-layout";
import { userMenu } from "~/content/menu";

export default function OverviewLayout(props: PropsWithChildren) {
  return <DashboardLayout menu={userMenu}>{props.children}</DashboardLayout>;
}

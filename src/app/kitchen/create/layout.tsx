import { Metadata } from "next";
import { PropsWithChildren } from "react";
import { DashboardLayout } from "~/components/layouts/dashboard-layout";

export const metadata: Metadata = {
  title: "Create kitchen",
};

export default function CreateKitchenLayout(props: PropsWithChildren) {
  return (
    <DashboardLayout menu={[]} minimal>
      {props.children}
    </DashboardLayout>
  );
}

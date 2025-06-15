import { PropsWithChildren } from "react";
import { DashboardLayout } from "~/components/layouts/dashboard-layout";
import { SettingsLayout } from "~/components/layouts/settings-layout";
import { userMenu } from "~/content/menu";

export default function AccountSettingsLayout(props: PropsWithChildren) {
  return (
    <DashboardLayout menu={userMenu}>
      <SettingsLayout
        title="Account Settings"
        menu={[
          {
            label: "General",
            href: "/settings",
          },
          {
            label: "Authentication",
            href: "/settings/authentication",
          },
          {
            label: "Kitchens",
            href: "/settings/kitchens",
          },
        ]}
      >
        {props.children}
      </SettingsLayout>
    </DashboardLayout>
  );
}

import { Metadata } from "next";
import { SettingsContent } from "~/components/settings/settings-content";
import { auth } from "~/libs/auth";

export const metadata: Metadata = {
  title: "General - Account Settings",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <SettingsContent
      user={{
        name: session.user.name ?? null,
        image: session.user.image ?? null,
      }}
    />
  );
}

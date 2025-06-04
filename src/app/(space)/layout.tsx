import Link from "next/link";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { PottyLogo } from "~/common/potty-logo";
import { ProfileDropdown } from "~/common/profile-dropdown";
import { getSession } from "~/utils/session";
import { getTheme } from "~/utils/theme";

export default async function SpaceLayout(props: PropsWithChildren) {
  const session = await getSession();
  const theme = await getTheme();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto max-w-7xl p-6">
      <header className="flex h-20 w-full items-center justify-between">
        <div>
          <Link href="/">
            <PottyLogo className="w-32" />
          </Link>
        </div>
        <ProfileDropdown user={session.user} theme={theme} />
      </header>
      {props.children}
    </main>
  );
}

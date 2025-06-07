import Link from "next/link";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { PottyLogo } from "~/common/potty-logo";
import { ProfileDropdown } from "~/common/profile-dropdown";
import { getSession } from "~/utils/session";

export default async function SpaceLayout(props: PropsWithChildren) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto min-h-screen max-w-7xl p-6">
      <header className="flex h-20 w-full items-center justify-between">
        <div>
          <Link href="/~">
            <PottyLogo className="w-32" />
          </Link>
        </div>
        <ProfileDropdown user={session.user} />
      </header>
      {props.children}
    </main>
  );
}

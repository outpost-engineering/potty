import Link from "next/link";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { PottyLogo } from "~/common/potty-logo";
import { ProfileDropdown } from "~/common/profile-dropdown";
import { getSession } from "~/libs/auth";

export default async function SpaceLayout(props: PropsWithChildren) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto min-h-screen max-w-7xl p-6">
      <header className="bg-background sticky top-0 z-40 w-full border-b">
        <div className="flex h-20 w-full items-center justify-between">
          <Link href="/space">
            <PottyLogo className="size-24" />
          </Link>
          <ProfileDropdown user={session.user} />
        </div>
      </header>
      {props.children}
    </main>
  );
}

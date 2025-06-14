import Link from "next/link";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { ActiveLink } from "~/components/active-link";
import { ImpressionBox } from "~/components/impression-box";
import { ProfileDropdown } from "~/components/profile-dropdown";
import UserManuelDropdown from "~/components/user-manuel-dropdown";
import { auth } from "~/libs/auth";

export default async function SpaceLayout(props: PropsWithChildren) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen w-full">
      <header className="bg-card sticky top-0 z-40 w-full px-10 py-4 pb-0">
        <div className="flex w-full items-center justify-between">
          <Link href="/space">
            <div className="bg-primary size-8 rounded-full"></div>
          </Link>
          <div className="flex items-center gap-3">
            <ImpressionBox />
            <UserManuelDropdown />
            <ProfileDropdown user={session.user!} />
          </div>
        </div>
        <div className="mt-4 flex w-full">
          <ActiveLink
            href="/space"
            className="hover:bg-accent data-[active]:border-primary text-muted-foreground data-[active]:text-foreground cursor-pointer rounded rounded-b-none border-b border-transparent px-2 py-2 text-base transition-all duration-150"
          >
            Overview
          </ActiveLink>
          <ActiveLink
            href="/space/settings"
            className="hover:bg-accent data-[active]:border-primary text-muted-foreground data-[active]:text-foreground cursor-pointer rounded rounded-b-none border-b border-transparent px-2 py-2 text-base transition-all duration-150"
          >
            Settings
          </ActiveLink>
        </div>
      </header>
      <div>{props.children}</div>
    </main>
  );
}

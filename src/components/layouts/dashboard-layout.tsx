import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { MenuItem } from "~/content/menu";
import { auth } from "~/libs/auth";
import { ActiveLink } from "../active-link";
import { ImpressionBox } from "../impression-box";
import { ProfileDropdown } from "../profile-dropdown";
import UserManuelDropdown from "../user-manuel-dropdown";

interface Props {
  children: React.ReactNode;
  menu: MenuItem[];
}

export async function DashboardLayout(props: Props) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen w-full">
      <header className="bg-card sticky top-0 z-40 w-full px-10 py-4 pb-0">
        <div className="flex w-full items-center justify-between">
          <Link href="/">
            <div className="bg-primary size-8 rounded-full"></div>
          </Link>
          <div className="flex items-center gap-3">
            <ImpressionBox />
            <UserManuelDropdown />
            <ProfileDropdown user={session.user!} />
          </div>
        </div>
        <div className="mt-4 flex w-full">
          {props.menu.map((m) => (
            <ActiveLink
              key={m.href}
              href={m.href}
              className="hover:bg-accent data-[active]:border-primary text-muted-foreground data-[active]:text-foreground cursor-pointer rounded rounded-b-none border-b border-transparent px-2 py-2 text-base transition-all duration-150"
            >
              {m.label}
            </ActiveLink>
          ))}
        </div>
      </header>
      <div className="mx-auto mt-6 max-w-7xl px-10 py-4">{props.children}</div>
    </main>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { Input } from "~/common/input";

export default function MySettingsLayout(props: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="mt-6 text-2xl font-medium">Account Settings</h1>
      <div>
        <div className="mt-6 flex h-fit w-full gap-10 border-t">
          <div className="h-screen flex-1/4 pt-12">
            <div className="sticky top-7 h-fit">
              <Input placeholder="Search..." />
              <div className="mt-10 w-full">
                <Link href="/~/settings">
                  <div
                    data-active={pathname === "/~/settings"}
                    className="hover:bg-accent/80 text-muted-foreground data-[active=true]:text-foreground mb-1.5 w-full rounded-md px-2 py-2 text-sm transition-all"
                  >
                    General
                  </div>
                </Link>
                <Link href="/~/settings/authentication">
                  <div
                    data-active={pathname === "/~/settings/authentication"}
                    className="hover:bg-accent/80 text-muted-foreground data-[active=true]:text-foreground mb-1.5 w-full rounded-md px-2 py-2 text-sm transition-all"
                  >
                    Authentication
                  </div>
                </Link>
                <Link href="/~/settings/teams">
                  <div
                    data-active={pathname === "/~/settings/teams"}
                    className="hover:bg-accent/80 text-muted-foreground data-[active=true]:text-foreground mb-1.5 w-full rounded-md px-2 py-2 text-sm transition-all"
                  >
                    Teams
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="h-fit flex-3/4 pt-12">{props.children}</div>
        </div>
      </div>
    </div>
  );
}

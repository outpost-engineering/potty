import React from "react";
import { MenuItem } from "~/content/menu";
import { ActiveLink } from "../active-link";
import { Input } from "../ui/input";

interface Props {
  title: string;
  menu: MenuItem[];
  children: React.ReactNode;
}

export function SettingsLayout(props: Props) {
  return (
    <div>
      <h1 className="text-2xl font-medium">{props.title}</h1>
      <div>
        <div className="mt-0 flex h-fit w-full gap-10">
          <div className="hidden flex-1/4 pt-12 md:block md:min-h-full">
            <div className="sticky top-32 h-fit">
              <Input placeholder="Search..." />
              <div className="mt-10 grid w-full">
                {props.menu.map((m) => (
                  <ActiveLink
                    key={m.href}
                    href={m.href}
                    strict
                    className="hover:bg-accent/80 text-muted-foreground data-[active=true]:text-foreground mb-1.5 w-full rounded-md px-2 py-2 text-sm transition-all"
                  >
                    {m.label}
                  </ActiveLink>
                ))}
              </div>
            </div>
          </div>
          <div className="h-fit pt-8 md:flex-3/4 md:pt-12">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import {
  ArrowLeftStartOnRectangleIcon,
  BriefcaseIcon,
  Cog8ToothIcon,
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import { User } from "@prisma/client";
import {
  Content,
  Item,
  Portal,
  Root,
  Separator,
  Sub,
  SubContent,
  SubTrigger,
  Trigger,
} from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { setTheme, Theme } from "~/utils/theme";

interface Props {
  user: User;
  theme: Theme;
}

export function ProfileDropdown(props: Props) {
  const { user, theme } = props;
  const router = useRouter();
  console.log(theme);

  return (
    <Root>
      <Trigger asChild>
        <div className="border-accent-2 relative cursor-pointer rounded-full border transition-all duration-150 ease-in select-none active:scale-[99%]">
          <img className="size-12" alt="Profile" src={user.picture!} />
        </div>
      </Trigger>
      <Portal>
        <Content
          className="bg-accent-1 border-accent-2 z-50 mt-2 mr-6 w-56 rounded-2xl border py-5"
          sideOffset={5}
        >
          <div className="px-4">
            <p className="line-clamp-1 overflow-hidden font-medium text-ellipsis">
              {user.name}
            </p>
            <p className="text-accent-6 overflow-hidden text-sm text-ellipsis">
              {user.email}
            </p>
          </div>
          <div className="mt-5 px-2">
            <Item
              onClick={() => router.push("/~")}
              className="text-accent-6 hover:text-foreground hover:bg-accent-2 flex cursor-pointer items-center justify-between rounded-lg border-none px-2 py-2 ring-0 transition-all duration-150 ease-in outline-none"
            >
              Dashboard
              <BriefcaseIcon className="size-6" />
            </Item>
            <Item
              onClick={() => router.push("/~/settings")}
              className="text-accent-6 hover:text-foreground hover:bg-accent-2 flex cursor-pointer items-center justify-between rounded-lg border-none px-2 py-2 ring-0 transition-all duration-150 ease-in outline-none"
            >
              Settings
              <Cog8ToothIcon className="size-6" />
            </Item>
          </div>
          <Separator className="bg-accent-3 mt-2 mb-2 h-px" />
          <div className="px-2">
            <Sub>
              <SubTrigger asChild>
                <Item className="text-accent-6 hover:text-foreground data-[state=open]:bg-accent-2 data-[state=open]:text-foreground flex cursor-pointer items-center justify-between rounded-lg border-none px-2 py-2 ring-0 transition-all duration-150 ease-in outline-none">
                  Theme
                  <SwatchIcon className="size-6" />
                </Item>
              </SubTrigger>
              <Portal>
                <SubContent
                  className="border-accent-2 bg-accent-1 z-50 mt-2 mr-6 w-56 rounded-2xl py-5"
                  sideOffset={-5}
                  alignOffset={-5}
                >
                  <div className="space-y-1 px-2">
                    <Item
                      data-selected={theme === "light"}
                      onClick={() => setTheme("light")}
                      className="text-accent-6 hover:text-foreground hover:bg-accent-2 data-[selected=true]:text-foreground flex cursor-pointer items-center justify-between rounded-lg border-none px-2 py-2 ring-0 transition-all duration-150 ease-in outline-none"
                    >
                      Light
                      <SunIcon className="size-6" />
                    </Item>
                    <Item
                      data-selected={theme === "dark"}
                      onClick={() => setTheme("dark")}
                      className="text-accent-6 hover:text-foreground hover:bg-accent-2 data-[selected=true]:text-foreground flex cursor-pointer items-center justify-between rounded-lg border-none px-2 py-2 ring-0 transition-all duration-150 ease-in outline-none"
                    >
                      Dark
                      <MoonIcon className="size-6" />
                    </Item>
                    <Item
                      data-selected={theme === "system"}
                      onClick={() => setTheme("system")}
                      className="text-accent-6 hover:text-foreground hover:bg-accent-2 data-[selected=true]:text-foreground flex cursor-pointer items-center justify-between rounded-lg border-none px-2 py-2 ring-0 transition-all duration-150 ease-in outline-none"
                    >
                      System
                      <ComputerDesktopIcon className="size-6" />
                    </Item>
                  </div>
                </SubContent>
              </Portal>
            </Sub>
          </div>
          <Separator className="bg-accent-3 mt-2 mb-2 h-px" />
          <div className="px-2">
            <Item
              onClick={() => router.push("/logout")}
              className="text-accent-6 hover:text-foreground hover:bg-accent-2 flex cursor-pointer items-center justify-between rounded-lg border-none px-2 py-2 ring-0 transition-all duration-150 ease-in outline-none"
            >
              Logout
              <ArrowLeftStartOnRectangleIcon className="size-6" />
            </Item>
          </div>
        </Content>
      </Portal>
    </Root>
  );
}

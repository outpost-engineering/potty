"use client";
import {
  ArrowLeftStartOnRectangleIcon,
  BriefcaseIcon,
  Cog8ToothIcon,
  HomeIcon,
  PlusCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { User } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu";

interface Props {
  user: User;
}

export function ProfileDropdown(props: Props) {
  const { user } = props;
  const [collisionBoundary, setCollisionBoundry] = useState<HTMLElement>();

  useEffect(() => {
    if (document && window) {
      setCollisionBoundry(document.getElementsByTagName("main")[0]);
    }
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="size-12 select-none">
          <AvatarImage src={user.picture!} alt="Picture" />
          <AvatarFallback className="text-lg">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64"
        collisionBoundary={collisionBoundary}
        align="end"
      >
        <DropdownMenuLabel className="mb-2">
          <div className="line-clamp-1 overflow-hidden font-medium text-ellipsis">
            {user.name}
          </div>
          <div className="text-muted-foreground mt-0.5 line-clamp-1 overflow-hidden font-normal text-ellipsis">
            {user.email}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <Link href="/~">
            <DropdownMenuItem>
              Dashboard
              <BriefcaseIcon className="size-5" />
            </DropdownMenuItem>
          </Link>
          <Link href="/~/settings">
            <DropdownMenuItem>
              Account Settings
              <Cog8ToothIcon className="size-5" />
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            Create Team
            <PlusCircleIcon className="size-5" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Command Menu
          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/">
            <DropdownMenuItem>
              Home Page
              <HomeIcon className="size-5" />
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            Support
            <QuestionMarkCircleIcon className="size-5" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href="/logout">
          <DropdownMenuItem variant="destructive">
            Log Out
            <ArrowLeftStartOnRectangleIcon className="size-5" />
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";
import {
  ArrowLeftStartOnRectangleIcon,
  BriefcaseIcon,
  Cog8ToothIcon,
  HomeIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { User } from "next-auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { logout } from "~/libs/actions";
import { CreateTeamDialog } from "./create-team-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Props {
  user: User;
}

export function ProfileDropdown(props: Props) {
  const { user } = props;
  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false);
  const [collisionBoundary, setCollisionBoundry] = useState<HTMLElement>();

  useEffect(() => {
    if (document && window) {
      setCollisionBoundry(document.getElementsByTagName("main")[0]);
    }
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none" asChild>
          <Button
            variant="outline"
            className="flex size-8 items-center justify-center rounded-full p-0"
          >
            <Avatar className="size-8 cursor-pointer select-none">
              <AvatarImage src={user.image!} alt="Picture" />
              <AvatarFallback className="text-lg">
                {user.name!.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
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
            <Link href="space">
              <DropdownMenuItem>
                Dashboard
                <BriefcaseIcon className="size-5" />
              </DropdownMenuItem>
            </Link>
            <Link href="/space/settings">
              <DropdownMenuItem>
                Account Settings
                <Cog8ToothIcon className="size-5" />
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => setCreateTeamDialogOpen(true)}>
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
          <Link href="/">
            <DropdownMenuItem>
              Home Page
              <HomeIcon className="size-5" />
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem variant="destructive" onClick={logout}>
            Log Out
            <ArrowLeftStartOnRectangleIcon className="size-5" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateTeamDialog
        open={createTeamDialogOpen}
        onOpenChange={setCreateTeamDialogOpen}
      />
    </>
  );
}

import {
  BookOpenIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function UserManuelDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none" asChild>
        <Button
          variant="outline"
          className="flex size-8 items-center justify-center rounded-full p-0"
        >
          <BookOpenIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href="/docs">
          <DropdownMenuItem>
            Docs
            <BookOpenIcon className="size-5" />
          </DropdownMenuItem>
        </Link>
        <Link href="/help">
          <DropdownMenuItem>
            Help
            <QuestionMarkCircleIcon className="size-5" />
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

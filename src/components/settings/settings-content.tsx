"use client";

import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { DisplayNameForm } from "./display-name-form";

interface SettingsContentProps {
  user: {
    name: string | null;
    image: string | null;
  };
}

export function SettingsContent({ user }: SettingsContentProps) {
  return (
    <div className="h-fit">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between">
          <p className="text-muted-foreground text-sm">
            This is your avatar. <br />
            Click on the avatar to upload a custom one from your files.
          </p>
          <Avatar className="size-24">
            <AvatarImage src={user.image ?? undefined} alt="Avatar" />
          </Avatar>
        </CardContent>
        <CardFooter className="border-t">
          <p className="text-muted-foreground text-sm">
            An avatar is optional but strongly recommended.
          </p>
        </CardFooter>
      </Card>
      <DisplayNameForm user={{ name: user.name }} />
      <Card className="border-destructive/40 mt-8 w-full pb-0">
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Permanently remove your Personal Account and all of its contents
            from the platform. This action is not reversible, so please continue
            with caution.
          </p>
        </CardContent>
        <CardFooter className="border-destructive/40 bg-destructive/10 justify-end border-t pb-6">
          <Button size="sm" variant="destructive">
            Delete Personal Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 
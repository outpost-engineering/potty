import { Avatar, AvatarImage } from "~/components/avatar";
import { Button } from "~/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/card";
import { Input } from "~/components/input";
import { getSession } from "~/libs/auth";

export default async function GeneralSettings() {
  const session = await getSession();

  if (!session) {
    return null;
  }

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
            <AvatarImage src={session.user.picture!} alt="Avatar" />
          </Avatar>
        </CardContent>
        <CardFooter className="border-t">
          <p className="text-muted-foreground text-sm">
            An avatar is optional but strongly recommended.
          </p>
        </CardFooter>
      </Card>
      <Card className="mt-8 w-full">
        <CardHeader>
          <CardTitle>Display Name</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Please enter your full name, or a display name you are comfortable
            with.
          </p>
          <Input className="mt-5 w-fit" defaultValue={session.user.name} />
        </CardContent>
        <CardFooter className="justify-between border-t">
          <p className="text-muted-foreground text-sm">
            Please use 32 characters at maximum.
          </p>
          <Button size="sm" disabled>
            Save
          </Button>
        </CardFooter>
      </Card>
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

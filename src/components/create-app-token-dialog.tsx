"use client";

import { ClipboardIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Team } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createAppToken } from "~/app/space/[team]/[app]/actions";

import { Button } from "./ui/button";
import { Datepicker } from "./ui/datepicker";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const schema = z.object({
  expiresAt: z.date().optional(),
});

interface Props {
  children: React.ReactNode;
  team: Team;
  appId: string;
}

export function CreateAppTokenDialog({ children, team, appId }: Props) {
  const [open, setOpen] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { expiresAt: undefined },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const expiresAt = data.expiresAt?.toISOString();

    await toast.promise(
      async () => {
        const created = await createAppToken(team, appId, expiresAt);
        if (!created) throw new Error("API key creation failed");
        setCreatedToken(created.token);
        form.reset();
      },
      {
        loading: "Creating API key...",
        success: "API key created!",
        error: "Failed to create API key",
      },
    );
  };

  const handleCopy = async () => {
    if (!createdToken) return;
    await navigator.clipboard.writeText(createdToken);
    toast.success("Copied to clipboard!");
  };

  const handleClose = () => {
    setCreatedToken(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false}>
        {!createdToken ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <DialogHeader>
                <DialogTitle>Create API Key</DialogTitle>
                <DialogDescription>
                  If you do not set an expiration date, the token will never
                  expire.
                </DialogDescription>
              </DialogHeader>
              <DialogBody className="space-y-8">
                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel optional>Expiration Date</FormLabel>
                      <FormControl>
                        <Datepicker
                          date={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" size="sm" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button size="sm" type="submit">
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Token created</DialogTitle>
              <DialogDescription>
                This is your token. Copy it now — you won’t be able to see it
                again.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="bg-muted flex items-center justify-between rounded-md px-3 py-2 font-mono text-sm">
                <span className="break-all">{createdToken}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-muted-foreground hover:text-foreground ml-2"
                >
                  <ClipboardIcon className="size-4 cursor-pointer" />
                </button>
              </div>
            </DialogBody>
            <DialogFooter className="justify-end">
              <Button size="sm" onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

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
import { Button } from "./button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";

const schema = z.object({
  expiresAt: z
    .string()
    .datetime({ message: "Must be a valid ISO 8601 date-time string" })
    .optional(),
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
    await toast.promise(
      async () => {
        const created = await createAppToken(team, appId, data.expiresAt);
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
                <DialogTitle>Create App Token</DialogTitle>
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
                        <Input
                          placeholder="e.g. 2025-12-31T23:59:59Z"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DialogBody>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button size="sm" type="submit">
                  Continue
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Token created</DialogTitle>
              <DialogDescription>
                This is your token. Copy it now—you won’t be able to see it
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

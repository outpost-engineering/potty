"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Team } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createApiKey } from "~/app/space/[team]/[app]/actions";
import { Button } from "./button";
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

export function CreateApiKeyDialog({ children, team, appId }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { expiresAt: undefined },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    await toast.promise(
      async () => {
        const created = await createApiKey(team, appId, data.expiresAt);
        if (!created) throw new Error("API key creation failed");

        form.reset();
        setOpen(false);
        router.refresh(); // triggers SSR refresh to show new key
      },
      {
        loading: "Creating API key...",
        success: "API key created!",
        error: "Failed to create API key",
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <Form {...form}>
        <DialogContent showCloseButton={false}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                If you do not set an expiration date, the API key will never
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
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button size="sm" type="submit">
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
}

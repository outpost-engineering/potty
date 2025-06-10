"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Team } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  createApp,
  isAppNameAvailable,
} from "~/app/space/[team]/[app]/actions";
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

const createAppSchema = z.object({
  name: z
    .string()
    .min(1, { message: "App name is required" })
    .max(50, {
      message: "App name must be 50 characters or fewer",
    })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Name can only contain letters, numbers, and hyphens",
    }),
  description: z
    .string()
    .max(100, { message: "App description must be 100 characters or fewer" })
    .optional(),
});

interface Props {
  children: React.ReactNode;
  team: Team;
}

export function CreateAppDialog(props: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof createAppSchema>>({
    resolver: zodResolver(createAppSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof createAppSchema>) => {
    const isNameAvailable = await isAppNameAvailable(props.team, data.name);

    if (!isNameAvailable) {
      form.setError("name", { message: "This name is already taken." });
      return;
    }

    await toast.promise(
      async () => {
        const created = await createApp(
          props.team,
          data.name,
          data.description,
        );
        if (!created) {
          throw new Error("Team creation failed.");
        }

        router.push(`/${props.team.slug}/${data.name}`);
      },
      {
        loading: `Creating your app...`,
        success: "App created successfully!",
        error: "Failed to create app. Please try again.",
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <Form {...form}>
        <DialogContent showCloseButton={false}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Create an app</DialogTitle>
              <DialogDescription>
                Connect your app and give your users a place to report bugs,
                suggest features, and share feedback.
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel optional>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                Continue
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
}

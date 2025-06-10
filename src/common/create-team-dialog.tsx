"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createTeam, isTeamSlugAvailable } from "~/app/space/[team]/actions";
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
} from "./dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const createTeamSchema = z.object({
  name: z.string().min(1, { message: "Team name is required" }).max(50, {
    message: "Team name must be 50 characters or fewer",
  }),
  slug: z
    .string()
    .min(1, { message: "Team slug is required" })
    .max(50, { message: "Team slug must be 50 characters or fewer" })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug must be lowercase and can only contain letters, numbers, and hyphens",
    }),
});

export function CreateTeamDialog(props: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof createTeamSchema>>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof createTeamSchema>) => {
    const isSlugAvaialbe = await isTeamSlugAvailable(data.slug);

    if (!isSlugAvaialbe) {
      form.setError("slug", { message: "This team slug is already taken." });
      return;
    }

    await toast.promise(
      async () => {
        const created = await createTeam(data.name, data.slug);

        if (!created) {
          throw new Error("Team creation failed.");
        }

        props.onOpenChange(false);
        router.push(`/${data.slug}`);
      },
      {
        loading: `Creating your team...`,
        success: "Team created successfully!",
        error: "Failed to create team. Please try again.",
      },
    );
  };

  return (
    <Dialog {...props}>
      <Form {...form}>
        <DialogContent showCloseButton={false}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Create a team</DialogTitle>
              <DialogDescription>
                Start collaborating with your team to collect bug reports,
                feature requests, and user feedback — all in one place.
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team slug</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription className="lg:whitespace-nowrap">
                      Will be used for your team&apos;s URL (e.g.{" "}
                      <code className="bg-muted relative inline h-fit rounded px-[0.3rem] py-[0.2rem]">
                        potty.dev/slug
                      </code>
                      )
                    </FormDescription>
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

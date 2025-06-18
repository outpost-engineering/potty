"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { updateDisplayName } from "~/libs/actions";

const displayNameSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(32, { message: "Name must be 32 characters or fewer" })
    .regex(/^[a-zA-Z0-9\s-]+$/, {
      message: "Name can only contain letters, numbers, spaces, and hyphens",
    }),
});

type DisplayNameFormValues = z.infer<typeof displayNameSchema>;

export function DisplayNameForm() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();

  const form = useForm<DisplayNameFormValues>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
    },
    mode: "onChange",
  });

  // Update form when session changes
  useEffect(() => {
    if (session?.user?.name) {
      form.reset({ name: session.user.name });
    }
  }, [session?.user?.name, form]);

  const onSubmit = async (data: DisplayNameFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);

      const result = await updateDisplayName(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      await updateSession({
        name: result.name,
      });
      
      toast.success("Display name updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update display name");
    }
  };

  const isDirty = form.formState.isDirty;
  const isSubmitting = form.formState.isSubmitting;
  const currentName = form.getValues("name");
  const sessionName = session?.user?.name;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mt-8 w-full">
          <CardHeader>
            <CardTitle>Display Name</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Please enter your full name, or a display name you are comfortable
              with.
            </p>
            <div className="mt-5 space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-fit"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-between border-t">
            <p className="text-muted-foreground text-sm">
              Please use 32 characters at maximum.
            </p>
            <Button 
              size="sm" 
              type="submit"
              disabled={
                isSubmitting || 
                !isDirty || 
                currentName === sessionName
              }
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
} 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { isKitchenSlugAvailable } from "~/libs/actions";

const generalStepSchema = z.object({
  name: z.string().min(1, { message: "Kitchen name is required" }).max(50, {
    message: "Kitchen name must be 50 characters or fewer",
  }),
  slug: z
    .string()
    .min(1, { message: "Kitchen slug is required" })
    .max(50, { message: "Kitchen slug must be 50 characters or fewer" })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug must be lowercase and can only contain letters, numbers, and hyphens",
    }),
});

interface Props {
  onSubmit: (data: z.infer<typeof generalStepSchema>) => void;
}

export function GeneralStep(props: Props) {
  const form = useForm<z.infer<typeof generalStepSchema>>({
    resolver: zodResolver(generalStepSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof generalStepSchema>) => {
    const isSlugAvaialbe = await isKitchenSlugAvailable(data.slug);

    if (!isSlugAvaialbe) {
      form.setError("slug", { message: "This slug is already taken." });
      return;
    }

    props.onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Create a kitchen</CardTitle>
          <CardDescription>
            Start collaborating with your team to collect bug reports, feature
            requests, and user impressions — all in one place.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kitchen name</FormLabel>
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
                <FormLabel>Kitchen slug</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription className="lg:whitespace-nowrap">
                  Will be used for your kitchen&apos;s URL (e.g.{" "}
                  <code className="bg-muted relative inline h-fit rounded px-[0.3rem] py-[0.2rem]">
                    potty.dev/slug
                  </code>
                  )
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="justify-end border-t">
          <Button size="sm" type="submit">
            Continue
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

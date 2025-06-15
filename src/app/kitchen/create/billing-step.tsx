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
import { Form } from "~/components/ui/form";

const billingStepSchema = z.object({});

interface Props {
  isCreating: boolean;
  onSubmit: (data: z.infer<typeof billingStepSchema>) => Promise<void>;
  onBack: () => void;
}

export function BillingStep(props: Props) {
  const form = useForm<z.infer<typeof billingStepSchema>>({
    resolver: zodResolver(billingStepSchema),
    defaultValues: {},
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof billingStepSchema>) => {
    await props.onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Create a kitchen</CardTitle>
          <CardDescription>
            Upon clicking Create, an amount of $5 will be added to your invoice
            and your credit card will be charged immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pb-4"></CardContent>
        <CardFooter className="justify-between border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={props.onBack}
            disabled={props.isCreating}
          >
            Back
          </Button>
          <Button size="sm" type="submit" disabled={props.isCreating}>
            Create
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

"use client";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { addImpression } from "~/libs/actions";
import { Button } from "./ui/button";
import { Form, FormField, FormItem, FormMessage } from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";

const impressionSchema = z.object({
  note: z
    .string()
    .min(1, "Please enter your feedback")
    .max(1500, "Feedback must be 1500 characters or fewer"),
  emotion: z
    .string()
    // Emoji might be 2 UTF-16 code units
    .max(2, "Emotion must be a single emoji")
    .optional(),
});

export function ImpressionBox() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof impressionSchema>>({
    resolver: zodResolver(impressionSchema),
    defaultValues: {
      note: "",
      emotion: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof impressionSchema>) => {
    await toast.promise(
      async () => {
        setOpen(false);
        const success = await addImpression(data.note, data.emotion);

        if (!success) {
          throw new Error("Impression creation failed.");
        }

        form.reset();
      },
      {
        loading: "Sending your feedback...",
        success: "Thanks for your feedback! 🎉",
        error: "Something went wrong. Please try again.",
      },
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex size-8 items-center justify-center rounded-full p-0"
        >
          <FaceSmileIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <p className="text-sm font-medium">Help us to improve!</p>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <Textarea
                    className="min-h-24"
                    placeholder="Type your feedback here..."
                    maxLength={1500}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="emotion"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-0.5">
                    <div
                      onClick={() => form.setValue("emotion", "😍")}
                      data-active={field.value === "😍" ? true : undefined}
                      className="hover:bg-primary/20 data-[active]:bg-primary/20 cursor-pointer rounded-full p-1.5 saturate-20 transition-all duration-150 hover:saturate-100 data-[active]:saturate-100"
                    >
                      😍
                    </div>
                    <div
                      onClick={() => form.setValue("emotion", "😁")}
                      data-active={field.value === "😁" ? true : undefined}
                      className="hover:bg-primary/20 data-[active]:bg-primary/20 cursor-pointer rounded-full p-1.5 saturate-20 transition-all duration-150 hover:saturate-100 data-[active]:saturate-100"
                    >
                      😁
                    </div>
                    <div
                      onClick={() => form.setValue("emotion", "😟")}
                      data-active={field.value === "😟" ? true : undefined}
                      className="hover:bg-primary/20 data-[active]:bg-primary/20 cursor-pointer rounded-full p-1.5 saturate-20 transition-all duration-150 hover:saturate-100 data-[active]:saturate-100"
                    >
                      😟
                    </div>
                    <div
                      onClick={() => form.setValue("emotion", "😭")}
                      data-active={field.value === "😭" ? true : undefined}
                      className="hover:bg-primary/20 data-[active]:bg-primary/20 cursor-pointer rounded-full p-1.5 saturate-20 transition-all duration-150 hover:saturate-100 data-[active]:saturate-100"
                    >
                      😭
                    </div>
                  </FormItem>
                )}
              />
              <Button size="sm" type="submit">
                Send
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "~/components/ui/card";
import { createKitchen } from "~/libs/actions";
import { BillingStep } from "./billing-step";
import { GeneralStep } from "./general-step";

interface KitchenData {
  name: string;
  slug: string;
}

export default function CreateKitchen() {
  const [step, setStep] = useState(0);
  const [kitchen, setKitchen] = useState<KitchenData>();
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    if (!kitchen) {
      return;
    }

    setIsCreating(true);

    await toast.promise(
      async () => {
        const created = await createKitchen(kitchen.name, kitchen.slug);

        if (!created) {
          setIsCreating(false);
          throw new Error("Team creation failed.");
        }

        router.push(`/${kitchen.slug}`);
      },
      {
        loading: "Firing up your kitchen...",
        success: "Kitchen created successfully!",
        error: "Failed to create your kitchen. Please try again.",
      },
    );
  };

  return (
    <Card className="mx-auto max-w-lg">
      {step === 0 && (
        <GeneralStep
          onSubmit={(data) => {
            setKitchen(data);
            setStep((prev) => prev + 1);
          }}
        />
      )}
      {step === 1 && (
        <BillingStep
          isCreating={isCreating}
          onSubmit={onSubmit}
          onBack={() => setStep((prev) => prev - 1)}
        />
      )}
    </Card>
  );
}

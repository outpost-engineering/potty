"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "~/components/ui/card";
import { startKitchenCheckout } from "~/libs/actions";
import { BillingStep } from "./billing-step";
import { GeneralStep } from "./general-step";

interface KitchenData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  website?: string;
  location?: string;
}

export default function CreateKitchen() {
  const [step, setStep] = useState(0);
  const [kitchen, setKitchen] = useState<KitchenData>();
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    if (!kitchen) return;
    setIsCreating(true);

    await toast.promise(
      async () => {
        const stripeUrl = await startKitchenCheckout(
          kitchen.name,
          kitchen.slug,
          kitchen.description,
          kitchen.image,
          kitchen.website,
          kitchen.location,
        );
        if (!stripeUrl) throw new Error("Failed to create checkout session");

        window.location.href = stripeUrl;
      },
      {
        loading: "Redirecting to checkout...",
        success: "Redirecting...",
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

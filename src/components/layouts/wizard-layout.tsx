"use client";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

interface Step {
  id: number;
  name: string;
}

interface Props {
  steps: Step[];
  children: React.ReactNode;
}

export function WizardLayout(props: Props) {
  return (
    <div>
      <div>
        <div className="mt-0 flex h-fit w-full gap-10">
          <div className="hidden flex-1/4 pt-12 md:block md:min-h-full">
            <div className="sticky top-32 h-fit">
              <div className="grid w-full">
                {props.steps.map((s) => (
                  <div
                    key={s.id}
                    className="hover:bg-accent/80 text-muted-foreground mb-1.5 flex w-full items-start gap-2 rounded-md px-2 py-2 text-sm transition-all"
                  >
                    <CheckCircleIcon className="text-muted-foreground size-6" />
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="h-fit pt-8 md:flex-3/4 md:pt-12">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}

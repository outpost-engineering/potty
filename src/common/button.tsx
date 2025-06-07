"use client";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { useRef } from "react";
import { cn } from "~/utils/shadcn";
import { Ripple, RippleRef } from "./animation/ripple";

const buttonVariants = cva(
  "relative overflow-hidden inline-flex items-center justify-between gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[99%]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
      },
      size: {
        default: "h-14 gap-2 px-4",
        sm: "h-10 rounded-md gap-1.5 px-4",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const rippleVariants = cva("", {
  variants: {
    variant: {
      default: "bg-background",
      outline: "bg-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const rippleRef = useRef<RippleRef>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    rippleRef.current?.addRipple(e);
    if (onClick) onClick(e);
  };

  return (
    <Comp
      data-slot="button"
      onClick={handleClick}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
      <Ripple ref={rippleRef} className={rippleVariants({ variant })} />
    </Comp>
  );
}

export { Button, buttonVariants };

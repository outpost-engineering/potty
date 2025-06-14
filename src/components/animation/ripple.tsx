import { motion } from "framer-motion";
import { forwardRef, useImperativeHandle, useState } from "react";
import { cn } from "~/libs/utils";

interface RippleInterface {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface Props {
  className?: string;
  duration?: number;
}

export interface RippleRef {
  addRipple: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Ripple = forwardRef<RippleRef, Props>((props, ref) => {
  const [ripples, setRipples] = useState<RippleInterface[]>([]);

  const addRipple = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple: RippleInterface = {
      id: Date.now(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, props.duration ?? 600);
  };

  useImperativeHandle(ref, () => ({
    addRipple,
  }));

  return (
    <>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className={cn(
            "pointer-events-none absolute rounded-full",
            props.className,
          )}
          initial={{ scale: 0, opacity: 0.2 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            width: ripple.size,
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
    </>
  );
});

Ripple.displayName = "Ripple";

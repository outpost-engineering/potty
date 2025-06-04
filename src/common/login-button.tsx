"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useRef } from "react";
import { Ripple, RippleRef } from "./animation/ripple";

interface Props {
  icon: ReactNode;
  href: string;
  provider: string;
}

export function LoginButton(props: Props) {
  const { icon, href, provider } = props;
  const rippleRef = useRef<RippleRef>(null);
  const router = useRouter();

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    rippleRef.current?.addRipple(event);
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      className="border-accent-2 relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-xl border-2 p-4 transition-all duration-150 ease-in active:scale-[99%]"
    >
      {icon}
      Continue with {provider}
      <div className="size-6"></div>
      <Ripple ref={rippleRef} />
    </button>
  );
}

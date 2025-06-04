"use client";
import { ReactNode, useRef } from "react";
import { loginWith } from "~/app/(auth)/login/actions";
import { Ripple, RippleRef } from "./animation/ripple";

interface Props {
  icon: ReactNode;
  provider: string;
  redirect: string;
}

export function LoginButton(props: Props) {
  const { icon, provider, redirect } = props;
  const rippleRef = useRef<RippleRef>(null);

  const onClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    rippleRef.current?.addRipple(event);
    loginWith(provider, redirect);
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

"use client";
import { ReactNode } from "react";
import { loginWith } from "~/app/(auth)/login/actions";
import { Button } from "./button";
interface Props {
  icon: ReactNode;
  provider: string;
  redirect: string;
}

export function LoginButton(props: Props) {
  const { icon, provider, redirect } = props;

  return (
    <Button
      className="w-full"
      variant="outline"
      onClick={() => loginWith(provider, redirect)}
    >
      {icon}
      Continue with {provider}
      <div className="size-5" aria-hidden></div>
    </Button>
  );
}

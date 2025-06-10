import { ReactNode } from "react";
import { signIn } from "~/libs/auth";
import { Button } from "./button";
interface Props {
  icon: ReactNode;
  provider: string;
  redirect: string;
}

export function LoginButton(props: Props) {
  const { icon, provider, redirect } = props;

  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: redirect });
      }}
    >
      <Button className="w-full" variant="outline">
        {icon}
        Continue with {provider}
        <div className="size-5" aria-hidden></div>
      </Button>
    </form>
  );
}

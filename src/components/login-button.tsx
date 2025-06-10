import { ComponentType, SVGProps } from "react";
import { signIn } from "~/libs/auth";
import { Button } from "./button";

interface Props {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  provider: string;
  redirect: string;
}

export function LoginButton(props: Props) {
  const { icon: Icon, provider, redirect } = props;

  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider.toLocaleLowerCase(), { redirectTo: redirect });
      }}
    >
      <Button className="w-full" variant="outline">
        <Icon className="size-5" />
        Continue with {provider}
        <div className="size-5" aria-hidden></div>
      </Button>
    </form>
  );
}

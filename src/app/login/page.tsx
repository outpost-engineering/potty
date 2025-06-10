import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/card";
import { AppleIcon } from "~/common/icons/apple";
import { GithubIcon } from "~/common/icons/github";
import { GoogleIcon } from "~/common/icons/google";
import { MicrosoftIcon } from "~/common/icons/microsoft";
import { LoginButton } from "~/common/login-button";
import { getSession } from "~/libs/auth";

interface SearchParams {
  redirect?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function LoginPage(props: Props) {
  const session = await getSession();
  const search = await props.searchParams;
  const redirectUrl = search.redirect ?? "/~";

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="mb-24 w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle withPotty className="flex items-center justify-center">
            Get ready!
          </CardTitle>
          <CardDescription>One link to hear your users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <LoginButton
            icon={<GithubIcon className="size-5" />}
            provider="Github"
            redirect={redirectUrl}
          />
          <LoginButton
            icon={<GoogleIcon className="size-5" />}
            provider="Google"
            redirect={redirectUrl}
          />
          <LoginButton
            icon={<MicrosoftIcon className="size-5" />}
            provider="Microsoft"
            redirect={redirectUrl}
          />
          <LoginButton
            icon={<AppleIcon className="size-5" />}
            provider="Apple"
            redirect={redirectUrl}
          />
        </CardContent>
        <CardFooter className="border-t">
          <p className="text-muted-foreground text-center text-sm">
            By clicking on continue, you agree to Potty&apos;s{" "}
            <Link href="/legal/terms-of-service" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy-policy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}

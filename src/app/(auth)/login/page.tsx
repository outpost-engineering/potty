import Link from "next/link";
import { redirect } from "next/navigation";
import { AppleIcon } from "~/common/icons/apple";
import { GithubIcon } from "~/common/icons/github";
import { GoogleIcon } from "~/common/icons/google";
import { MicrosoftIcon } from "~/common/icons/microsoft";
import { LoginButton } from "~/common/login-button";
import { PottyLogo } from "~/common/potty-logo";
import { getSession } from "~/utils/session";

interface SearchParams {
  redirect?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function LoginPage(props: Props) {
  const session = await getSession();
  const search = await props.searchParams;

  if (session) {
    redirect("/");
  }

  const getRedirectUrl = (provider: string) => {
    const redirect_uri = search.redirect ?? "/";
    return `${process.env.BASE_URL}/api/auth/${provider}?redirect=${redirect_uri}`;
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="bg-accent-1 mb-24 flex w-full max-w-sm flex-col items-center justify-center rounded-3xl px-8 py-12">
        <PottyLogo className="w-28" />
        <h1 className="mt-6 text-xl font-semibold">Get ready!</h1>
        <p className="text-accent-6 mt-2">One link to hear your users.</p>
        <div className="mt-10 w-full space-y-2">
          <LoginButton
            provider="Github"
            icon={<GithubIcon className="size-6" />}
            href={`https://github.com/login/oauth/authorize?client_id=${process.env.AUTH_GITHUB_ID}&scope=read:user user:email&redirect_uri=${getRedirectUrl("github")}`}
          />
          <LoginButton
            provider="Google"
            icon={<GoogleIcon className="size-6" />}
            href=""
          />
          <LoginButton
            provider="Microsoft"
            icon={<MicrosoftIcon className="size-6" />}
            href=""
          />
          <LoginButton
            provider="Apple"
            icon={<AppleIcon className="size-6" />}
            href=""
          />
        </div>
        <div className="mt-8">
          <p className="text-accent-5 text-center text-sm">
            By clicking on continue, you agree to Potty&apos;s{" "}
            <Link
              href="/legal/terms-of-service"
              className="text-accent-6 underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/legal/privacy-policy"
              className="text-accent-6 underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

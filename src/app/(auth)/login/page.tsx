import { AppleIcon } from "@/common/apple-icon";
import { GithubIcon } from "@/common/github-icon";
import { GoogleIcon } from "@/common/google-icon";
import { LoginButton } from "@/common/login-button";
import { MicrosoftIcon } from "@/common/microsoft-icon";
import { getSession } from "@/utils/jwt";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="bg-accent-1 m-2 w-lg rounded-3xl px-10 py-10 text-center">
        <h1 className="text-center text-3xl font-bold">
          Get <span className="text-primary">Ready!</span>
        </h1>
        <p className="text-accent-4 pt-4 text-xl font-normal">
          One link to hear your users.
        </p>
        <div className="mt-14 mb-8 space-y-3">
          <LoginButton
            icon={GithubIcon}
            href={
              `https://github.com/login/oauth/authorize` +
              `?client_id=${process.env.AUTH_GITHUB_ID}` +
              `&redirect_uri=${process.env.BASE_URL}/api/auth/github` +
              `&scope=read:user%20user:email`
            }
          >
            Continue with Github
          </LoginButton>
          <LoginButton icon={GoogleIcon} href={"#"}>
            Continue with Google
          </LoginButton>
          <LoginButton icon={MicrosoftIcon} href={"#"}>
            Continue with Microsoft
          </LoginButton>
          <LoginButton icon={AppleIcon} href={"#"}>
            Continue with Apple
          </LoginButton>
        </div>
      </div>
    </main>
  );
}

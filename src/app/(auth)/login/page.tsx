import { getSession } from "@/utils/jwt";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <main className="bg-background text-foreground flex min-h-screen items-center justify-center">
      <div className="space-y-4 rounded-2xl p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold">Sign in</h1>
        <a
          href={
            `https://github.com/login/oauth/authorize` +
            `?client_id=${process.env.AUTH_GITHUB_ID}` +
            `&redirect_uri=${process.env.BASE_URL}/api/auth/github` +
            `&scope=read:user%20user:email`
          }
          className="w-full rounded-lg bg-gray-700 px-5 py-2 text-white transition hover:bg-gray-800"
        >
          Sign in with GitHub
        </a>
      </div>
    </main>
  );
}

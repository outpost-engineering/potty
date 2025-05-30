import { auth, signIn } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="bg-background text-foreground flex min-h-screen items-center justify-center">
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/" });
        }}
        className="space-y-4 rounded-2xl p-8 shadow-lg"
      >
        <h1 className="text-center text-2xl font-bold">Sign in</h1>
        <button
          type="submit"
          className="w-full rounded-lg bg-gray-700 px-5 py-2 text-white transition hover:bg-gray-800"
        >
          Sign in with GitHub
        </button>
      </form>
    </main>
  );
}

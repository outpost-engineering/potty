import { auth, signIn } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/" });
        }}
        className="p-8 rounded-2xl shadow-lg space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Sign in</h1>
        <button
          type="submit"
          className="w-full bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Sign in with GitHub
        </button>
      </form>
    </main>
  );
}

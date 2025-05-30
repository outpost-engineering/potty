import { auth, signIn } from "@/app/auth";

export default async function Home() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <main>
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/" });
        }}
      >
        <button type="submit">Sign in</button>
      </form>
      {JSON.stringify(session)}
    </main>
  );
}

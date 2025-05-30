import { auth, signIn } from "@/app/auth";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    await signIn("github", { redirectTo: "/" });
  }

  return <main>{JSON.stringify(session)}</main>;
}

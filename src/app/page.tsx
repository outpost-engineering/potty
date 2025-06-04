import { getSession } from "~/utils/session";

export default async function Home() {
  const session = await getSession();

  if (session) {
    return <main>Logged in</main>;
  }

  return <main>Home</main>;
}

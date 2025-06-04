import { redirect } from "next/navigation";
import { Hero } from "~/common/marketing/hero";
import { getSession } from "~/utils/session";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect("/~");
  }

  return (
    <main className="container mx-auto max-w-7xl">
      <Hero />
    </main>
  );
}

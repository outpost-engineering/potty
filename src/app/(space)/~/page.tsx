import { redirect } from "next/navigation";
import { getSession } from "~/utils/session";

export default async function MyOverview() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return <main>My Overview</main>;
}

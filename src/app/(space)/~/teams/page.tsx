import { redirect } from "next/navigation";
import { getSession } from "~/utils/session";

export default async function MyTeams() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return <main>My Teams</main>;
}

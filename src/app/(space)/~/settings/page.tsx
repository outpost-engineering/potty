import { redirect } from "next/navigation";
import { getSession } from "~/utils/session";

export default async function MySettings() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return <main>My Settings</main>;
}

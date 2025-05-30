import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <main>{JSON.stringify(session)}</main>;
}

import { getSession } from "@/utils/jwt";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return <main>{JSON.stringify(session)}</main>;
  // const session = await auth();
  // console.log(session?.user)
  // if (!session?.user) {
  //   redirect('/login');
  // }
  // return <CreateTeamForm userId={session.user.id!} />;
}

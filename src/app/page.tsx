import { auth, signIn } from "~/libs/auth";

export default async function Home() {
  const session = await auth();
  console.log("SESSION: ", session);

  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <button type="submit">Sign in with Github</button>
      {/* {session?.user && (
        <div>
          <div>{JSON.stringify(session.user)}</div>
          <img src={session.user.image!} alt="User Avatar" />
        </div>
      )} */}
    </form>
  );
}

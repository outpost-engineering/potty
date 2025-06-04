import { redirect } from "next/navigation";
import { getSession } from "~/utils/session";

export default async function Login() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <main className="container mx-auto bg-purple-700">
      Login
      <br />
      <a
        href={
          "https://github.com/login/oauth/authorize" +
          "?client_id=" +
          process.env.AUTH_GITHUB_ID +
          "&scope=" +
          encodeURIComponent("read:user user:email") +
          "&redirect_uri=" +
          encodeURIComponent(`${process.env.BASE_URL}/api/auth/github`)
        }
      >
        Login with GitHub
      </a>
    </main>
  );
}

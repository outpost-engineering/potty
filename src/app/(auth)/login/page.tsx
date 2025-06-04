import { Modak } from "next/font/google";
import { redirect } from "next/navigation";
import { getSession } from "~/utils/session";

const modak = Modak({
  weight: "400",
  subsets: ["latin"],
});

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  const githubUrl =
    "https://github.com/login/oauth/authorize" +
    "?client_id=" +
    process.env.AUTH_GITHUB_ID +
    "&scope=" +
    encodeURIComponent("read:user user:email") +
    "&redirect_uri=" +
    encodeURIComponent(`${process.env.BASE_URL}/api/auth/github`);

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
      <div className="bg-[#222222] rounded-2xl p-8 w-full max-w-md">
        <h1
          className={`
            ${modak.className} 
            text-[2.5vw]   
            leading-[100%]
            text-[#FF4070]
            text-center
          `}
        >
          POTTY
        </h1>
        <p className="mt-4 text-white text-center text-xl font-semibold">
          Get ready!
        </p>
        <p className="mt-2 text-gray-400 text-center">
          One link to hear your users.
        </p>
        <a
          href={githubUrl}
          className="
            mt-6 
            flex 
            items-center 
            justify-center 
            w-full 
            border 
            border-gray-600 
            rounded-lg 
            px-4 
            py-2 
            text-white 
            hover:bg-gray-700 
            transition-colors
          "
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 0C5.37 0 0 5.37 0 12c0 5.303 
                 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 
                 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.416-4.042-1.416
                 -.546-1.385-1.333-1.755-1.333-1.755-1.09-.745.082-.73.082-.73 
                 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 
                 2.807 1.305 3.492.998.108-.775.418-1.306 
                 .76-1.606-2.665-.304-5.466-1.332-5.466-5.931 
                 0-1.31.47-2.38 1.235-3.22-.125-.303-.535-1.525.115-3.176 
                 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 
                 1.02.005 2.04.138 3 .405 2.285-1.552 3.29-1.23 
                 3.29-1.23.65 1.65.24 2.873.12 3.176.77.84 1.23 
                 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.37 
                 .81 1.102.81 2.222 0 1.606-.015 2.896-.015 3.286 
                 0 .32.21.695.825.575C20.565 21.795 24 17.298 24 
                 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
          Continue with GitHub
        </a>
        <p className="mt-6 text-center text-gray-500 text-xs">
          By clicking on continue, you agree to Potty’s{" "}
          <a
            href="/terms"
            className="underline hover:text-gray-300 transition-colors"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="underline hover:text-gray-300 transition-colors"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}

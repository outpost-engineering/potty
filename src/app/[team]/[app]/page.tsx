import { prisma } from "@/app/prisma";
import { notFound } from "next/navigation";

interface Props {
  params: {
    team: string;
    app: string;
  };
}

export default async function App(props: Props) {
  const params = await props.params;

  const app = await prisma.app.findFirst({
    where: {
      name: params.app,
      team: {
        slug: params.team,
      },
    },
    include: {
      team: true,
    },
  });

  if (!app) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-extrabold text-gray-900">
          {app.name}
        </h1>
        <p className="text-lg text-gray-600">
          {app.description || "No description provided."}
        </p>
      </header>

      {app.picture && (
        <div className="mb-8 flex justify-center">
          <img
            src={app.picture}
            alt={`${app.name} logo`}
            className="h-32 w-32 rounded-lg object-contain shadow-md"
          />
        </div>
      )}

      {app.website && (
        <p className="mb-8 text-center">
          <a
            href={app.website}
            target="_blank"
            rel="noreferrer"
            className="inline-block font-medium text-red-600 hover:underline"
          >
            Visit Official Site →
          </a>
        </p>
      )}

      <hr className="my-12 border-gray-200" />

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Company</h2>
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-medium">Name:</span> {app.team.name}
          </p>
          {app.team.website && (
            <p className="text-gray-700">
              <span className="font-medium">Website:</span>{" "}
              <a
                href={app.team.website}
                target="_blank"
                rel="noreferrer"
                className="text-red-600 hover:underline"
              >
                {app.team.website}
              </a>
            </p>
          )}
          {app.team.description && (
            <p className="text-gray-700">
              <span className="font-medium">About:</span> {app.team.description}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

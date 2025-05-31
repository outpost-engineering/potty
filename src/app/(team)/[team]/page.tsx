import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "~/app/prisma";

interface Props {
  params: {
    team: string;
  };
}

export default async function Team(props: Props) {
  const params = await props.params;

  const team = await prisma.team.findFirst({
    where: { slug: params.team },
    include: {
      apps: true,
    },
  });

  if (!team) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-extrabold text-gray-900">
          {team.name}
        </h1>
        {team.description && (
          <p className="text-lg text-gray-600">{team.description}</p>
        )}
      </header>

      <div className="mb-12 flex flex-col items-center space-y-4">
        {team.picture && (
          <img
            src={team.picture}
            alt={`${team.name} logo`}
            className="h-36 w-36 rounded-full object-contain shadow-md"
          />
        )}
        {team.website && (
          <a
            href={team.website}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-red-600 hover:underline"
          >
            Visit Company Site →
          </a>
        )}
      </div>

      <hr className="my-12 border-gray-200" />

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Apps by {team.name}
        </h2>
        {team.apps.length === 0 ? (
          <p className="text-gray-600">No apps registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.apps.map((app) => (
              <Link
                key={app.id}
                href={`${team.slug}/${app.name}`}
                className="block rounded-lg border p-6 transition-shadow hover:shadow-lg"
              >
                {app.picture && (
                  <img
                    src={app.picture}
                    alt={`${app.name} logo`}
                    className="mb-4 h-32 w-full object-contain"
                  />
                )}
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {app.name}
                </h3>
                {app.description && (
                  <p className="mb-4 line-clamp-3 text-gray-600">
                    {app.description}
                  </p>
                )}
                <span className="font-medium text-red-600 hover:underline">
                  View App →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

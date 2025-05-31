import { getSession } from "@/utils/jwt";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/app/prisma";

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const teams = await prisma.team.findMany({
    where: {
      memberships: {
        some: {
          uid: session.user.id,
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Teams</h1>
        <Link
          href="/team/new"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Create New Team
        </Link>
      </div>

      {teams.length === 0 ? (
        <p className="text-gray-600">You’re not part of any teams yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link
              key={team.id}
              href={team.slug}
              className="rounded border p-4 transition hover:shadow-md"
            >
              <div className="text-lg font-semibold">{team.name}</div>
              {team.description && (
                <p className="mt-1 text-sm text-gray-600">{team.description}</p>
              )}
              <p className="mt-2 text-xs text-gray-400">{team.slug}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

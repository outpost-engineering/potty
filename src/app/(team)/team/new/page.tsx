import { redirect } from "next/navigation";
import { createTeam } from "~/app/actions";
import { getSession } from "~/utils/jwt";

export default async function CreateTeam() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main>
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="mb-4 text-2xl font-bold">Create a New Team</h1>
        <form className="space-y-6" action={createTeam}>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              name="slug"
              required
              className="mt-1 block w-full rounded border p-2"
              placeholder="my-team"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              required
              className="mt-1 block w-full rounded border p-2"
              placeholder="My Team"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full rounded border p-2"
              placeholder="A brief description"
            />
          </div>
          <div>
            <label htmlFor="picture" className="block text-sm font-medium">
              Picture
            </label>
            <input
              id="picture"
              name="picture"
              type="file"
              accept="image/*"
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              className="mt-1 block w-full rounded border p-2"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium">
              Location
            </label>
            <input
              id="location"
              name="location"
              className="mt-1 block w-full rounded border p-2"
              placeholder="City, Country"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            Create Team
          </button>
        </form>
      </div>
    </main>
  );
}

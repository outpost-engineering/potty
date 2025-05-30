'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface CreateTeamFormProps {
  userId: string;
}

export default function CreateTeamForm({ userId }: CreateTeamFormProps) {
  const router = useRouter();
  const [pictureFile, setPictureFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setPictureFile(e.target.files[0]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let pictureUrl: string | undefined;
    if (pictureFile) {
      const uploadForm = new FormData();
      uploadForm.append('file', pictureFile);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadForm });
      const { url } = await uploadRes.json();
      pictureUrl = url;
    }

    const payload = {
      slug: formData.get('slug'),
      name: formData.get('name'),
      description: formData.get('description') || null,
      website: formData.get('website') || null,
      location: formData.get('location') || null,
      picture: pictureUrl || null,
      userId,
    };

    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log("Team Successfully Created")
    } else {
      console.error('Failed to create team', await res.text());
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create a New Team</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="slug" className="block text-sm font-medium">
            Slug <span className="text-red-500">*</span>
          </label>
          <input id="slug" name="slug" required className="mt-1 block w-full border rounded p-2" placeholder="my-team" />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input id="name" name="name" required className="mt-1 block w-full border rounded p-2" placeholder="My Team" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea id="description" name="description" rows={3} className="mt-1 block w-full border rounded p-2" placeholder="A brief description" />
        </div>
        <div>
          <label htmlFor="picture" className="block text-sm font-medium">Picture</label>
          <input id="picture" name="picture" type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full" />
        </div>
        <div>
          <label htmlFor="website" className="block text-sm font-medium">Website</label>
          <input id="website" name="website" type="url" className="mt-1 block w-full border rounded p-2" placeholder="https://example.com" />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium">Location</label>
          <input id="location" name="location" className="mt-1 block w-full border rounded p-2" placeholder="City, Country" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Create Team</button>
      </form>
    </main>
  );
}
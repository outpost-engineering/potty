export const runtime = 'nodejs';

import React from 'react';
import { auth } from '@/app/auth';
import { redirect } from 'next/navigation';
import CreateTeamForm from '@/CreateTeamForm';

export default async function CreateTeamPage() {
  const session = await auth();
  console.log(session?.user)
  if (!session?.user) {
    redirect('/login');
  }

  return <CreateTeamForm userId={session.user.id!} />;
}
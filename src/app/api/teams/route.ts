import { NextResponse } from 'next/server';
import { prisma } from '@/app/prisma';
import { auth } from '@/app/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug, name, description, picture, website, location } = await request.json();
  const userId = session.user.id!;

  const team = await prisma.team.create({
    data: {
      slug,
      name,
      description,
      picture,
      website,
      location,
      memberships: {
        create: {
          uid: userId,
          role: 'Owner',
        },
      },
    },
  });

  return NextResponse.json(team, { status: 201 });
}

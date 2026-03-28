import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { users } from '@ownspce/db';
import { getAuthUser } from '@/lib/auth-helper';
import { db } from '@/lib/db';

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { theme } = await req.json();
  if (theme !== 'dark' && theme !== 'light') {
    return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
  }

  await db
    .update(users)
    .set({ theme })
    .where(eq(users.id, user.id));

  return NextResponse.json({ data: { theme } });
}

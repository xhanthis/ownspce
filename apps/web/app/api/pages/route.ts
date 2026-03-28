import { NextRequest, NextResponse } from 'next/server';
import { pages, eq, and, desc } from '@ownspce/db';
import type { PageType } from '@ownspce/core';
import { getAuthUser } from '@/lib/auth-helper';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(pages)
    .where(
      and(eq(pages.userId, user.id), eq(pages.isDeleted, false))
    )
    .orderBy(desc(pages.updatedAt));

  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, title } = await req.json();
  const validTypes: PageType[] = ['scratch', 'rightnow', 'todo', 'kanban'];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: 'Invalid page type' }, { status: 400 });
  }

  const rows = await db
    .insert(pages)
    .values({
      userId: user.id,
      type,
      title: title ?? 'Untitled',
    })
    .returning();

  return NextResponse.json({ data: rows[0] }, { status: 201 });
}

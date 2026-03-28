import { NextRequest, NextResponse } from 'next/server';
import { pages, eq, and, asc, desc } from '@ownspce/db';
import type { PageType } from '@ownspce/core';
import { getAuthUser } from '@/lib/auth-helper';
import { db } from '@/lib/db';

const DEFAULT_CONTENT: Record<PageType, object> = {
  scratch: { json: { type: 'doc', content: [] } },
  rightnow: { active: [], onDeck: [], holding: [] },
  todo: { items: [] },
  kanban: { columns: [] },
  story: { json: { type: 'doc', content: [] } },
};

export async function GET(req: NextRequest) {
  try {
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
      .orderBy(asc(pages.sortOrder), desc(pages.updatedAt));

    return NextResponse.json({ data: rows });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, title } = body;
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
        content: DEFAULT_CONTENT[type as PageType] ?? {},
      })
      .returning();

    return NextResponse.json({ data: rows[0] }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { pages, eq, and } from '@ownspce/db';
import { getAuthUser } from '@/lib/auth-helper';
import { db } from '@/lib/db';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: RouteContext) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await ctx.params;
    const rows = await db
      .select()
      .from(pages)
      .where(
        and(
          eq(pages.id, id),
          eq(pages.userId, user.id),
          eq(pages.isDeleted, false)
        )
      )
      .limit(1);

    if (!rows[0]) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: rows[0] });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await ctx.params;
    const body = await req.json();
    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) updates.title = body.title;
    if (body.content !== undefined) updates.content = body.content;
    if (body.isPinned !== undefined) updates.isPinned = body.isPinned;
    if (body.sortOrder !== undefined) updates.sortOrder = body.sortOrder;
    updates.updatedAt = new Date();

    if (Object.keys(updates).length <= 1) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const rows = await db
      .update(pages)
      .set(updates)
      .where(
        and(
          eq(pages.id, id),
          eq(pages.userId, user.id),
          eq(pages.isDeleted, false)
        )
      )
      .returning();

    if (!rows[0]) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: rows[0] });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await ctx.params;
    await db
      .update(pages)
      .set({ isDeleted: true })
      .where(
        and(eq(pages.id, id), eq(pages.userId, user.id))
      );

    return NextResponse.json({ data: { id } });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

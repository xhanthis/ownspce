import { NextRequest, NextResponse } from 'next/server';
import { pages, eq, and } from '@ownspce/db';
import { getAuthUser } from '@/lib/auth-helper';
import { db } from '@/lib/db';

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { order } = body as { order: { id: string; sortOrder: number }[] };

    if (!Array.isArray(order) || order.length === 0) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 });
    }

    await Promise.all(
      order.map(({ id, sortOrder }) =>
        db.update(pages).set({ sortOrder }).where(and(eq(pages.id, id), eq(pages.userId, user.id)))
      )
    );

    return NextResponse.json({ data: { ok: true } });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { sql } from '@/lib/db'
import type { PageIndexRow } from '@/lib/types'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const allowed = ['title', 'updated_at']
  const updates = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)))

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  // Always bump updated_at
  const rows = await sql`
    UPDATE page_index
    SET
      title = COALESCE(${updates.title as string ?? null}, title),
      updated_at = NOW()
    WHERE id = ${params.id} AND user_id = ${session.user.id} AND is_deleted = FALSE
    RETURNING id, user_id, page_type, title, drive_file_id, updated_at, is_deleted
  ` as PageIndexRow[]

  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ data: rows[0] })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await sql`
    UPDATE page_index SET is_deleted = TRUE WHERE id = ${params.id} AND user_id = ${session.user.id}
  `

  return NextResponse.json({ data: { id: params.id } })
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { sql } from '@/lib/db'
import type { PageIndexRow, PageType } from '@/lib/types'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await sql`
    SELECT id, user_id, page_type, title, drive_file_id, updated_at, is_deleted
    FROM page_index
    WHERE user_id = ${session.user.id} AND is_deleted = FALSE
    ORDER BY updated_at DESC
  ` as PageIndexRow[]

  return NextResponse.json({ data: rows })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { page_type, title } = await req.json()
  const validTypes: PageType[] = ['scratch', 'rightnow', 'todo', 'kanban']
  if (!validTypes.includes(page_type)) {
    return NextResponse.json({ error: 'Invalid page type' }, { status: 400 })
  }

  const rows = await sql`
    INSERT INTO page_index (user_id, page_type, title)
    VALUES (${session.user.id}, ${page_type}, ${title ?? 'Untitled'})
    RETURNING id, user_id, page_type, title, drive_file_id, updated_at, is_deleted
  ` as PageIndexRow[]

  return NextResponse.json({ data: rows[0] }, { status: 201 })
}

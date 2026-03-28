import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { sql } from '@/lib/db'
import type { PageIndexRow } from '@/lib/types'
import PageRenderer from '@/components/PageRenderer'

interface Props { params: { id: string } }

export default async function PageRoute({ params }: Props) {
  const session = await auth()
  if (!session) notFound()

  const rows = await sql`
    SELECT id, user_id, page_type, title, drive_file_id, updated_at, is_deleted
    FROM page_index
    WHERE id = ${params.id} AND user_id = ${session.user.id} AND is_deleted = FALSE
    LIMIT 1
  ` as PageIndexRow[]

  if (!rows[0]) notFound()

  return <PageRenderer page={rows[0]} />
}

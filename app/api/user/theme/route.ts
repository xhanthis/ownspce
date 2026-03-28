import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { sql } from '@/lib/db'

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { theme } = await req.json()
  if (theme !== 'dark' && theme !== 'light') {
    return NextResponse.json({ error: 'Invalid theme' }, { status: 400 })
  }

  await sql`UPDATE users SET theme = ${theme} WHERE id = ${session.user.id}`
  return NextResponse.json({ data: { theme } })
}

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { users, eq } from '@ownspce/db';
import { db } from '@/lib/db';

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    const rows = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    const user = rows[0];
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await new SignJWT({
      id: user.id,
      username: user.username,
      theme: user.theme,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(secret);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        theme: user.theme,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const token = authHeader.slice(7);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      user: {
        id: payload.id,
        username: payload.username,
        theme: payload.theme,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

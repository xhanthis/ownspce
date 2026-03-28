import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { auth } from '@/lib/auth';

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);

interface AuthUser {
  id: string;
  username: string;
  theme: string;
}

export async function getAuthUser(
  req?: NextRequest
): Promise<AuthUser | null> {
  // Check Bearer token first (mobile)
  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7);
        const { payload } = await jwtVerify(token, secret);
        return {
          id: payload.id as string,
          username: payload.username as string,
          theme: payload.theme as string,
        };
      } catch {
        return null;
      }
    }
  }

  // Fall back to NextAuth session (web)
  const session = await auth();
  if (!session?.user) return null;
  return {
    id: session.user.id,
    username: session.user.name,
    theme: session.user.theme,
  };
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/pages', '/profile'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some(p => pathname.startsWith(p));

  if (isProtected) {
    const token =
      request.cookies.get('authjs.session-token')?.value ??
      request.cookies.get('__Secure-authjs.session-token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg|logo.svg|logo-dark.svg).*)'],
};

import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth, request }) {
      const isAppRoute =
        request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/pages') ||
        request.nextUrl.pathname.startsWith('/profile');
      if (isAppRoute) return !!auth;
      return true;
    },
  },
  providers: [],
};

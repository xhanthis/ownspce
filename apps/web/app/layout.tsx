import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import SessionProvider from '@/components/SessionProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ownspce',
  description: 'Your personal space',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let theme = 'dark';
  try {
    const { auth } = await import('@/lib/auth');
    const session = await auth();
    theme = session?.user?.theme ?? 'dark';
  } catch {
    // Auth unavailable — default to dark theme
  }

  return (
    <html lang="en" className={`${GeistSans.variable} ${theme}`}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

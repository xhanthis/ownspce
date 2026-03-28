import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { auth } from '@/lib/auth'
import SessionProvider from '@/components/SessionProvider'
import './globals.css'


export const metadata: Metadata = {
  title: 'Ownspce',
  description: 'Your personal space',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const theme = session?.user?.theme ?? 'dark'

  return (
    <html lang="en" className={`${GeistSans.variable} ${theme}`}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}

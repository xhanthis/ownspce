import type { Metadata } from 'next';
import { Hanken_Grotesk, Newsreader } from 'next/font/google';
import './globals.css';

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken-grotesk',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: 'Ownspce — a page that becomes whatever you need',
  description:
    'Ownspce pages start blank. Stack the blocks that fit the thought — a priority lane, an impact map, a board, a note. Zero-knowledge cloud: your key never leaves your device.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${hankenGrotesk.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}

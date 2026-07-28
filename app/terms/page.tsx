import type { Metadata } from 'next';
import Link from 'next/link';
import OwlLogo from '../owl-logo';

export const metadata: Metadata = {
  title: 'Terms of Service — Ownspce',
  description:
    'The terms for using Ownspce — a private, local-first, end-to-end encrypted workspace for notes, tasks, and planning.',
  alternates: { canonical: '/terms' },
};

const LAST_UPDATED = '25 July 2026';

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: 'agreement',
    title: 'Agreement',
    body: (
      <p className="text-[15px] leading-[1.85] text-muted">
        By installing or using Ownspce you agree to these terms. If you don&rsquo;t agree, please
        don&rsquo;t use the app. Ownspce is operated from Pune, Maharashtra, India.
      </p>
    ),
  },
  {
    id: 'your-content',
    title: 'Your content is yours',
    body: (
      <p className="text-[15px] leading-[1.85] text-muted">
        You own everything you create in Ownspce. Your content is end-to-end encrypted and stored on
        your device; we can never read it. You are responsible for your content and for keeping your
        recovery phrase safe — if you lose it and have no signed-in device, we cannot recover your
        data for you.
      </p>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    body: (
      <p className="text-[15px] leading-[1.85] text-muted">
        Don&rsquo;t use Ownspce to break the law, infringe others&rsquo; rights, or disrupt the
        service. Because your content is sealed to us, you are solely accountable for how you use it.
      </p>
    ),
  },
  {
    id: 'plans',
    title: 'Plans and billing',
    body: (
      <p className="text-[15px] leading-[1.85] text-muted">
        Ownspce offers a free tier and paid Pro and Team plans. Paid plans renew until cancelled. You
        can cancel anytime; access continues to the end of the billing period. Prices are shown in the
        app and may change with notice.
      </p>
    ),
  },
  {
    id: 'availability',
    title: 'Availability and warranty',
    body: (
      <p className="text-[15px] leading-[1.85] text-muted">
        Ownspce is provided &ldquo;as is.&rdquo; We work hard to keep sync reliable, but we can&rsquo;t
        guarantee uninterrupted service. Because the app is local-first, your data stays available on
        your device even when sync is offline.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    body: (
      <p className="text-[15px] leading-[1.85] text-muted">
        To the extent permitted by law, Ownspce is not liable for indirect or consequential damages,
        or for loss of data outside our reasonable control. Keep your own backups by exporting your
        content, which you can do anytime.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes',
    body: (
      <p className="text-[15px] leading-[1.85] text-muted">
        We may update these terms; we&rsquo;ll change the date above and notify you in the app for
        anything significant. Questions? Write to{' '}
        <a
          href="mailto:hello@ownspce.com"
          className="text-ink underline decoration-border underline-offset-[3px] transition-colors hover:decoration-muted"
        >
          hello@ownspce.com
        </a>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <nav className="mx-auto flex max-w-[1080px] items-center justify-between px-[16px] py-[24px] md:px-[32px]">
        <Link href="/" className="flex items-center gap-[10px]">
          <OwlLogo size={28} />
          <span className="text-[16px] font-semibold tracking-[-0.01em]">Ownspce</span>
        </Link>
        <Link
          href="/#waitlist"
          className="rounded-m border border-border px-[16px] py-[9px] text-[13px] font-medium text-muted transition-colors hover:border-accent hover:text-accent"
        >
          Join the waitlist
        </Link>
      </nav>

      <header className="mx-auto max-w-[720px] px-[16px] pb-[32px] pt-[48px] md:px-[32px]">
        <p className="mb-[12px] text-[11px] uppercase tracking-[0.16em] text-faint">Legal · Terms</p>
        <h1 className="text-[40px] font-semibold leading-[1.05] tracking-[-0.025em] md:text-[46px]">
          Terms of Service
        </h1>
        <p className="mt-[12px] text-[13px] text-faint">Last updated {LAST_UPDATED}</p>
      </header>

      <main className="mx-auto max-w-[720px] space-y-[36px] px-[16px] pb-[64px] md:px-[32px]">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-[32px]">
            <h2 className="mb-[12px] text-[22px] font-semibold tracking-[-0.015em]">{s.title}</h2>
            {s.body}
          </section>
        ))}
      </main>

      <footer className="mx-auto max-w-[1080px] border-t border-border px-[16px] py-[24px] md:px-[32px]">
        <div className="flex flex-col items-center justify-between gap-[12px] md:flex-row">
          <Link href="/" className="flex items-center gap-[8px]">
            <OwlLogo size={20} />
            <span className="text-[13px] text-muted">Ownspce</span>
          </Link>
          <div className="flex items-center gap-[16px] text-[12px] text-faint">
            <Link href="/privacy-policy" className="transition-colors hover:text-muted">
              Privacy
            </Link>
            <span className="text-muted">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

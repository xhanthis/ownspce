import type { Metadata } from 'next';
import Link from 'next/link';
import OwlLogo from '../owl-logo';

export const metadata: Metadata = {
  title: 'Privacy Policy — Ownspce',
  description:
    'Ownspce stores your notes, tasks and boards on your own device. We don’t have a copy. If you turn on sync, your data goes to your Google Drive or iCloud — not to our servers.',
  alternates: { canonical: '/privacy-policy' },
};

const LAST_UPDATED = '25 July 2026';

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 L19 6 L19 12 C19 16.5 15.8 19.8 12 21 C8.2 19.8 5 16.5 5 12 L5 6 Z"
        stroke="#22C55E"
        strokeWidth="1.4"
        fill="none"
        strokeLinejoin="round"
      />
      <path d="M9 12 L11 14 L15 9.5" stroke="#22C55E" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M4 12 L12 4 M6.5 4 H12 V9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="font-sans text-[15px] leading-[1.85] text-[#C0C0C0]">{children}</p>;
}

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-[8px]">
      {items.map((item, index) => (
        <li
          key={index}
          className="font-sans text-[15px] leading-[1.75] text-[#C0C0C0] pl-[20px] relative before:content-[''] before:absolute before:left-[4px] before:top-[11px] before:w-[4px] before:h-[4px] before:rounded-full before:bg-border-mid"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-[4px] text-t1 underline underline-offset-[3px] decoration-border-mid hover:decoration-t2 transition-colors duration-150 ease-out"
    >
      {children}
      <ArrowIcon />
    </a>
  );
}

function MailLink({ children }: { children?: React.ReactNode }) {
  return (
    <a
      href="mailto:privacy@ownspce.com"
      className="text-t1 underline underline-offset-[3px] decoration-border-mid hover:decoration-t2 transition-colors duration-150 ease-out"
    >
      {children ?? 'privacy@ownspce.com'}
    </a>
  );
}

const ACCOUNT_DATA = [
  { field: 'Name', reason: 'To show in the app' },
  { field: 'Email address', reason: 'Account identity' },
  { field: 'Username', reason: 'Account identity' },
  { field: 'Profile picture URL', reason: 'To show in the app' },
  { field: 'Account ID', reason: 'To link your devices' },
];

const sections: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    body: (
      <P>
        Ownspce (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is operated from Pune, Maharashtra, India. For any privacy
        question, write to <MailLink />.
      </P>
    ),
  },
  {
    id: 'your-content',
    title: 'Your content stays yours',
    body: (
      <>
        <P>
          Everything you create in Ownspce — notes, pages, tasks, boards, tags, attachments, images and voice
          recordings — is stored locally on your device by default.
        </P>
        <P>
          We do not collect, upload, read, scan, sell, or use your content to train any AI model. It never reaches
          our servers.
        </P>
      </>
    ),
  },
  {
    id: 'without-an-account',
    title: 'Using Ownspce without an account',
    body: (
      <P>
        You can install and use Ownspce with no sign-up. In this mode we collect no personal data at all.
      </P>
    ),
  },
  {
    id: 'cloud-sync',
    title: 'If you turn on cloud sync',
    body: (
      <>
        <P>Sync is optional. When you enable it:</P>
        <Bullets
          items={[
            'You sign in with Google or Apple.',
            'Your data is written into your own Google Drive or iCloud account.',
            'It syncs between your devices through that account.',
            'We never receive, store or have access to those files.',
          ]}
        />
        <P>Your cloud provider&apos;s own privacy policy applies to the storage itself:</P>
        <Bullets
          items={[
            <>
              Google Drive — <ExternalLink href="https://policies.google.com/privacy">policies.google.com/privacy</ExternalLink>
            </>,
            <>
              Apple iCloud — <ExternalLink href="https://www.apple.com/legal/privacy">apple.com/legal/privacy</ExternalLink>
            </>,
          ]}
        />
        <P>You can revoke our access at any time from your Google or Apple account settings.</P>
      </>
    ),
  },
  {
    id: 'what-we-store',
    title: 'What we do store',
    body: (
      <>
        <P>Only what&apos;s needed to know an account exists:</P>
        <div className="rounded-[12px] border-[0.5px] border-border bg-surface overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-[0.5px] border-border">
                <th className="text-left font-sans text-[11px] tracking-[0.5px] uppercase text-t3 font-medium px-[16px] py-[12px]">
                  Data
                </th>
                <th className="text-left font-sans text-[11px] tracking-[0.5px] uppercase text-t3 font-medium px-[16px] py-[12px]">
                  Why
                </th>
              </tr>
            </thead>
            <tbody>
              {ACCOUNT_DATA.map((row) => (
                <tr key={row.field} className="border-b-[0.5px] border-border last:border-b-0">
                  <td className="font-sans text-[14px] text-t1 px-[16px] py-[12px] align-top whitespace-nowrap">
                    {row.field}
                  </td>
                  <td className="font-sans text-[14px] text-t2 px-[16px] py-[12px] align-top">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>That&apos;s it. No content, no file names, no note titles.</P>
        <P>If you never enable sync, we hold none of this.</P>
      </>
    ),
  },
  {
    id: 'voice-and-camera',
    title: 'Voice and camera',
    body: (
      <>
        <Bullets
          items={[
            <>
              <span className="text-t1">Microphone</span> — used only when you start a voice note. Audio is
              transcribed on your device. Nothing is sent anywhere.
            </>,
            <>
              <span className="text-t1">Camera / Photos</span> — used only when you capture or pick an image for
              text extraction. The text is read on your device. Nothing is sent anywhere.
            </>,
          ]}
        />
        <P>Both permissions are optional and can be revoked in your device settings.</P>
      </>
    ),
  },
  {
    id: 'sharing',
    title: 'Sharing and collaboration',
    body: (
      <P>
        If you share a space with other people, that shared content lives in the space owner&apos;s cloud account.
        Only people the owner invites can access it. We are not part of that transfer.
      </P>
    ),
  },
  {
    id: 'analytics',
    title: 'Analytics and advertising',
    body: (
      <>
        <P>
          We do not show ads. We do not use advertising identifiers or third-party trackers, and we do not sell or
          share personal information with data brokers.
        </P>
        <P>
          If we ever add anonymous, aggregated crash or usage reporting, it will be opt-in and never include your
          content.
        </P>
      </>
    ),
  },
  {
    id: 'payments',
    title: 'Payments',
    body: (
      <P>
        If you buy a paid plan, the purchase is handled by Google Play. We receive a subscription status, not your
        card details. Google Play&apos;s privacy policy applies to the payment.
      </P>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    body: (
      <P>
        Ownspce is not directed at children under 13. We do not knowingly collect data from them.
      </P>
    ),
  },
  {
    id: 'retention',
    title: 'How long we keep data',
    body: (
      <>
        <P>
          Account details are kept while your account is active. Delete your account and they are removed from our
          systems within 30 days.
        </P>
        <P>
          Your notes are yours to delete — remove them from your device and from your Google Drive or iCloud folder.
        </P>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    body: (
      <P>
        Account data is transmitted over encrypted connections (TLS) and stored on managed infrastructure with
        restricted access. Because your content never reaches us, a breach on our side cannot expose your notes.
      </P>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your rights',
    body: (
      <>
        <P>
          You can request access to, correction of, or deletion of your account data at any time. Depending on where
          you live, you may also have rights under the GDPR, the DPDP Act 2023 (India), or the CCPA. Write to{' '}
          <MailLink /> and we&apos;ll respond within 30 days.
        </P>
        <P>
          To delete your account, use Settings → Account → Delete account in the app, or email us.
        </P>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes',
    body: (
      <P>
        If we update this policy, we&apos;ll change the date above and notify you in the app for anything
        significant.
      </P>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-bg text-t1">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-[16px] md:px-[32px] py-[24px] max-w-[1080px] mx-auto">
        <Link href="/" className="flex items-center gap-[12px] group">
          <OwlLogo size={32} />
          <span className="font-sans text-[15px] font-medium tracking-tight">ownspce</span>
        </Link>
        <Link
          href="/#waitlist"
          className="font-sans text-[13px] font-medium px-[20px] py-[10px] rounded-[12px] border-[0.5px] border-border text-t2 hover:border-border-mid hover:text-t1 transition-all duration-150 ease-out"
        >
          Join Waitlist
        </Link>
      </nav>

      {/* Header */}
      <header className="px-[16px] md:px-[32px] pt-[48px] pb-[32px] max-w-[720px] mx-auto">
        <p className="font-sans text-[11px] tracking-[0.5px] text-t3 uppercase mb-[12px]">
          Legal &middot; Privacy
        </p>
        <h1 className="font-serif text-[44px] leading-[48px] tracking-[-1px] mb-[12px]">
          Privacy Policy
        </h1>
        <p className="font-sans text-[13px] text-t3">Last updated {LAST_UPDATED}</p>

        <div className="mt-[32px] rounded-[12px] border-[0.5px] border-border bg-surface p-[24px] md:p-[32px]">
          <div className="flex items-center gap-[8px] mb-[16px]">
            <ShieldIcon />
            <span className="font-sans text-[11px] tracking-[0.5px] uppercase text-t3">The short version</span>
          </div>
          <p className="font-serif text-[22px] leading-[32px] text-t1">
            Ownspce stores your notes, tasks and boards on your own device. We don&apos;t have a copy. If you turn on
            sync, your data goes to your Google Drive or iCloud — not to our servers. We can&apos;t read it.
          </p>
        </div>
      </header>

      {/* Contents + policy */}
      <div className="px-[16px] md:px-[32px] pb-[48px] max-w-[1080px] mx-auto lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-[48px] lg:justify-center">
        <aside className="hidden lg:block">
          <nav aria-label="Table of contents" className="sticky top-[32px] pt-[16px]">
            <p className="font-sans text-[11px] tracking-[0.5px] uppercase text-t3 mb-[16px]">Contents</p>
            <ol className="space-y-[8px]">
              {sections.map((section, index) => (
                <li key={section.id} className="flex gap-[8px]">
                  <span className="font-sans text-[11px] text-t3 pt-[3px] tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <a
                    href={`#${section.id}`}
                    className="font-sans text-[13px] leading-[1.5] text-t2 hover:text-t1 transition-colors duration-150 ease-out"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <main className="max-w-[720px] w-full pt-[16px] space-y-[40px]">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="scroll-mt-[32px]">
              <div className="flex items-baseline gap-[12px] mb-[16px]">
                <span className="font-sans text-[11px] text-t3 tabular-nums tracking-[0.5px]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="font-serif text-[24px] leading-[30px] text-t1">{section.title}</h2>
              </div>
              <div className="space-y-[16px] pl-0 md:pl-[35px]">{section.body}</div>
            </section>
          ))}

          {/* Contact */}
          <section id="contact" className="scroll-mt-[32px]">
            <div className="rounded-[24px] border-[0.5px] border-border bg-surface p-[32px] text-center">
              <div className="flex justify-center mb-[16px]">
                <OwlLogo size={40} />
              </div>
              <h2 className="font-serif text-[24px] leading-[30px] mb-[8px]">Questions about your privacy?</h2>
              <p className="font-sans text-[13px] text-t2 max-w-[360px] mx-auto mb-[24px]">
                Write to us and we&apos;ll respond within 30 days.
              </p>
              <a
                href="mailto:privacy@ownspce.com"
                className="inline-block px-[20px] py-[13px] rounded-[12px] bg-t1 text-bg font-sans font-medium text-[15px] hover:opacity-80 transition-all duration-150 ease-out"
              >
                privacy@ownspce.com
              </a>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="px-[16px] md:px-[32px] py-[24px] max-w-[1080px] mx-auto border-t-[0.5px] border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-[12px]">
          <Link href="/" className="flex items-center gap-[8px]">
            <OwlLogo size={20} />
            <span className="font-sans text-[13px] text-t2">ownspce</span>
          </Link>
          <div className="flex items-center gap-[16px]">
            <Link
              href="/"
              className="font-sans text-[11px] text-t3 tracking-[0.5px] hover:text-t2 transition-colors duration-150 ease-out"
            >
              Home
            </Link>
            <span className="font-sans text-[11px] text-t2 tracking-[0.5px]">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

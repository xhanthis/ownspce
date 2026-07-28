'use client';

import { useEffect, useId, useState } from 'react';
import OwlLogo from './owl-logo';
import {
  HeroMockup,
  CaptureMockup,
  SecondBrainMockup,
  PlanMockup,
  AiMockup,
  PublishMockup,
} from './mockups';

/* -------------------------------------------------------------------------- */
/*  Shared bits                                                               */
/* -------------------------------------------------------------------------- */

/** The Ownspce web app — the "Log in" action redirects here. */
const SIGN_IN_URL = 'https://app.ownspce.com';

const PRIMARY_BTN =
  'inline-flex items-center justify-center whitespace-nowrap rounded-m bg-accent px-[20px] py-[12px] text-[15px] font-medium text-surface transition-colors duration-150 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

const NAV_LINK =
  'text-[14px] font-medium text-muted transition-colors duration-150 hover:text-ink focus-visible:outline-none focus-visible:text-ink';

/** Small terracotta check used across security / feature checklists. */
function Check() {
  return (
    <span
      aria-hidden="true"
      className="mt-[2px] flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-accent-light"
    >
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path
          d="M1 4.2 3.6 6.8 9 1.2"
          stroke="#CC785C"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/**
 * Waitlist email capture — the single primary action, repeated in the hero,
 * pricing cards (as a button), and the final CTA.
 *
 * TODO(form-backend): wire `onSubmit` to the real waitlist endpoint
 * (e.g. POST /api/waitlist or a hosted form provider). For now it validates
 * the address client-side and shows an optimistic confirmation.
 */
function WaitlistForm({
  microcopy,
  centered = false,
}: {
  microcopy: string;
  centered?: boolean;
}) {
  const inputId = useId();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    // TODO(form-backend): send `email` to the waitlist backend here.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={centered ? 'mx-auto max-w-[440px]' : 'max-w-[440px]'}>
        <p className="animate-rise rounded-m border border-accent/30 bg-accent-light px-[16px] py-[14px] text-[14.5px] text-ink">
          You&rsquo;re on the list. We&rsquo;ll email you when your space is ready.
        </p>
      </div>
    );
  }

  return (
    <div className={centered ? 'mx-auto max-w-[440px]' : 'max-w-[440px]'}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[9px] sm:flex-row"
        noValidate
      >
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          className="w-full min-w-0 flex-1 rounded-m border border-border bg-surface px-[15px] py-[12px] text-[15px] text-ink outline-none transition-colors duration-150 placeholder:text-faint focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/40"
        />
        <button type="submit" className={PRIMARY_BTN}>
          Join the waitlist
        </button>
      </form>
      <p className={`mt-[10px] text-[12.5px] text-faint ${centered ? 'text-center' : ''}`}>
        {microcopy}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const PILLARS = [
  {
    title: 'Everything in one place',
    body:
      'Notes, tasks, boards, and sprint planning, unified. A spec and its tasks are one item — nothing drifts out of sync.',
  },
  {
    title: 'Truly private',
    body:
      'End-to-end encrypted with a key only your device holds. We store your data but can never read it. Safe for .env files and legal docs.',
  },
  {
    title: 'Fast, and everywhere',
    body:
      'Local-first, so it’s instant and works offline. Syncs across every device the moment you’re online.',
  },
];

const FEATURES = [
  {
    title: 'Capture anything, instantly',
    line:
      'Voice notes, photo-to-text, web clipper, share sheet, widgets, and Siri. Every thought lands in one Inbox to sort later.',
    Mockup: CaptureMockup,
  },
  {
    title: 'A second brain',
    line:
      'Nested pages, tags, and smart links. Search by what you remember, not where you filed it.',
    Mockup: SecondBrainMockup,
  },
  {
    title: 'Plan what matters',
    line:
      'A Priority Lane that works like air-traffic control, an Impact × Effort map, and Kanban boards — all over the same tasks.',
    Mockup: PlanMockup,
  },
  {
    title: 'Private AI (coming)',
    line:
      'Ask your notes, clean up text, turn a table into a chart — with only what you ask about ever leaving, just for that request.',
    Mockup: AiMockup,
  },
  {
    title: 'Publish when you want',
    line:
      'Turn any page into a public link at ownspce.com/@you/page, or share a still-encrypted secret link.',
    Mockup: PublishMockup,
  },
];

const TEAM_LIST = [
  'Shared encrypted spaces',
  'Real-time editing',
  'Roles & permissions',
  'Company knowledge base',
  'Decision log',
  'Audit log',
  'Google/Apple SSO',
];

const SECURITY_LIST = [
  'End-to-end encrypted',
  'Keys never leave your device',
  'Fully offline-capable',
  'Synced through the cloud, always sealed',
  'Export everything, anytime',
];

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    unit: '',
    blurb: 'Everything private and local, across 2 devices.',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$4.99',
    unit: '/mo (₹299)',
    blurb: 'Unlimited devices, publishing, AI, and integrations.',
    popular: true,
  },
  {
    name: 'Team',
    price: '$4.99',
    unit: '/user/mo (₹299)',
    blurb: 'Shared spaces, sprint planning, and a company knowledge base. (2-seat minimum.)',
    popular: false,
  },
];

const FAQ = [
  {
    q: 'Is it really private?',
    a: 'Yes. Your data is end-to-end encrypted with a key only your device holds. We can’t read it, and neither can anyone who breaches us.',
  },
  {
    q: 'Does it work offline?',
    a: 'Fully. It’s local-first — everything’s on your device and syncs when you’re back online.',
  },
  {
    q: 'What if I lose my phone?',
    a: 'A recovery phrase, or another of your signed-in devices, restores everything. Only you hold it, so keep it safe.',
  },
  {
    q: 'Can my team use it?',
    a: 'Yes — shared encrypted spaces with real-time editing, roles, and a company knowledge base.',
  },
  {
    q: 'What does it cost?',
    a: 'Free to start; Pro and Team are $4.99/month (₹299).',
  },
  {
    q: 'Which devices?',
    a: 'iPhone, iPad, Android, Mac, and the web.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Ownspce marketing landing page.
 * Mobile-first, single primary action throughout: join the waitlist.
 */
export default function LandingPage() {
  // On-scroll fade-ins. Elements marked `.reveal` become visible once they
  // enter the viewport; users who prefer reduced motion get them immediately
  // (handled in CSS) and we also reveal all upfront if the observer is absent.
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-m focus:bg-ink focus:px-4 focus:py-2 focus:text-surface"
      >
        Skip to content
      </a>

      {/* 1. Nav ------------------------------------------------------------ */}
      <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-shell items-center gap-[16px] px-[20px] py-[13px] md:px-[40px]">
          <a href="#hero" className="flex items-center gap-[9px]" aria-label="ownspce home">
            <OwlLogo size={28} />
            <span className="text-[18px] font-semibold tracking-[-0.01em] text-ink">ownspce</span>
          </a>
          <nav className="ml-[24px] hidden items-center gap-[24px] md:flex" aria-label="Primary">
            <a href="#features" className={NAV_LINK}>
              Features
            </a>
            <a href="#security" className={NAV_LINK}>
              Security
            </a>
            <a href="#pricing" className={NAV_LINK}>
              Pricing
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-[8px] sm:gap-[14px]">
            <a
              href={SIGN_IN_URL}
              className="text-[13.5px] font-medium text-muted transition-colors duration-150 hover:text-ink focus-visible:outline-none focus-visible:text-ink"
            >
              Log in
            </a>
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center rounded-m bg-accent px-[16px] py-[9px] text-[13.5px] font-medium text-surface transition-colors duration-150 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Join the waitlist
            </a>
          </div>
        </div>
      </header>

      <main id="hero">
        {/* 2. Hero -------------------------------------------------------- */}
        <section className="mx-auto max-w-shell px-[20px] pb-[24px] pt-[52px] md:px-[40px] md:pt-[72px]">
          <div className="grid grid-cols-1 items-center gap-[44px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-[56px]">
            <div className="reveal">
              <h1 className="text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-[64px]">
                Notes, tasks, and plans — private.
              </h1>
              <p className="mt-[20px] max-w-[500px] text-[17px] leading-[1.6] text-muted md:text-[18px]">
                A calm, fast workspace for everything you think and build. Encrypted,
                offline-ready, and synced across every device.
              </p>
              <div className="mt-[28px]">
                <WaitlistForm microcopy="No credit card. Your space stays yours." />
              </div>
              <p className="mt-[22px] flex items-start gap-[9px] text-[13.5px] leading-[1.55] text-muted">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="mt-[2px] flex-none"
                >
                  <path
                    d="M8 1.5 3 3.5v4c0 3 2.1 5.4 5 6.5 2.9-1.1 5-3.5 5-6.5v-4L8 1.5Z"
                    stroke="#CC785C"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                  <path d="M6 8l1.5 1.5L10.5 6.5" stroke="#CC785C" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Private by design, not by promise — sealed on your device, unreadable
                even to us.
              </p>
            </div>

            <div className="reveal">
              <HeroMockup />
            </div>
          </div>
        </section>

        {/* 3. Platform strip --------------------------------------------- */}
        <section className="mx-auto max-w-shell px-[20px] md:px-[40px]">
          <div className="reveal flex flex-col items-center justify-center gap-[6px] rounded-l border border-border bg-surface px-[20px] py-[14px] text-center sm:flex-row sm:gap-[16px]">
            <span className="text-[14px] font-medium text-ink">
              iPhone · iPad · Android · Mac · Web
            </span>
            <span className="hidden text-faint sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="text-[14px] text-muted">Open &amp; go — no account needed to start.</span>
          </div>
        </section>

        {/* 4. The shift -------------------------------------------------- */}
        <section className="mx-auto max-w-shell px-[20px] py-[72px] md:px-[40px] md:py-[96px]">
          <div className="reveal mx-auto max-w-[760px] text-center">
            <h2 className="text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[40px]">
              Stop juggling tools. Stop handing over your thinking.
            </h2>
            <p className="mx-auto mt-[20px] max-w-[640px] text-[17px] leading-[1.7] text-muted md:text-[18px]">
              Your ideas, tasks, and docs live in three apps — all on servers someone else can
              read. Ownspce puts them in one place, where a doc and its tasks are the same thing,
              and seals it so it&rsquo;s yours alone.
            </p>
          </div>
        </section>

        {/* 5. Three pillars ---------------------------------------------- */}
        <section className="mx-auto max-w-shell px-[20px] pb-[24px] md:px-[40px]">
          <div className="grid grid-cols-1 gap-[16px] md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <div
                key={p.title}
                className="reveal flex flex-col rounded-l border border-border bg-surface p-[24px]"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="mb-[14px] flex h-[36px] w-[36px] items-center justify-center rounded-m bg-accent-light">
                  <span className="h-[10px] w-[10px] rounded-full bg-accent" />
                </div>
                <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-ink">{p.title}</h3>
                <p className="mt-[9px] text-[14.5px] leading-[1.65] text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Feature showcase ------------------------------------------- */}
        <section id="features" className="mx-auto max-w-shell scroll-mt-[80px] px-[20px] py-[72px] md:px-[40px] md:py-[96px]">
          <div className="reveal mx-auto max-w-[680px] text-center">
            <h2 className="text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[40px]">
              Everything you need, nothing you don&rsquo;t
            </h2>
          </div>
          <div className="mt-[56px] flex flex-col gap-[56px] md:gap-[80px]">
            {FEATURES.map((f, i) => {
              const { Mockup } = f;
              const flip = i % 2 === 1;
              return (
                <div
                  key={f.title}
                  className="reveal grid grid-cols-1 items-center gap-[32px] lg:grid-cols-2 lg:gap-[56px]"
                >
                  <div className={flip ? 'lg:order-2' : ''}>
                    <h3 className="text-[22px] font-semibold tracking-[-0.015em] text-ink md:text-[26px]">
                      {f.title}
                    </h3>
                    <p className="mt-[12px] max-w-[460px] text-[15.5px] leading-[1.65] text-muted md:text-[16.5px]">
                      {f.line}
                    </p>
                  </div>
                  <div className={flip ? 'lg:order-1' : ''}>
                    <Mockup />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. Team -------------------------------------------------------- */}
        <section className="bg-surface">
          <div className="mx-auto max-w-shell px-[20px] py-[72px] md:px-[40px] md:py-[96px]">
            <div className="reveal grid grid-cols-1 gap-[40px] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-[64px]">
              <div>
                <h2 className="text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[38px]">
                  Built for teams that guard their thinking
                </h2>
                <p className="mt-[20px] max-w-[520px] text-[16.5px] leading-[1.7] text-muted">
                  Invite your team into a shared, encrypted space. Plan sprints, keep a knowledge
                  base that doesn&rsquo;t rot, and give clients guest access you revoke in one click.
                  Your roadmap stays sealed — even from us.
                </p>
              </div>
              <ul className="grid grid-cols-1 gap-[12px] self-center sm:grid-cols-2">
                {TEAM_LIST.map((item) => (
                  <li key={item} className="flex items-start gap-[10px] text-[14.5px] text-ink">
                    <Check />
                    <span className="leading-[1.5]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 8. Security ---------------------------------------------------- */}
        <section id="security" className="scroll-mt-[80px] bg-ink text-bg">
          <div className="mx-auto max-w-shell px-[20px] py-[72px] md:px-[40px] md:py-[96px]">
            <div className="reveal grid grid-cols-1 gap-[40px] lg:grid-cols-2 lg:gap-[64px]">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8f8f88]">
                  Security
                </div>
                <h2 className="mt-[14px] text-[30px] font-semibold leading-[1.12] tracking-[-0.02em] text-bg md:text-[42px]">
                  Private by design, not by promise
                </h2>
                <p className="mt-[20px] max-w-[520px] text-[16.5px] leading-[1.7] text-[#c9c9c2]">
                  Most apps &ldquo;encrypt your data&rdquo; but hold the keys — so they can read it,
                  and so can anyone who breaches them. Ownspce is zero-knowledge: sealed on your
                  device with a key we never see. We store and sync it, but can never open it.
                </p>
              </div>
              <ul className="flex flex-col gap-[14px] self-center">
                {SECURITY_LIST.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-[12px] border-b border-white/10 pb-[14px] text-[16px] text-bg last:border-b-0 last:pb-0"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[2px] flex h-[20px] w-[20px] flex-none items-center justify-center rounded-full bg-accent"
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4.2 3.6 6.8 9 1.2"
                          stroke="#fff"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="leading-[1.4]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 9. Pricing ----------------------------------------------------- */}
        <section id="pricing" className="mx-auto max-w-shell scroll-mt-[80px] px-[20px] py-[72px] md:px-[40px] md:py-[96px]">
          <div className="reveal mx-auto max-w-[680px] text-center">
            <h2 className="text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[40px]">
              Simple pricing. Private on every tier.
            </h2>
          </div>
          <div className="mt-[48px] grid grid-cols-1 items-stretch gap-[16px] md:grid-cols-3">
            {PRICING.map((tier, i) => (
              <div
                key={tier.name}
                style={{ transitionDelay: `${i * 70}ms` }}
                className={`reveal relative flex flex-col rounded-l border bg-surface p-[26px] ${
                  tier.popular ? 'border-accent shadow-[0_0_0_1px_#CC785C]' : 'border-border'
                }`}
              >
                {tier.popular && (
                  <span className="absolute right-[20px] top-[22px] rounded-full bg-accent-light px-[10px] py-[3px] text-[11px] font-semibold text-accent">
                    Most popular
                  </span>
                )}
                <h3 className="text-[17px] font-semibold text-ink">{tier.name}</h3>
                <div className="mt-[12px] flex items-baseline gap-[3px]">
                  <span className="text-[34px] font-semibold tracking-[-0.02em] text-ink">
                    {tier.price}
                  </span>
                  {tier.unit && <span className="text-[14px] text-muted">{tier.unit}</span>}
                </div>
                <p className="mt-[12px] min-h-[66px] text-[14px] leading-[1.6] text-muted">
                  {tier.blurb}
                </p>
                <a
                  href="#waitlist"
                  className={`mt-[16px] inline-flex items-center justify-center rounded-m px-[18px] py-[11px] text-[14.5px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                    tier.popular
                      ? 'bg-accent text-surface hover:bg-accent-hover'
                      : 'border border-border bg-surface text-ink hover:border-accent hover:text-accent'
                  }`}
                >
                  Join the waitlist
                </a>
              </div>
            ))}
          </div>
          <p className="reveal mt-[24px] text-center text-[13.5px] text-faint">
            Annual billing saves ~25%. India billed in ₹.
          </p>
        </section>

        {/* 10. FAQ -------------------------------------------------------- */}
        <section className="mx-auto max-w-[760px] px-[20px] pb-[72px] md:px-[40px] md:pb-[96px]">
          <div className="reveal">
            <div className="divide-y divide-border border-y border-border">
              {FAQ.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-[16px] py-[18px] text-[16px] font-medium text-ink transition-colors hover:text-accent focus-visible:outline-none focus-visible:text-accent [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="flex-none text-faint transition-transform duration-200 group-open:rotate-45"
                    >
                      <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </summary>
                  <p className="pb-[18px] text-[15px] leading-[1.65] text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Final CTA -------------------------------------------------- */}
        <section id="waitlist" className="scroll-mt-[80px] px-[20px] pb-[80px] md:px-[40px]">
          <div className="reveal mx-auto max-w-[760px] rounded-xl border border-border bg-surface px-[24px] py-[48px] text-center md:px-[48px] md:py-[64px]">
            <h2 className="text-[34px] font-semibold leading-[1.08] tracking-[-0.025em] text-ink md:text-[46px]">
              Own your space.
            </h2>
            <p className="mx-auto mt-[16px] max-w-[440px] text-[16.5px] leading-[1.6] text-muted">
              One private home for your notes, tasks, and plans. Join the waitlist and be first in.
            </p>
            <div className="mt-[28px]">
              <WaitlistForm microcopy="No credit card. Private by design." centered />
            </div>
          </div>
        </section>
      </main>

      {/* 12. Footer ------------------------------------------------------- */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-shell px-[20px] py-[36px] md:px-[40px]">
          <div className="flex flex-col items-start justify-between gap-[24px] md:flex-row md:items-center">
            <div className="flex items-center gap-[9px]">
              <OwlLogo size={24} />
              <span className="text-[16px] font-semibold tracking-[-0.01em] text-ink">ownspce</span>
            </div>
            <nav className="flex flex-wrap gap-x-[24px] gap-y-[10px]" aria-label="Footer">
              <a href="#features" className={NAV_LINK}>
                Features
              </a>
              <a href="#security" className={NAV_LINK}>
                Security
              </a>
              <a href="#pricing" className={NAV_LINK}>
                Pricing
              </a>
              <a href="/privacy-policy" className={NAV_LINK}>
                Privacy
              </a>
              <a href="/terms" className={NAV_LINK}>
                Terms
              </a>
            </nav>
          </div>
          <div className="mt-[28px] flex flex-col gap-[6px] border-t border-border pt-[20px] text-[13px] text-faint sm:flex-row sm:items-center sm:justify-between">
            <span>Private by design. Built with care.</span>
            <span>© 2026 Ownspce.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

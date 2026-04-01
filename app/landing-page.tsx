'use client';

import { useState } from 'react';

function OwlLogo({ size = 48 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={size} height={size}>
      <path fillRule="evenodd" fill="#F5F5F0" d="M256,130 C242,126 214,114 192,102 C174,92 158,76 144,70 C132,75 114,96 100,120 C84,148 74,180 68,214 C62,250 62,288 68,322 C74,358 86,392 106,420 C126,448 154,470 186,484 C210,494 234,498 256,498 C278,498 302,494 326,484 C358,470 386,448 406,420 C426,392 438,358 444,322 C450,288 450,250 444,214 C438,180 428,148 412,120 C398,96 380,75 368,70 C354,76 338,92 320,102 C298,114 270,126 256,130Z M180,272 m-72,0 a72,72 0 1,0 144,0 a72,72 0 1,0 -144,0 M332,272 m-72,0 a72,72 0 1,0 144,0 a72,72 0 1,0 -144,0" />
      <circle cx="190" cy="276" r="29" fill="#F5F5F0" />
      <circle cx="322" cy="276" r="29" fill="#F5F5F0" />
      <polygon points="246,348 266,348 256,368" fill="#F5F5F0" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#444" strokeWidth="1.5" />
      <path d="M5 8 L7 10.5 L11 5.5" stroke="#888" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UnifiedIllustration() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-40">
      <rect x="20" y="20" width="100" height="70" rx="12" fill="#141414" stroke="#2A2A2A" strokeWidth="0.5" />
      <rect x="32" y="34" width="50" height="4" rx="2" fill="#444" />
      <rect x="32" y="44" width="70" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="32" y="52" width="60" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="32" y="60" width="65" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="90" y="50" width="100" height="90" rx="12" fill="#141414" stroke="#2A2A2A" strokeWidth="0.5" />
      <circle cx="106" cy="68" r="5" stroke="#888" strokeWidth="1" fill="none" />
      <rect x="118" y="65" width="55" height="4" rx="2" fill="#444" />
      <circle cx="106" cy="84" r="5" stroke="#22C55E" strokeWidth="1" fill="none" />
      <path d="M103 84 L105 86.5 L109.5 81.5" stroke="#22C55E" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="118" y="81" width="45" height="4" rx="2" fill="#444" />
      <circle cx="106" cy="100" r="5" stroke="#888" strokeWidth="1" fill="none" />
      <rect x="118" y="97" width="50" height="4" rx="2" fill="#444" />
      <rect x="160" y="15" width="100" height="80" rx="12" fill="#141414" stroke="#2A2A2A" strokeWidth="0.5" />
      <rect x="172" y="28" width="24" height="55" rx="4" fill="#1E1E1E" />
      <rect x="177" y="34" width="14" height="8" rx="2" fill="#2A2A2A" />
      <rect x="177" y="46" width="14" height="6" rx="2" fill="#2A2A2A" />
      <rect x="202" y="28" width="24" height="55" rx="4" fill="#1E1E1E" />
      <rect x="207" y="34" width="14" height="10" rx="2" fill="#2A2A2A" />
      <rect x="232" y="28" width="24" height="55" rx="4" fill="#1E1E1E" />
      <rect x="237" y="34" width="14" height="6" rx="2" fill="#2A2A2A" />
    </svg>
  );
}

function PrivacyIllustration() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-40">
      <path d="M140 25 L185 45 L185 90 C185 115 165 135 140 145 C115 135 95 115 95 90 L95 45 Z" fill="#141414" stroke="#2A2A2A" strokeWidth="0.5" />
      <path d="M140 40 L175 55 L175 88 C175 108 159 124 140 132 C121 124 105 108 105 88 L105 55 Z" fill="#1E1E1E" />
      <rect x="128" y="82" width="24" height="20" rx="4" fill="#F5F5F5" opacity="0.9" />
      <path d="M133 82 L133 74 C133 70.13 136.13 67 140 67 C143.87 67 147 70.13 147 74 L147 82" stroke="#F5F5F5" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.9" />
      <circle cx="140" cy="92" r="2.5" fill="#0A0A0A" />
    </svg>
  );
}

function OrganizationIllustration() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-40">
      <rect x="60" y="20" width="160" height="120" rx="12" fill="#141414" stroke="#2A2A2A" strokeWidth="0.5" />
      <rect x="60" y="20" width="50" height="120" rx="12" fill="#1E1E1E" stroke="#2A2A2A" strokeWidth="0.5" />
      <rect x="70" y="36" width="30" height="3" rx="1.5" fill="#444" />
      <rect x="70" y="48" width="25" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="70" y="56" width="28" height="3" rx="1.5" fill="#F5F5F5" opacity="0.4" />
      <rect x="70" y="64" width="22" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="70" y="76" width="30" height="3" rx="1.5" fill="#444" />
      <rect x="70" y="88" width="20" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="122" y="34" width="80" height="5" rx="2.5" fill="#444" />
      <rect x="122" y="48" width="85" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="122" y="56" width="75" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="122" y="64" width="80" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="122" y="86" width="30" height="14" rx="7" fill="#1E1E1E" />
      <rect x="128" y="91" width="18" height="3" rx="1.5" fill="#888" />
      <rect x="158" y="86" width="35" height="14" rx="7" fill="#1E1E1E" />
      <rect x="164" y="91" width="22" height="3" rx="1.5" fill="#888" />
    </svg>
  );
}

function OfflineIllustration() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-40">
      <rect x="80" y="25" width="120" height="85" rx="12" fill="#141414" stroke="#2A2A2A" strokeWidth="0.5" />
      <rect x="88" y="33" width="104" height="65" rx="4" fill="#1E1E1E" />
      <rect x="96" y="42" width="40" height="4" rx="2" fill="#444" />
      <rect x="96" y="52" width="88" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="96" y="60" width="80" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="96" y="68" width="75" height="3" rx="1.5" fill="#2A2A2A" />
      <g transform="translate(140, 124)">
        <path d="M-16-5 C-12-10 -4-13 0-13 C4-13 12-10 16-5" stroke="#444" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M-10-1 C-7-4.5 -3-6 0-6 C3-6 7-4.5 10-1" stroke="#444" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="0" cy="4" r="2.5" fill="#444" />
        <line x1="-18" y1="-14" x2="18" y2="8" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </g>
      <g transform="translate(200, 55)">
        <circle cx="0" cy="0" r="14" fill="#1E1E1E" stroke="#2A2A2A" strokeWidth="0.5" />
        <path d="M-5 0 L-2 3.5 L5.5-4" stroke="#22C55E" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function SyncIllustration() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-40">
      {/* Laptop left */}
      <rect x="18" y="45" width="72" height="50" rx="6" fill="#141414" stroke="#2A2A2A" strokeWidth="0.5" />
      <rect x="24" y="51" width="60" height="38" rx="2" fill="#1E1E1E" />
      <rect x="30" y="58" width="28" height="3" rx="1.5" fill="#444" />
      <rect x="30" y="66" width="42" height="2" rx="1" fill="#2A2A2A" />
      <rect x="30" y="72" width="36" height="2" rx="1" fill="#2A2A2A" />
      <rect x="12" y="95" width="84" height="5" rx="2" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="0.5" />
      {/* Phone right */}
      <rect x="192" y="38" width="40" height="68" rx="8" fill="#141414" stroke="#2A2A2A" strokeWidth="0.5" />
      <rect x="197" y="46" width="30" height="50" rx="2" fill="#1E1E1E" />
      <rect x="202" y="53" width="18" height="3" rx="1.5" fill="#444" />
      <rect x="202" y="61" width="20" height="2" rx="1" fill="#2A2A2A" />
      <rect x="202" y="67" width="16" height="2" rx="1" fill="#2A2A2A" />
      {/* Cloud center */}
      <path d="M122 68 C122 60 129 54 137 54 C140 48 147 44 155 44 C167 44 176 53 176 65 C181 65 185 69 185 74 C185 79 181 83 176 83 L122 83 C117 83 113 79 113 74 C113 69 117 65 122 65 Z" fill="#1E1E1E" stroke="#2A2A2A" strokeWidth="0.5" />
      {/* Drive-style icon inside cloud */}
      <path d="M136 74 L144 60 L152 74 Z" fill="#444" />
      <path d="M144 60 L152 74 L160 60 Z" fill="#333" />
      <path d="M136 74 L152 74 L160 60 L152 74 Z" fill="#3A3A3A" />
      {/* Sync arrows: laptop → cloud */}
      <path d="M92 72 C98 65 108 63 112 64" stroke="#444" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M109 61 L112 64 L109 67" stroke="#444" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sync arrows: cloud → phone */}
      <path d="M186 68 C190 67 194 66 194 65" stroke="#444" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M191 62 L194 65 L191 68" stroke="#444" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* iCloud label */}
      <rect x="114" y="88" width="60" height="10" rx="5" fill="#1A1A1A" />
      <rect x="118" y="91" width="52" height="3" rx="1.5" fill="#2A2A2A" />
    </svg>
  );
}

function CrossPlatformIllustration() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-40">
      <rect x="30" y="30" width="100" height="70" rx="8" fill="#141414" stroke="#2A2A2A" strokeWidth="0.5" />
      <rect x="36" y="36" width="88" height="52" rx="2" fill="#1E1E1E" />
      <rect x="65" y="100" width="30" height="4" rx="2" fill="#2A2A2A" />
      <rect x="55" y="104" width="50" height="3" rx="1.5" fill="#1E1E1E" />
      <rect x="44" y="44" width="35" height="3" rx="1.5" fill="#444" />
      <rect x="44" y="52" width="72" height="2" rx="1" fill="#2A2A2A" />
      <rect x="44" y="58" width="65" height="2" rx="1" fill="#2A2A2A" />
      <rect x="145" y="25" width="55" height="80" rx="8" fill="#141414" stroke="#2A2A2A" strokeWidth="0.5" />
      <rect x="150" y="32" width="45" height="62" rx="2" fill="#1E1E1E" />
      <rect x="156" y="40" width="25" height="3" rx="1.5" fill="#444" />
      <rect x="156" y="48" width="32" height="2" rx="1" fill="#2A2A2A" />
      <rect x="215" y="35" width="38" height="70" rx="8" fill="#141414" stroke="#2A2A2A" strokeWidth="0.5" />
      <rect x="220" y="42" width="28" height="50" rx="2" fill="#1E1E1E" />
      <rect x="225" y="49" width="18" height="2.5" rx="1.25" fill="#444" />
      <rect x="225" y="55" width="16" height="2" rx="1" fill="#2A2A2A" />
      <g opacity="0.35">
        <path d="M133 65 C138 55 143 55 148 65" stroke="#F5F5F5" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M145 63 L148 65 L145 67" stroke="#F5F5F5" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M203 65 C208 55 211 55 216 65" stroke="#F5F5F5" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M213 63 L216 65 L213 67" stroke="#F5F5F5" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  }

  const features = [
    {
      title: 'Notes, tasks, boards — one place',
      description: 'Stop switching between apps. Write notes, manage tasks, and organize boards in a single unified workspace.',
      illustration: <UnifiedIllustration />,
    },
    {
      title: 'You own your data',
      description: 'We never read, store or sell your data. You decide if you want data to be local or synced.',
      illustration: <PrivacyIllustration />,
    },
    {
      title: 'Organize thoughts naturally',
      description: 'Nested pages, tags, and smart linking let you structure ideas the way your mind works.',
      illustration: <OrganizationIllustration />,
    },
    {
      title: 'Works without internet',
      description: 'Full offline support. On a plane, in a tunnel, at a cabin — your work goes where you go.',
      illustration: <OfflineIllustration />,
    },
    {
      title: 'Sync with Google Drive or iCloud',
      description: 'Use your own Google Drive or iCloud to sync across devices. Your data moves through your cloud storage — never ours.',
      illustration: <SyncIllustration />,
    },
    {
      title: 'Available on all your devices',
      description: 'Seamlessly move between desktop, tablet, and phone. Your workspace syncs locally.',
      illustration: <CrossPlatformIllustration />,
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-t1">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-[16px] md:px-[32px] py-[24px] max-w-[1080px] mx-auto">
        <div className="flex items-center gap-[12px]">
          <OwlLogo size={32} />
          <span className="font-sans text-[15px] font-medium tracking-tight">ownspce</span>
        </div>
        <a
          href="#waitlist"
          className="font-sans text-[13px] font-medium px-[20px] py-[10px] rounded-[12px] border-[0.5px] border-border text-t2 hover:border-border-mid hover:text-t1 transition-all duration-150 ease-out"
        >
          Join Waitlist
        </a>
      </nav>

      {/* Hero */}
      <section className="px-[16px] md:px-[32px] pt-[80px] pb-[48px] max-w-[720px] mx-auto text-center">
        <div className="flex justify-center mb-[24px]">
          <OwlLogo size={64} />
        </div>
        <h1 className="font-serif italic text-[44px] leading-[48px] tracking-[-1px] mb-[4px]">
          Ownspce
        </h1>
        <p className="font-sans font-light text-[17px] text-t2 mb-[16px]">Own your space.</p>
        <p className="font-sans text-[13px] text-t3 max-w-[290px] mx-auto mb-[32px] leading-[1.7]">
          Your thoughts, tasks, and ideas — on your device.
          Private by design, not by promise.
        </p>

        <div className="inline-flex items-center gap-[8px] px-[16px] py-[8px] rounded-full bg-elev text-t3 font-sans text-[11px] tracking-[0.5px] mb-[32px]">
          <CheckIcon />
          Designed for the way you think
        </div>

        {/* Waitlist form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-[8px] max-w-[400px] mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-[16px] py-[14px] rounded-[12px] bg-elev border-none text-t1 placeholder-t3 font-sans text-[14px] focus:outline-none focus:ring-1 focus:ring-border-mid transition-all duration-150 ease-out"
          />
          <button
            type="submit"
            className="px-[20px] py-[15px] rounded-[12px] bg-t1 text-bg font-sans font-medium text-[15px] hover:opacity-80 transition-all duration-150 ease-out whitespace-nowrap"
          >
            Join Waitlist
          </button>
        </form>
        {submitted && (
          <p className="font-sans text-[13px] text-success mt-[12px]">You&apos;re on the list. We&apos;ll be in touch.</p>
        )}
        <p className="font-sans text-[12px] font-light text-t3 mt-[12px]">No credit card required.</p>
      </section>

      {/* Why another notes app — story section */}
      <section className="px-[16px] md:px-[32px] py-[48px] max-w-[600px] mx-auto">
        <div className="rounded-[12px] border-[0.5px] border-border bg-surface p-[24px] md:p-[32px]">
          <p className="font-sans text-[11px] tracking-[0.5px] text-t3 uppercase mb-[12px]">
            Personal &middot; Essay
          </p>
          <h2 className="font-serif text-[24px] leading-[30px] mb-[8px]">
            Why I&apos;m building another notes app
          </h2>
          <p className="font-sans text-[15px] text-t3 mb-[16px]">
            And why this one is different from Notion, Obsidian, and the rest.
          </p>
          <div className="flex items-center gap-[12px] mb-[24px] pb-[24px] border-b-[0.5px] border-border">
            <div className="w-[32px] h-[32px] rounded-[8px] bg-elev border-[0.5px] border-border flex items-center justify-center font-serif italic text-[14px] text-t1">
              R
            </div>
            <div>
              <p className="font-sans text-[13px] font-medium text-t1">Rahul</p>
              <p className="font-sans text-[11px] text-t3">6 min read</p>
            </div>
          </div>

          <div className="space-y-[20px] font-sans text-[15px] leading-[1.85] text-[#C0C0C0]">
            <p>
              I&apos;ve used Notion since 2020. I&apos;ve tried Obsidian, Logseq, Roam, Bear, Apple Notes,
              and at one point, a physical Moleskine. None of them felt right.
            </p>
            <p>
              Notion is powerful but cloud-locked. My product ideas — things I&apos;d never want on
              someone else&apos;s server — sit on Notion&apos;s AWS instances. I have no say in that.
            </p>
            <p>
              Obsidian is private and local, but the mobile app is an afterthought, and there&apos;s
              no task management. You need plugins for everything.
            </p>
            <p>
              The gap I kept hitting:{' '}
              <em className="font-serif italic text-t1">
                a beautiful, mobile-first app where the data is mine, that also does tasks.
              </em>{' '}
              That combination doesn&apos;t exist.
            </p>
            <p>
              So I&apos;m building it.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-[16px] md:px-[32px] py-[48px] max-w-[1080px] mx-auto">
        <div className="text-center mb-[32px]">
          <h2 className="font-serif text-[36px] leading-[42px] tracking-tight mb-[4px]">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="font-sans text-[13px] text-t2 max-w-[400px] mx-auto">
            A single app that replaces your notes, task manager, and project boards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[12px] border-[0.5px] border-border bg-surface p-[16px] hover:border-border-mid transition-all duration-150 ease-out"
            >
              <div className="mb-[16px] rounded-[8px] overflow-hidden bg-bg">
                {feature.illustration}
              </div>
              <h3 className="font-sans text-[15px] font-medium mb-[4px]">{feature.title}</h3>
              <p className="font-sans text-[13px] text-t2 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-[16px] md:px-[32px] py-[48px] max-w-[720px] mx-auto">
        <div className="text-center mb-[32px]">
          <h2 className="font-serif text-[36px] leading-[42px] tracking-tight mb-[4px]">
            Get started in seconds
          </h2>
          <p className="font-sans text-[13px] text-t2">
            No sign-up walls. No cloud accounts. Just open and go.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          {[
            { step: '01', title: 'Download the app', description: 'Available for iOS, Android, Mac, and Web.' },
            { step: '02', title: 'Create your space', description: 'Set up your workspace in one tap. Everything stays local.' },
            { step: '03', title: 'Start building', description: 'Write, plan, and organize — your way, on your terms.' },
          ].map((item) => (
            <div key={item.step} className="text-center md:text-left">
              <span className="font-sans text-[11px] tracking-[0.5px] text-t3 mb-[12px] block">{item.step}</span>
              <h3 className="font-sans text-[18px] font-medium mb-[8px]">{item.title}</h3>
              <p className="font-sans text-[13px] text-t2 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section id="waitlist" className="px-[16px] md:px-[32px] py-[48px] max-w-[720px] mx-auto text-center">
        <div className="rounded-[24px] border-[0.5px] border-border bg-surface p-[32px] md:p-[48px]">
          <div className="flex justify-center">
            <OwlLogo size={48} />
          </div>
          <h2 className="font-serif italic text-[36px] leading-[42px] tracking-tight mt-[24px] mb-[4px]">
            Ready to own your space?
          </h2>
          <p className="font-sans text-[13px] text-t2 max-w-[360px] mx-auto mb-[24px]">
            Join the waitlist and be the first to experience a workspace that truly belongs to you.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-[8px] max-w-[400px] mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-[16px] py-[14px] rounded-[12px] bg-elev border-none text-t1 placeholder-t3 font-sans text-[14px] focus:outline-none focus:ring-1 focus:ring-border-mid transition-all duration-150 ease-out"
            />
            <button
              type="submit"
              className="px-[20px] py-[15px] rounded-[12px] bg-t1 text-bg font-sans font-medium text-[15px] hover:opacity-80 transition-all duration-150 ease-out whitespace-nowrap"
            >
              Join Waitlist
            </button>
          </form>
          {submitted && (
            <p className="font-sans text-[13px] text-success mt-[12px]">You&apos;re on the list. We&apos;ll be in touch.</p>
          )}
          <p className="font-sans text-[12px] font-light text-t3 mt-[12px]">No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-[16px] md:px-[32px] py-[24px] max-w-[1080px] mx-auto border-t-[0.5px] border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-[12px]">
          <div className="flex items-center gap-[8px]">
            <OwlLogo size={20} />
            <span className="font-sans text-[13px] text-t2">ownspce</span>
          </div>
          <p className="font-sans text-[11px] text-t3 tracking-[0.5px]">
            Private by design. Built with care.
          </p>
        </div>
      </footer>
    </div>
  );
}

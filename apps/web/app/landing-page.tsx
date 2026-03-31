'use client';

import { useState } from 'react';

function OwlLogo({ size = 48 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={size} height={size}>
      <rect width="512" height="512" rx="112" fill="#1A1A1A" />
      <circle cx="180" cy="260" r="72" fill="#F5F5F0" />
      <circle cx="332" cy="260" r="72" fill="#F5F5F0" />
      <circle cx="198" cy="264" r="28" fill="#1A1A1A" />
      <circle cx="350" cy="264" r="28" fill="#1A1A1A" />
    </svg>
  );
}

function UnifiedWorkspaceIllustration() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-40">
      {/* Note card */}
      <rect x="20" y="20" width="100" height="70" rx="8" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="1" />
      <rect x="32" y="34" width="50" height="4" rx="2" fill="#555" />
      <rect x="32" y="44" width="70" height="3" rx="1.5" fill="#333" />
      <rect x="32" y="52" width="60" height="3" rx="1.5" fill="#333" />
      <rect x="32" y="60" width="65" height="3" rx="1.5" fill="#333" />
      <rect x="32" y="68" width="40" height="3" rx="1.5" fill="#333" />
      {/* Task list */}
      <rect x="90" y="50" width="100" height="90" rx="8" fill="#141414" stroke="#2A2A2A" strokeWidth="1" />
      <circle cx="106" cy="68" r="5" stroke="#FF6B4A" strokeWidth="1.5" fill="none" />
      <rect x="118" y="65" width="55" height="4" rx="2" fill="#555" />
      <circle cx="106" cy="84" r="5" stroke="#FF6B4A" strokeWidth="1.5" fill="none" />
      <path d="M103 84 L105 86.5 L109.5 81.5" stroke="#FF6B4A" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="118" y="81" width="45" height="4" rx="2" fill="#444" />
      <circle cx="106" cy="100" r="5" stroke="#FF6B4A" strokeWidth="1.5" fill="none" />
      <rect x="118" y="97" width="50" height="4" rx="2" fill="#555" />
      <circle cx="106" cy="116" r="5" stroke="#555" strokeWidth="1.5" fill="none" />
      <rect x="118" y="113" width="40" height="4" rx="2" fill="#444" />
      {/* Board card */}
      <rect x="160" y="15" width="100" height="80" rx="8" fill="#111" stroke="#2A2A2A" strokeWidth="1" />
      <rect x="172" y="28" width="24" height="55" rx="4" fill="#1A1A1A" />
      <rect x="177" y="34" width="14" height="8" rx="2" fill="#FF6B4A" opacity="0.3" />
      <rect x="177" y="46" width="14" height="6" rx="2" fill="#FF6B4A" opacity="0.2" />
      <rect x="202" y="28" width="24" height="55" rx="4" fill="#1A1A1A" />
      <rect x="207" y="34" width="14" height="10" rx="2" fill="#C45A3C" opacity="0.3" />
      <rect x="232" y="28" width="24" height="55" rx="4" fill="#1A1A1A" />
      <rect x="237" y="34" width="14" height="6" rx="2" fill="#555" opacity="0.3" />
    </svg>
  );
}

function PrivacyIllustration() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-40">
      {/* Shield */}
      <path d="M140 25 L185 45 L185 90 C185 115 165 135 140 145 C115 135 95 115 95 90 L95 45 Z" fill="#141414" stroke="#2A2A2A" strokeWidth="1.5" />
      <path d="M140 40 L175 55 L175 88 C175 108 159 124 140 132 C121 124 105 108 105 88 L105 55 Z" fill="#1A1A1A" />
      {/* Lock icon */}
      <rect x="128" y="82" width="24" height="20" rx="4" fill="#FF6B4A" opacity="0.8" />
      <path d="M133 82 L133 74 C133 70.13 136.13 67 140 67 C143.87 67 147 70.13 147 74 L147 82" stroke="#FF6B4A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="140" cy="92" r="2.5" fill="#0A0A0A" />
      {/* Data dots orbiting */}
      <circle cx="140" cy="25" r="3" fill="#333" />
      <circle cx="185" cy="45" r="2.5" fill="#333" />
      <circle cx="95" cy="45" r="2.5" fill="#333" />
      <circle cx="70" cy="85" r="2" fill="#222" />
      <circle cx="210" cy="85" r="2" fill="#222" />
    </svg>
  );
}

function OrganizationIllustration() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-40">
      {/* Nested pages */}
      <rect x="60" y="20" width="160" height="120" rx="10" fill="#111" stroke="#2A2A2A" strokeWidth="1" />
      {/* Sidebar */}
      <rect x="60" y="20" width="50" height="120" rx="10" fill="#141414" />
      <rect x="60" y="20" width="50" height="120" rx="10" fill="#141414" stroke="#2A2A2A" strokeWidth="1" />
      <rect x="70" y="36" width="30" height="3" rx="1.5" fill="#555" />
      <rect x="70" y="48" width="25" height="3" rx="1.5" fill="#333" />
      <rect x="70" y="56" width="28" height="3" rx="1.5" fill="#FF6B4A" opacity="0.6" />
      <rect x="70" y="64" width="22" height="3" rx="1.5" fill="#333" />
      <rect x="70" y="76" width="30" height="3" rx="1.5" fill="#555" />
      <rect x="70" y="88" width="20" height="3" rx="1.5" fill="#333" />
      <rect x="70" y="96" width="26" height="3" rx="1.5" fill="#333" />
      <rect x="70" y="108" width="30" height="3" rx="1.5" fill="#555" />
      {/* Content area */}
      <rect x="122" y="34" width="80" height="5" rx="2.5" fill="#444" />
      <rect x="122" y="48" width="85" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="122" y="56" width="75" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="122" y="64" width="80" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="122" y="72" width="60" height="3" rx="1.5" fill="#2A2A2A" />
      {/* Tags */}
      <rect x="122" y="86" width="30" height="14" rx="7" fill="#FF6B4A" opacity="0.15" />
      <rect x="128" y="91" width="18" height="3" rx="1.5" fill="#FF6B4A" opacity="0.6" />
      <rect x="158" y="86" width="35" height="14" rx="7" fill="#2A2A2A" />
      <rect x="164" y="91" width="22" height="3" rx="1.5" fill="#555" />
      <rect x="122" y="110" width="85" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="122" y="118" width="70" height="3" rx="1.5" fill="#2A2A2A" />
    </svg>
  );
}

function OfflineIllustration() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-40">
      {/* Device */}
      <rect x="80" y="25" width="120" height="85" rx="10" fill="#141414" stroke="#2A2A2A" strokeWidth="1.5" />
      <rect x="88" y="33" width="104" height="65" rx="4" fill="#111" />
      {/* Screen content */}
      <rect x="96" y="42" width="40" height="4" rx="2" fill="#555" />
      <rect x="96" y="52" width="88" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="96" y="60" width="80" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="96" y="68" width="75" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="96" y="78" width="35" height="12" rx="6" fill="#FF6B4A" opacity="0.2" />
      <rect x="102" y="82" width="22" height="3" rx="1.5" fill="#FF6B4A" opacity="0.7" />
      {/* WiFi off icon */}
      <g transform="translate(140, 120)">
        <path d="M-16-5 C-12-10 -4-13 0-13 C4-13 12-10 16-5" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M-10-1 C-7-4.5 -3-6 0-6 C3-6 7-4.5 10-1" stroke="#444" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="0" cy="4" r="2.5" fill="#555" />
        {/* Strike-through */}
        <line x1="-18" y1="-14" x2="18" y2="8" stroke="#FF6B4A" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      </g>
      {/* Checkmark */}
      <g transform="translate(200, 55)">
        <circle cx="0" cy="0" r="14" fill="#FF6B4A" opacity="0.15" />
        <path d="M-5 0 L-2 3.5 L5.5-4" stroke="#FF6B4A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function MinimalDesignIllustration() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-40">
      {/* Clean editor */}
      <rect x="50" y="20" width="180" height="120" rx="10" fill="#111" stroke="#2A2A2A" strokeWidth="1" />
      {/* Title bar dots */}
      <circle cx="66" cy="34" r="3" fill="#FF6B4A" opacity="0.6" />
      <circle cx="76" cy="34" r="3" fill="#555" opacity="0.4" />
      <circle cx="86" cy="34" r="3" fill="#555" opacity="0.4" />
      {/* Divider */}
      <line x1="50" y1="44" x2="230" y2="44" stroke="#1A1A1A" strokeWidth="1" />
      {/* Editor content - clean text */}
      <rect x="68" y="56" width="90" height="6" rx="3" fill="#444" />
      <rect x="68" y="72" width="144" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="68" y="80" width="130" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="68" y="88" width="140" height="3" rx="1.5" fill="#2A2A2A" />
      <rect x="68" y="96" width="100" height="3" rx="1.5" fill="#2A2A2A" />
      {/* Cursor blink */}
      <rect x="68" y="110" width="2" height="14" rx="1" fill="#FF6B4A" opacity="0.8" />
    </svg>
  );
}

function CrossPlatformIllustration() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-40">
      {/* Desktop */}
      <rect x="30" y="30" width="100" height="70" rx="6" fill="#141414" stroke="#2A2A2A" strokeWidth="1" />
      <rect x="36" y="36" width="88" height="52" rx="2" fill="#111" />
      <rect x="65" y="100" width="30" height="4" rx="2" fill="#2A2A2A" />
      <rect x="55" y="104" width="50" height="3" rx="1.5" fill="#1A1A1A" />
      {/* Desktop screen content */}
      <rect x="44" y="44" width="35" height="3" rx="1.5" fill="#555" />
      <rect x="44" y="52" width="72" height="2" rx="1" fill="#2A2A2A" />
      <rect x="44" y="58" width="65" height="2" rx="1" fill="#2A2A2A" />
      <rect x="44" y="64" width="70" height="2" rx="1" fill="#2A2A2A" />
      {/* Tablet */}
      <rect x="145" y="25" width="55" height="80" rx="6" fill="#141414" stroke="#2A2A2A" strokeWidth="1" />
      <rect x="150" y="32" width="45" height="62" rx="2" fill="#111" />
      <rect x="156" y="40" width="25" height="3" rx="1.5" fill="#555" />
      <rect x="156" y="48" width="32" height="2" rx="1" fill="#2A2A2A" />
      <rect x="156" y="54" width="28" height="2" rx="1" fill="#2A2A2A" />
      {/* Phone */}
      <rect x="215" y="35" width="38" height="70" rx="6" fill="#141414" stroke="#2A2A2A" strokeWidth="1" />
      <rect x="220" y="42" width="28" height="50" rx="2" fill="#111" />
      <rect x="225" y="49" width="18" height="2.5" rx="1.25" fill="#555" />
      <rect x="225" y="55" width="16" height="2" rx="1" fill="#2A2A2A" />
      <rect x="225" y="60" width="14" height="2" rx="1" fill="#2A2A2A" />
      {/* Sync arrows */}
      <g opacity="0.4">
        <path d="M133 65 C138 55 143 55 148 65" stroke="#FF6B4A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M145 63 L148 65 L145 67" stroke="#FF6B4A" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M203 65 C208 55 211 55 216 65" stroke="#FF6B4A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M213 63 L216 65 L213 67" stroke="#FF6B4A" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#555" strokeWidth="1.5" />
      <path d="M5 8 L7 10.5 L11 5.5" stroke="#888" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
      description: 'Stop switching between apps. Write notes, manage tasks, and organize boards in a single unified workspace built for how you actually work.',
      illustration: <UnifiedWorkspaceIllustration />,
    },
    {
      title: 'Your data stays on your device',
      description: 'We never read, store, or sell your notes. Everything lives on your device, encrypted and private. No cloud dependency, no data harvesting.',
      illustration: <PrivacyIllustration />,
    },
    {
      title: 'Organize thoughts naturally',
      description: 'Nested pages, tags, and smart linking let you structure your ideas the way your mind works — not the way a tool forces you to.',
      illustration: <OrganizationIllustration />,
    },
    {
      title: 'Works without internet',
      description: 'Full offline support means your workspace is always available. On a plane, in a tunnel, at a cabin — your work goes where you go.',
      illustration: <OfflineIllustration />,
    },
    {
      title: 'Clean and minimal interface',
      description: 'A distraction-free editor that stays out of your way. No clutter, no bloat — just a beautiful canvas for your thoughts.',
      illustration: <MinimalDesignIllustration />,
    },
    {
      title: 'Available on all your devices',
      description: 'Seamlessly move between desktop, tablet, and phone. Your workspace syncs locally across devices with zero lag.',
      illustration: <CrossPlatformIllustration />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <OwlLogo size={36} />
          <span className="text-lg font-medium tracking-tight">ownspce</span>
        </div>
        <a
          href="#waitlist"
          className="text-sm px-5 py-2.5 rounded-full border border-[#2A2A2A] text-[#ccc] hover:border-[#444] hover:text-white transition-colors"
        >
          Join Waitlist
        </a>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-12 pt-20 pb-28 max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <OwlLogo size={72} />
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-normal tracking-tight mb-4">
          Ownspce
        </h1>
        <p className="text-xl md:text-2xl text-[#999] mb-4">Own your space.</p>
        <p className="text-base md:text-lg text-[#666] max-w-xl mx-auto mb-10 leading-relaxed">
          Your thoughts, tasks, and ideas — on your device.
          <br />
          Private by design, not by promise.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1A1A1A] bg-[#111] text-[#888] text-sm mb-12">
          <CheckIcon />
          Designed for the way you think
        </div>

        {/* Waitlist form - Hero */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-5 py-3.5 rounded-xl bg-[#111] border border-[#2A2A2A] text-white placeholder-[#555] text-sm focus:outline-none focus:border-[#444] transition-colors"
          />
          <button
            type="submit"
            className="px-7 py-3.5 rounded-xl bg-white text-[#0A0A0A] font-medium text-sm hover:bg-[#e5e5e5] transition-colors whitespace-nowrap"
          >
            Join Waitlist
          </button>
        </form>
        {submitted && (
          <p className="text-sm text-[#FF6B4A] mt-3">You&apos;re on the list. We&apos;ll be in touch.</p>
        )}
        <p className="text-xs text-[#444] mt-4">No credit card required.</p>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-4">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="text-[#666] text-base md:text-lg max-w-lg mx-auto">
            A single app that replaces your notes, task manager, and project boards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-[#1A1A1A] bg-[#0D0D0D] p-6 hover:border-[#2A2A2A] transition-colors"
            >
              <div className="mb-5 rounded-xl overflow-hidden bg-[#0A0A0A]">
                {feature.illustration}
              </div>
              <h3 className="text-base font-medium mb-2 text-[#eee]">{feature.title}</h3>
              <p className="text-sm text-[#666] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 md:px-12 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-4">
            Get started in seconds
          </h2>
          <p className="text-[#666] text-base md:text-lg">
            No sign-up walls. No cloud accounts. Just open and go.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Download the app', description: 'Available for macOS, Windows, iOS, and Android.' },
            { step: '02', title: 'Create your space', description: 'Set up your workspace in one tap. Everything stays local.' },
            { step: '03', title: 'Start building', description: 'Write, plan, and organize — your way, on your terms.' },
          ].map((item) => (
            <div key={item.step} className="text-center md:text-left">
              <span className="text-xs font-mono text-[#FF6B4A] opacity-70 mb-3 block">{item.step}</span>
              <h3 className="text-lg font-medium mb-2">{item.title}</h3>
              <p className="text-sm text-[#666] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section id="waitlist" className="px-6 md:px-12 py-24 max-w-4xl mx-auto text-center">
        <div className="rounded-3xl border border-[#1A1A1A] bg-[#0D0D0D] p-10 md:p-16">
          <OwlLogo size={48} />
          <h2 className="text-3xl md:text-4xl font-serif tracking-tight mt-6 mb-4">
            Ready to own your space?
          </h2>
          <p className="text-[#666] text-base md:text-lg max-w-md mx-auto mb-8">
            Join the waitlist and be the first to experience a workspace that truly belongs to you.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-3.5 rounded-xl bg-[#111] border border-[#2A2A2A] text-white placeholder-[#555] text-sm focus:outline-none focus:border-[#444] transition-colors"
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-xl bg-white text-[#0A0A0A] font-medium text-sm hover:bg-[#e5e5e5] transition-colors whitespace-nowrap"
            >
              Join Waitlist
            </button>
          </form>
          {submitted && (
            <p className="text-sm text-[#FF6B4A] mt-3">You&apos;re on the list. We&apos;ll be in touch.</p>
          )}
          <p className="text-xs text-[#444] mt-4">No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-10 max-w-6xl mx-auto border-t border-[#1A1A1A]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <OwlLogo size={24} />
            <span className="text-sm text-[#666]">ownspce</span>
          </div>
          <p className="text-xs text-[#444]">
            Private by design. Built with care.
          </p>
        </div>
      </footer>
    </div>
  );
}

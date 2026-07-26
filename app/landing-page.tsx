'use client';

import { useState } from 'react';
import Link from 'next/link';
import OwlLogo from './owl-logo';

type Lane = 'now' | 'next' | 'holding';

const WAITLIST_COUNT = 1840;

const BLOCKS = [
  {
    name: 'Priority Lane',
    desc: 'One thing on the runway, a short queue behind it, the rest held.',
    tile: 'bg-[rgba(176,116,90,0.14)]',
    dot: 'bg-lane',
  },
  {
    name: 'Impact Map',
    desc: 'Plot work by impact against time. Quick wins surface themselves.',
    tile: 'bg-[rgba(111,139,176,0.16)]',
    dot: 'bg-impact',
  },
  {
    name: 'Board',
    desc: 'To do, doing, complete — for work that moves in stages.',
    tile: 'bg-[rgba(139,161,126,0.18)]',
    dot: 'bg-board',
  },
  {
    name: 'Quick Note',
    desc: 'A titled callout for a decision you don’t want to lose.',
    tile: 'bg-[rgba(169,127,160,0.16)]',
    dot: 'bg-quicknote',
  },
  {
    name: 'Text',
    desc: 'Plain paragraphs. Where the thinking actually happens.',
    tile: 'bg-[rgba(154,143,125,0.16)]',
    dot: 'bg-plain',
  },
];

const SHOT_PAGES = [
  { title: 'Launch plan', dot: 'bg-lane', active: true },
  { title: 'Weekly notes', dot: 'bg-board', active: false },
  { title: 'Product ideas', dot: 'bg-plain', active: false },
];

const SHOT_CHIPS = [
  { label: 'Impact Map', className: 'text-impact bg-[rgba(111,139,176,0.16)]' },
  { label: 'Priority Lane', className: 'text-lane bg-[rgba(176,116,90,0.14)]' },
  { label: 'Board', className: 'text-board bg-[rgba(139,161,126,0.18)]' },
  { label: 'Quick Note', className: 'text-quicknote bg-[rgba(169,127,160,0.16)]' },
];

const PLATFORMS = [
  { name: 'iPhone', short: 'Capture, one column', status: 'Beta', live: true },
  { name: 'Desktop & web', short: 'Shape pages, keyboard-first', status: 'Beta', live: true },
  { name: 'iPad & Android', short: 'Same blocks, tuned for touch', status: 'Soon', live: false },
];

const SYNC_STEPS = [
  { n: '1', title: 'Locked here', body: 'Your device seals a page before it goes anywhere.' },
  { n: '2', title: 'Passed along', body: 'We move the sealed page between your devices.' },
  { n: '3', title: 'Opened there', body: 'Only your devices hold the key that opens it.' },
];

const SEALED_PILLARS = [
  { title: 'The key stays with you', body: 'It is made on your device and never uploaded.' },
  { title: 'Nothing to hand over', body: 'What we store is unreadable — titles included.' },
  { title: 'Yours to take out', body: 'Export every page as plain Markdown, any time.' },
];

const SIGN_IN_URL = 'https://app.ownspce.com';

const CTA_BASE =
  'inline-flex items-center justify-center font-semibold text-surface bg-accent hover:bg-accent-dark transition-colors duration-150 ease-out';

function CheckMark() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
      <path d="M1 4l2.6 2.6L9 1.2" stroke="#e2d8c6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Ownspce marketing landing page.
 * Renders the hero with a live Priority Lane demo, the block catalogue,
 * the zero-knowledge sync explainer, the founder essay and the waitlist form.
 * Handles: empty runway, empty task titles, invalid waitlist email.
 */
export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [shotTitle, setShotTitle] = useState('Launch plan');
  const [shotBody, setShotBody] = useState(
    'Where each bet sits, what’s cleared for the runway, and the sprint board — all on one page.'
  );
  const [tasks, setTasks] = useState<Record<Lane, string[]>>({
    now: ['Ship local-sync beta'],
    next: ['Onboarding empty states', 'Record demo walkthrough'],
    holding: ['Reply to waitlist', 'Weekly review'],
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSubmitted(true);
  }

  function editTask(lane: Lane, index: number, value: string) {
    setTasks(prev => ({ ...prev, [lane]: prev[lane].map((task, i) => (i === index ? value : task)) }));
  }

  function addTask(lane: Lane) {
    setTasks(prev => ({ ...prev, [lane]: [...prev[lane], ''] }));
  }

  function promoteTask(lane: 'next' | 'holding', index: number) {
    setTasks(prev => {
      const source = prev[lane].filter((_, i) => i !== index);
      const moved = prev[lane][index];
      if (lane === 'holding') return { ...prev, holding: source, next: [...prev.next, moved] };
      return { now: [moved], next: source, holding: prev.now.length ? [...prev.holding, ...prev.now] : prev.holding };
    });
  }

  function landTask() {
    setTasks(prev => {
      const landed = prev.now[0];
      const [promoted, ...rest] = prev.next;
      return {
        now: promoted !== undefined ? [promoted] : [],
        next: rest,
        holding: landed ? [...prev.holding, landed] : prev.holding,
      };
    });
  }

  return (
    <div className="min-h-screen bg-bg text-t1">
      {/* Navigation */}
      <header className="sticky top-0 z-20 bg-bg/[0.86] backdrop-blur-[14px] border-b border-[rgba(60,45,30,0.07)]">
        <div className="max-w-[1160px] mx-auto px-[20px] md:px-[40px] py-[14px] flex items-center gap-[14px]">
          <div className="flex items-center gap-[10px]">
            <OwlLogo size={28} />
            <span className="font-serif text-[19px] font-medium tracking-[-0.01em]">Ownspce</span>
          </div>
          <nav className="ml-[26px] hidden md:flex gap-[22px]">
            <a href="#blocks" className="text-[14px] font-medium text-t2 hover:text-t1 transition-colors duration-150">Blocks</a>
            <a href="#sealed" className="text-[14px] font-medium text-t2 hover:text-t1 transition-colors duration-150">Privacy</a>
            <a href="#essay" className="text-[14px] font-medium text-t2 hover:text-t1 transition-colors duration-150">Essay</a>
          </nav>
          <div className="ml-auto flex items-center gap-[12px]">
            <a
              href={SIGN_IN_URL}
              className="hidden sm:block text-[14px] font-semibold text-t2 hover:text-t1 transition-colors duration-150"
            >
              Sign in
            </a>
            <a
              href="#waitlist"
              className={`${CTA_BASE} text-[13.5px] px-[15px] py-[9px] rounded-[9px] shadow-[0_2px_8px_rgba(176,116,90,0.26)]`}
            >
              Get early access
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(110%_80%_at_50%_-10%,#efe8dc,#f4efe7_60%)]">
        <div className="max-w-[1160px] mx-auto px-[20px] md:px-[40px] pt-[56px] md:pt-[76px] text-center">
          <div className="inline-flex items-center gap-[8px] border border-border-mid bg-surface rounded-[22px] px-[13px] py-[6px] text-[12.5px] font-semibold text-t2">
            <span className="w-[7px] h-[7px] rounded-full bg-sage animate-pulse-soft" />
            Zero-knowledge cloud · your key never leaves your device
          </div>
          <h1 className="font-serif text-[44px] md:text-[74px] font-medium tracking-[-0.025em] leading-[1.03] mt-[22px] text-balance">
            A page that becomes
            <br />
            whatever you need.
          </h1>
          <p className="text-[17px] md:text-[19px] leading-[1.6] text-t2 max-w-[600px] mx-auto mt-[20px] text-pretty">
            Ownspce pages start blank. Stack the blocks that fit the thought — a priority lane, an impact map, a board,
            a note — and rearrange them whenever the work changes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-[10px] mt-[30px]">
            <a href="#waitlist" className={`${CTA_BASE} text-[15.5px] px-[24px] py-[14px] rounded-m shadow-[0_3px_14px_rgba(176,116,90,0.3)]`}>
              Get early access
            </a>
            <a
              href="#blocks"
              className="inline-flex items-center justify-center text-[15.5px] font-semibold px-[24px] py-[14px] rounded-m border border-border-mid bg-surface text-[#5f574c] hover:border-accent transition-colors duration-150 ease-out"
            >
              See the blocks
            </a>
          </div>
          <p className="text-[12.5px] text-t3 mt-[14px]">Free while in beta · no account required</p>
        </div>

        {/* Live product demo */}
        <div className="max-w-[1160px] mx-auto px-[20px] md:px-[40px] pt-[44px]">
          <div className="rounded-t-[20px] border border-b-0 border-border-mid bg-elev shadow-[0_-1px_60px_rgba(60,45,30,0.1)] overflow-hidden">
            <div className="flex items-center gap-[7px] px-[14px] py-[11px] border-b border-border-mid">
              <span className="w-[10px] h-[10px] rounded-full bg-[#d3c7b2]" />
              <span className="w-[10px] h-[10px] rounded-full bg-[#d3c7b2]" />
              <span className="w-[10px] h-[10px] rounded-full bg-[#d3c7b2]" />
              <span className="ml-[12px] text-[11.5px] text-t3">Launch plan — Ownspce</span>
            </div>
            <div className="flex min-h-[470px]">
              <div className="w-[210px] flex-none border-r border-border-mid px-[12px] py-[16px] hidden lg:flex flex-col gap-[4px]">
                <div className="text-[10px] tracking-[0.14em] uppercase text-t2 font-bold px-[8px] pb-[8px]">Your pages</div>
                {SHOT_PAGES.map(page => (
                  <div
                    key={page.title}
                    className={`flex items-center gap-[9px] px-[10px] py-[8px] rounded-[9px] border ${
                      page.active ? 'bg-bg border-border-mid' : 'bg-transparent border-transparent'
                    }`}
                  >
                    <span className={`w-[7px] h-[7px] rounded-full flex-none ${page.dot}`} />
                    <span className="text-[13px] font-semibold text-[#3d362d]">{page.title}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1 min-w-0 bg-bg px-[16px] md:px-[30px] py-[26px] overflow-hidden">
                <input
                  value={shotTitle}
                  onChange={e => setShotTitle(e.target.value)}
                  placeholder="Untitled page"
                  aria-label="Page title"
                  className="w-full bg-transparent border-none outline-none font-serif text-[26px] md:text-[30px] font-medium tracking-[-0.015em] text-t1 p-0 placeholder:text-t3"
                />
                <textarea
                  value={shotBody}
                  onChange={e => setShotBody(e.target.value)}
                  placeholder="Start writing…"
                  aria-label="Page body"
                  className="w-full max-w-[520px] h-[46px] bg-transparent border-none outline-none resize-none overflow-hidden text-[14px] leading-[1.6] text-[#6b6358] mt-[7px] p-0 placeholder:text-t3"
                />

                <div className="mt-[14px] rounded-l bg-surface border border-[#e7ddcd] overflow-hidden">
                  <div className="flex items-center flex-wrap gap-[9px] px-[14px] py-[10px] border-b border-[#efe6d6]">
                    <span className="w-[8px] h-[8px] rounded-full bg-lane" />
                    <span className="text-[10.5px] tracking-[0.13em] uppercase font-bold text-[#6b6358]">Priority Lane</span>
                    <span className="text-[11.5px] text-t3">Now · Next · Holding</span>
                    <span className="ml-auto text-[11px] text-t3">Try it — everything here is live</span>
                  </div>
                  <div className="p-[14px] grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-m items-start">
                    <div className="rounded-[13px] bg-white border border-[#f0e6d5] p-[13px]">
                      <div className="flex items-center gap-[7px] mb-[6px]">
                        <span className="w-[7px] h-[7px] rounded-full bg-danger shadow-[0_0_0_3.5px_rgba(194,90,63,0.16)] animate-pulse-soft" />
                        <span className="text-[9.5px] tracking-[0.14em] uppercase font-bold text-accent">On Now</span>
                      </div>
                      {tasks.now.length > 0 ? (
                        <div>
                          <input
                            value={tasks.now[0]}
                            onChange={e => editTask('now', 0, e.target.value)}
                            placeholder="What’s on the runway?"
                            aria-label="Task on now"
                            className="w-full min-w-0 bg-transparent border-none outline-none font-serif text-[18px] leading-[1.2] text-t1 py-[2px] placeholder:text-t3"
                          />
                          <button
                            type="button"
                            onClick={landTask}
                            className={`${CTA_BASE} mt-[10px] w-full text-[12.5px] font-semibold p-[8px] rounded-[10px]`}
                          >
                            Land ✓
                          </button>
                        </div>
                      ) : (
                        <p className="text-[13px] text-t3 pt-m pb-[6px]">Runway clear. Bring one up →</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-s">
                      <div className="text-[9.5px] tracking-[0.14em] uppercase font-bold text-[#6b6358]">Cleared Next</div>
                      {tasks.next.map((task, i) => (
                        <div key={i} className="rounded-[11px] bg-white border border-[#f0e6d5] px-[10px] py-[9px] flex items-center gap-[7px]">
                          <input
                            value={task}
                            onChange={e => editTask('next', i, e.target.value)}
                            placeholder="Add a task"
                            aria-label={`Next task ${i + 1}`}
                            className="flex-1 w-full min-w-0 bg-transparent border-none outline-none text-[12.5px] font-medium leading-[1.3] text-t1 p-0 placeholder:text-t3"
                          />
                          <button
                            type="button"
                            onClick={() => promoteTask('next', i)}
                            aria-label="Move to On Now"
                            className="w-[22px] h-[22px] flex-none rounded-[7px] border border-[#e4dbcc] bg-white text-t2 text-[11px] font-bold leading-none p-0 hover:text-accent hover:border-accent transition-colors duration-150"
                          >
                            ↑
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addTask('next')}
                        className="border border-dashed border-border-mid text-t3 text-[11.5px] font-semibold p-[6px] rounded-[9px] hover:text-accent hover:border-accent transition-colors duration-150"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="flex flex-col gap-s">
                      <div className="text-[9.5px] tracking-[0.14em] uppercase font-bold text-t2">Holding</div>
                      {tasks.holding.map((task, i) => (
                        <div key={i} className="rounded-[10px] bg-[#f3ecdf] border border-[#e9dfce] px-[10px] py-[8px] flex items-center gap-[7px]">
                          <input
                            value={task}
                            onChange={e => editTask('holding', i, e.target.value)}
                            placeholder="Someday"
                            aria-label={`Holding task ${i + 1}`}
                            className="flex-1 w-full min-w-0 bg-transparent border-none outline-none text-[12.5px] leading-[1.3] text-[#4b433a] p-0 placeholder:text-t3"
                          />
                          <button
                            type="button"
                            onClick={() => promoteTask('holding', i)}
                            aria-label="Move to Cleared Next"
                            className="w-[22px] h-[22px] flex-none rounded-[7px] border border-[#e4dbcc] bg-white text-t2 text-[11px] font-bold leading-none p-0 hover:text-accent hover:border-accent transition-colors duration-150"
                          >
                            ↑
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addTask('holding')}
                        className="border border-dashed border-border-mid text-t3 text-[11.5px] font-semibold p-[6px] rounded-[9px] hover:text-accent hover:border-accent transition-colors duration-150"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-m flex flex-wrap gap-s">
                  {SHOT_CHIPS.map(chip => (
                    <span key={chip.label} className={`text-[10.5px] font-semibold rounded-[6px] px-s py-[3px] ${chip.className}`}>
                      {chip.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blocks */}
      <section id="blocks" className="bg-elev border-t border-border scroll-mt-[72px]">
        <div className="max-w-[1160px] mx-auto px-[20px] md:px-[40px] py-[64px] md:py-[84px]">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-[40px] lg:gap-[56px] items-start">
            <div className="lg:sticky lg:top-[96px]">
              <div className="text-[11px] tracking-[0.16em] uppercase text-t2 font-bold">The blocks</div>
              <h2 className="font-serif text-[34px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.1] mt-m">
                Five ways to hold a thought.
              </h2>
              <p className="text-[16.5px] leading-[1.65] text-t2 mt-[14px]">
                No templates to choose up front. Add a block when you need it, drop it when you don’t — notes, tasks and
                boards in one page instead of three apps.
              </p>
              <div className="flex flex-col gap-[9px] mt-[26px] pt-[22px] border-t border-border">
                {PLATFORMS.map(platform => (
                  <div key={platform.name} className="flex items-center gap-[10px]">
                    <span className="text-[14.5px] font-semibold text-[#3d362d]">{platform.name}</span>
                    <span className="text-[13px] text-t3 flex-1 min-w-0">{platform.short}</span>
                    <span
                      className={`text-[10.5px] font-bold tracking-[0.08em] uppercase rounded-[20px] px-s py-[3px] ${
                        platform.live ? 'text-success bg-[rgba(139,161,126,0.2)]' : 'text-t2 bg-[rgba(154,143,125,0.16)]'
                      }`}
                    >
                      {platform.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-[10px]">
              {BLOCKS.map(block => (
                <div
                  key={block.name}
                  className="border border-border bg-surface rounded-l px-[20px] py-[18px] flex items-start gap-[15px] hover:border-border-mid transition-colors duration-150 ease-out"
                >
                  <span className={`w-[38px] h-[38px] flex-none rounded-[11px] flex items-center justify-center ${block.tile}`}>
                    <span className={`w-m h-m rounded-full ${block.dot}`} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[16.5px] font-semibold">{block.name}</h3>
                    <p className="text-[13.5px] leading-[1.55] text-t2 mt-[3px]">{block.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Zero-knowledge sync */}
      <section id="sealed" className="bg-ink text-ink-t1 scroll-mt-[72px]">
        <div className="max-w-[1160px] mx-auto px-[20px] md:px-[40px] py-[64px] md:py-[88px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[40px] lg:gap-[56px] items-start">
            <div>
              <div className="text-[11px] tracking-[0.16em] uppercase text-ink-t3 font-bold">Sealed by design</div>
              <h2 className="font-serif text-[34px] md:text-[44px] font-medium tracking-[-0.02em] leading-[1.08] mt-m">
                On every device. Readable on none of ours.
              </h2>
              <p className="text-[16.5px] leading-[1.7] text-ink-t2 mt-l max-w-[520px]">
                Your pages sync everywhere, but they leave your device already locked. We keep the sealed copy. The key
                that opens it stays with you.
              </p>
              <ul className="flex flex-col gap-[13px] mt-[26px]">
                {SEALED_PILLARS.map(pillar => (
                  <li key={pillar.title} className="flex items-start gap-[11px]">
                    <span className="w-[20px] h-[20px] flex-none mt-[3px] rounded-full bg-[rgba(244,239,231,0.1)] border border-[rgba(244,239,231,0.24)] flex items-center justify-center">
                      <CheckMark />
                    </span>
                    <span className="text-[15.5px] leading-[1.5]">
                      <span className="font-semibold text-ink-t1">{pillar.title}</span>
                      <span className="text-ink-t3"> — {pillar.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/privacy-policy"
                className="inline-flex items-center gap-[7px] mt-[26px] text-[14px] font-semibold text-ink-t1 border-b border-ink-line pb-[3px] hover:border-ink-t1 transition-colors duration-150"
              >
                Read how it works in full
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="border border-ink-line rounded-xl p-xl bg-ink-fill">
              <div className="text-[10.5px] tracking-[0.14em] uppercase text-ink-t3 font-bold mb-[18px]">
                One page, one trip
              </div>
              <div className="flex flex-col gap-[18px]">
                {SYNC_STEPS.map(step => (
                  <div key={step.n} className="flex items-start gap-[14px]">
                    <span className="w-[30px] h-[30px] flex-none rounded-full flex items-center justify-center text-[13px] font-bold text-ink bg-border">
                      {step.n}
                    </span>
                    <div className="flex-1">
                      <div className="text-[15px] font-semibold text-ink-t1">{step.title}</div>
                      <p className="text-[13.5px] leading-[1.55] text-ink-t3 mt-[2px]">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-[22px] pt-l border-t border-[rgba(244,239,231,0.14)] font-serif italic text-[14px] leading-[1.6] text-[#9c9382]">
                Sign in with Google or Apple. That gets you your data — not the key to it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Essay */}
      <section id="essay" className="bg-bg scroll-mt-[72px]">
        <div className="max-w-[680px] mx-auto px-[20px] md:px-[40px] py-[64px] md:py-[84px]">
          <div className="text-[11px] tracking-[0.16em] uppercase text-t2 font-bold">Personal · Essay</div>
          <h2 className="font-serif text-[32px] md:text-[42px] font-medium tracking-[-0.02em] leading-[1.1] mt-m text-balance">
            Why I’m building another notes app
          </h2>
          <div className="flex items-center gap-[11px] mt-l pb-[26px] mb-[26px] border-b border-border">
            <span className="w-[34px] h-[34px] rounded-full bg-border flex items-center justify-center font-serif text-[15px] text-[#5f574c]">
              R
            </span>
            <div>
              <div className="text-[13.5px] font-semibold">Rahul</div>
              <div className="text-[12.5px] text-t3">6 min read</div>
            </div>
          </div>
          <div className="flex flex-col gap-l">
            <p className="text-[17px] md:text-[18px] leading-[1.75] text-body text-pretty">
              I’ve used Notion since 2020. I’ve tried Obsidian, Logseq, Roam, Bear, Apple Notes, and at one point, a
              physical Moleskine. None of them felt right. Notion is powerful but cloud-locked — my product ideas sit on
              someone else’s AWS instances and I have no say in that.
            </p>
            <p className="text-[17px] md:text-[18px] leading-[1.75] text-body text-pretty">
              Obsidian is private and local, but the mobile app is an afterthought, and there’s no task management. You
              need plugins for everything.
            </p>
            <blockquote className="my-[2px] px-[22px] py-[18px] border-l-2 border-accent bg-surface rounded-r-[14px]">
              <p className="font-serif italic text-[20px] md:text-[22px] leading-[1.5] text-t1">
                The gap I kept hitting: a beautiful, mobile-first app where the data is mine, that also does tasks. That
                combination doesn’t exist.
              </p>
            </blockquote>
            <p className="text-[17px] md:text-[18px] leading-[1.75] text-body">So I’m building it.</p>
          </div>
        </div>
      </section>

      {/* Early access */}
      <section id="waitlist" className="bg-bg scroll-mt-[72px]">
        <div className="max-w-[680px] mx-auto px-[20px] md:px-[40px] pb-[64px] md:pb-[84px]">
          <div className="border border-border bg-elev rounded-xl px-[24px] py-[32px] md:px-[40px] md:py-[40px] text-center">
            <h3 className="font-serif text-[30px] md:text-[36px] font-medium tracking-[-0.02em] leading-[1.1]">
              Make the space yours.
            </h3>
            <p className="text-[15.5px] leading-[1.6] text-t2 mt-m mb-[22px] max-w-[420px] mx-auto">
              Early access ships in waves — no passwords, no Ownspce account to create. Sign in with Google or Apple and
              go.
            </p>
            {submitted ? (
              <p className="border border-[#cdd8c4] bg-[#f1f5ec] rounded-[14px] p-l text-[15px] text-success animate-rise max-w-[420px] mx-auto">
                You’re on the list. Watch for an invite from Ownspce.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-[9px] max-w-[420px] mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-label="Email address"
                  required
                  className="flex-1 w-full min-w-0 border border-border-mid bg-surface rounded-m px-[15px] py-[13px] text-[15px] text-t1 outline-none placeholder:text-t3 focus:border-accent transition-colors duration-150 ease-out"
                />
                <button
                  type="submit"
                  className={`${CTA_BASE} text-[15px] px-[20px] py-[13px] rounded-m whitespace-nowrap shadow-[0_3px_14px_rgba(176,116,90,0.28)]`}
                >
                  Get early access
                </button>
              </form>
            )}
            <p className="text-[12.5px] text-t3 mt-m">
              {WAITLIST_COUNT.toLocaleString()} people waiting · invites go out weekly
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg border-t border-border">
        <div className="max-w-[1160px] mx-auto px-[20px] md:px-[40px] py-[26px] flex items-center gap-l flex-wrap">
          <div className="flex items-center gap-[9px]">
            <OwlLogo size={22} />
            <span className="text-[13.5px] text-t2">Ownspce © 2026</span>
          </div>
          <div className="ml-auto flex gap-[20px]">
            <Link href="/privacy-policy" className="text-[13.5px] text-t2 hover:text-t1 transition-colors duration-150">
              Privacy Policy
            </Link>
            <a href="#blocks" className="text-[13.5px] text-t2 hover:text-t1 transition-colors duration-150">Blocks</a>
            <a href="#waitlist" className="text-[13.5px] text-t2 hover:text-t1 transition-colors duration-150">Early access</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

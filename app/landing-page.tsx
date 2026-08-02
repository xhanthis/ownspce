'use client';

import { useEffect, useState } from 'react';
import OwlLogo from './owl-logo';
import { DesktopMockup, PrivacyVisual, Tag, Check, CAT } from './mockups';

/* -------------------------------------------------------------------------- */
/*  Constants & shared bits                                                   */
/* -------------------------------------------------------------------------- */

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.ownspce.app';
const APP_URL = 'https://app.ownspce.com';
const JOIN_NOTE = 'Free on Android and the web · no account needed';

/**
 * Resolves where "Get started" sends the visitor:
 * - Android → Google Play
 * - iOS and desktop/web → the web app (iOS will point at the App Store later)
 * Defaults to the web app so the link is correct during SSR and without JS.
 */
function useGetStartedHref() {
  const [href, setHref] = useState(APP_URL);
  useEffect(() => {
    if (typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)) {
      setHref(PLAY_URL);
    }
  }, []);
  return href;
}

/** The single primary call to action, repeated in the nav, hero and final CTA. */
function GetStarted({ variant = 'primary', className = '' }: { variant?: 'primary' | 'nav'; className?: string }) {
  const href = useGetStartedHref();
  const sizing =
    variant === 'nav'
      ? 'rounded-[9px] px-[15px] py-[9px] text-[13.5px] shadow-[0_2px_8px_rgba(176,116,90,0.26)]'
      : 'rounded-[12px] px-[30px] py-[14px] text-[15.5px] shadow-[0_3px_16px_rgba(176,116,90,0.3)]';
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-[8px] bg-accent font-semibold text-surface transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${sizing} ${className}`}
    >
      Get started
    </a>
  );
}

const SERIF_H2 =
  'font-serif font-medium tracking-[-0.022em] leading-[1.05] text-[34px] md:text-[46px]';

/**
 * Notion-style rotating headline. The prefix stays put while the final word —
 * shown in a tinted pill with a leading emoji, like Notion's "● Jam" chip —
 * cycles through use cases, so a visitor grasps the product in a beat. The pill
 * sits on its own centred line so the layout never shifts as widths change, and
 * cycling pauses (holding the first entry) when the visitor prefers reduced motion.
 */
const HEAD_WORDS: { emoji: string; word: string; color: string }[] = [

  { emoji: '🧠', word: 'brain', color: CAT.plum },

  { emoji: '🗓️', word: 'meetings', color: CAT.blue },

  { emoji: '🛒', word: 'grocery list', color: CAT.sage },

  { emoji: '🎓', word: 'lecture', color: CAT.gold },

  { emoji: '📥', word: 'inbox', color: CAT.accent },

  { emoji: '🗣️', word: 'standup', color: CAT.stone },

  { emoji: '📚', word: 'reading list', color: CAT.blue },

  { emoji: '🖊️', word: 'whiteboard', color: CAT.plum },

  { emoji: '🗒️', word: 'sticky notes', color: CAT.accent },

  { emoji: '🗂️', word: '40 open tabs', color: CAT.stone },

  { emoji: '🌙', word: '2am thoughts', color: CAT.plum },

  { emoji: '🎧', word: 'podcast notes', color: CAT.sage },

  { emoji: '✈️', word: 'trip plan', color: CAT.blue },

  { emoji: '🎁', word: 'gift ideas', color: CAT.accent },

  { emoji: '🍳', word: 'cooking tv show', color: CAT.sage },

  { emoji: '🏋️', word: 'gym plan', color: CAT.stone },

  { emoji: '🚿', word: 'shower ideas', color: CAT.plum },

];

function RotatingHeadline() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % HEAD_WORDS.length), 2200);
    return () => clearInterval(id);
  }, []);

  const cur = HEAD_WORDS[idx];

  return (
    <span className="mt-[0.12em] flex justify-center">
      {/* keyed so each entry re-mounts and replays the enter animation */}
      <span
        key={idx}
        className="inline-flex animate-rise items-center gap-[0.28em] rounded-full px-[0.52em] py-[0.1em]"
        style={{ background: rgba(cur.color, 0.14) }}
      >
        <span className="text-[0.82em] leading-none" aria-hidden="true">
          {cur.emoji}
        </span>
        <span>{cur.word}</span>
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Use-cases interactive demo                                                */
/* -------------------------------------------------------------------------- */

type Task = { title: string; tag?: string; tagColor?: string; done?: boolean };

const TABS = [
  { id: 'lane', label: 'Planning the week', caption: 'Groceries, errands and work in one list you can reshuffle.', color: CAT.accent },
  { id: 'board', label: 'Planning a party', caption: 'A birthday or a big trip — see every stage at a glance.', color: CAT.sage },
  { id: 'note', label: 'Idea on the go', caption: "Two taps, it's saved. Sort it out later.", color: CAT.plum },
  { id: 'text', label: 'Notes after a class', caption: 'A blank page that keeps up. Type / for a table.', color: CAT.stone },
  { id: 'impact', label: "Deciding what's first", caption: 'Five things to do — see which one is actually worth it.', color: CAT.blue },
] as const;

const DEMO_LANES: { name: string; color: string; tasks: Task[]; bar?: boolean }[] = [
  { name: 'Right now', color: CAT.accent, tasks: [{ title: 'Buy milk & eggs', tag: 'Groceries', tagColor: CAT.sage }, { title: 'Call the plumber' }] },
  { name: 'Next up', color: CAT.gold, bar: true, tasks: [{ title: 'Reply to emails', tag: 'Work', tagColor: CAT.blue }, { title: 'Pay the rent', tag: 'Home', tagColor: CAT.plum }, { title: 'Book the dentist' }] },
  { name: 'Backlog', color: CAT.stone, tasks: [{ title: 'Plan the weekend trip' }, { title: 'Sort old photos', tag: 'Someday', tagColor: CAT.blue }, { title: 'Read a book', done: true }] },
];

const DEMO_BOARD: { name: string; color: string; cards: string[] }[] = [
  { name: 'To do', color: CAT.stone, cards: ['Send invites', 'Order the cake', 'Buy balloons'] },
  { name: 'Doing', color: CAT.gold, cards: ['Make a playlist', 'Plan the food'] },
  { name: 'Done', color: CAT.sage, cards: ['Book the venue', 'Pick a date', 'Invite the family'] },
];

const IMPACT_DOTS: [string, number, number, string][] = [
  ['Book dentist', 18, 20, CAT.accent],
  ['Reply to landlord', 34, 44, CAT.gold],
  ['Plan holiday', 58, 26, CAT.sage],
  ['Learn guitar', 66, 70, CAT.blue],
  ['Sort old photos', 82, 82, CAT.stone],
];

const DEMO_NOTES: [string, string, number][] = [
  ['Call Mom back', 'Just now', -2.2],
  ['Idea: surprise party for Sam', '2h ago', 1.4],
  ['Book a flu shot', 'Yesterday', -0.8],
];

const SLASH_ITEMS: [string, string, boolean][] = [
  ['H1', 'Heading', false],
  ['¶', 'Paragraph', false],
  ['☑', 'Checklist', false],
  ['▦', 'Table', true],
  ['◒', 'Priority Lane', false],
];

function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function DemoTaskRow({ task, color }: { task: Task; color: string }) {
  const done = !!task.done;
  return (
    <div
      className="flex items-start gap-[9px]"
      style={{
        borderRadius: 12,
        border: `1px solid ${done ? 'transparent' : '#f0e7d7'}`,
        background: done ? '#f4efe4' : '#fdfaf3',
        padding: '10px 11px',
        opacity: done ? 0.6 : 1,
      }}
    >
      <Check color={color} done={done} size={18} />
      <div className="flex min-w-0 flex-col gap-[5px]">
        <div
          className="overflow-hidden text-ellipsis whitespace-nowrap font-serif font-medium"
          style={{ fontSize: 15, color: done ? '#8b8173' : '#2b2620', textDecoration: done ? 'line-through' : 'none' }}
        >
          {task.title}
        </div>
        {task.tag && <Tag label={task.tag} color={task.tagColor || color} />}
      </div>
      <span className="ml-auto text-[12px] tracking-[1px] text-[#cfc3ae]">⠿</span>
    </div>
  );
}

function LanePane() {
  return (
    <div className="relative w-full">
      <div className="grid w-full grid-cols-1 items-start gap-[16px] px-[20px] sm:grid-cols-3 md:px-[30px]">
        {DEMO_LANES.map((lane) => (
          <div key={lane.name} className="flex flex-col gap-[9px] rounded-[16px] border border-[#eae0ce] bg-card p-[14px]">
            <div className="flex items-center gap-[7px]">
              <span className="h-[8px] w-[8px] flex-none rounded-full" style={{ background: lane.color }} />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#4b433a]">{lane.name}</span>
            </div>
            {lane.tasks.map((t, i) => (
              <DemoTaskRow key={i} task={t} color={lane.color} />
            ))}
            {lane.bar && <div className="h-[2px] animate-bar rounded-[2px]" style={{ background: lane.color }} />}
          </div>
        ))}
      </div>
      <div
        className="absolute left-[36px] top-[240px] hidden w-[250px] gap-[10px] rounded-[13px] border border-[#e0d3bd] bg-card p-[11px_12px] shadow-[0_18px_30px_-14px_rgba(60,44,28,0.4)] md:flex"
        style={{ animation: 'osdrag 5.2s ease-in-out infinite' }}
      >
        <span className="h-[19px] w-[19px] flex-none rounded-full border-[1.5px] border-[#d8ccb8]" />
        <div className="flex min-w-0 flex-col gap-[5px]">
          <div className="font-serif text-[15.5px]">Pick up dry cleaning</div>
          <Tag label="Errand" color={CAT.sage} />
        </div>
        <span className="ml-auto text-[12px] tracking-[1px] text-[#cfc3ae]">⠿</span>
      </div>
    </div>
  );
}

function BoardPane() {
  return (
    <div className="grid w-full grid-cols-1 items-start gap-[16px] px-[20px] sm:grid-cols-3 md:px-[30px]">
      {DEMO_BOARD.map((col) => (
        <div key={col.name} className="flex flex-col gap-[9px] rounded-[16px] border border-[#eae0ce] bg-card p-[14px]">
          <div className="flex items-center gap-[7px]">
            <span className="h-[8px] w-[8px] flex-none rounded-full" style={{ background: col.color }} />
            <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#4b433a]">{col.name}</span>
          </div>
          {col.cards.map((title) => (
            <div key={title} className="flex flex-col gap-[7px] rounded-[11px] border border-[#f0e7d7] bg-[#fdfaf3] p-[10px_11px]">
              <div className="text-[13.5px] font-medium text-body">{title}</div>
              <div className="h-[5px] w-[70%] rounded-[4px] bg-[#efe6d6]" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function TextPane() {
  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-col gap-[10px] px-[20px] md:px-[30px]">
      <div className="font-serif text-[32px] tracking-[-0.016em]">Weekend plans</div>
      <div className="flex flex-col gap-[7px]">
        {['96%', '88%', '62%'].map((w) => (
          <div key={w} className="h-[7px] rounded-[4px] bg-[#e9dfcd]" style={{ width: w }} />
        ))}
      </div>
      <div className="flex items-center gap-[2px] text-[16.5px] text-body">
        /<span className="inline-block h-[19px] w-[1.5px] animate-caret bg-accent" />
      </div>
      <div className="flex w-[330px] max-w-full flex-col gap-[2px] rounded-[14px] border border-[#e7ddcd] bg-card p-[9px] shadow-[0_20px_40px_-22px_rgba(60,44,28,0.45)]">
        <div className="px-[8px] py-[5px] text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Basic</div>
        {SLASH_ITEMS.map(([glyph, name, hot]) => (
          <div
            key={name}
            className="flex items-center gap-[10px] rounded-[9px] px-[8px] py-[7px]"
            style={{ background: hot ? rgba(CAT.accent, 0.1) : 'transparent' }}
          >
            <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-[8px] border border-line bg-sand text-[10.5px] font-bold text-muted">
              {glyph}
            </span>
            <span className="text-[13.5px] font-medium">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImpactPane() {
  return (
    <div className="flex w-full justify-center px-[20px] md:px-[30px]">
      <div className="relative aspect-[600/292] w-full max-w-[600px] rounded-[18px] border border-[#eae0ce] bg-card">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-[#f0e6d5]" />
        <div className="absolute bottom-0 top-0 left-1/2 w-px bg-[#f0e6d5]" />
        <div className="absolute left-[18px] top-[14px] text-[10.5px] font-bold uppercase tracking-[0.12em] text-faint">High impact</div>
        <div className="absolute bottom-[14px] right-[18px] text-[10.5px] font-bold uppercase tracking-[0.12em] text-faint">Slow</div>
        {IMPACT_DOTS.map(([label, x, y, color]) => (
          <div key={label} className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-[8px]" style={{ left: `${x}%`, top: `${y}%` }}>
            <span className="h-[13px] w-[13px] rounded-full" style={{ background: color, boxShadow: `0 0 0 5px ${rgba(color, 0.15)}` }} />
            <span className="whitespace-nowrap text-[12px] font-semibold text-[#4b433a]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotePane() {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-[18px] px-[20px] md:px-[30px]">
      {DEMO_NOTES.map(([title, time, rot]) => (
        <div
          key={title}
          className="flex h-[214px] w-[220px] flex-col gap-[9px] rounded-[18px] border border-[#eae0ce] bg-card p-[18px] shadow-[0_18px_34px_-22px_rgba(60,44,28,0.35)]"
          style={{ transform: `rotate(${rot}deg)` }}
        >
          <div className="font-serif text-[17px] tracking-[-0.008em]">{title}</div>
          <div className="h-[6px] w-[92%] rounded-[4px] bg-[#efe6d6]" />
          <div className="h-[6px] w-[70%] rounded-[4px] bg-[#efe6d6]" />
          <div className="mt-auto text-[11px] font-semibold text-faint">{time}</div>
        </div>
      ))}
    </div>
  );
}

function UseCasesDemo() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('lane');
  const active = TABS.find((t) => t.id === tab) || TABS[0];

  return (
    <div className="flex flex-col gap-[28px]">
      <div className="flex flex-wrap items-end justify-between gap-[24px]">
        <h2 className={`${SERIF_H2} max-w-[560px] text-balance`}>One space for every part of your week.</h2>
        <div className="flex flex-wrap gap-[8px]" role="tablist" aria-label="Use cases">
          {TABS.map((t) => {
            const on = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.id)}
                className="rounded-full px-[15px] py-[9px] text-[13.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
                style={{
                  border: `1px solid ${on ? t.color : '#e2d8c6'}`,
                  background: on ? rgba(t.color, 0.12) : '#fdfbf6',
                  color: on ? t.color : '#7a7062',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-border bg-surface shadow-[0_26px_60px_-40px_rgba(60,44,28,0.4)]">
        <div className="flex min-h-[400px] items-center justify-center overflow-hidden bg-[#f7f3ea] py-[28px]">
          <div key={tab} className="w-full animate-rise">
            {tab === 'lane' && <LanePane />}
            {tab === 'board' && <BoardPane />}
            {tab === 'text' && <TextPane />}
            {tab === 'impact' && <ImpactPane />}
            {tab === 'note' && <NotePane />}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-[11px] border-t border-line bg-surface px-[20px] py-[15px]">
          <span className="h-[9px] w-[9px] flex-none rounded-full" style={{ background: active.color }} />
          <span className="text-[15px] font-semibold">{active.label}</span>
          <span className="text-[15px] text-[#8b8173]">{active.caption}</span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Features                                                                  */
/* -------------------------------------------------------------------------- */

const TAG_LIST: [string, string][] = [
  ['Work', CAT.blue],
  ['Errand', CAT.gold],
  ['Personal', CAT.sage],
  ['Home', CAT.plum],
  ['Health', CAT.accent],
];

function SlashFeature() {
  const rows: [string, string, boolean][] = [
    ['H1', 'Heading 1', false],
    ['▦', 'Table', true],
    ['◒', 'Priority Lane', false],
  ];
  return (
    <div className="flex w-full flex-col gap-[2px] rounded-[13px] border border-[#eae0ce] bg-card p-[8px]">
      {rows.map(([glyph, name, hot]) => (
        <div
          key={name}
          className="flex items-center gap-[9px] rounded-[9px] px-[7px] py-[6px]"
          style={{ background: hot ? rgba(CAT.accent, 0.1) : 'transparent' }}
        >
          <span className="flex h-[24px] w-[24px] flex-none items-center justify-center rounded-[7px] border border-line bg-sand text-[10px] font-bold text-muted">
            {glyph}
          </span>
          <span className="text-[12.5px] font-medium text-body">{name}</span>
        </div>
      ))}
    </div>
  );
}

function DragFeature() {
  const cards = ['84%', '62%', '74%'];
  return (
    <div className="flex w-full flex-col gap-[7px]">
      {cards.map((w, i) => (
        <div
          key={w}
          className="flex items-center gap-[9px] rounded-[11px] bg-card p-[10px_11px]"
          style={{
            border: `1px solid ${i === 1 ? rgba(CAT.accent, 0.4) : '#eae0ce'}`,
            transform: i === 1 ? 'translateX(16px) rotate(-1.4deg)' : 'none',
            boxShadow: i === 1 ? '0 12px 22px -14px rgba(60,44,28,0.4)' : 'none',
          }}
        >
          <span className="h-[15px] w-[15px] flex-none rounded-full border-[1.5px] border-[#d8ccb8]" />
          <span className="h-[6px] rounded-[4px] bg-[#efe6d6]" style={{ width: w }} />
          <span className="ml-auto text-[12px] tracking-[1px] text-[#cfc3ae]">⠿</span>
        </div>
      ))}
    </div>
  );
}

function TagsFeature() {
  return (
    <div className="flex max-w-[230px] flex-wrap justify-center gap-[7px]">
      {TAG_LIST.map(([label, color]) => (
        <span
          key={label}
          className="rounded-full font-semibold"
          style={{ border: `1px solid ${rgba(color, 0.45)}`, background: rgba(color, 0.12), color, fontSize: 12, padding: '4px 11px' }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

const FEATURES = [
  { title: 'Slash anything in', desc: 'One key brings headings, tables, lanes and boards.', Visual: SlashFeature },
  { title: "Drag, don't re-type", desc: 'Move a task across lanes or reorder it in place.', Visual: DragFeature },
  { title: 'Tag it your way', desc: 'Your own labels — no fixed folders to fight.', Visual: TagsFeature },
];

const AVATARS: [string, string][] = [
  ['R', CAT.accent],
  ['M', CAT.sage],
  ['A', CAT.blue],
  ['K', CAT.gold],
];

function ShareMini() {
  return (
    <div className="flex w-full flex-col gap-[14px]">
      <div className="flex justify-center">
        {AVATARS.map(([initial, color], i) => (
          <span
            key={initial}
            className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full text-[15px] font-semibold text-surface"
            style={{ background: color, marginLeft: i ? -10 : 0, boxShadow: '0 0 0 3px #f4efe7' }}
          >
            {initial}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-[7px] rounded-[14px] border border-[#eae0ce] bg-card p-[12px]">
        <div className="text-[12.5px] font-semibold text-[#4b433a]">Weekend trip</div>
        <div className="h-[6px] w-[86%] rounded-[4px] bg-[#efe6d6]" />
        <div className="h-[6px] w-[58%] rounded-[4px] bg-[#efe6d6]" />
      </div>
    </div>
  );
}

function PublishMini() {
  return (
    <div className="w-full overflow-hidden rounded-[14px] border border-[#eae0ce] bg-card">
      <div className="flex items-center gap-[7px] border-b border-[#f3ebdc] px-[11px] py-[9px]">
        <span className="h-[7px] w-[7px] rounded-full bg-[#e0cfc0]" />
        <span className="flex h-[16px] flex-1 items-center rounded-full bg-sand px-[9px] text-[9.5px] font-semibold text-faint">
          ownspce.app/recipes
        </span>
      </div>
      <div className="flex flex-col gap-[7px] p-[12px]">
        <div className="font-serif text-[15px]">Mum&rsquo;s recipes</div>
        {['92%', '74%', '82%'].map((w) => (
          <div key={w} className="h-[6px] rounded-[4px] bg-[#efe6d6]" style={{ width: w }} />
        ))}
      </div>
    </div>
  );
}

function OfflineMini() {
  return (
    <div className="flex flex-col items-center gap-[14px]">
      <div className="relative h-[66px] w-[86px]">
        <span className="absolute bottom-[8px] left-0 h-[26px] w-[86px] rounded-[16px] bg-line" />
        <span className="absolute bottom-[20px] left-[14px] h-[34px] w-[34px] rounded-full bg-line" />
        <span className="absolute bottom-[22px] left-[40px] h-[26px] w-[26px] rounded-full bg-line" />
        <span className="absolute left-1/2 top-1/2 h-[8px] w-[104px] -translate-x-1/2 -translate-y-1/2 rotate-[-32deg] rounded-[5px] bg-sand" />
        <span className="absolute left-1/2 top-1/2 h-[3px] w-[96px] -translate-x-1/2 -translate-y-1/2 rotate-[-32deg] rounded-[2px] bg-accent" />
      </div>
      <div className="rounded-[12px] border border-[#eae0ce] bg-card px-[13px] py-[9px] text-[12px] font-semibold text-[#4b433a]">
        Saved on device
      </div>
    </div>
  );
}

const MINI = [
  { label: 'Shared spaces', Visual: ShareMini },
  { label: 'Publish a page', Visual: PublishMini },
  { label: 'Works offline', Visual: OfflineMini },
];

/* -------------------------------------------------------------------------- */
/*  Privacy facts                                                             */
/* -------------------------------------------------------------------------- */

const FACTS: [string, string][] = [
  ['⌘', 'No account needed to start.'],
  ['⊘', "Even we can't read your pages."],
  ['⇄', 'Stays locked while it syncs.'],
];

/* -------------------------------------------------------------------------- */
/*  Pricing                                                                   */
/* -------------------------------------------------------------------------- */

const PLANS = [
  {
    tier: 'Personal',
    usd: 'Free',
    inr: 'Free',
    per: 'forever',
    note: 'Everything private and local, across 2 devices.',
    features: ['Unlimited pages', 'Private and local'],
  },
  {
    tier: 'Pro',
    usd: '$3.99',
    inr: '₹299',
    per: '/mo',
    note: 'Every device in step, and pages you can open up to other people.',
    features: ['Unlimited pages', 'Sync across devices', 'Collaborate on pages'],
  },
];

function UsFlag() {
  return (
    <span className="relative flex h-[13px] w-[19px] flex-none flex-col overflow-hidden rounded-[3px] border border-border">
      {['#b22234', '#fdfbf6', '#b22234', '#fdfbf6', '#b22234', '#fdfbf6', '#b22234'].map((c, i) => (
        <span key={i} className="flex-1" style={{ background: c }} />
      ))}
      <span className="absolute left-0 top-0 h-[54%] w-[42%] bg-[#3c3b6e]" />
    </span>
  );
}

function InFlag() {
  return (
    <span className="flex h-[13px] w-[19px] flex-none flex-col overflow-hidden rounded-[3px] border border-border">
      {['#ff9933', '#fdfbf6', '#138808'].map((c, i) => (
        <span key={i} className="flex-1" style={{ background: c }} />
      ))}
    </span>
  );
}

function Pricing() {
  const [cur, setCur] = useState<'usd' | 'inr'>('usd');
  const inr = cur === 'inr';
  const currencies = [
    { id: 'usd' as const, label: 'USD', Flag: UsFlag },
    { id: 'inr' as const, label: 'India', Flag: InFlag },
  ];

  return (
    <div className="flex flex-col items-center gap-[24px] text-center">
      <h2 className={SERIF_H2}>Private on every tier.</h2>

      <div className="flex gap-[6px] rounded-full border border-border-2 bg-sand p-[4px]">
        {currencies.map(({ id, label, Flag }) => {
          const on = cur === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setCur(id)}
              className="inline-flex items-center gap-[9px] rounded-full px-[16px] py-[8px] text-[13.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                background: on ? '#fdfbf6' : 'transparent',
                color: on ? '#2b2620' : '#8b8173',
                boxShadow: on ? '0 2px 8px -4px rgba(60,44,28,0.35)' : 'none',
              }}
            >
              <span style={{ opacity: on ? 1 : 0.55 }}>
                <Flag />
              </span>
              {label}
            </button>
          );
        })}
      </div>

      <div className="mx-auto grid w-full max-w-[660px] grid-cols-1 gap-[18px] sm:grid-cols-2">
        {PLANS.map((p) => (
          <div
            key={p.tier}
            className="flex flex-col gap-[8px] rounded-[20px] border border-border-2 bg-sand p-[26px_24px] text-left"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-faint">{p.tier}</span>
            <div className="flex items-baseline gap-[7px]">
              <span className="font-serif text-[38px] font-medium tracking-[-0.02em]">{inr ? p.inr : p.usd}</span>
              <span className="text-[13px] font-semibold text-faint">{p.per}</span>
            </div>
            <p className="text-[14.5px] leading-[1.5] text-[#8b8173]">{p.note}</p>
            <ul className="mt-[6px] flex flex-col gap-[9px]">
              {p.features.map((feature) => (
                <li key={feature} className="flex items-center gap-[10px] text-[14px] text-ink">
                  <Check color={CAT.accent} done size={16} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-[12.5px] text-faint">
        {inr ? 'Annual billing saves ~25% · billed in ₹ by Razorpay' : 'Annual billing saves ~25% · billed in USD'}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  FAQ                                                                       */
/* -------------------------------------------------------------------------- */

const FAQS: [string, string, string][] = [
  ['private', 'Is it really private?', "Yes. Everything is scrambled on your device with a key only you hold. We can't read it, and neither can anyone who breaks into us."],
  ['offline', 'Does it work offline?', "Fully. Your pages live on your device first and sync the moment you're back online."],
  ['lost', 'What if I lose my phone?', "A recovery phrase — or any other device you're signed in on — brings everything back. Only you hold it, so keep it somewhere safe."],
  ['team', 'Can my team use it?', 'Yes. Shared encrypted spaces with real-time editing, roles and a company knowledge base.'],
  ['cost', 'What does it cost?', 'Free forever for unlimited pages on 2 devices. Pro is $3.99 a month (₹299) for sync and collaboration, and annual billing saves about 25%.'],
  ['devices', 'Which devices?', 'Android and the web today. iPhone, iPad and Mac are next.'],
];

function Faq() {
  const [open, setOpen] = useState<string | null>('private');
  return (
    <div className="flex flex-col gap-[22px]">
      <h2 className={SERIF_H2}>Questions people ask.</h2>
      <div className="flex flex-col gap-[9px]">
        {FAQS.map(([id, q, a]) => {
          const isOpen = open === id;
          return (
            <div
              key={id}
              className="overflow-hidden rounded-[16px]"
              style={{ border: `1px solid ${isOpen ? '#ded3c0' : '#e6dcca'}`, background: isOpen ? '#fdfbf6' : 'transparent' }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-[16px] px-[20px] py-[18px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
              >
                <span className="text-[16.5px] font-semibold text-ink">{q}</span>
                <span className="ml-auto flex h-[26px] w-[26px] flex-none items-center justify-center rounded-[9px] border border-border-2 bg-sand text-[15px] font-semibold leading-none text-muted">
                  {isOpen ? '–' : '+'}
                </span>
              </button>
              {isOpen && (
                <p className="max-w-[660px] px-[20px] pb-[18px] text-[15.5px] leading-[1.65] text-soft text-pretty">{a}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function LandingPage() {
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
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[12px] focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-line bg-bg/[0.86] backdrop-blur-md">
        <div className="mx-auto flex max-w-shell items-center gap-[26px] px-[20px] py-[13px] md:px-[40px]">
          <a href="#top" className="flex items-center gap-[10px]" aria-label="Ownspce home">
            <OwlLogo size={28} />
            <span className="font-serif text-[19px] font-medium tracking-[-0.01em]">Ownspce</span>
          </a>
          <nav className="ml-[6px] hidden gap-[20px] md:flex" aria-label="Primary">
            <a href="#usecases" className="text-[14px] font-semibold text-muted hover:text-ink">Use cases</a>
            <a href="#features" className="text-[14px] font-semibold text-muted hover:text-ink">Features</a>
            <a href="#pricing" className="text-[14px] font-semibold text-muted hover:text-ink">Pricing</a>
          </nav>
          <div className="ml-auto flex items-center gap-[12px]">
            <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="hidden text-[14px] font-semibold text-muted hover:text-ink sm:block">
              Sign in
            </a>
            <GetStarted variant="nav" />
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#faf6ed_0%,#f4efe7_100%)]">
          <div className="pointer-events-none absolute -top-[170px] left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-[rgba(176,116,90,0.13)] blur-[90px]" />
          <div className="relative mx-auto flex max-w-shell flex-col items-center gap-[24px] px-[20px] pt-[64px] md:px-[40px] md:pt-[74px]">
            <h1 className="reveal m-0 max-w-[940px] text-center font-serif text-[46px] font-medium leading-[1.02] tracking-[-0.028em] md:text-[80px]">
              <span className="block">Get everything out of your</span>
              <RotatingHeadline />
            </h1>
            <p className="reveal max-w-[520px] text-center text-[18px] leading-[1.5] text-soft text-pretty md:text-[19px]">
              Notes, tasks and half-thoughts — encrypted, only yours.
            </p>
            <GetStarted className="reveal" />
            <div className="reveal text-[12.5px] text-faint">{JOIN_NOTE}</div>

            <div className="reveal mt-[12px] w-full">
              <DesktopMockup />
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section id="usecases" className="scroll-mt-[72px] border-t border-border-2 bg-sand">
          <div className="reveal mx-auto max-w-shell px-[20px] py-[78px] md:px-[40px] md:py-[84px]">
            <UseCasesDemo />
          </div>
        </section>

        {/* Privacy */}
        <section id="privacy" className="scroll-mt-[72px] bg-dark text-bg">
          <div className="mx-auto grid max-w-shell grid-cols-1 items-center gap-[44px] px-[20px] py-[72px] md:px-[40px] md:py-[82px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-[52px]">
            <div className="reveal flex flex-col gap-[24px]">
              <h2 className="m-0 font-serif text-[38px] font-medium leading-[1.04] tracking-[-0.022em] md:text-[48px]">
                Locked so only you can open it.
              </h2>
              <p className="max-w-[430px] text-[17px] leading-[1.6] text-[#c8bfae] text-pretty">
                Most apps lock your notes but keep a spare key. Ownspce doesn&rsquo;t. Everything is scrambled on your
                phone before it&rsquo;s saved, so we store it without ever being able to read it.
              </p>
              <div>
                {FACTS.map(([glyph, text]) => (
                  <div key={text} className="flex items-center gap-[14px] border-t border-white/10 py-[15px]">
                    <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[11px] border border-white/15 bg-white/5 text-[15px] text-[#d8cfbe]">
                      {glyph}
                    </span>
                    <span className="text-[17px] font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal">
              <PrivacyVisual />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-[72px] bg-bg">
          <div className="mx-auto flex max-w-shell flex-col gap-[26px] px-[20px] py-[80px] md:px-[40px]">
            <h2 className={`reveal text-center ${SERIF_H2}`}>The parts you&rsquo;ll use daily.</h2>

            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-3">
              {FEATURES.map(({ title, desc, Visual }) => (
                <div key={title} className="reveal flex flex-col gap-[16px] rounded-[20px] border border-border-2 bg-sand p-[22px]">
                  <div className="flex h-[120px] items-center justify-center" aria-hidden="true">
                    <Visual />
                  </div>
                  <div className="flex flex-col gap-[5px]">
                    <div className="text-[16px] font-semibold">{title}</div>
                    <div className="text-[14px] leading-[1.5] text-[#8b8173]">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-3">
              {MINI.map(({ label, Visual }) => (
                <div key={label} className="reveal flex flex-col gap-[12px]">
                  <div className="flex h-[250px] items-center justify-center rounded-[20px] border border-border-2 bg-sand p-[26px]" aria-hidden="true">
                    <Visual />
                  </div>
                  <div className="text-[14.5px] font-semibold">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why */}
        <section id="why" className="border-t border-border-2 bg-sand">
          <div className="reveal mx-auto grid max-w-shell grid-cols-1 items-center gap-[40px] px-[20px] py-[80px] md:px-[40px] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-[52px]">
            <h2 className="m-0 max-w-[520px] text-balance font-serif text-[36px] font-medium leading-[1.06] tracking-[-0.022em] md:text-[44px]">
              Why I&rsquo;m building another notes app.
            </h2>
            <div className="flex max-w-[560px] flex-col gap-[16px] text-[17.5px] leading-[1.65] text-body text-pretty">
              <p>
                I kept my life in four apps: one for tasks, one for notes, one for the things I couldn&rsquo;t file, and
                my head for the rest. Nothing talked to each other, and everything I wrote sat on someone else&rsquo;s
                server.
              </p>
              <p>
                Ownspce is one page that holds all of it, encrypted with a key that never leaves your device. I built it
                for me. It&rsquo;s free while it&rsquo;s small.
              </p>
              <p className="font-serif text-[17px] italic text-[#8b8173]">— Rahul, building in the open</p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-[72px] border-t border-border-2 bg-bg">
          <div className="reveal mx-auto max-w-shell px-[20px] py-[70px] md:px-[40px]">
            <Pricing />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-[72px] border-t border-border-2 bg-sand">
          <div className="reveal mx-auto max-w-[840px] px-[20px] py-[74px] md:px-[40px]">
            <Faq />
          </div>
        </section>

        {/* Get */}
        <section id="get" className="scroll-mt-[72px] border-t border-border-2 bg-bg">
          <div className="reveal mx-auto flex max-w-shell flex-col items-center gap-[22px] px-[20px] py-[84px] text-center md:px-[40px]">
            <h2 className="m-0 text-balance font-serif text-[44px] font-medium leading-[1.02] tracking-[-0.024em] md:text-[56px]">
              Make the space yours.
            </h2>
            <GetStarted />
            <div className="text-[12.5px] text-faint">{JOIN_NOTE}</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-2 bg-bg">
        <div className="mx-auto flex max-w-shell flex-wrap items-center gap-[18px] px-[20px] py-[24px] md:px-[40px]">
          <div className="flex items-center gap-[9px]">
            <OwlLogo size={22} />
            <span className="text-[13px] text-faint">© 2026 Ownspce</span>
          </div>
          <nav className="ml-auto flex flex-wrap gap-[20px]" aria-label="Footer">
            <a href="/privacy-policy" className="text-[13px] text-muted hover:text-ink">Privacy</a>
            <a href="/terms" className="text-[13px] text-muted hover:text-ink">Terms</a>
            <a href="#usecases" className="text-[13px] text-muted hover:text-ink">Use cases</a>
            <a href="#pricing" className="text-[13px] text-muted hover:text-ink">Pricing</a>
            <a href="#faq" className="text-[13px] text-muted hover:text-ink">FAQ</a>
            <a href="#get" className="text-[13px] text-muted hover:text-ink">Get started</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

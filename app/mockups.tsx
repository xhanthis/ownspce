/**
 * Brand-style "app window" mockups for the Ownspce v2 landing page.
 *
 * The product visuals are clean CSS mockups drawn in the design system — warm
 * surfaces, 1px borders, Newsreader titles, terracotta accent used sparingly.
 * They're decorative, so they're hidden from assistive tech (aria-hidden) and
 * the surrounding copy carries the meaning.
 */

const ACCENT = '#b0745a';

/** Category accent colours used across the product mockups. */
export const CAT = {
  accent: '#b0745a',
  gold: '#c39a4e',
  sage: '#8ba17e',
  blue: '#6f8bb0',
  plum: '#a97fa0',
  stone: '#8a8070',
} as const;

function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/** Small category tag pill. */
export function Tag({ label, color, size = 10.5 }: { label: string; color: string; size?: number }) {
  return (
    <span
      className="inline-flex self-start whitespace-nowrap rounded-full font-semibold"
      style={{
        border: `1px solid ${rgba(color, 0.45)}`,
        background: rgba(color, 0.12),
        color,
        fontSize: size,
        padding: '1.5px 7px',
      }}
    >
      {label}
    </span>
  );
}

/** Round checkbox — filled + ticked when done. */
export function Check({ color, done, size = 15 }: { color: string; done?: boolean; size?: number }) {
  return (
    <span
      className="flex flex-none items-center justify-center rounded-full font-bold text-white"
      style={{
        width: size,
        height: size,
        border: `1.5px solid ${done ? color : '#d8ccb8'}`,
        background: done ? color : 'transparent',
        fontSize: size * 0.5,
      }}
    >
      {done ? '✓' : ''}
    </span>
  );
}

type Task = { title: string; tag?: string; tagColor?: string; done?: boolean };

function TaskRow({
  task,
  color,
  pad,
  radius,
  titleSize,
  checkSize,
}: {
  task: Task;
  color: string;
  pad: string;
  radius: number;
  titleSize: number;
  checkSize: number;
}) {
  const done = !!task.done;
  return (
    <div
      className="flex items-start gap-[9px]"
      style={{
        borderRadius: radius,
        border: `1px solid ${done ? 'transparent' : '#f0e7d7'}`,
        background: done ? '#f4efe4' : '#fdfaf3',
        padding: pad,
        opacity: done ? 0.6 : 1,
      }}
    >
      <Check color={color} done={done} size={checkSize} />
      <div className="flex min-w-0 flex-col gap-[4px]">
        <div
          className="overflow-hidden text-ellipsis whitespace-nowrap font-serif font-medium"
          style={{
            fontSize: titleSize,
            letterSpacing: '-0.005em',
            color: done ? '#8b8173' : '#2b2620',
            textDecoration: done ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </div>
        {task.tag && <Tag label={task.tag} color={task.tagColor || color} size={titleSize * 0.7} />}
      </div>
    </div>
  );
}

function Dot({ color, size = 7 }: { color: string; size?: number }) {
  return <span className="flex-none rounded-full" style={{ width: size, height: size, background: color }} />;
}

/* -------------------------------------------------------------------------- */
/*  Hero — desktop window + floating phone                                    */
/* -------------------------------------------------------------------------- */

const NAV_ROWS: [string, string, boolean][] = [
  ['Today', CAT.accent, true],
  ['This week', CAT.gold, false],
  ['Groceries', CAT.sage, false],
  ['Trip to Goa', CAT.blue, false],
  ['Home', CAT.plum, false],
  ['Reading list', CAT.stone, false],
];

const HERO_LANES: { name: string; color: string; tasks: Task[] }[] = [
  { name: 'Right now', color: CAT.accent, tasks: [{ title: 'Buy groceries', tag: 'Errand', tagColor: CAT.sage }, { title: 'Call plumber' }] },
  { name: 'Next up', color: CAT.gold, tasks: [{ title: 'Reply to emails', tag: 'Work', tagColor: CAT.blue }, { title: 'Pay rent' }] },
  { name: 'Backlog', color: CAT.stone, tasks: [{ title: 'Plan the trip' }, { title: 'Water plants', done: true }] },
];

const PHONE_CHIPS: [string, boolean][] = [['All', true], ['Now', false], ['Next', false]];
const PHONE_TASKS: Task[] = [
  { title: 'Buy milk & eggs', tag: 'Errand', tagColor: CAT.sage },
  { title: 'Call the plumber' },
  { title: 'Reply to emails', tag: 'Work', tagColor: CAT.blue },
  { title: 'Water the plants', done: true },
];

/** The floating Android phone — the actual product surface. */
export function PhoneMockup({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-[34px] border border-border bg-surface p-[8px] shadow-[0_34px_70px_-34px_rgba(60,44,28,0.5)] ${className}`}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[27px] bg-[#f7f3ea]">
        <div className="flex justify-between px-[15px] pt-[13px] text-[10px] font-semibold text-soft">
          <span>9:41</span>
          <span>▮▮▮</span>
        </div>
        <div className="flex flex-col gap-[8px] border-b border-line px-[15px] pb-[10px] pt-[9px]">
          <div className="font-serif text-[19px]">Right Now</div>
          <div className="flex gap-[5px]">
            {PHONE_CHIPS.map(([label, active]) => (
              <span
                key={label}
                className="rounded-full font-semibold"
                style={{
                  border: `1px solid ${active ? '#d3c4ae' : '#e7ddcd'}`,
                  background: active ? '#f2ebdd' : '#fffdf8',
                  color: active ? '#4b433a' : '#8b8173',
                  fontSize: 10.5,
                  padding: '4px 10px',
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-[7px] px-[12px] py-[10px]">
          {PHONE_TASKS.map((t, i) => (
            <TaskRow key={i} task={t} color={CAT.accent} pad="10px 11px" radius={13} titleSize={14.5} checkSize={19} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Hero visual: a single clean phone on mobile; the full app window on larger screens. */
export function DesktopMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[1060px]" aria-hidden="true">
      {/* Mobile — one simple phone screen so the product reads at a glance. */}
      <div className="flex justify-center pb-[8px] md:hidden">
        <PhoneMockup className="w-[268px] max-w-full" />
      </div>

      {/* Tablet & desktop — the full app window. */}
      <div className="hidden overflow-hidden rounded-t-[22px] border border-b-0 border-border bg-surface shadow-[0_-20px_70px_-40px_rgba(60,44,28,0.5)] md:block">
        {/* chrome */}
        <div className="flex items-center gap-[7px] border-b border-line px-[15px] py-[11px]">
          <span className="h-[9px] w-[9px] rounded-full bg-[#e0cfc0]" />
          <span className="h-[9px] w-[9px] rounded-full bg-[#e6ddc9]" />
          <span className="h-[9px] w-[9px] rounded-full bg-[#e6ddc9]" />
        </div>

        <div className="flex min-h-[440px] md:h-[552px]">
          {/* sidebar */}
          <div className="hidden w-[206px] flex-none flex-col gap-[16px] border-r border-line bg-sand p-[16px_14px] md:flex">
            <div className="flex items-center gap-[8px]">
              <span className="flex h-[20px] w-[20px] items-center justify-center rounded-[7px] bg-ink">
                <span className="h-[7px] w-[7px] rounded-full border-[1.5px] border-bg" />
              </span>
              <span className="font-serif text-[14.5px]">Ownspce</span>
            </div>
            <div className="flex flex-col gap-[3px]">
              {NAV_ROWS.map(([label, color, active]) => (
                <div
                  key={label}
                  className="flex items-center gap-[9px] rounded-[9px] px-[9px] py-[7px]"
                  style={{
                    background: active ? '#fffdf8' : 'transparent',
                    color: active ? '#2b2620' : '#6b6255',
                    border: `1px solid ${active ? '#eae0ce' : 'transparent'}`,
                  }}
                >
                  <Dot color={color} />
                  <span className="text-[12.5px] font-medium">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-[7px] text-[11px] font-semibold text-faint">
              <Dot color={CAT.sage} size={6} />
              Synced · sealed
            </div>
          </div>

          {/* page body */}
          <div className="flex min-w-0 flex-1 flex-col gap-[14px] p-[22px] md:p-[26px_30px] lg:pr-[268px]">
            <div className="font-serif text-[30px] tracking-[-0.015em]">Tuesday</div>
            <div className="flex flex-col gap-[7px]">
              {['92%', '78%', '54%'].map((w) => (
                <div key={w} className="h-[7px] rounded-[4px] bg-[#e9dfcd]" style={{ width: w }} />
              ))}
            </div>

            {/* Priority Lane */}
            <div className="overflow-hidden rounded-[15px] border border-[#eae0ce] bg-card">
              <div className="flex items-center gap-[9px] border-b border-[#f3ebdc] px-[14px] py-[11px]">
                <Dot color={ACCENT} size={9} />
                <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#4b433a]">Priority Lane</span>
                <span className="text-[11.5px] text-faint">6 open</span>
              </div>
              <div className="grid grid-cols-3 gap-[10px] px-[14px] pb-[16px] pt-[12px]">
                {HERO_LANES.map((lane) => (
                  <div key={lane.name} className="flex flex-col gap-[6px]">
                    <div className="flex items-center gap-[6px]">
                      <Dot color={lane.color} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{lane.name}</span>
                    </div>
                    {lane.tasks.map((t, i) => (
                      <TaskRow key={i} task={t} color={lane.color} pad="8px 9px" radius={10} titleSize={13} checkSize={15} />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Board + Quick note */}
            <div className="flex gap-[10px]">
              <div className="flex flex-1 flex-col gap-[8px] rounded-[14px] border border-[#eae0ce] bg-card p-[12px_14px]">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-sage">Board</div>
                <div className="flex gap-[6px]">
                  {['34%', '30%', '36%'].map((w) => (
                    <div key={w} className="h-[44px] rounded-[10px] border border-[#efe6d6] bg-[#f7f3ea]" style={{ width: w }} />
                  ))}
                </div>
              </div>
              <div className="flex w-[168px] flex-none flex-col gap-[7px] rounded-[14px] border border-[#eae0ce] bg-card p-[12px_14px]">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-plum">Quick note</div>
                <div className="h-[6px] w-[90%] rounded-[4px] bg-[#efe6d6]" />
                <div className="h-[6px] w-[64%] rounded-[4px] bg-[#efe6d6]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* floating phone */}
      <PhoneMockup className="absolute -bottom-[26px] right-[26px] hidden h-[432px] w-[218px] animate-float border-[#ded3c0] lg:block" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Privacy visual — device → sealed packets → cloud                          */
/* -------------------------------------------------------------------------- */

export function PrivacyVisual() {
  const packets = ['a9f2·c410', '7de1·b83a', 'f0c6·29ab'];
  return (
    <div
      aria-hidden="true"
      className="relative h-[360px] overflow-hidden rounded-[22px] border border-white/15 bg-[linear-gradient(160deg,rgba(244,239,231,0.05),rgba(244,239,231,0.01))] md:h-[400px]"
    >
      {/* device */}
      <div className="absolute left-[8%] top-1/2 flex h-[216px] w-[132px] -translate-y-1/2 flex-col gap-[8px] rounded-[22px] border border-white/25 bg-[#2c2721] p-[12px]">
        <div className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#9c9382]">Your device</div>
        <div className="h-[7px] w-[88%] rounded-[4px] bg-white/20" />
        <div className="h-[7px] w-[66%] rounded-[4px] bg-white/15" />
        <div className="h-[7px] w-[78%] rounded-[4px] bg-white/15" />
        <div
          className="mt-auto flex items-center gap-[7px] rounded-[10px] px-[9px] py-[7px]"
          style={{ border: `1px solid ${rgba(ACCENT, 0.5)}` }}
        >
          <span className="relative flex h-[18px] w-[18px] flex-none items-center justify-center">
            <span className="h-[11px] w-[11px] rounded-full border-[2.5px]" style={{ borderColor: ACCENT }} />
            <span className="absolute left-[8px] top-[13px] h-[6px] w-[2.5px] rounded-[2px]" style={{ background: ACCENT }} />
            <span className="absolute left-[11px] top-[15px] h-[2.5px] w-[4px] rounded-[2px]" style={{ background: ACCENT }} />
          </span>
          <span className="text-[10.5px] font-semibold text-[#e0d8c8]">Key stays</span>
        </div>
      </div>

      {/* dashed wire */}
      <div className="absolute left-[26%] right-[22%] top-1/2 h-px bg-[repeating-linear-gradient(90deg,rgba(244,239,231,0.3)_0_6px,transparent_6px_13px)]" />
      {packets.map((text, i) => (
        <div
          key={text}
          className="absolute left-[38%] top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[7px] border border-white/15 bg-dark px-[8px] py-[4px] font-mono text-[10.5px] tracking-[0.06em] text-[#b8af9e] max-md:hidden"
          style={{ animation: `ospacket 6s linear infinite`, animationDelay: `${i * 2}s`, opacity: 0 }}
        >
          {text}
        </div>
      ))}

      {/* cloud */}
      <div className="absolute right-[7%] top-1/2 flex h-[112px] w-[150px] -translate-y-1/2 flex-col items-center justify-center gap-[8px] rounded-[20px] border border-white/20 bg-white/5">
        <span className="absolute -inset-[14px] animate-pulse rounded-[26px] border border-white/10" />
        <span className="text-[22px] text-[#c8bfae]">☁</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9c9382]">Opaque bytes</span>
      </div>
    </div>
  );
}

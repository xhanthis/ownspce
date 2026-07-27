/**
 * Brand-style "app window" mockups.
 *
 * The Ownspce app isn't built yet, so every product visual on the page is a
 * clean CSS/SVG mockup drawn in the locked design system — soft surfaces,
 * 1px borders, generous whitespace, terracotta accent used sparingly. These
 * are decorative, so they're hidden from assistive tech (aria-hidden) and the
 * surrounding copy carries the meaning.
 */

/** A framed window with the three-dot chrome bar and a title. */
function AppWindow({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden rounded-l border border-border bg-surface shadow-[0_1px_2px_rgba(26,26,26,0.03)] ${className}`}
    >
      <div className="flex items-center gap-[7px] border-b border-border px-[14px] py-[11px]">
        <span className="h-[9px] w-[9px] rounded-full bg-[#E0E0DA]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[#E0E0DA]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[#E0E0DA]" />
        <span className="ml-[10px] text-[11.5px] font-medium text-faint">{title}</span>
      </div>
      {children}
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return <span className="h-[7px] w-[7px] flex-none rounded-full" style={{ background: color }} />;
}

/**
 * Hero visual — a full page with nested items on the left and a Priority Lane
 * on the right. Shows the wedge: a doc and its tasks living on one page.
 */
export function HeroMockup() {
  return (
    <AppWindow title="Q3 Launch — ownspce">
      <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr]">
        {/* Sidebar */}
        <div className="hidden flex-col gap-[3px] border-r border-border bg-bg/40 p-[14px] sm:flex">
          <div className="px-[8px] pb-[8px] text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
            Spaces
          </div>
          {[
            { label: 'Q3 Launch', active: true },
            { label: 'Weekly notes', active: false },
            { label: 'Research', active: false },
            { label: 'Personal', active: false },
          ].map((p) => (
            <div
              key={p.label}
              className={`flex items-center gap-[8px] rounded-s px-[9px] py-[7px] text-[12.5px] ${
                p.active ? 'bg-accent-light font-medium text-ink' : 'text-muted'
              }`}
            >
              <Dot color={p.active ? '#CC785C' : '#C9C9C2'} />
              {p.label}
            </div>
          ))}
        </div>

        {/* Page body */}
        <div className="p-[18px] sm:p-[22px]">
          <div className="text-[19px] font-semibold tracking-[-0.01em] text-ink">Q3 Launch plan</div>
          <p className="mt-[6px] text-[12.5px] leading-[1.6] text-muted">
            Everything for the release — the brief, the open questions, and the work — on one page.
          </p>

          {/* Nested items */}
          <div className="mt-[16px] flex flex-col gap-[7px]">
            {[
              { text: 'Positioning brief', depth: 0, done: true },
              { text: 'Pricing page copy', depth: 1, done: true },
              { text: 'Onboarding empty states', depth: 1, done: false },
              { text: 'Beta invite waves', depth: 0, done: false },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-[9px] text-[13px]"
                style={{ paddingLeft: row.depth * 18 }}
              >
                <span
                  className={`flex h-[15px] w-[15px] flex-none items-center justify-center rounded-[5px] border ${
                    row.done ? 'border-accent bg-accent' : 'border-[#D4D4CD] bg-surface'
                  }`}
                >
                  {row.done && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.6 3.3 6 8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className={row.done ? 'text-faint line-through' : 'text-ink'}>{row.text}</span>
              </div>
            ))}
          </div>

          {/* Priority Lane */}
          <div className="mt-[18px] rounded-m border border-border bg-bg/50 p-[13px]">
            <div className="mb-[11px] flex items-center gap-[8px]">
              <Dot color="#CC785C" />
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted">
                Priority Lane
              </span>
              <span className="text-[11px] text-faint">Now · Next · Later</span>
            </div>
            <div className="grid grid-cols-3 gap-[8px]">
              {[
                { head: 'Now', items: ['Ship beta'], accent: true },
                { head: 'Next', items: ['Docs pass', 'Demo video'], accent: false },
                { head: 'Later', items: ['Android build'], accent: false },
              ].map((col) => (
                <div key={col.head} className="flex flex-col gap-[6px]">
                  <div className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-faint">
                    {col.head}
                  </div>
                  {col.items.map((it) => (
                    <div
                      key={it}
                      className={`rounded-s px-[9px] py-[7px] text-[11.5px] leading-tight ${
                        col.accent
                          ? 'border border-accent/30 bg-accent-light font-medium text-ink'
                          : 'border border-border bg-surface text-muted'
                      }`}
                    >
                      {it}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}

/** Capture — an Inbox with mixed capture sources landing in one place. */
export function CaptureMockup() {
  const rows = [
    { icon: '🎙', label: 'Voice note — “idea for onboarding”' },
    { icon: '📷', label: 'Photo → text — whiteboard sketch' },
    { icon: '🔗', label: 'Web clip — pricing benchmarks' },
    { icon: '↗', label: 'Share sheet — link from Safari' },
  ];
  return (
    <AppWindow title="Inbox" className="h-full">
      <div className="flex flex-col gap-[8px] p-[16px]">
        <div className="mb-[2px] text-[10.5px] font-semibold uppercase tracking-[0.12em] text-faint">
          To sort — 4 new
        </div>
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center gap-[10px] rounded-s border border-border bg-bg/40 px-[11px] py-[9px]"
          >
            <span className="flex h-[24px] w-[24px] flex-none items-center justify-center rounded-[7px] bg-accent-light text-[12px]">
              {r.icon}
            </span>
            <span className="truncate text-[12.5px] text-ink">{r.label}</span>
          </div>
        ))}
      </div>
    </AppWindow>
  );
}

/** Second brain — a nested page tree with tags. */
export function SecondBrainMockup() {
  const tree = [
    { text: 'Product', depth: 0 },
    { text: 'Roadmap', depth: 1 },
    { text: 'Q3 launch', depth: 2 },
    { text: 'Interviews', depth: 1 },
    { text: 'Personal', depth: 0 },
  ];
  return (
    <AppWindow title="All pages" className="h-full">
      <div className="p-[16px]">
        <div className="flex flex-col gap-[6px]">
          {tree.map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-[8px] text-[12.5px] text-ink"
              style={{ paddingLeft: r.depth * 16 }}
            >
              <Dot color={r.depth === 0 ? '#CC785C' : '#C9C9C2'} />
              {r.text}
            </div>
          ))}
        </div>
        <div className="mt-[14px] flex flex-wrap gap-[6px] border-t border-border pt-[12px]">
          {['#launch', '#pricing', '#idea', '#legal'].map((t) => (
            <span
              key={t}
              className="rounded-[6px] bg-bg px-[8px] py-[3px] text-[11px] font-medium text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </AppWindow>
  );
}

/** Plan — Priority Lane, an Impact × Effort map, and a board tab strip. */
export function PlanMockup() {
  return (
    <AppWindow title="Planning" className="h-full">
      <div className="p-[16px]">
        <div className="mb-[10px] flex gap-[6px]">
          {['Lane', 'Impact × Effort', 'Board'].map((t, i) => (
            <span
              key={t}
              className={`rounded-[7px] px-[10px] py-[5px] text-[11px] font-medium ${
                i === 1 ? 'bg-accent text-surface' : 'bg-bg text-muted'
              }`}
            >
              {t}
            </span>
          ))}
        </div>
        {/* Impact × Effort quadrant */}
        <div className="relative aspect-[4/3] w-full rounded-m border border-border bg-bg/40">
          <span className="absolute left-[8px] top-[6px] text-[9px] font-semibold uppercase tracking-[0.1em] text-faint">
            Impact
          </span>
          <span className="absolute bottom-[6px] right-[8px] text-[9px] font-semibold uppercase tracking-[0.1em] text-faint">
            Effort
          </span>
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-border" />
          {[
            { x: '22%', y: '26%', accent: true },
            { x: '30%', y: '40%', accent: false },
            { x: '68%', y: '32%', accent: false },
            { x: '58%', y: '70%', accent: false },
            { x: '78%', y: '74%', accent: false },
          ].map((p, i) => (
            <span
              key={i}
              className={`absolute h-[12px] w-[12px] -translate-x-1/2 -translate-y-1/2 rounded-full ${
                p.accent ? 'bg-accent ring-4 ring-accent-light' : 'bg-[#C4C4BC]'
              }`}
              style={{ left: p.x, top: p.y }}
            />
          ))}
        </div>
        <p className="mt-[10px] text-[11px] leading-[1.5] text-faint">
          Quick wins — high impact, low effort — surface top-left.
        </p>
      </div>
    </AppWindow>
  );
}

/** Private AI — a prompt over your own notes with a scoped-request note. */
export function AiMockup() {
  return (
    <AppWindow title="Ask your notes" className="h-full">
      <div className="flex flex-col gap-[10px] p-[16px]">
        <div className="self-end rounded-m rounded-br-[4px] bg-accent px-[12px] py-[8px] text-[12px] text-surface">
          Summarise my launch decisions
        </div>
        <div className="self-start rounded-m rounded-bl-[4px] border border-border bg-bg/50 px-[12px] py-[9px] text-[12px] leading-[1.55] text-ink">
          Three calls stand: ship beta in waves, price at $4.99, hold Android
          for v2. Pulled from <span className="font-medium text-accent">3 pages</span>.
        </div>
        <div className="mt-[2px] flex items-center gap-[7px] rounded-s border border-dashed border-border px-[10px] py-[7px] text-[10.5px] text-faint">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="2.5" y="5.5" width="7" height="5" rx="1" stroke="#999999" strokeWidth="1" />
            <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" stroke="#999999" strokeWidth="1" />
          </svg>
          Only the content you ask about leaves — for that one request.
        </div>
      </div>
    </AppWindow>
  );
}

/** Publish — a public link bar with the ownspce.com/@you/page format. */
export function PublishMockup() {
  return (
    <AppWindow title="Share" className="h-full">
      <div className="p-[16px]">
        <div className="flex items-center gap-[9px] rounded-m border border-border bg-bg/50 px-[12px] py-[10px]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-none">
            <circle cx="7" cy="7" r="6" stroke="#CC785C" strokeWidth="1.2" />
            <path d="M1 7h12M7 1c1.8 1.6 2.8 3.8 2.8 6S8.8 12.4 7 14M7 1C5.2 2.6 4.2 4.8 4.2 7S5.2 12.4 7 13" stroke="#CC785C" strokeWidth="1.1" />
          </svg>
          <span className="truncate text-[12.5px] text-ink">
            ownspce.com/<span className="font-medium text-accent">@you</span>/q3-launch
          </span>
        </div>
        <div className="mt-[10px] flex items-center justify-between rounded-s border border-border px-[12px] py-[9px]">
          <span className="text-[12px] text-muted">Public page</span>
          <span className="relative h-[18px] w-[32px] rounded-full bg-accent">
            <span className="absolute right-[2px] top-[2px] h-[14px] w-[14px] rounded-full bg-surface" />
          </span>
        </div>
        <div className="mt-[8px] flex items-center justify-between rounded-s border border-border px-[12px] py-[9px]">
          <span className="text-[12px] text-muted">Encrypted secret link</span>
          <span className="relative h-[18px] w-[32px] rounded-full bg-[#DCDCD5]">
            <span className="absolute left-[2px] top-[2px] h-[14px] w-[14px] rounded-full bg-surface" />
          </span>
        </div>
      </div>
    </AppWindow>
  );
}

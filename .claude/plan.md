# CLAUDE.md — ownspce

## Project Overview
ownspce is a superlight personal productivity app (Notion + Todoist hybrid).
Single Next.js 14 monorepo. No separate backend service.
User content lives in Google Drive. NeonDB stores only metadata.

---

## Stack (non-negotiable, keep it lean)
- **Framework:** Next.js 14 App Router (TypeScript)
- **Styling:** Tailwind CSS only — no component libraries
- **Auth:** NextAuth.js v5 (credentials provider, bcrypt)
- **DB:** NeonDB via `@neondatabase/serverless` — metadata only, no content
- **Storage:** Google Drive API v3 — all page content as JSON files
- **Mobile:** Ionic Capacitor — built from the same Next.js codebase, compiled to native iOS/Android via Capacitor. No separate mobile app folder needed.
- **Deploy:** Vercel (web) + Capacitor build for iOS/Android
- **Editor:** TipTap (Scratch + Story pages only)
- **DnD:** dnd-kit (Kanban + Right Now)

---

## Monorepo Structure
```
ownspce/
├── app/                        # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx          # App shell with sidebar
│   │   ├── dashboard/page.tsx
│   │   ├── pages/[id]/page.tsx # Dynamic page renderer
│   │   └── profile/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── pages/route.ts      # CRUD page index in NeonDB
│   │   ├── pages/[id]/route.ts
│   │   ├── drive/connect/route.ts
│   │   └── drive/file/route.ts # Read/write to Drive
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                     # Only what you build — no shadcn
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── pages/
│   │   ├── ScratchPage.tsx     # TipTap editor
│   │   ├── RightNowPage.tsx    # ATC runway view
│   │   ├── TodoPage.tsx        # Checklist
│   │   ├── StoryPage.tsx       # Long-form TipTap
│   │   └── KanbanPage.tsx      # dnd-kit board
│   ├── PageRenderer.tsx        # Routes page_type to correct component
│   └── Sidebar.tsx
├── lib/
│   ├── db.ts                   # NeonDB client (singleton)
│   ├── drive.ts                # Google Drive helpers
│   ├── auth.ts                 # NextAuth config
│   └── types.ts                # Shared TypeScript types
├── packages/
│   └── core/                   # Shared types (used by web + Capacitor)
│       └── types.ts
├── middleware.ts               # Protect /app/* routes
├── .env.local
└── CLAUDE.md
```

---

## NeonDB Schema
Run once to set up. Never store page content here.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(32) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  theme VARCHAR(16) DEFAULT 'dark',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE storage_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(16) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  folder_id TEXT,
  connected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE page_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  page_type VARCHAR(16) NOT NULL, -- scratch | rightnow | todo | story | kanban
  title TEXT NOT NULL DEFAULT 'Untitled',
  drive_file_id TEXT,             -- null until Drive is connected
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);
```

---

## Page Content Format
Every page is saved as a JSON file in the user's Google Drive at:
`/ownspce/pages/{page_id}.json`

```ts
// lib/types.ts

export type PageType = 'scratch' | 'rightnow' | 'todo' | 'story' | 'kanban'

export interface BasePage {
  id: string
  type: PageType
  title: string
  updatedAt: string
}

export interface ScratchPage extends BasePage {
  type: 'scratch'
  content: string // TipTap JSON string
}

export interface RightNowPage extends BasePage {
  type: 'rightnow'
  active: RightNowItem[]   // max 3
  onDeck: RightNowItem[]   // max 5
  holding: RightNowItem[]
}

export interface RightNowItem {
  id: string
  text: string
  createdAt: string
}

export interface TodoPage extends BasePage {
  type: 'todo'
  items: TodoItem[]
}

export interface TodoItem {
  id: string
  text: string
  done: boolean
  label?: string
}

export interface StoryPage extends BasePage {
  type: 'story'
  content: string // TipTap JSON string
  coverImage?: string
}

export interface KanbanPage extends BasePage {
  type: 'kanban'
  columns: KanbanColumn[]
}

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
}

export interface KanbanCard {
  id: string
  title: string
  notes?: string
}
```

---

## API Routes

### Auth
- `POST /api/auth/signup` — create user (username + password)
- `GET|POST /api/auth/[...nextauth]` — NextAuth handlers (login, session)

### Pages (metadata in NeonDB)
- `GET /api/pages` — list all pages for current user (from page_index)
- `POST /api/pages` — create new page_index entry
- `PATCH /api/pages/[id]` — update title or metadata
- `DELETE /api/pages/[id]` — soft delete (is_deleted = true)

### Drive (content in Google Drive)
- `GET /api/drive/connect` — OAuth redirect to Google
- `GET /api/drive/callback` — handle OAuth callback, save tokens
- `GET /api/drive/file?pageId=x` — fetch page JSON from Drive
- `PUT /api/drive/file?pageId=x` — write/update page JSON in Drive

---

## Design System
Primary colour: `#0A0A0A` (text), `#FFFFFF` (bg), `#F2F2F2` (surface)
Border: `#E0E0E0`, 1px
Accent (use sparingly): `#FF6B4A` — active states, CTA, Right Now active lane only
Font: Geist Sans (import via `next/font/google`)
Radius: 10px cards, 6px inputs/buttons
Spacing: 8px base grid
Motion: 150ms ease fade + translateY(4px) on enter — CSS only, no animation libraries

Dark mode: use `class="dark"` on `<html>` driven by user's theme setting.
Tailwind dark variants: `dark:bg-zinc-900 dark:text-white` etc.

---

## Right Now Page — ATC Logic
This is the signature feature. Build it carefully.

Three fixed lanes:
- **Active** — max 3 items. These are on the runway right now.
- **On Deck** — max 5 items. Cleared for approach.
- **Holding** — unlimited. Waiting in stack.

Rules:
- Drag from Holding → On Deck → Active only when slots are free
- When Active item is completed, it disappears and On Deck auto-promotes
- Items in Active get a subtle pulse animation (`#FF6B4A` left border)
- Save full state to Drive on every change (debounced 800ms)

---

## Build Order (MVP Phase 1)

### Step 1 — Project bootstrap
```bash
npx create-next-app@latest ownspce --typescript --tailwind --app
cd ownspce
npm install @neondatabase/serverless next-auth@beta bcryptjs
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install googleapis
npm install --save-dev @types/bcryptjs

# Capacitor (mobile)
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
npx cap init ownspce com.ownspce.app --web-dir=out
```

### Step 2 — Environment variables
```env
DATABASE_URL=                    # Neon connection string
NEXTAUTH_SECRET=                 # random 32-char string
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/drive/callback
```

### Step 3 — DB + Auth (lib/db.ts, lib/auth.ts)
- Set up Neon client singleton
- Configure NextAuth credentials provider
- Hash passwords with bcrypt (rounds: 10)
- Run schema SQL against Neon

### Step 4 — Middleware
Protect all `/app/*` routes. Redirect unauthenticated users to `/login`.

```ts
// middleware.ts
export { auth as middleware } from '@/lib/auth'
export const config = { matcher: ['/(app)/:path*'] }
```

### Step 5 — Auth pages (login + signup)
Minimal forms. No third-party UI. Just Input + Button components.
Show ownspce logo (owl icon). Black background, white card.

### Step 6 — Dashboard + Sidebar
- Sidebar: logo, page list grouped by type, "+ New Page" button, profile link
- Dashboard: grid of recent pages (title, type badge, last edited)
- "+ New Page" opens a modal: pick page type → creates entry in NeonDB → opens editor

### Step 7 — Drive connect flow
- Profile page: "Connect Google Drive" button
- OAuth flow → save tokens in storage_connections
- After connect: create `/ownspce/pages/` folder in Drive
- If not connected: save content to localStorage with a banner nudging Drive connect

### Step 8 — Page components (build in this order)
1. **TodoPage** — simplest. Checkbox list. Learn the save-to-Drive pattern here.
2. **ScratchPage** — TipTap editor. Auto-save on change (debounce 1s).
3. **RightNowPage** — ATC lanes. dnd-kit between lanes. Max slot enforcement.
4. **StoryPage** — TipTap with cover image upload to Drive.
5. **KanbanPage** — dnd-kit columns. Custom column add/rename.

### Step 9 — PageRenderer
```tsx
// components/PageRenderer.tsx
const map = { scratch: ScratchPage, rightnow: RightNowPage, todo: TodoPage, story: StoryPage, kanban: KanbanPage }
export default function PageRenderer({ page }) {
  const Component = map[page.type]
  return <Component page={page} />
}
```

### Step 10 — Profile page
- Change theme (dark/light) — saves to users.theme in NeonDB
- Reconnect / disconnect Drive
- Export all data (zip of all JSON files from Drive)

---

## Drive Save Pattern
Use this exact pattern in every page component.

```ts
// On every content change (debounced):
const save = useDebouncedCallback(async (content) => {
  await fetch(`/api/drive/file?pageId=${page.id}`, {
    method: 'PUT',
    body: JSON.stringify(content),
  })
  // Also update page_index.updated_at in NeonDB
  await fetch(`/api/pages/${page.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ updatedAt: new Date().toISOString() }),
  })
}, 800)
```

If Drive is not connected, fall back to localStorage key `ownspce_page_{id}`.

---

## Performance Rules
- No external UI component libraries (no shadcn, radix, headlessui)
- No state management library (no zustand, redux) — React state + SWR only
- SWR for data fetching: `useSWR('/api/pages', fetcher)`
- Images: Next.js `<Image>` only
- Bundle target: < 150KB first load JS
- No CSS-in-JS — Tailwind only

---

## Mobile — Ionic Capacitor (Phase 2)
Capacitor wraps the Next.js static export as a native iOS/Android app.
No separate codebase. Same HTML/CSS/JS runs in a native WebView.

### Setup
Add to `next.config.ts`:
```ts
output: 'export'   // required for Capacitor static build
```

Add Capacitor plugins as needed:
```bash
npm install @capacitor/filesystem    # for local file access
npm install @capacitor/browser       # for Drive OAuth popup
npm install @capacitor/status-bar @capacitor/splash-screen
```

### Build + sync flow
```bash
npm run build        # Next.js static export → /out
npx cap sync         # copies /out to ios/App and android/app
npx cap open ios     # open in Xcode
npx cap open android # open in Android Studio
```

### OTA updates (replaces CodePush)
Use **Capawesome Cloud** or **Appflow** for OTA JS updates.
Or self-host: on app launch, fetch a version manifest from your Vercel URL and
prompt user to reload if a newer build is available.

### Drive OAuth on mobile
Use `@capacitor/browser` to open the Google OAuth URL in a native browser,
then handle the redirect back via a custom URL scheme: `com.ownspce.app://callback`

### Notes
- All API calls from mobile still hit the deployed Next.js API on Vercel
- No need for a separate mobile API — same endpoints work
- Use `Capacitor.isNativePlatform()` to detect mobile and adjust UI if needed (e.g. hide sidebar, show bottom nav)

---

## Coding Conventions
- All components: functional, no class components
- File naming: PascalCase for components, camelCase for lib/utils
- No `any` types — use the types from `lib/types.ts`
- API routes: always return `{ data, error }` shape
- Every Drive API call wrapped in try/catch with token refresh fallback
- Comments only where logic is non-obvious — keep code self-documenting

---

## What NOT to build
- No real-time collaboration
- No comments or mentions
- No notifications
- No sharing / public pages
- No AI features (for now)
- No complex permissions
Keep it a sharp personal tool.
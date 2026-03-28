# ownspce — Complete Claude Code Build Plan
> Execute this top to bottom. Each step must pass before moving to the next.

---

## STACK REFERENCE (read before starting)

| Layer | Choice |
|---|---|
| Mobile | React Native CLI (bare) |
| Navigation | React Navigation v7 |
| Styling | Restyle (Shopify) |
| State | Zustand |
| Server State | TanStack Query |
| Rich Text (mobile) | 10tap-editor |
| Rich Text (web) | Tiptap |
| Drag & Drop | react-native-draggable-flatlist |
| OTA | CodePush (App Center) |
| Local Cache | MMKV |
| Monorepo | Turborepo |
| DB | NeonDB (Postgres) |
| ORM | Drizzle ORM |
| API | Next.js API routes (hosted on Vercel) |
| Auth | NextAuth v5 (credentials) |
| Storage | Google Drive API + iCloud CloudKit |
| Web | Next.js 14 |

---

## STEP 1 — Monorepo Scaffold

```bash
mkdir ownspce && cd ownspce
npx create-turbo@latest . --package-manager pnpm
```

Set up this exact folder structure:

```
ownspce/
├── apps/
│   ├── mobile/        ← React Native CLI (iOS + Android)
│   └── web/           ← Next.js 14 (web + API)
├── packages/
│   ├── core/          ← shared types, constants
│   └── db/            ← Drizzle schema + migrations
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

`pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

`turbo.json`:
```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "type-check": { "dependsOn": ["^build"] }
  }
}
```

---

## STEP 2 — packages/db (NeonDB + Drizzle)

```bash
cd packages/db
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit
```

`packages/db/src/schema.ts`:
```ts
import { pgTable, uuid, text, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const pageTypeEnum = pgEnum('page_type', ['scratch', 'right_now', 'todo', 'story', 'kanban']);
export const storageProviderEnum = pgEnum('storage_provider', ['google_drive', 'icloud']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').unique().notNull(),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  theme: text('theme').default('dark'),
  storageProvider: storageProviderEnum('storage_provider').default('google_drive'),
  driveAccessToken: text('drive_access_token'),
  driveRefreshToken: text('drive_refresh_token'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const devices = pgTable('devices', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  deviceName: text('device_name'),
  platform: text('platform'),
  lastSeen: timestamp('last_seen').defaultNow(),
  pushToken: text('push_token'),
  codepushKey: text('codepush_key'),
});

export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  title: text('title').notNull().default('Untitled'),
  type: pageTypeEnum('type').notNull(),
  driveFileId: text('drive_file_id'),
  isPinned: boolean('is_pinned').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const syncLog = pgTable('sync_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  pageId: uuid('page_id').references(() => pages.id),
  action: text('action'),
  syncedAt: timestamp('synced_at').defaultNow(),
});
```

`drizzle.config.ts`:
```ts
import type { Config } from 'drizzle-kit';
export default {
  schema: './src/schema.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: { connectionString: process.env.DATABASE_URL! },
} satisfies Config;
```

Run migration:
```bash
pnpm drizzle-kit generate:pg
pnpm drizzle-kit push:pg
```

---

## STEP 3 — packages/core (Shared Logic)

```bash
cd packages/core
pnpm add axios zod zustand @tanstack/query-core
```

Structure:
```
packages/core/src/
├── types/
│   ├── user.ts
│   ├── page.ts
│   └── sync.ts
├── api/
│   ├── client.ts       ← base axios instance
│   ├── auth.ts         ← signup, login, logout
│   ├── pages.ts        ← CRUD for pages
│   └── drive.ts        ← Google Drive helpers
├── store/
│   ├── authStore.ts    ← Zustand: user session
│   └── pageStore.ts    ← Zustand: pages list
└── index.ts
```

`packages/core/src/types/page.ts`:
```ts
export type PageType = 'scratch' | 'right_now' | 'todo' | 'story' | 'kanban';

export interface Page {
  id: string;
  userId: string;
  title: string;
  type: PageType;
  driveFileId: string | null;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// Content types per page (stored in Drive as JSON)
export interface ScratchContent { json: object } // Tiptap/10tap JSON
export interface TodoContent { items: { id: string; text: string; done: boolean; tags: string[]; dueDate?: string }[] }
export interface RightNowContent { urgent: Task[]; next: Task[]; parked: Task[] }
export interface StoryContent { json: object }
export interface KanbanContent { columns: { id: string; title: string; wipLimit?: number; cards: KanbanCard[] }[] }

interface Task { id: string; title: string; eta?: string; priority: 'red' | 'yellow' | 'green'; done: boolean }
interface KanbanCard { id: string; title: string; description?: string; dueDate?: string; label?: string }
```

`packages/core/src/store/authStore.ts`:
```ts
import { create } from 'zustand';

interface AuthState {
  user: { id: string; username: string; email: string; theme: string } | null;
  token: string | null;
  setUser: (user: AuthState['user'], token: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user, token) => set({ user, token }),
  clearUser: () => set({ user: null, token: null }),
}));
```

---

## STEP 4 — apps/web (Next.js 14 + API Routes)

API routes live in `apps/web/app/api/`:
- `POST /api/auth/signup` — { username, password } → hash password, insert user, return JWT
- NextAuth handles session-based login for web
- `POST /api/auth/token` — generates JWT for mobile app auth
- `GET /api/pages` — list all pages for authed user
- `POST /api/pages` — create page with default content per type
- `PATCH /api/pages/:id` — update title, content, isPinned
- `DELETE /api/pages/:id` — soft delete
- `GET/PATCH /api/user/theme` — theme preference

Auth:
- Web: NextAuth v5 with credentials provider (session-based)
- Mobile: Bearer JWT via `getAuthUser()` helper that checks both auth methods

---

## STEP 5 — apps/mobile (React Native CLI)

### 5.1 Init

```bash
cd apps/mobile
npx react-native@latest init ownspce --template react-native-template-typescript
```

### 5.2 Install all dependencies at once

```bash
pnpm add \
  @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs \
  react-native-screens react-native-safe-area-context \
  @shopify/restyle \
  zustand @tanstack/react-query axios \
  react-native-mmkv \
  @10play/tentap-editor \
  react-native-draggable-flatlist \
  react-native-reanimated react-native-gesture-handler \
  react-native-code-push \
  react-native-fs \
  @react-native-google-signin/google-signin \
  react-native-keychain \
  react-native-vector-icons \
  date-fns \
  ../../packages/core
```

```bash
cd ios && pod install
```

### 5.3 Design System (Restyle)

`src/theme/theme.ts`:
```ts
import { createTheme } from '@shopify/restyle';

const palette = {
  black: '#0A0A0A',
  surface: '#141414',
  elevated: '#1E1E1E',
  white: '#F5F5F5',
  muted: '#6B6B6B',
  border: '#2A2A2A',
  success: '#22C55E',
  danger: '#EF4444',
  transparent: 'transparent',
};

const theme = createTheme({
  colors: {
    mainBackground: palette.black,
    cardBackground: palette.surface,
    elevatedBackground: palette.elevated,
    primaryText: palette.white,
    mutedText: palette.muted,
    border: palette.border,
    accent: palette.white,
    success: palette.success,
    danger: palette.danger,
  },
  spacing: { xs: 4, s: 8, m: 16, l: 24, xl: 32, xxl: 48 },
  borderRadii: { s: 4, m: 8, l: 16, xl: 24, full: 999 },
  textVariants: {
    header: { fontFamily: 'InstrumentSerif-Regular', fontSize: 28, color: 'primaryText' },
    subheader: { fontFamily: 'DMSans-SemiBold', fontSize: 18, color: 'primaryText' },
    body: { fontFamily: 'DMSans-Regular', fontSize: 15, color: 'primaryText' },
    caption: { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'mutedText' },
    code: { fontFamily: 'FiraCode-Regular', fontSize: 13, color: 'primaryText' },
    defaults: { fontFamily: 'DMSans-Regular', color: 'primaryText' },
  },
});

export type Theme = typeof theme;
export default theme;
```

Add custom fonts: download Instrument Serif, DM Sans, Fira Code → add to `android/app/src/main/assets/fonts/` and `ios/ownspce/` → link via `react-native.config.js`.

### 5.4 App Entry + Navigation

`src/App.tsx`:
```tsx
import CodePush from 'react-native-code-push';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@shopify/restyle';
import theme from './theme/theme';
import RootNavigator from './navigation/RootNavigator';

const queryClient = new QueryClient();

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default CodePush(codePushOptions)(App);
```

`src/navigation/RootNavigator.tsx`:
```tsx
// If no token in MMKV → AuthStack
// Else → AppStack
import { useAuthStore } from '@ownspce/core';

export default function RootNavigator() {
  const token = useAuthStore(s => s.token);
  return token ? <AppStack /> : <AuthStack />;
}
```

`src/navigation/AuthStack.tsx` — screens: Landing, Signup, Login

`src/navigation/AppStack.tsx` — Bottom tabs: Dashboard, Pages, Profile
- Each tab has its own nested stack navigator

### 5.5 Screens — Build in this order

#### AUTH SCREENS

**screens/auth/SignupScreen.tsx**
- Fields: username, email, password
- Call `POST /auth/signup`
- On success: store JWT in MMKV + Keychain, set user in authStore
- Navigate to ConnectStorageScreen

**screens/auth/LoginScreen.tsx**
- Fields: email, password
- Call `POST /auth/login`
- On success: store JWT, set user, navigate to Dashboard

**screens/auth/ConnectStorageScreen.tsx**
- Show two options: Google Drive / iCloud
- Google Drive: trigger OAuth via `@react-native-google-signin/google-signin`
- Store tokens via `POST /drive/connect`
- Skip option available

#### DASHBOARD

**screens/dashboard/DashboardScreen.tsx**
- Header: "Good morning, @{username}" (time-aware)
- Pinned pages row (horizontal scroll)
- Recent pages list (last 5 modified)
- Floating Action Button (+) → opens PageTypePickerSheet
- Empty state: "Create your first page"

#### PAGE TYPE PICKER

**components/PageTypePickerSheet.tsx** (Bottom sheet)
- 5 cards, each with icon + label + description:
  - ✏️ Scratch — "Blank canvas"
  - 🛬 Right Now — "Priority queue"
  - ✅ Todo — "Checklist"
  - 📖 Story — "Long-form writing"
  - 📋 Kanban — "Board view"
- On select: call `POST /pages`, create Drive file, navigate to editor

#### PAGES LIST

**screens/pages/PagesScreen.tsx**
- Grid view (2 col) of all pages with type icon + title + date
- Filter bar: All / Scratch / Right Now / Todo / Story / Kanban
- Long press → pin, rename, delete
- Pull to refresh

#### EDITORS — one screen per page type

**screens/pages/editors/ScratchEditor.tsx**
- `TenTapEditor` component
- Toolbar: Bold, Italic, H1, H2, Bullet, Numbered, Code, Quote
- `/` command menu via editor extensions
- Auto-save: useEffect with 30s debounce → write to Drive file
- Word count in bottom bar

**screens/pages/editors/RightNowEditor.tsx**
- 3 horizontal sections: Urgent | Next | Parked
- `DraggableFlatList` in each section
- TaskCard: priority dot (colored) + title + ETA chip
- FAB to add task → modal with title, ETA, priority selector
- Swipe right to complete → auto-archive logic
- Drag between sections via shared state

**screens/pages/editors/TodoEditor.tsx**
- FlatList of ChecklistItem components
- Swipe left: delete · Swipe right: done
- Bottom input bar for quick-add
- Tags shown as pills on each item
- Group by tag toggle in header

**screens/pages/editors/StoryEditor.tsx**
- Full-screen `TenTapEditor` with minimal toolbar
- Header: title input (large, Instrument Serif)
- Bottom bar: word count + read time estimate + streak badge
- Export button (top right) → share sheet with PDF/Markdown options

**screens/pages/editors/KanbanEditor.tsx**
- Horizontal ScrollView of columns
- Each column: title + WIP badge + `DraggableFlatList` of cards
- KanbanCard: title + label color dot + due date
- Add card: tap `+` at bottom of column
- Add column: `+` button at end of scroll
- Long press card → edit modal

#### PROFILE

**screens/profile/ProfileScreen.tsx**
- Avatar (initials-based, auto-generated from username)
- Username display + edit button
- Theme toggle: Dark / Light (store in DB + MMKV)
- Storage section: show connected provider, connect/disconnect buttons
- App version + CodePush version display

#### SETTINGS

**screens/settings/SettingsScreen.tsx**
- Sync status (last synced timestamp)
- Notification preferences
- Clear local cache
- Logout
- About / Privacy

### 5.6 Shared Components (build these first, use everywhere)

```
src/components/
├── Button.tsx          ← ghost, solid, danger variants
├── Input.tsx           ← borderless, bottom underline focus
├── Card.tsx            ← Restyle Box wrapper with border
├── PageCard.tsx        ← page grid item
├── TaskCard.tsx        ← right now task
├── ChecklistItem.tsx   ← todo item with swipe
├── FAB.tsx             ← floating action button
├── EmptyState.tsx      ← icon + message + CTA
├── LoadingSpinner.tsx
└── BottomSheet.tsx     ← reusable bottom sheet wrapper
```

### 5.7 Google Drive Integration

`packages/core/src/api/drive.ts`:
```ts
const DRIVE_BASE = 'https://www.googleapis.com/drive/v3';
const UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

// Read page content from Drive
export async function readDriveFile(fileId: string, accessToken: string): Promise<object> {
  const res = await axios.get(`${DRIVE_BASE}/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
}

// Write page content to Drive
export async function writeDriveFile(fileId: string | null, content: object, accessToken: string): Promise<string> {
  const body = JSON.stringify(content);
  if (fileId) {
    // Update existing
    await axios.patch(`${UPLOAD_BASE}/files/${fileId}?uploadType=media`, body, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    });
    return fileId;
  } else {
    // Create new in ownspce/pages/ folder
    const meta = await axios.post(`${DRIVE_BASE}/files`, { name: `${Date.now()}.json`, parents: ['ownspce-folder-id'] }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    await axios.patch(`${UPLOAD_BASE}/files/${meta.data.id}?uploadType=media`, body, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    });
    return meta.data.id;
  }
}
```

Auto-save hook (use in every editor):
```ts
// src/hooks/useAutoSave.ts
import { useEffect, useRef } from 'react';

export function useAutoSave(content: object, pageId: string, driveFileId: string | null) {
  const timer = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      // 1. Write to Drive
      // 2. PATCH /pages/:id with updatedAt
      // 3. Update sync_log
    }, 30000); // 30s debounce
    return () => clearTimeout(timer.current!);
  }, [content]);
}
```

### 5.8 CodePush Setup

```bash
npm install -g appcenter-cli
appcenter login
appcenter apps create -d ownspce-ios -o iOS -p React-Native
appcenter apps create -d ownspce-android -o Android -p React-Native
appcenter codepush deployment add -a {org}/ownspce-ios Production
appcenter codepush deployment add -a {org}/ownspce-ios Staging
appcenter codepush deployment add -a {org}/ownspce-android Production
appcenter codepush deployment add -a {org}/ownspce-android Staging
```

Add deployment keys to `Info.plist` (iOS) and `strings.xml` (Android).

Release update:
```bash
appcenter codepush release-react -a {org}/ownspce-ios -d Production
appcenter codepush release-react -a {org}/ownspce-android -d Production
```

---

## STEP 6 — apps/web (Next.js)

```bash
cd apps/web
npx create-next-app@latest . --typescript --tailwind --app
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tanstack/react-query axios zustand ../../packages/core ../../packages/db
```

### Pages to build

**`app/page.tsx`** — Landing page
- Hero: "Your space. Your data." + Get Started CTA
- 3 feature sections: Pages, Right Now, Kanban
- Footer with GitHub link

**`app/(auth)/signup/page.tsx`** — Signup form (mirrors mobile)

**`app/(auth)/login/page.tsx`** — Login form

**`app/(app)/layout.tsx`** — Sidebar layout
- Left sidebar: logo, nav items (Dashboard, Pages, Profile), collapse toggle
- Main content area

**`app/(app)/dashboard/page.tsx`** — Same content as mobile dashboard

**`app/(app)/pages/page.tsx`** — Pages grid

**`app/(app)/pages/[id]/page.tsx`** — Dynamic editor (render correct editor by page.type)

**`app/(app)/profile/page.tsx`** — Profile settings

### Web editors use Tiptap (same JSON format as 10tap):
```tsx
// components/editors/ScratchEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const editor = useEditor({
  extensions: [StarterKit],
  content: initialContent,
  onUpdate: ({ editor }) => debouncedSave(editor.getJSON()),
});
```

Keyboard shortcuts:
- `Cmd+K` → Command palette (search pages, create new)
- `Cmd+N` → New page
- `Cmd+S` → Force save
- `Cmd+\` → Toggle sidebar

---

## STEP 7 — Environment Variables

`apps/web/.env`:
```env
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Mobile (`apps/mobile/.env`):
```env
API_BASE_URL=https://ownspce.vercel.app
GOOGLE_WEB_CLIENT_ID=
CODEPUSH_KEY_IOS_PROD=
CODEPUSH_KEY_IOS_STAGING=
CODEPUSH_KEY_ANDROID_PROD=
CODEPUSH_KEY_ANDROID_STAGING=
```

---

## STEP 8 — CI/CD

`.github/workflows/mobile.yml`:
```yaml
name: Mobile CI
on: [push]
jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: cd apps/mobile && npx react-native build-ios --mode Release
      - name: CodePush (main branch only)
        if: github.ref == 'refs/heads/main'
        run: appcenter codepush release-react -a {org}/ownspce-ios -d Production
```

`.github/workflows/web.yml`:
```yaml
name: Web CI
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install && pnpm build
      - run: pnpm --filter api deploy  # Cloudflare Workers
      - run: pnpm --filter web deploy  # Vercel or CF Pages
```

---

## STEP 9 — Build Order Checklist for Claude Code

Run these in exact order. Each block must be working before proceeding.

```
[x] 1.  Monorepo scaffold (Turborepo + pnpm workspaces)
[x] 2.  packages/db — Drizzle schema + NeonDB migration
[x] 3.  packages/core — types, constants
[x] 4.  apps/web — Next.js init + API routes (auth, pages)
[x] 5.  apps/mobile — RN CLI init + all deps installed + pod install
[x] 6.  apps/mobile — Theme (Restyle) + fonts
[x] 7.  apps/mobile — Navigation setup (RootNavigator, AuthStack, AppStack)
[x] 8.  apps/mobile — Shared components (Button, Input, Card, FAB, EmptyState)
[x] 9.  apps/mobile — Auth screens (Signup, Login)
[x] 10. apps/mobile — Dashboard screen
[x] 11. apps/mobile — Pages list + PageTypePicker
[x] 12. apps/mobile — Scratch editor
[x] 13. apps/mobile — Todo editor
[x] 14. apps/mobile — Right Now editor
[x] 15. apps/mobile — Kanban editor
[x] 16. apps/mobile — Profile screen
[x] 17. apps/mobile — useAutoSave hook wired to all editors
[x] 18. apps/web — Auth pages (Signup, Login)
[x] 19. apps/web — App layout (sidebar)
[x] 20. apps/web — Dashboard, Pages list
[x] 21. apps/web — All editors (Tiptap-based: Scratch, Todo, RightNow, Kanban)
[ ] 22. apps/mobile — Story editor + export
[ ] 23. apps/mobile — Google Drive OAuth + read/write integration
[ ] 24. apps/mobile — CodePush init + deployment keys
[ ] 25. apps/web — Keyboard shortcuts + Command palette
[ ] 26. CI/CD — GitHub Actions for mobile (CodePush) + web (Vercel)
[ ] 27. Final — App Store + Play Store submission prep (icons, splash, metadata)
```

---

## NOTES FOR CLAUDE CODE

- Always import shared types from `@ownspce/core`, never duplicate types.
- Every editor MUST use `useAutoSave` hook. Do not implement save differently per editor.
- Drive file content is always valid JSON. Never write raw strings.
- MMKV is the only local storage on mobile. No AsyncStorage.
- API routes live in `apps/web/app/api/` (Next.js API routes). Mobile calls them via Bearer JWT. Web uses NextAuth session.
- All API routes are protected by auth except signup/login.
- Theme is stored in DB and synced on login. MMKV is only cache.
- `updated_at` on pages table must be updated on every save. This is the sync conflict resolver.
- Do not use Expo. Do not use Expo modules. Pure bare RN CLI only.
- No separate desktop app. The web version serves desktop users.
- iCloud integration is Phase 2. Build Google Drive first. Abstract behind a `StorageProvider` interface so swapping is easy.
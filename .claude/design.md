# ownspce — Design System & Implementation Guide
> This file is the single source of truth for all design decisions in ownspce.
> Claude Code must reference this before writing any UI component.

---

## 1. Philosophy

**One rule above all:** Information is the UI. No decorative noise.

- Black and white dominant. Color only carries meaning (success, danger, warning).
- Every element earns its place. If it doesn't help the user, remove it.
- Calm under heavy use. Reference: claude.ai. Not Notion. Not Linear.
- Mobile-first. Every decision is made for a 375px screen first.

---

## 2. Typography

### Fonts (must be loaded before first render)

```ts
// All three must be present. No fallbacks to system fonts.
'InstrumentSerif-Regular'   // Display, page titles, landing hero
'InstrumentSerif-Italic'    // Emphasis, taglines, story titles
'DMSans-Light'              // Weight 300 — subtitles, secondary labels
'DMSans-Regular'            // Weight 400 — body, labels
'DMSans-Medium'             // Weight 500 — buttons, headings
'FiraCode-Regular'          // Code blocks only
```

### Usage rules

| Context | Font | Size | Weight | Color |
|---|---|---|---|---|
| App name / hero | Instrument Serif Italic | 44px | — | t1 |
| Page title (editor) | Instrument Serif Regular | 28–32px | — | t1 |
| Section heading | DM Sans | 18px | 500 | t1 |
| Body text | DM Sans | 15px | 400 | t1 |
| Secondary label | DM Sans | 13px | 400 | t2 |
| Caption / meta | DM Sans | 12px | 300 | t3 |
| Tiny label / tag | DM Sans | 11px | 400 | t3 |
| Pill / badge text | DM Sans | 10px | 500 | varies |
| Code | Fira Code | 13px | 400 | t1 |
| Web section heading | Instrument Serif Regular | 36px | — | t1 |
| Web subtitle | DM Sans | 13–15px | 400 | t2 |

**Web note:** Instrument Serif renders thin on screen below 36px. Use 36px minimum for section headings on web landing pages.

**Never use** Inter, Roboto, SF Pro, or system fonts anywhere in the UI.

---

## 3. Color Tokens

### Restyle theme — `packages/ui/src/theme.ts`

```ts
import { createTheme } from '@shopify/restyle';

const palette = {
  // Backgrounds
  black:   '#0A0A0A',
  surface: '#141414',
  elev:    '#1E1E1E',

  // Text
  white:   '#F5F5F5',
  muted:   '#888888',
  faint:   '#444444',

  // Border
  border:  '#2A2A2A',
  borderMid: '#3A3A3A',

  // Semantic
  green:   '#22C55E',
  red:     '#EF4444',
  yellow:  '#EAB308',

  // Transparent
  none: 'transparent',
} as const;

export const theme = createTheme({
  colors: {
    // Surfaces
    mainBackground:    palette.black,    // screen bg
    cardBackground:    palette.surface,  // cards, sheets
    elevatedBackground: palette.elev,    // inputs, elevated cards

    // Text
    primaryText:  palette.white,
    secondaryText: palette.muted,
    tertiaryText: palette.faint,

    // Border
    border:       palette.border,
    borderStrong: palette.borderMid,

    // Accent
    accent:   palette.white,

    // Semantic
    success:  palette.green,
    danger:   palette.red,
    warning:  palette.yellow,

    // Transparent
    none: palette.none,
  },

  spacing: {
    xs:  4,
    s:   8,
    m:   12,
    l:   16,
    xl:  24,
    xxl: 32,
    xxxl: 48,
  },

  borderRadii: {
    xs:   4,   // input underlines
    s:    8,   // tags, badges
    m:    12,  // buttons, cards
    l:    16,  // bottom sheets
    xl:   24,  // large cards
    full: 999, // pills
  },

  textVariants: {
    hero: {
      fontFamily: 'InstrumentSerif-Italic',
      fontSize: 44,
      color: 'primaryText',
      lineHeight: 48,
      letterSpacing: -1,
    },
    pageTitle: {
      fontFamily: 'InstrumentSerif-Regular',
      fontSize: 30,
      color: 'primaryText',
      lineHeight: 36,
    },
    sectionHead: {
      fontFamily: 'DMSans-Medium',
      fontSize: 18,
      color: 'primaryText',
    },
    body: {
      fontFamily: 'DMSans-Regular',
      fontSize: 15,
      color: 'primaryText',
      lineHeight: 24,
    },
    label: {
      fontFamily: 'DMSans-Regular',
      fontSize: 13,
      color: 'secondaryText',
    },
    caption: {
      fontFamily: 'DMSans-Light',
      fontSize: 12,
      color: 'tertiaryText',
    },
    tiny: {
      fontFamily: 'DMSans-Regular',
      fontSize: 11,
      color: 'tertiaryText',
      letterSpacing: 0.5,
    },
    code: {
      fontFamily: 'FiraCode-Regular',
      fontSize: 13,
      color: 'primaryText',
    },
    defaults: {
      fontFamily: 'DMSans-Regular',
      color: 'primaryText',
    },
  },

  breakpoints: {},
});

export type Theme = typeof theme;
```

---

## 4. Spacing System

**Use only these values. Never arbitrary numbers.**

```
xs  =  4px   → icon padding, tiny gaps
s   =  8px   → between related elements
m   = 12px   → internal card padding
l   = 16px   → screen horizontal padding (always 16px left/right)
xl  = 24px   → between sections
xxl = 32px   → large section gaps
xxxl = 48px  → hero spacing
```

**Screen horizontal padding is always 16px.** No exceptions.

---

## 5. Border Radius

```
xs  =   4px  → inputs, small tags
s   =   8px  → icon buttons, small cards
m   =  12px  → buttons, regular cards
l   =  16px  → bottom sheets (top corners only)
xl  =  24px  → large sheets, modals
full = 999px → pills, avatars, dots
```

---

## 6. Motion

**One curve. One speed.** No exceptions.

```ts
// All transitions
duration: 150ms
easing: 'ease-out'

// Bottom sheets
duration: 280ms
easing: 'ease-out'

// Page transitions
type: 'fade' + slight upward translate (8px)
duration: 200ms
```

Never use spring physics for UI transitions. Only for drag-and-drop.

---

## 7. Component Specs

### 7.1 Button

```ts
// Variants
type ButtonVariant = 'solid' | 'ghost' | 'danger'

// Solid (primary CTA)
background: white (#F5F5F5)
color: black (#0A0A0A)
borderRadius: 'm' (12px)
paddingVertical: 15
paddingHorizontal: 20
fontSize: 15, weight: 500

// Ghost (secondary)
background: transparent
border: 0.5px solid border (#2A2A2A)
color: primaryText
same sizing as solid

// Danger
background: transparent
border: 0.5px solid red
color: red
same sizing

// States
pressed: opacity 0.8
disabled: opacity 0.35
```

### 7.2 Input

```ts
// Borderless style (used in all editors)
background: transparent
borderBottom: 0.5px solid border
borderBottomColor on focus: '#555'
color: primaryText
fontSize: 15
paddingVertical: 12
fontFamily: 'DMSans-Regular'

// Filled style (used in sheets, auth)
background: elevatedBackground
borderRadius: 'm'
padding: 14 16
color: primaryText
fontSize: 14
border: none
```

### 7.3 Card

```ts
background: cardBackground     // #141414
border: '0.5px solid border'  // #2A2A2A
borderRadius: 'm'              // 12px
padding: 'l'                   // 16px

// Elevated card (for profile items, list rows)
background: elevatedBackground // #1E1E1E
same border and radius
paddingVertical: 13
paddingHorizontal: 16
```

### 7.4 FAB (Floating Action Button)

```ts
width: 52
height: 52
borderRadius: 16
background: white (#F5F5F5)
color: black (#0A0A0A)
fontSize: 24
position: absolute
bottom: 32
right: 24
// Shadow
shadowColor: '#000'
shadowOffset: {width: 0, height: 8}
shadowOpacity: 0.4
shadowRadius: 16
elevation: 8  // Android
```

### 7.5 Bottom Sheet

```ts
// Container
background: cardBackground
borderTopLeftRadius: 24
borderTopRightRadius: 24
paddingHorizontal: 24
paddingTop: 20
paddingBottom: 40  // + safe area

// Handle
width: 36
height: 4
borderRadius: full
background: border
marginBottom: 20
alignSelf: center

// Title in sheet
fontFamily: 'InstrumentSerif-Italic'
fontSize: 22
color: primaryText
marginBottom: 4

// Subtitle in sheet
fontSize: 13
color: tertiaryText
marginBottom: 22
```

### 7.6 Top Bar

```ts
// Every screen
height: 44
paddingTop: 52  // below status bar (safe area)
paddingHorizontal: 20
display: flex, row, space-between, center

// Icon button
width: 36
height: 36
borderRadius: 10
background: transparent (default)
background on press: elevatedBackground
color: secondaryText
```

### 7.7 List Row (Todo / Settings / Profile items)

```ts
display: flex, row, align center
paddingVertical: 13
paddingHorizontal: 16
borderBottom: '0.5px solid #1A1A1A'
background: cardBackground

// Left icon
width: 32, height: 32
borderRadius: 8
background: elevatedBackground
justifyContent: center, alignItems: center

// Title
fontSize: 14
color: primaryText
flex: 1, marginLeft: 12

// Right element (chevron, toggle, badge)
color: tertiaryText
fontSize: 12
```

### 7.8 Tag / Pill

```ts
// Standard tag
fontSize: 11
paddingVertical: 3
paddingHorizontal: 10
borderRadius: full (999)
background: elevatedBackground
color: tertiaryText

// Semantic tag
// Success
background: rgba(34, 197, 94, 0.1)
color: success (#22C55E)

// Danger
background: rgba(239, 68, 68, 0.1)
color: danger (#EF4444)

// Warning
background: rgba(234, 179, 8, 0.1)
color: warning (#EAB308)
```

### 7.9 Toggle

```ts
width: 44
height: 24
borderRadius: full
background off: elevatedBackground
background on: success (#22C55E)
transition: 200ms ease-out

// Knob
width: 20, height: 20
borderRadius: full
background: white
position absolute
top: 2
left off: 2
left on: 22
```

### 7.10 Avatar (initials-based)

```ts
width: 72    // profile page
width: 28    // top bar
borderRadius: depends on context (12 for profile, 8 for top bar)
background: elevatedBackground
border: '0.5px solid border'
fontFamily: 'InstrumentSerif-Italic'
fontSize: proportional
color: primaryText
```

### 7.11 Empty State

```ts
// Always centered, always has an action
flex: 1
justifyContent: center
alignItems: center
padding: xxl (32)

// Icon
fontSize: 40 (emoji) or 48x48 SVG
marginBottom: 16
opacity: 0.4

// Title
fontSize: 17, weight: 500
color: primaryText
marginBottom: 8
textAlign: center

// Subtitle
fontSize: 14
color: secondaryText
textAlign: center
lineHeight: 22
marginBottom: 24

// CTA
use Button 'ghost' variant
```

---

## 8. Navigation

### Stack Config

```ts
// All navigators use this base config
screenOptions: {
  headerShown: false,
  contentStyle: { backgroundColor: '#0A0A0A' },
  animation: 'fade',  // or 'slide_from_right' for drill-down
  animationDuration: 200,
}
```

### Tab Bar

```ts
// NOT a standard tab bar — ownspce uses:
// Top bar with hamburger (left) + profile (right)
// No bottom tab bar on main screens

// The FAB (+) is the primary navigation for creating pages
// Hamburger opens the page hierarchy drawer
```

### Drawer (Page Hierarchy)

```ts
// Slides from left
width: 300
background: cardBackground
// Header
paddingTop: 56
paddingHorizontal: 20
paddingBottom: 16
borderBottom: '0.5px solid border'

// Logo in drawer
fontFamily: 'InstrumentSerif-Italic'
fontSize: 22

// Drawer item
paddingVertical: 9
paddingHorizontal: 20
fontSize: 13
color: primaryText

// Indent for subpages
paddingLeft: 54  // creates visual hierarchy
```

---

## 9. Screen-by-Screen Specs

### 9.1 Landing

```
Layout: flex column, space-between
Background: mainBackground

Top section (flex: 1, padding: 80 28 0):
  Logo image: 64x64, borderRadius 16, marginBottom 24
  "Ownspce" — hero variant (Instrument Serif Italic, 44px)
  "Own your space." — DM Sans Light, 17px, color t2, marginBottom 16
  Tagline text — 13px, t3, lineHeight 1.7, maxWidth 290

Bottom section (padding: 0 28 48):
  "Designed for the way you think" pill — inline flex, elevated bg
  Feature row 1: 42x42 icon tile + title (13px 500) + subtitle (12px t3)
  Feature row 2: same
  [Get Started — It's free] solid button
  "No credit card required." — 12px t3, centered, marginTop 12
```

### 9.2 Sign In Sheet (opens on CTA tap)

```
Sheet with handle
"Welcome." — Instrument Serif Italic, 22px
"Sign in to start your space." — 13px t3

[Sign in with Apple] — solid white button, Apple SVG logo
[Sign in with Google] — ghost dark button, coloured Google G
Divider — "or continue with email"
Email input (filled style)
Password input (filled style)
[Continue] — solid button
```

### 9.3 Home Screen

```
Top bar: hamburger (left) | "ownspce" italic t2 | avatar R (right)
Content area (scroll):
  Date: "Tuesday, March 31" — tiny, t3, letterSpacing
  Greeting: "Good morning,\nRahul." — pageTitle variant, Instrument Serif
  
  "📌 Pinned" section label — tiny uppercase t3
  Page link rows (tappable, border, chevron right)
  
  "📄 Recent Pages" section label
  Page link rows (icon | title + meta | chevron)

FAB: + at bottom right
```

### 9.4 Scratch Editor

```
Top bar: ‹ back | ··· actions
Title input: Instrument Serif, 30px, borderless
Body textarea: DM Sans, 15px, t2, lineHeight 1.8, borderless
Toolbar: horizontal scroll, tool buttons (B I H1 H2 • 1. ⌞ /)
Footer: "148 words · Saved locally ●" — 11px t3
```

### 9.5 Right Now

```
Top bar + page title "Right Now" (pageTitle) + subtitle "3 on approach"
ATC label: "— APPROACH CLEARED —" centered tiny t3

Sections: Now (red) | Next (yellow) | Backlog (t3)
Each section:
  Header: colored dot + uppercase label + count (right)
  Tasks: checkbox + title + ETA + priority dot
  "+ Add" row

FAB: +
```

### 9.6 Todo

```
Top bar + "Groceries" title + tag pills
Task list:
  Circular checkbox (done = green fill + ✓)
  Task text + tag pill + chevron (opens subpage)
  Done section: strikethrough text
Quick-add bar (bottom): + icon + input + send button
```

### 9.7 Story

```
Top bar: ‹ back | Share | ···
"Personal · Essay" — tiny t3
Title: Instrument Serif, 24px, borderless input
Subtitle: 15px t3, borderless input
Meta bar: avatar + byline + date + "● Saved" green
Body: 15px #C0C0C0, lineHeight 1.85
Stats footer: word count | read time | streak
```

### 9.8 Kanban

```
Top bar + "Product Roadmap" title
Horizontal scroll of columns:
  Column header: uppercase label + count badge
  Cards: label pill + title + meta (date)
  "+ Add card" row
Column min-width: 220px, gap: 12px
```

### 9.9 Expense

```
Top bar + "March Expenses" title
Summary card:
  "Total spent" t3 label
  ₹18,420 — Instrument Serif 32px
  Month subtitle
  Category bar (colored segments)
  Legend (dot + label + amount)

Expense list: icon tile + name + category + amount (right)
Quick-add bar: description input + amount input + send
```

### 9.10 Profile

```
Top bar + "Edit" right button
Avatar: 72x72, borderRadius 22, Instrument Serif italic initial
Name: 18px 500 | Handle: 13px t3

Streak card: label + "14 days 🔥" + 7-day dot grid
  Done days: rgba(34,197,94,0.1) bg + green text
  
Section groups (grouped list rows):
  Account: Username | Theme toggle | Notifications toggle
  Sync (Premium badge): ownspce Sync | Google Drive | iCloud
  After completion: opens completion sheet
  Data: Export | Delete account (red)
```

### 9.11 Subpage (Infinite task drill-down)

```
Breadcrumb: Home › Right Now › Task name (tappable trail)
Page title: Instrument Serif Italic, 24px
Status pills: priority | due date | estimate

Subtasks section:
  Each subtask: checkbox + title + notes + › (drill into next level)
  Completed: green checkbox + strikethrough
  "+ Add subtask" quick input at bottom

Notes section: divider + "Notes" label + body text
```

---

## 10. Interaction Patterns

### Swipe actions (Todo + Right Now tasks)
```
Swipe left → red background → trash icon → delete
Swipe right → green background → checkmark → complete
Use react-native-gesture-handler + Reanimated
Threshold: 80px to trigger action
```

### Long press (Page list + Kanban cards)
```
Long press (400ms) → haptic feedback → context menu
Options: Pin / Rename / Move / Delete
Use ActionSheet (not modal) on both iOS and Android
```

### Drag and drop (Kanban + Right Now)
```
Library: react-native-draggable-flatlist
Drag handle: visible only on long press (don't show by default)
Placeholder: dashed border, same height as dragged card
Drop feedback: haptic (light impact)
```

### Pull to refresh
```
All list screens support pull-to-refresh
Syncs from Drive/iCloud on release
Custom indicator: single dot pulsing, no spinner
```

### Quick capture (global)
```
Available from: any screen via shake gesture
Shake threshold: 2.0 (react-native-shake)
Opens: bottom sheet with text input + send
AI routes to correct page silently
Timeout: 30s auto-dismiss if no input
```

---

## 11. Status Indicators

**Always visible. Never hidden.**

```ts
// Sync status dot — bottom of editor screens
● green  = "Saved"          (synced to Drive)
● yellow = "Saved locally"  (offline, will sync)
● gray   = "Saving..."      (in progress)

// Always show at bottom of every editor
fontSize: 11px, t3, textAlign: center
```

---

## 12. Icon System

**No icon library.** All icons are custom SVG, inline in components.

Standard sizes:
```
16px — inline text icons, tab icons
18px — top bar actions
20px — feature illustrations in cards
24px — FAB icon
28px — empty state
```

All icons use `currentColor` or explicit `fill="#888"` (muted). Never black. Never white directly — use the token.

---

## 13. Priority Dots (Right Now)

```
🔴 Red    = Urgent / Now    → #EF4444
🟡 Yellow = Next            → #EAB308
⚫ Gray   = Backlog/Parked  → #444444

Size: 7x7px, borderRadius: full
Always right-aligned in task row
```

---

## 14. File Structure (UI)

```
packages/ui/src/
├── theme.ts              ← All tokens. Single source of truth.
├── components/
│   ├── Box.tsx           ← Restyle Box
│   ├── Text.tsx          ← Restyle Text
│   ├── Button.tsx        ← solid | ghost | danger
│   ├── Input.tsx         ← borderless | filled
│   ├── Card.tsx          ← standard | elevated
│   ├── PageCard.tsx      ← page link row
│   ├── TaskCard.tsx      ← Right Now task
│   ├── ChecklistItem.tsx ← Todo item with swipe
│   ├── FAB.tsx
│   ├── BottomSheet.tsx
│   ├── EmptyState.tsx
│   ├── Avatar.tsx
│   ├── Toggle.tsx
│   ├── Tag.tsx
│   ├── SyncIndicator.tsx
│   └── TopBar.tsx
└── index.ts              ← re-exports everything
```

---

## 15. Do Not Rules

These are hard stops. Claude Code must never do these.

```
✗ Never use system fonts (Inter, Roboto, SF Pro, Arial)
✗ Never hardcode colors — always use theme tokens
✗ Never use arbitrary spacing values — only the spacing scale
✗ Never use TabBar — navigation is Drawer + FAB
✗ Never show empty states without an action button
✗ Never use gradients or shadows except the FAB shadow
✗ Never use more than 2 font families on one screen
✗ Never put content behind the notch — always respect safe area
✗ Never use red for anything except danger/delete actions
✗ Never use modal stack for confirmation — always use ActionSheet
✗ Never hide the sync indicator — always show save status in editors
✗ Never use border-radius larger than 24px except pills (999px)
```

---

## 16. Accessibility

```
Minimum tap target: 44x44px (iOS HIG standard)
Text contrast: all text must pass WCAG AA on dark backgrounds
Focus states: 2px white outline for keyboard/switch navigation
Haptic feedback: light impact on all confirmations
VoiceOver labels: all icon buttons must have accessibilityLabel
```

---

## 17. Theme File Location

```
packages/ui/src/theme.ts    ← Master token file
apps/mobile/src/App.tsx     ← ThemeProvider wraps entire app
```

Import pattern in every component:
```ts
import { useTheme } from '@shopify/restyle';
import { Theme } from '@ownspce/ui';

const theme = useTheme<Theme>();
// then use theme.colors.primaryText etc.
```

---

*ownspce design system v1.0 — build exactly this, deviate nowhere*
import { Platform } from 'react-native';

// ─── Colors ──────────────────────────────────────────────────────────────────
export const colors = {
  background: '#F5F5F0',
  surface: '#FFFFFF',
  surfaceElevated: '#FAFAF8',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9CA3AF',
  border: '#E5E5E0',
  borderStrong: '#D1D1CC',
  accent: '#CC785C',
  accentLight: '#F5EDE8',
  success: '#059669',
  error: '#DC2626',
  warning: '#D97706',
  hover: '#FAFAF8',
  overlay: 'rgba(0,0,0,0.4)',
  // Block type indicators
  todoChecked: '#059669',
  kanbanTodo: '#6B7280',
  kanbanInProgress: '#CC785C',
  kanbanDone: '#059669',
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
const fontFamily = Platform.select({
  ios: 'System',
  android: 'System',
  default: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
});

const monoFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: '"SF Mono", "Fira Code", "Courier New", monospace',
});

export const typography = {
  fontFamily,
  monoFamily,
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 26 },
  bodyLarge: { fontSize: 18, fontWeight: '400' as const, lineHeight: 28 }, // story
  small: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  label: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  mono: { fontSize: 14, lineHeight: 22 },
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// ─── Border radius ────────────────────────────────────────────────────────────
export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const shadows = {
  subtle: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
    },
    android: { elevation: 1 },
    default: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  }),
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  }),
  modal: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
    },
    android: { elevation: 8 },
    default: { boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
  }),
} as const;

// ─── Animation ────────────────────────────────────────────────────────────────
export const timing = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

export const spring = {
  damping: 15,
  stiffness: 150,
  mass: 1,
} as const;

// ─── Layout ───────────────────────────────────────────────────────────────────
export const layout = {
  maxContentWidth: 680,
  tabStripHeight: 48,
  headerHeight: 56,
  blockIndent: 24,
} as const;

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
  accent: '#FF6B4A',
  transparent: 'transparent',
  blue100: '#DBEAFE',
  blue700: '#1D4ED8',
  orange100: '#FFEDD5',
  orange700: '#C2410C',
  green100: '#DCFCE7',
  green700: '#15803D',
  purple100: '#F3E8FF',
  purple700: '#7C3AED',
};

const theme = createTheme({
  colors: {
    mainBackground: palette.black,
    cardBackground: palette.surface,
    elevatedBackground: palette.elevated,
    primaryText: palette.white,
    mutedText: palette.muted,
    border: palette.border,
    accent: palette.accent,
    success: palette.success,
    danger: palette.danger,
    white: palette.white,
    black: palette.black,
    transparent: palette.transparent,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadii: {
    s: 4,
    m: 8,
    l: 16,
    xl: 24,
    full: 999,
  },
  textVariants: {
    header: {
      fontSize: 24,
      fontWeight: '700',
      color: 'primaryText',
    },
    subheader: {
      fontSize: 18,
      fontWeight: '600',
      color: 'primaryText',
    },
    body: {
      fontSize: 15,
      color: 'primaryText',
    },
    caption: {
      fontSize: 12,
      color: 'mutedText',
    },
    defaults: {
      fontSize: 15,
      color: 'primaryText',
    },
  },
});

export type Theme = typeof theme;
export default theme;

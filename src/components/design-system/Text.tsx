import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { colors, typography } from './tokens';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'bodyLarge' | 'small' | 'caption' | 'label' | 'mono';
type Color = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'error' | 'success';

interface Props extends TextProps {
  variant?: Variant;
  color?: Color;
  weight?: TextStyle['fontWeight'];
}

const colorMap: Record<Color, string> = {
  primary: colors.textPrimary,
  secondary: colors.textSecondary,
  tertiary: colors.textTertiary,
  accent: colors.accent,
  error: colors.error,
  success: colors.success,
};

export function Text({ variant = 'body', color = 'primary', weight, style, ...props }: Props) {
  const base = typography[variant];
  return (
    <RNText
      style={[
        {
          ...base,
          fontFamily: variant === 'mono' ? typography.monoFamily : typography.fontFamily,
          color: colorMap[color],
          ...(weight ? { fontWeight: weight } : {}),
        },
        style,
      ]}
      {...props}
    />
  );
}

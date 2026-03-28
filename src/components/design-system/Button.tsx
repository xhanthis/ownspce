import React from 'react';
import { ViewStyle, StyleProp, ActivityIndicator } from 'react-native';
import { AnimatedPressable } from './AnimatedPressable';
import { Text } from './Text';
import { colors, spacing, radius, typography } from './tokens';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

const variantStyles: Record<Variant, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.accent, text: '#FFFFFF' },
  secondary: { bg: colors.surface, text: colors.textPrimary, border: colors.border },
  ghost: { bg: 'transparent', text: colors.textPrimary },
  danger: { bg: '#FEE2E2', text: colors.error },
};

const sizeStyles: Record<Size, { paddingH: number; paddingV: number; fontSize: number }> = {
  sm: { paddingH: spacing.md, paddingV: spacing.sm, fontSize: 13 },
  md: { paddingH: spacing.lg, paddingV: spacing.md, fontSize: 15 },
  lg: { paddingH: spacing.xl, paddingV: spacing.lg, fontSize: 16 },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  icon,
}: Props) {
  const vs = variantStyles[variant];
  const ss = sizeStyles[size];

  return (
    <AnimatedPressable
      haptic
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          backgroundColor: vs.bg,
          paddingHorizontal: ss.paddingH,
          paddingVertical: ss.paddingV,
          borderRadius: radius.md,
          opacity: disabled ? 0.5 : 1,
          ...(vs.border ? { borderWidth: 1, borderColor: vs.border } : {}),
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={vs.text} />
      ) : (
        <>
          {icon}
          <Text
            variant={size === 'sm' ? 'small' : 'body'}
            style={{ color: vs.text, fontWeight: '500', fontSize: ss.fontSize }}
          >
            {label}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}

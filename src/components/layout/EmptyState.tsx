import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from '../design-system/Text';
import { Button } from '../design-system/Button';
import { colors, spacing } from '../design-system/tokens';

interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
  style?: ViewStyle;
}

export function EmptyState({ icon, title, subtitle, action, style }: Props) {
  return (
    <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxxl }, style]}>
      {icon && (
        <Text variant="h1" style={{ marginBottom: spacing.lg, fontSize: 48 }}>
          {icon}
        </Text>
      )}
      <Text variant="h3" style={{ textAlign: 'center', marginBottom: spacing.sm }}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="body" color="secondary" style={{ textAlign: 'center', marginBottom: spacing.xl }}>
          {subtitle}
        </Text>
      )}
      {action && <Button label={action.label} onPress={action.onPress} />}
    </View>
  );
}

import React from 'react';
import { View } from 'react-native';
import { colors, spacing } from '../../../components/design-system/tokens';

export function DividerBlock() {
  return (
    <View style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.lg }}>
      <View style={{ height: 1, backgroundColor: colors.border }} />
    </View>
  );
}

import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../components/design-system/Text';
import { PrioritySection } from './PrioritySection';
import { colors, spacing } from '../../components/design-system/tokens';
import { useBlocks } from '../../hooks/useBlocks';
import { parseContent } from '../../utils/contentJson';
import { PriorityItemContent } from '../../types/block';
import Tab from '../../db/models/Tab';

interface Props {
  tab: Tab;
}

export function RightNowEditor({ tab }: Props) {
  const allBlocks = useBlocks(tab.id);

  const nowBlocks = allBlocks.filter(
    (b) => (parseContent<PriorityItemContent>(b.contentJson)).section === 'now',
  );
  const nextBlocks = allBlocks.filter(
    (b) => (parseContent<PriorityItemContent>(b.contentJson)).section === 'next',
  );
  const laterBlocks = allBlocks.filter(
    (b) => (parseContent<PriorityItemContent>(b.contentJson)).section === 'later',
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.xl, paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={{ marginBottom: spacing.xxl }}>
        <Text variant="h2" weight="700" style={{ marginBottom: spacing.xs }}>
          Right Now
        </Text>
        <Text variant="small" color="secondary">
          What are you working on today?
        </Text>
      </View>

      <PrioritySection section="now" blocks={nowBlocks} tabId={tab.id} />
      <PrioritySection section="next" blocks={nextBlocks} tabId={tab.id} />
      <PrioritySection section="later" blocks={laterBlocks} tabId={tab.id} />
    </ScrollView>
  );
}

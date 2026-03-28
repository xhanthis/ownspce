import React, { useRef, useCallback } from 'react';
import { View, TextInput, Pressable, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '../../components/design-system/Text';
import { AnimatedPressable } from '../../components/design-system/AnimatedPressable';
import { colors, spacing, radius, typography, spring, timing } from '../../components/design-system/tokens';
import { createBlock, updateBlockContent, deleteBlock } from '../../db/mutations';
import { PriorityItemContent } from '../../types/block';
import Block from '../../db/models/Block';
import { parseContent } from '../../utils/contentJson';

interface SectionConfig {
  label: string;
  sublabel: string;
  maxItems: number | null;
  accentColor: string;
}

const SECTION_CONFIG: Record<string, SectionConfig> = {
  now: { label: 'Now', sublabel: 'Focus on these', maxItems: 3, accentColor: colors.accent },
  next: { label: 'Next', sublabel: 'Up after now', maxItems: 5, accentColor: colors.textPrimary },
  later: { label: 'Later', sublabel: 'When ready', maxItems: null, accentColor: colors.textSecondary },
};

function PriorityItem({ block, onDelete }: { block: Block; onDelete: () => void }) {
  const content = parseContent<PriorityItemContent>(block.contentJson);
  const localText = useRef(content.text);
  const checkScale = useSharedValue(content.checked ? 1 : 0);
  const strikeWidth = useSharedValue(content.checked ? 1 : 0);
  const rowOpacity = useSharedValue(1);

  const checkStyle = useAnimatedStyle(() => ({ transform: [{ scale: checkScale.value }] }));
  const strikeStyle = useAnimatedStyle(() => ({ width: `${strikeWidth.value * 100}%` as any }));
  const rowStyle = useAnimatedStyle(() => ({ opacity: rowOpacity.value }));

  function toggleCheck() {
    const newChecked = !content.checked;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (newChecked) {
      checkScale.value = withSpring(1, spring);
      strikeWidth.value = withTiming(1, { duration: 200 });
      rowOpacity.value = withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(0.4, { duration: 300 }),
      );
    } else {
      checkScale.value = withSpring(0, spring);
      strikeWidth.value = withTiming(0, { duration: 200 });
      rowOpacity.value = withTiming(1, { duration: 200 });
    }
    updateBlockContent(block.id, { ...content, checked: newChecked });
  }

  return (
    <Animated.View style={[rowStyle, { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm }]}>
      <Pressable
        onPress={toggleCheck}
        style={{
          width: 22,
          height: 22,
          borderRadius: radius.full,
          borderWidth: 2,
          borderColor: content.checked ? colors.success : colors.border,
          backgroundColor: content.checked ? colors.success : 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.View style={checkStyle}>
          <Animated.Text style={{ color: '#fff', fontSize: 12 }}>✓</Animated.Text>
        </Animated.View>
      </Pressable>

      <View style={{ flex: 1 }}>
        <TextInput
          defaultValue={content.text}
          onChangeText={(v) => {
            localText.current = v;
            updateBlockContent(block.id, { ...content, text: v });
          }}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace' && localText.current === '') onDelete();
          }}
          placeholder="What needs doing..."
          placeholderTextColor={colors.textTertiary}
          style={{
            ...typography.body,
            color: content.checked ? colors.textSecondary : colors.textPrimary,
          }}
        />
        <Animated.View
          pointerEvents="none"
          style={[
            strikeStyle,
            { position: 'absolute', height: 1.5, top: 12, left: 0, backgroundColor: colors.textSecondary },
          ]}
        />
      </View>

      <Pressable onPress={onDelete} hitSlop={8}>
        <Text style={{ color: colors.textTertiary, fontSize: 18 }}>×</Text>
      </Pressable>
    </Animated.View>
  );
}

interface Props {
  section: 'now' | 'next' | 'later';
  blocks: Block[];
  tabId: string;
}

export function PrioritySection({ section, blocks, tabId }: Props) {
  const config = SECTION_CONFIG[section];
  const [inputText, setInputText] = React.useState('');
  const inputRef = useRef<TextInput>(null);

  async function handleAdd() {
    const text = inputText.trim();
    if (!text) return;
    if (config.maxItems !== null && blocks.length >= config.maxItems) {
      Alert.alert(
        `${config.label} is full`,
        `You can only have ${config.maxItems} items in "${config.label}". Move one to make room.`,
      );
      return;
    }
    const lastOrder = blocks.length > 0 ? blocks[blocks.length - 1].blockOrder : 0;
    await createBlock(tabId, 'priority_item', {
      text,
      checked: false,
      section,
    } as PriorityItemContent, lastOrder);
    setInputText('');
  }

  return (
    <View style={{ marginBottom: spacing.xl }}>
      {/* Section header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.sm }}>
        <View style={{ width: 3, height: 20, borderRadius: 2, backgroundColor: config.accentColor }} />
        <Text variant="label" weight="700" style={{ color: config.accentColor }}>
          {config.label}
        </Text>
        <Text variant="caption" color="secondary">{config.sublabel}</Text>
        {config.maxItems !== null && (
          <Text variant="caption" style={{ marginLeft: 'auto', color: blocks.length >= config.maxItems ? colors.error : colors.textTertiary }}>
            {blocks.length}/{config.maxItems}
          </Text>
        )}
      </View>

      {/* Items */}
      {blocks.map((block) => (
        <PriorityItem key={block.id} block={block} onDelete={() => deleteBlock(block.id)} />
      ))}

      {/* Add input */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm }}>
        <View style={{ width: 22, height: 22, borderRadius: radius.full, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' }} />
        <TextInput
          ref={inputRef}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          placeholder="Add item..."
          placeholderTextColor={colors.textTertiary}
          style={{ ...typography.body, color: colors.textPrimary, flex: 1 }}
        />
      </View>
    </View>
  );
}

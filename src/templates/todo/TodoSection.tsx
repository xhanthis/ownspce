import React, { useState, useRef } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Text } from '../../components/design-system/Text';
import { AnimatedPressable } from '../../components/design-system/AnimatedPressable';
import { TodoItem } from './TodoItem';
import { colors, spacing, radius, typography, timing } from '../../components/design-system/tokens';
import { createBlock, deleteBlock } from '../../db/mutations';
import { TaskItemContent } from '../../types/block';
import Block from '../../db/models/Block';
import { parseContent } from '../../utils/contentJson';

interface Props {
  sectionId: string;
  sectionTitle: string;
  blocks: Block[];
  tabId: string;
  completedCount: number;
  totalCount: number;
}

export function TodoSection({ sectionId, sectionTitle, blocks, tabId, completedCount, totalCount }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [inputText, setInputText] = useState('');
  const contentHeight = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    overflow: 'hidden',
    opacity: withTiming(contentHeight.value, { duration: timing.normal }),
    maxHeight: withTiming(contentHeight.value === 0 ? 0 : 9999, { duration: timing.normal }),
  }));

  function toggleCollapse() {
    contentHeight.value = collapsed ? 1 : 0;
    setCollapsed(!collapsed);
  }

  async function handleAddTask() {
    const text = inputText.trim();
    if (!text) return;
    const lastOrder = blocks.length > 0 ? blocks[blocks.length - 1].blockOrder : 0;
    await createBlock(tabId, 'task_item', {
      text,
      checked: false,
      sectionId,
      depth: 0,
    } as TaskItemContent, lastOrder);
    setInputText('');
  }

  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <View style={{ marginBottom: spacing.xl }}>
      {/* Section header */}
      <Pressable
        onPress={toggleCollapse}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.sm,
        }}
      >
        <Text
          style={{
            color: colors.textTertiary,
            fontSize: 12,
            transform: [{ rotate: collapsed ? '-90deg' : '0deg' }],
            width: 16,
          }}
        >
          ▾
        </Text>
        <Text variant="label" weight="600" style={{ flex: 1 }}>
          {sectionTitle}
        </Text>
        <Text variant="caption" color="secondary">
          {completedCount}/{totalCount}
        </Text>
      </Pressable>

      {/* Progress bar */}
      {totalCount > 0 && (
        <View style={{ paddingHorizontal: spacing.xl, marginBottom: spacing.sm }}>
          <View style={{ height: 3, backgroundColor: colors.border, borderRadius: 2 }}>
            <Animated.View
              style={{
                height: 3,
                borderRadius: 2,
                backgroundColor: progress === 1 ? colors.success : colors.accent,
                width: `${progress * 100}%`,
              }}
            />
          </View>
        </View>
      )}

      {/* Items */}
      <Animated.View style={animatedStyle}>
        {blocks.map((block) => (
          <TodoItem key={block.id} block={block} onDelete={() => deleteBlock(block.id)} />
        ))}

        {/* Add item */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.xs,
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: radius.xs,
              borderWidth: 2,
              borderColor: colors.border,
              borderStyle: 'dashed',
            }}
          />
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleAddTask}
            returnKeyType="done"
            placeholder="Add task..."
            placeholderTextColor={colors.textTertiary}
            style={{ ...typography.body, color: colors.textPrimary, flex: 1 }}
          />
        </View>
      </Animated.View>
    </View>
  );
}

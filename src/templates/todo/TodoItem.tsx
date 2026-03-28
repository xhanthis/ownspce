import React, { useRef } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '../../components/design-system/Text';
import { colors, typography, spacing, radius, spring } from '../../components/design-system/tokens';
import { updateBlockContent, deleteBlock } from '../../db/mutations';
import { TaskItemContent } from '../../types/block';
import Block from '../../db/models/Block';
import { parseContent } from '../../utils/contentJson';

interface Props {
  block: Block;
  onDelete: () => void;
}

export function TodoItem({ block, onDelete }: Props) {
  const content = parseContent<TaskItemContent>(block.contentJson);
  const localText = useRef(content.text);
  const depth = content.depth ?? 0;
  const checkScale = useSharedValue(content.checked ? 1 : 0);
  const strikeWidth = useSharedValue(content.checked ? 1 : 0);

  const checkStyle = useAnimatedStyle(() => ({ transform: [{ scale: checkScale.value }] }));
  const strikeStyle = useAnimatedStyle(() => ({ width: `${strikeWidth.value * 100}%` as any }));

  function toggleCheck() {
    const newChecked = !content.checked;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    checkScale.value = withSpring(newChecked ? 1 : 0, spring);
    strikeWidth.value = withTiming(newChecked ? 1 : 0, { duration: 200 });
    updateBlockContent(block.id, { ...content, checked: newChecked });
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
        paddingVertical: spacing.xs,
        paddingLeft: spacing.xl + depth * spacing.xl,
        paddingRight: spacing.xl,
      }}
    >
      <Pressable
        onPress={toggleCheck}
        style={{
          width: 20,
          height: 20,
          borderRadius: radius.xs,
          borderWidth: 2,
          borderColor: content.checked ? colors.todoChecked : colors.border,
          backgroundColor: content.checked ? colors.todoChecked : 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 3,
        }}
      >
        <Animated.View style={checkStyle}>
          <Animated.Text style={{ color: '#fff', fontSize: 12, lineHeight: 14 }}>✓</Animated.Text>
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
          placeholder="Task..."
          placeholderTextColor={colors.textTertiary}
          style={{
            ...typography.body,
            color: content.checked ? colors.textSecondary : colors.textPrimary,
            minHeight: 28,
          }}
        />
        <Animated.View
          pointerEvents="none"
          style={[
            strikeStyle,
            { position: 'absolute', height: 1.5, top: 13, left: 0, backgroundColor: colors.textSecondary },
          ]}
        />
      </View>

      <Pressable onPress={onDelete} hitSlop={8} style={{ marginTop: 4 }}>
        <Text style={{ color: colors.textTertiary, fontSize: 16 }}>×</Text>
      </Pressable>
    </View>
  );
}

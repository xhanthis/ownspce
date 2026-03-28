import React, { useRef, useCallback } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, spring } from '../../../components/design-system/tokens';
import { useDebounce } from '../../../hooks/useDebounce';
import { updateBlockContent } from '../../../db/mutations';
import { TodoContent } from '../../../types/block';

interface Props {
  blockId: string;
  content: TodoContent;
  onEnterPress: (blockId: string, blockOrder: number) => void;
  onBackspaceEmpty: (blockId: string) => void;
  onFocus: (blockId: string) => void;
  blockOrder: number;
}

export function TodoBlock({ blockId, content, onEnterPress, onBackspaceEmpty, onFocus, blockOrder }: Props) {
  const localText = useRef(content.text);
  const checkScale = useSharedValue(content.checked ? 1 : 0);
  const strikeWidth = useSharedValue(content.checked ? 1 : 0);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const strikeStyle = useAnimatedStyle(() => ({
    width: `${strikeWidth.value * 100}%` as any,
  }));

  function toggleCheck() {
    const newChecked = !content.checked;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    checkScale.value = withSpring(newChecked ? 1 : 0, spring);
    strikeWidth.value = withTiming(newChecked ? 1 : 0, { duration: 200 });
    updateBlockContent(blockId, { ...content, checked: newChecked });
  }

  const debouncedSave = useDebounce(
    useCallback(
      (text: string) => updateBlockContent(blockId, { ...content, text }),
      [blockId, content],
    ),
    500,
  );

  const depth = content.depth ?? 0;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xs,
        paddingLeft: spacing.xl + depth * spacing.xl,
      }}
    >
      {/* Checkbox */}
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
          marginRight: spacing.md,
        }}
      >
        <Animated.View style={checkStyle}>
          <Animated.Text style={{ color: '#fff', fontSize: 12, lineHeight: 14 }}>✓</Animated.Text>
        </Animated.View>
      </Pressable>

      {/* Text with strikethrough */}
      <View style={{ flex: 1 }}>
        <TextInput
          defaultValue={content.text}
          onChangeText={(v) => {
            localText.current = v;
            debouncedSave(v);
          }}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Enter') onEnterPress(blockId, blockOrder);
            else if (nativeEvent.key === 'Backspace' && localText.current === '') onBackspaceEmpty(blockId);
          }}
          onFocus={() => onFocus(blockId)}
          placeholder="Todo item"
          placeholderTextColor={colors.textTertiary}
          style={{
            ...typography.body,
            color: content.checked ? colors.textSecondary : colors.textPrimary,
            minHeight: 28,
          }}
        />
        {/* Animated strikethrough overlay */}
        <Animated.View
          pointerEvents="none"
          style={[
            strikeStyle,
            {
              position: 'absolute',
              height: 1.5,
              top: 13,
              left: 0,
              backgroundColor: colors.textSecondary,
            },
          ]}
        />
      </View>
    </View>
  );
}

import React, { useRef, useCallback } from 'react';
import { TextInput, View, TextStyle } from 'react-native';
import { colors, typography, spacing } from '../../../components/design-system/tokens';
import { useDebounce } from '../../../hooks/useDebounce';
import { updateBlockContent } from '../../../db/mutations';
import { TextContent, HeadingContent, QuoteContent, CodeContent, BlockType } from '../../../types/block';

interface Props {
  blockId: string;
  type: BlockType;
  content: TextContent | HeadingContent | QuoteContent | CodeContent;
  onEnterPress: (afterBlockId: string, afterOrder: number) => void;
  onBackspaceEmpty: (blockId: string) => void;
  onFocus: (blockId: string) => void;
  blockOrder: number;
}

function getTextStyle(type: BlockType): TextStyle {
  switch (type) {
    case 'heading':
      return { ...typography.h2, color: colors.textPrimary };
    case 'quote':
      return {
        ...typography.body,
        color: colors.textSecondary,
        fontStyle: 'italic',
        borderLeftWidth: 3,
        borderLeftColor: colors.accent,
        paddingLeft: spacing.md,
      };
    case 'code':
      return {
        ...typography.mono,
        fontFamily: typography.monoFamily,
        color: colors.textPrimary,
        backgroundColor: colors.surfaceElevated,
        padding: spacing.md,
        borderRadius: 6,
      };
    default:
      return { ...typography.body, color: colors.textPrimary };
  }
}

export function TextBlock({ blockId, type, content, onEnterPress, onBackspaceEmpty, onFocus, blockOrder }: Props) {
  const text = (content as TextContent).text ?? '';
  const localText = useRef(text);

  const saveContent = useCallback(
    async (value: string) => {
      const existing = content as any;
      await updateBlockContent(blockId, { ...existing, text: value });
    },
    [blockId, content],
  );

  const debouncedSave = useDebounce(saveContent, 500);

  function handleChangeText(value: string) {
    localText.current = value;

    // Markdown shortcuts at start of block
    if (value.startsWith('# ') && type !== 'heading') {
      updateBlockContent(blockId, { ...(content as any), text: value.slice(2) });
      return;
    }

    debouncedSave(value);
  }

  function handleKeyPress({ nativeEvent }: any) {
    if (nativeEvent.key === 'Enter') {
      onEnterPress(blockId, blockOrder);
    } else if (nativeEvent.key === 'Backspace' && localText.current === '') {
      onBackspaceEmpty(blockId);
    }
  }

  return (
    <View style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.xs }}>
      <TextInput
        multiline
        defaultValue={text}
        onChangeText={handleChangeText}
        onKeyPress={handleKeyPress}
        onFocus={() => onFocus(blockId)}
        placeholder={type === 'text' ? 'Write something...' : undefined}
        placeholderTextColor={colors.textTertiary}
        style={[getTextStyle(type), { minHeight: 28 }]}
        textAlignVertical="top"
      />
    </View>
  );
}

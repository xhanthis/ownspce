import React, { useRef, useCallback } from 'react';
import { View, TextInput, TextStyle } from 'react-native';
import { colors, typography, spacing } from '../../../components/design-system/tokens';
import { useDebounce } from '../../../hooks/useDebounce';
import { updateBlockContent } from '../../../db/mutations';
import { HeadingContent, HeadingLevel } from '../../../types/block';

interface Props {
  blockId: string;
  content: HeadingContent;
  onEnterPress: (blockId: string, blockOrder: number) => void;
  onBackspaceEmpty: (blockId: string) => void;
  onFocus: (blockId: string) => void;
  blockOrder: number;
}

const levelStyles: Record<HeadingLevel, TextStyle> = {
  1: { ...typography.h1, color: colors.textPrimary },
  2: { ...typography.h2, color: colors.textPrimary },
  3: { ...typography.h3, color: colors.textPrimary },
};

const placeholders: Record<HeadingLevel, string> = {
  1: 'Heading 1',
  2: 'Heading 2',
  3: 'Heading 3',
};

export function HeadingBlock({ blockId, content, onEnterPress, onBackspaceEmpty, onFocus, blockOrder }: Props) {
  const localText = useRef(content.text);
  const level = content.level ?? 1;

  const saveContent = useCallback(
    (text: string) => updateBlockContent(blockId, { ...content, text }),
    [blockId, content],
  );
  const debouncedSave = useDebounce(saveContent, 500);

  return (
    <View style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm }}>
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
        placeholder={placeholders[level]}
        placeholderTextColor={colors.textTertiary}
        style={[levelStyles[level], { minHeight: level === 1 ? 44 : 36 }]}
      />
    </View>
  );
}

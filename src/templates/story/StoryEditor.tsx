import React, { useState, useCallback } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Text } from '../../components/design-system/Text';
import { AddBlockMenu } from '../../components/editor/AddBlockMenu';
import { colors, spacing, typography, radius } from '../../components/design-system/tokens';
import { useBlocks } from '../../hooks/useBlocks';
import { createBlock, deleteBlock, updateBlockContent } from '../../db/mutations';
import { BlockType, TextContent, HeadingContent, QuoteContent, CodeContent, DividerContent } from '../../types/block';
import Block from '../../db/models/Block';
import Tab from '../../db/models/Tab';
import { parseContent } from '../../utils/contentJson';
import { useDebounce } from '../../hooks/useDebounce';

// Estimated read time: ~200 words/min
function estimateReadTime(blocks: Block[]): string {
  const totalWords = blocks.reduce((sum, block) => {
    const content = parseContent<any>(block.contentJson);
    const text = content.text ?? '';
    return sum + text.split(/\s+/).filter(Boolean).length;
  }, 0);
  const minutes = Math.max(1, Math.round(totalWords / 200));
  return `${minutes} min read`;
}

function StoryTextBlock({
  block,
  onEnterPress,
  onBackspaceEmpty,
  isLarge = false,
}: {
  block: Block;
  onEnterPress: (id: string, order: number) => void;
  onBackspaceEmpty: (id: string) => void;
  isLarge?: boolean;
}) {
  const content = parseContent<TextContent | HeadingContent | QuoteContent | CodeContent>(block.contentJson);
  const text = (content as TextContent).text ?? '';

  const save = useCallback(
    (value: string) => updateBlockContent(block.id, { ...content, text: value } as any),
    [block.id, content],
  );
  const debouncedSave = useDebounce(save, 500);

  const getStyle = () => {
    switch (block.type) {
      case 'heading': {
        const level = (content as HeadingContent).level ?? 1;
        return level === 1
          ? { ...typography.h1, color: colors.textPrimary }
          : level === 2
          ? { ...typography.h2, color: colors.textPrimary }
          : { ...typography.h3, color: colors.textPrimary };
      }
      case 'quote':
        return {
          ...typography.bodyLarge,
          color: colors.textSecondary,
          fontStyle: 'italic' as const,
          borderLeftWidth: 3,
          borderLeftColor: colors.accent,
          paddingLeft: spacing.lg,
        };
      case 'code':
        return {
          ...typography.mono,
          fontFamily: typography.monoFamily,
          backgroundColor: colors.surfaceElevated,
          padding: spacing.md,
          borderRadius: radius.sm,
        };
      default:
        return isLarge
          ? { ...typography.bodyLarge, color: colors.textPrimary }
          : { ...typography.body, color: colors.textPrimary };
    }
  };

  if (block.type === 'divider') {
    return (
      <View style={{ paddingVertical: spacing.xl }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xl }}>
          {['·', '·', '·'].map((dot, i) => (
            <Text key={i} style={{ color: colors.textTertiary, fontSize: 20 }}>{dot}</Text>
          ))}
        </View>
      </View>
    );
  }

  return (
    <TextInput
      defaultValue={text}
      multiline
      onChangeText={(v) => debouncedSave(v)}
      onKeyPress={({ nativeEvent }) => {
        if (nativeEvent.key === 'Enter') onEnterPress(block.id, block.blockOrder);
        else if (nativeEvent.key === 'Backspace' && text === '') onBackspaceEmpty(block.id);
      }}
      placeholder={block.type === 'text' ? (isLarge ? 'Start your story...' : 'Continue writing...') : undefined}
      placeholderTextColor={colors.textTertiary}
      style={[getStyle(), { minHeight: isLarge ? 32 : 28 }]}
      textAlignVertical="top"
    />
  );
}

interface Props {
  tab: Tab;
}

export function StoryEditor({ tab }: Props) {
  const blocks = useBlocks(tab.id);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleEnterPress = useCallback(
    async (afterBlockId: string, afterOrder: number) => {
      await createBlock(tab.id, 'text', { text: '' }, afterOrder);
    },
    [tab.id],
  );

  const handleAddBlock = useCallback(
    async (type: BlockType) => {
      const lastOrder = blocks.length > 0 ? blocks[blocks.length - 1].blockOrder : 0;
      const defaultContent: Record<BlockType, any> = {
        text: { text: '' },
        heading: { text: '', level: 2 },
        todo: { text: '', checked: false },
        bullet: { text: '' },
        numbered: { text: '' },
        divider: {},
        quote: { text: '' },
        code: { text: '' },
        priority_item: { text: '', checked: false, section: 'now' },
        task_item: { text: '', checked: false, sectionId: '' },
        kanban_card: { title: '', columnId: '' },
      };
      await createBlock(tab.id, type, defaultContent[type], lastOrder);
    },
    [tab.id, blocks],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        contentContainerStyle={{
          maxWidth: 720,
          alignSelf: 'center',
          width: '100%',
          paddingHorizontal: spacing.xxl,
          paddingTop: spacing.xxl,
          paddingBottom: 120,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Read time */}
        {blocks.length > 0 && (
          <Text variant="caption" color="secondary" style={{ marginBottom: spacing.xl }}>
            {estimateReadTime(blocks)}
          </Text>
        )}

        {/* Blocks */}
        {blocks.map((block, index) => (
          <View key={block.id} style={{ marginBottom: spacing.md }}>
            <StoryTextBlock
              block={block}
              onEnterPress={handleEnterPress}
              onBackspaceEmpty={(id) => deleteBlock(id)}
              isLarge={index === 0}
            />
          </View>
        ))}

        {blocks.length === 0 && (
          <TextInput
            placeholder="Start writing your story..."
            placeholderTextColor={colors.textTertiary}
            multiline
            onSubmitEditing={() => createBlock(tab.id, 'text', { text: '' }, 0)}
            style={{ ...typography.bodyLarge, color: colors.textPrimary, minHeight: 200 }}
            onChangeText={(v) => {
              if (v.length > 0 && blocks.length === 0) {
                createBlock(tab.id, 'text', { text: v }, 0);
              }
            }}
          />
        )}
      </ScrollView>

      {/* FAB: Add block */}
      <TouchableOpacity
        onPress={() => setShowAddMenu(true)}
        style={{
          position: 'absolute',
          bottom: spacing.xl,
          right: spacing.xl,
          width: 48,
          height: 48,
          borderRadius: radius.full,
          backgroundColor: colors.accent,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 24, lineHeight: 26 }}>+</Text>
      </TouchableOpacity>

      <AddBlockMenu
        visible={showAddMenu}
        onSelect={handleAddBlock}
        onClose={() => setShowAddMenu(false)}
      />
    </View>
  );
}

import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { Text } from '../../components/design-system/Text';
import { AddBlockMenu } from '../../components/editor/AddBlockMenu';
import { TextBlock } from './blocks/TextBlock';
import { HeadingBlock } from './blocks/HeadingBlock';
import { TodoBlock } from './blocks/TodoBlock';
import { DividerBlock } from './blocks/DividerBlock';
import { EmptyState } from '../../components/layout/EmptyState';
import { colors, spacing, radius } from '../../components/design-system/tokens';
import { useBlocks } from '../../hooks/useBlocks';
import { useEditorStore } from '../../store/editor';
import { createBlock, deleteBlock, reorderBlock } from '../../db/mutations';
import { BlockType, TextContent, HeadingContent, TodoContent, DividerContent, QuoteContent, CodeContent } from '../../types/block';
import Block from '../../db/models/Block';
import Tab from '../../db/models/Tab';
import { parseContent } from '../../utils/contentJson';
import * as Haptics from 'expo-haptics';

interface Props {
  tab: Tab;
}

function defaultContentForType(type: BlockType): any {
  switch (type) {
    case 'text': return { text: '' } as TextContent;
    case 'heading': return { text: '', level: 1 } as HeadingContent;
    case 'todo': return { text: '', checked: false, depth: 0 } as TodoContent;
    case 'bullet':
    case 'numbered': return { text: '' };
    case 'divider': return {} as DividerContent;
    case 'quote': return { text: '' } as QuoteContent;
    case 'code': return { text: '', language: '' } as CodeContent;
    default: return { text: '' };
  }
}

function renderBlock(
  block: Block,
  onEnterPress: (blockId: string, blockOrder: number) => void,
  onBackspaceEmpty: (blockId: string) => void,
  onFocus: (blockId: string) => void,
  drag: () => void,
  isActive: boolean,
) {
  const content = parseContent(block.contentJson);

  switch (block.type as BlockType) {
    case 'heading':
      return (
        <HeadingBlock
          blockId={block.id}
          content={content as HeadingContent}
          onEnterPress={onEnterPress}
          onBackspaceEmpty={onBackspaceEmpty}
          onFocus={onFocus}
          blockOrder={block.blockOrder}
        />
      );
    case 'todo':
      return (
        <TodoBlock
          blockId={block.id}
          content={content as TodoContent}
          onEnterPress={onEnterPress}
          onBackspaceEmpty={onBackspaceEmpty}
          onFocus={onFocus}
          blockOrder={block.blockOrder}
        />
      );
    case 'divider':
      return <DividerBlock />;
    default:
      return (
        <TextBlock
          blockId={block.id}
          type={block.type as BlockType}
          content={content as TextContent}
          onEnterPress={onEnterPress}
          onBackspaceEmpty={onBackspaceEmpty}
          onFocus={onFocus}
          blockOrder={block.blockOrder}
        />
      );
  }
}

export function BlankEditor({ tab }: Props) {
  const blocks = useBlocks(tab.id);
  const { setFocusedBlock, setReordering } = useEditorStore();
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleEnterPress = useCallback(
    async (afterBlockId: string, afterOrder: number) => {
      await createBlock(tab.id, 'text', { text: '' }, afterOrder);
    },
    [tab.id],
  );

  const handleBackspaceEmpty = useCallback(
    async (blockId: string) => {
      await deleteBlock(blockId);
    },
    [],
  );

  const handleAddBlock = useCallback(
    async (type: BlockType) => {
      const lastOrder = blocks.length > 0 ? blocks[blocks.length - 1].blockOrder : 0;
      await createBlock(tab.id, type, defaultContentForType(type), lastOrder);
    },
    [tab.id, blocks],
  );

  const handleDragEnd = useCallback(
    async ({ data }: { data: Block[] }) => {
      setReordering(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Reassign orders based on new positions
      for (let i = 0; i < data.length; i++) {
        await reorderBlock(data[i].id, (i + 1) * 1000);
      }
    },
    [setReordering],
  );

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Block>) => (
      <ScaleDecorator activeScale={1.02}>
        <View
          style={{
            backgroundColor: isActive ? colors.surfaceElevated : 'transparent',
            borderRadius: isActive ? radius.sm : 0,
          }}
        >
          {renderBlock(
            item,
            handleEnterPress,
            handleBackspaceEmpty,
            setFocusedBlock,
            drag,
            isActive,
          )}
          {/* Long-press drag handle - only visible on hover/long-press */}
          <TouchableOpacity
            onLongPress={drag}
            style={{
              position: 'absolute',
              left: spacing.sm,
              top: 8,
              padding: spacing.sm,
            }}
          >
            <Text style={{ color: colors.textTertiary, fontSize: 12 }}>⠿</Text>
          </TouchableOpacity>
        </View>
      </ScaleDecorator>
    ),
    [handleEnterPress, handleBackspaceEmpty, setFocusedBlock],
  );

  if (blocks.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <EmptyState
          title="Start writing"
          subtitle="Tap below to add your first block."
          style={{ flex: 0, paddingTop: spacing.xxxl }}
        />
        <TouchableOpacity
          onPress={() => setShowAddMenu(true)}
          style={{
            margin: spacing.xl,
            padding: spacing.lg,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
            borderStyle: 'dashed',
            alignItems: 'center',
          }}
        >
          <Text variant="body" color="secondary">+ Add block</Text>
        </TouchableOpacity>
        <AddBlockMenu
          visible={showAddMenu}
          onSelect={handleAddBlock}
          onClose={() => setShowAddMenu(false)}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <DraggableFlatList
        data={blocks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragBegin={() => setReordering(true)}
        onDragEnd={handleDragEnd}
        contentContainerStyle={{ paddingTop: spacing.lg, paddingBottom: 120 }}
      />

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

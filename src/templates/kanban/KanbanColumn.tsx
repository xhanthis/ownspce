import React, { useState } from 'react';
import { View, TextInput, Pressable, ScrollView } from 'react-native';
import { Text } from '../../components/design-system/Text';
import { AnimatedPressable } from '../../components/design-system/AnimatedPressable';
import { KanbanCard } from './KanbanCard';
import { colors, spacing, radius, typography } from '../../components/design-system/tokens';
import { createBlock } from '../../db/mutations';
import { KanbanCardContent } from '../../types/block';
import Block from '../../db/models/Block';

interface Column {
  id: string;
  title: string;
  accentColor?: string;
}

interface Props {
  column: Column;
  cards: Block[];
  tabId: string;
  allColumns: Column[];
}

export function KanbanColumn({ column, cards, tabId, allColumns }: Props) {
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  async function handleAddCard() {
    const title = newCardTitle.trim();
    if (!title) {
      setIsAdding(false);
      return;
    }
    const lastOrder = cards.length > 0 ? cards[cards.length - 1].blockOrder : 0;
    await createBlock(tabId, 'kanban_card', {
      title,
      columnId: column.id,
    } as KanbanCardContent, lastOrder);
    setNewCardTitle('');
    setIsAdding(false);
  }

  const accent = column.accentColor ?? colors.textPrimary;

  return (
    <View
      style={{
        width: 260,
        marginRight: spacing.md,
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.lg,
        padding: spacing.md,
        maxHeight: '100%',
      }}
    >
      {/* Column header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
        <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: accent }} />
        <Text variant="label" weight="600" style={{ flex: 1 }}>{column.title}</Text>
        <Text variant="caption" style={{ color: colors.textTertiary }}>{cards.length}</Text>
      </View>

      {/* Cards */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 0 }}>
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            block={card}
            availableColumns={allColumns}
          />
        ))}
      </ScrollView>

      {/* Add card */}
      {isAdding ? (
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            padding: spacing.sm,
            borderWidth: 1,
            borderColor: colors.accent,
            marginTop: spacing.sm,
          }}
        >
          <TextInput
            value={newCardTitle}
            onChangeText={setNewCardTitle}
            placeholder="Card title..."
            placeholderTextColor={colors.textTertiary}
            autoFocus
            onSubmitEditing={handleAddCard}
            onBlur={handleAddCard}
            style={{ ...typography.small, color: colors.textPrimary, paddingVertical: spacing.xs }}
          />
        </View>
      ) : (
        <Pressable
          onPress={() => setIsAdding(true)}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
            marginTop: spacing.sm,
            paddingVertical: spacing.sm,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Text style={{ color: colors.textTertiary, fontSize: 16 }}>+</Text>
          <Text variant="small" color="secondary">Add card</Text>
        </Pressable>
      )}
    </View>
  );
}

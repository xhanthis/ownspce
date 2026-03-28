import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Text } from '../../components/design-system/Text';
import { Button } from '../../components/design-system/Button';
import { KanbanColumn } from './KanbanColumn';
import { colors, spacing, radius, typography } from '../../components/design-system/tokens';
import { useBlocks } from '../../hooks/useBlocks';
import { parseContent } from '../../utils/contentJson';
import { KanbanCardContent } from '../../types/block';
import Tab from '../../db/models/Tab';
import Block from '../../db/models/Block';
import { generateId } from '../../utils/id';

interface Column {
  id: string;
  title: string;
  accentColor?: string;
}

const DEFAULT_COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', accentColor: colors.kanbanTodo },
  { id: 'in_progress', title: 'In Progress', accentColor: colors.kanbanInProgress },
  { id: 'done', title: 'Done', accentColor: colors.kanbanDone },
];

interface Props {
  tab: Tab;
}

export function KanbanEditor({ tab }: Props) {
  const allBlocks = useBlocks(tab.id);
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  function getCardsForColumn(columnId: string): Block[] {
    return allBlocks.filter((b) => {
      const content = parseContent<KanbanCardContent>(b.contentJson);
      return content.columnId === columnId;
    });
  }

  function addColumn() {
    if (!newColumnTitle.trim()) return;
    setColumns((prev) => [
      ...prev,
      { id: generateId(), title: newColumnTitle.trim() },
    ]);
    setNewColumnTitle('');
    setShowAddColumn(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xxl,
          alignItems: 'flex-start',
        }}
        style={{ flex: 1 }}
      >
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            cards={getCardsForColumn(column.id)}
            tabId={tab.id}
            allColumns={columns}
          />
        ))}

        {/* Add column button */}
        <Pressable
          onPress={() => setShowAddColumn(true)}
          style={({ pressed }) => ({
            width: 200,
            height: 44,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            borderStyle: 'dashed',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: pressed ? 0.6 : 1,
            flexDirection: 'row',
            gap: spacing.sm,
          })}
        >
          <Text style={{ color: colors.textTertiary, fontSize: 16 }}>+</Text>
          <Text variant="small" color="secondary">Add column</Text>
        </Pressable>
      </ScrollView>

      {/* Add column modal */}
      <Modal visible={showAddColumn} transparent animationType="slide" onRequestClose={() => setShowAddColumn(false)}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' }}
          onPress={() => setShowAddColumn(false)}
          activeOpacity={1}
        >
          <TouchableOpacity activeOpacity={1}>
            <View
              style={{
                backgroundColor: colors.surface,
                borderTopLeftRadius: radius.xl,
                borderTopRightRadius: radius.xl,
                padding: spacing.xl,
                gap: spacing.lg,
              }}
            >
              <Text variant="h3">New Column</Text>
              <TextInput
                value={newColumnTitle}
                onChangeText={setNewColumnTitle}
                placeholder="Column name"
                placeholderTextColor={colors.textTertiary}
                autoFocus
                onSubmitEditing={addColumn}
                style={{
                  ...typography.body,
                  color: colors.textPrimary,
                  backgroundColor: colors.surfaceElevated,
                  borderRadius: radius.md,
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              />
              <Button label="Add Column" onPress={addColumn} disabled={!newColumnTitle.trim()} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

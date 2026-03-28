import React, { useState } from 'react';
import { View, TextInput, Pressable, Modal, TouchableOpacity } from 'react-native';
import { Text } from '../../components/design-system/Text';
import { AnimatedPressable } from '../../components/design-system/AnimatedPressable';
import { colors, spacing, radius, typography, shadows } from '../../components/design-system/tokens';
import { updateBlockContent, deleteBlock } from '../../db/mutations';
import { KanbanCardContent } from '../../types/block';
import Block from '../../db/models/Block';
import { parseContent } from '../../utils/contentJson';
import { Platform } from 'react-native';

interface Props {
  block: Block;
  onMoveToColumn?: (blockId: string, columnId: string) => void;
  availableColumns: { id: string; title: string }[];
}

export function KanbanCard({ block, onMoveToColumn, availableColumns }: Props) {
  const content = parseContent<KanbanCardContent>(block.contentJson);
  const [showDetail, setShowDetail] = useState(false);
  const [editTitle, setEditTitle] = useState(content.title);
  const [editDescription, setEditDescription] = useState(content.description ?? '');

  function saveChanges() {
    updateBlockContent(block.id, {
      ...content,
      title: editTitle.trim() || content.title,
      description: editDescription.trim() || undefined,
    });
    setShowDetail(false);
  }

  const hasDescription = !!content.description;
  const checklistTotal = content.checklist?.length ?? 0;
  const checklistDone = content.checklist?.filter((c) => c.checked).length ?? 0;

  return (
    <>
      <AnimatedPressable
        onPress={() => setShowDetail(true)}
        style={[
          {
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            padding: spacing.md,
            marginBottom: spacing.sm,
            borderWidth: 1,
            borderColor: colors.border,
          },
          Platform.OS === 'ios' ? shadows.subtle : {},
        ]}
      >
        <Text variant="small" weight="500" numberOfLines={2}>{content.title}</Text>
        {hasDescription && (
          <Text variant="caption" color="secondary" numberOfLines={1} style={{ marginTop: spacing.xs }}>
            {content.description}
          </Text>
        )}
        {checklistTotal > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm }}>
            <Text style={{ fontSize: 11, color: checklistDone === checklistTotal ? colors.success : colors.textSecondary }}>
              ☑ {checklistDone}/{checklistTotal}
            </Text>
          </View>
        )}
      </AnimatedPressable>

      {/* Card detail modal */}
      <Modal visible={showDetail} transparent animationType="slide" onRequestClose={() => setShowDetail(false)}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' }}
          onPress={saveChanges}
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
              <View style={{ alignItems: 'center' }}>
                <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
              </View>

              <TextInput
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Card title"
                placeholderTextColor={colors.textTertiary}
                style={{ ...typography.h3, color: colors.textPrimary }}
                autoFocus
              />

              <TextInput
                value={editDescription}
                onChangeText={setEditDescription}
                placeholder="Add description..."
                placeholderTextColor={colors.textTertiary}
                multiline
                style={{
                  ...typography.body,
                  color: colors.textPrimary,
                  minHeight: 80,
                  backgroundColor: colors.surfaceElevated,
                  borderRadius: radius.md,
                  padding: spacing.md,
                }}
                textAlignVertical="top"
              />

              {/* Move to column */}
              {availableColumns.length > 1 && (
                <View>
                  <Text variant="label" color="secondary" style={{ marginBottom: spacing.sm }}>Move to</Text>
                  <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
                    {availableColumns
                      .filter((col) => col.id !== content.columnId)
                      .map((col) => (
                        <AnimatedPressable
                          key={col.id}
                          onPress={() => {
                            updateBlockContent(block.id, { ...content, columnId: col.id });
                            setShowDetail(false);
                          }}
                          style={{
                            paddingHorizontal: spacing.md,
                            paddingVertical: spacing.sm,
                            borderRadius: radius.full,
                            backgroundColor: colors.surfaceElevated,
                            borderWidth: 1,
                            borderColor: colors.border,
                          }}
                        >
                          <Text variant="small">{col.title}</Text>
                        </AnimatedPressable>
                      ))}
                  </View>
                </View>
              )}

              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <AnimatedPressable
                  onPress={saveChanges}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.md,
                    borderRadius: radius.md,
                    backgroundColor: colors.accent,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
                </AnimatedPressable>
                <AnimatedPressable
                  onPress={() => {
                    deleteBlock(block.id);
                    setShowDetail(false);
                  }}
                  style={{
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.lg,
                    borderRadius: radius.md,
                    backgroundColor: '#FEE2E2',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: colors.error }}>Delete</Text>
                </AnimatedPressable>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

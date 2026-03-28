import React, { useState } from 'react';
import { ScrollView, View, TextInput, Pressable, Modal, TouchableOpacity } from 'react-native';
import { Text } from '../../components/design-system/Text';
import { Button } from '../../components/design-system/Button';
import { TodoSection } from './TodoSection';
import { colors, spacing, radius, typography } from '../../components/design-system/tokens';
import { useBlocks } from '../../hooks/useBlocks';
import { parseContent } from '../../utils/contentJson';
import { TaskItemContent } from '../../types/block';
import Tab from '../../db/models/Tab';
import { generateId } from '../../utils/id';
import Block from '../../db/models/Block';

interface Section {
  id: string;
  title: string;
}

interface Props {
  tab: Tab;
}

export function TodoEditor({ tab }: Props) {
  const allBlocks = useBlocks(tab.id);
  const [sections, setSections] = useState<Section[]>([
    { id: 'default', title: 'Tasks' },
  ]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  function addSection() {
    if (!newSectionTitle.trim()) return;
    setSections((prev) => [...prev, { id: generateId(), title: newSectionTitle.trim() }]);
    setNewSectionTitle('');
    setShowAddSection(false);
  }

  function getBlocksForSection(sectionId: string): Block[] {
    return allBlocks.filter((b) => {
      const content = parseContent<TaskItemContent>(b.contentJson);
      return content.sectionId === sectionId;
    });
  }

  // Overall progress
  const totalBlocks = allBlocks.length;
  const completedBlocks = allBlocks.filter((b) => parseContent<TaskItemContent>(b.contentJson).checked).length;
  const overallProgress = totalBlocks > 0 ? completedBlocks / totalBlocks : 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: spacing.xl, paddingBottom: 80 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header with overall progress */}
      <View style={{ paddingHorizontal: spacing.xl, marginBottom: spacing.xl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
          <Text variant="h2" weight="700">Tasks</Text>
          {totalBlocks > 0 && (
            <Text variant="caption" color="secondary">{completedBlocks}/{totalBlocks} done</Text>
          )}
        </View>
        {totalBlocks > 0 && (
          <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2 }}>
            <View
              style={{
                height: 4,
                borderRadius: 2,
                backgroundColor: overallProgress === 1 ? colors.success : colors.accent,
                width: `${overallProgress * 100}%`,
              }}
            />
          </View>
        )}
      </View>

      {/* Sections */}
      {sections.map((section) => {
        const sectionBlocks = getBlocksForSection(section.id);
        const completed = sectionBlocks.filter((b) => parseContent<TaskItemContent>(b.contentJson).checked).length;
        return (
          <TodoSection
            key={section.id}
            sectionId={section.id}
            sectionTitle={section.title}
            blocks={sectionBlocks}
            tabId={tab.id}
            completedCount={completed}
            totalCount={sectionBlocks.length}
          />
        );
      })}

      {/* Add section */}
      <Pressable
        onPress={() => setShowAddSection(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          marginHorizontal: spacing.xl,
          marginTop: spacing.md,
        }}
      >
        <Text style={{ color: colors.textTertiary, fontSize: 16 }}>+</Text>
        <Text variant="small" color="secondary">Add section</Text>
      </Pressable>

      {/* Add section modal */}
      <Modal visible={showAddSection} transparent animationType="slide" onRequestClose={() => setShowAddSection(false)}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' }}
          onPress={() => setShowAddSection(false)}
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
              <Text variant="h3">New Section</Text>
              <TextInput
                value={newSectionTitle}
                onChangeText={setNewSectionTitle}
                placeholder="Section name"
                placeholderTextColor={colors.textTertiary}
                autoFocus
                onSubmitEditing={addSection}
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
              <Button label="Add Section" onPress={addSection} disabled={!newSectionTitle.trim()} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

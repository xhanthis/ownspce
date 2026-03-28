import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../../src/components/design-system/Text';
import { AnimatedPressable } from '../../../src/components/design-system/AnimatedPressable';
import { Button } from '../../../src/components/design-system/Button';
import { TabStrip } from '../../../src/components/layout/TabStrip';
import { EmptyState } from '../../../src/components/layout/EmptyState';
import { EmojiPicker } from '../../../src/components/editor/EmojiPicker';
import { colors, spacing, radius, typography } from '../../../src/components/design-system/tokens';
import { useWorkspace } from '../../../src/hooks/useWorkspace';
import { useTabs } from '../../../src/hooks/useTab';
import { createTab } from '../../../src/db/mutations';
import { TemplateType, TEMPLATE_LABELS, TEMPLATE_DESCRIPTIONS, TEMPLATE_ICONS } from '../../../src/types/template';
import Tab from '../../../src/db/models/Tab';

// Template rendering (inline — full template screens imported in next step)
import { BlankEditor } from '../../../src/templates/blank/BlankEditor';
import { RightNowEditor } from '../../../src/templates/right-now/RightNowEditor';
import { StoryEditor } from '../../../src/templates/story/StoryEditor';
import { TodoEditor } from '../../../src/templates/todo/TodoEditor';
import { KanbanEditor } from '../../../src/templates/kanban/KanbanEditor';

const TEMPLATES: TemplateType[] = ['blank', 'right_now', 'story', 'todo', 'kanban'];

function renderTemplate(tab: Tab) {
  switch (tab.templateType as TemplateType) {
    case 'blank': return <BlankEditor tab={tab} />;
    case 'right_now': return <RightNowEditor tab={tab} />;
    case 'story': return <StoryEditor tab={tab} />;
    case 'todo': return <TodoEditor tab={tab} />;
    case 'kanban': return <KanbanEditor tab={tab} />;
    default: return null;
  }
}

export default function WorkspaceScreen() {
  const { workspaceId } = useLocalSearchParams<{ workspaceId: string }>();
  const router = useRouter();
  const workspace = useWorkspace(workspaceId);
  const tabs = useTabs(workspaceId);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [showAddTab, setShowAddTab] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const [newTabTemplate, setNewTabTemplate] = useState<TemplateType>('blank');
  const [newTabEmoji, setNewTabEmoji] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0] ?? null;

  React.useEffect(() => {
    if (tabs.length > 0 && !activeTabId) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs]);

  async function handleCreateTab() {
    if (!newTabName.trim() || !workspaceId) return;
    const tab = await createTab(workspaceId, newTabName.trim(), newTabTemplate, newTabEmoji || undefined);
    setActiveTabId(tab.id);
    setShowAddTab(false);
    setNewTabName('');
    setNewTabEmoji('');
  }

  if (!workspace) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <AnimatedPressable onPress={() => router.back()} style={{ padding: spacing.sm, marginRight: spacing.sm }}>
          <Text style={{ color: colors.textSecondary, fontSize: 18 }}>‹</Text>
        </AnimatedPressable>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          {workspace.emoji && <Text style={{ fontSize: 18 }}>{workspace.emoji}</Text>}
          <Text variant="body" weight="600" numberOfLines={1}>{workspace.name}</Text>
        </View>
      </View>

      {/* Tab strip */}
      <TabStrip
        tabs={tabs}
        activeTabId={activeTab?.id ?? null}
        onTabPress={(tab) => setActiveTabId(tab.id)}
        onAddTab={() => setShowAddTab(true)}
      />

      {/* Template content */}
      {tabs.length === 0 ? (
        <EmptyState
          icon="📄"
          title="No tabs yet"
          subtitle="Create a tab to start writing."
          action={{ label: 'New Tab', onPress: () => setShowAddTab(true) }}
        />
      ) : activeTab ? (
        <View style={{ flex: 1 }}>
          {renderTemplate(activeTab)}
        </View>
      ) : null}

      {/* Add Tab Modal */}
      <Modal visible={showAddTab} transparent animationType="slide" onRequestClose={() => setShowAddTab(false)}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' }}
          onPress={() => setShowAddTab(false)}
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
              <Text variant="h3">New Tab</Text>

              {/* Tab name */}
              <TextInput
                value={newTabName}
                onChangeText={setNewTabName}
                placeholder="Tab name"
                placeholderTextColor={colors.textTertiary}
                autoFocus
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

              {/* Emoji */}
              <AnimatedPressable
                onPress={() => setShowEmojiPicker(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                  backgroundColor: colors.surfaceElevated,
                  borderRadius: radius.md,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ fontSize: 20 }}>{newTabEmoji || '📄'}</Text>
                <Text variant="body" color="secondary">
                  {newTabEmoji ? 'Change emoji' : 'Pick emoji (optional)'}
                </Text>
              </AnimatedPressable>

              {/* Template selector */}
              <View>
                <Text variant="label" color="secondary" style={{ marginBottom: spacing.sm }}>
                  Choose template
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                    {TEMPLATES.map((t) => (
                      <AnimatedPressable
                        key={t}
                        onPress={() => setNewTabTemplate(t)}
                        style={{
                          paddingHorizontal: spacing.lg,
                          paddingVertical: spacing.md,
                          borderRadius: radius.md,
                          backgroundColor: newTabTemplate === t ? colors.accentLight : colors.surfaceElevated,
                          borderWidth: 1,
                          borderColor: newTabTemplate === t ? colors.accent : colors.border,
                          alignItems: 'center',
                          minWidth: 80,
                          gap: spacing.xs,
                        }}
                      >
                        <Text style={{ fontSize: 20 }}>{TEMPLATE_ICONS[t]}</Text>
                        <Text
                          variant="label"
                          style={{ color: newTabTemplate === t ? colors.accent : colors.textPrimary }}
                        >
                          {TEMPLATE_LABELS[t]}
                        </Text>
                        <Text variant="caption" color="secondary" style={{ textAlign: 'center' }}>
                          {TEMPLATE_DESCRIPTIONS[t]}
                        </Text>
                      </AnimatedPressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <Button label="Create Tab" onPress={handleCreateTab} disabled={!newTabName.trim()} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <EmojiPicker
        visible={showEmojiPicker}
        onSelect={setNewTabEmoji}
        onClose={() => setShowEmojiPicker(false)}
      />
    </SafeAreaView>
  );
}

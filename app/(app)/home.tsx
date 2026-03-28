import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../src/components/design-system/Text';
import { Button } from '../../src/components/design-system/Button';
import { AnimatedPressable } from '../../src/components/design-system/AnimatedPressable';
import { EmptyState } from '../../src/components/layout/EmptyState';
import { EmojiPicker } from '../../src/components/editor/EmojiPicker';
import { colors, spacing, radius, typography, shadows } from '../../src/components/design-system/tokens';
import { useWorkspaces } from '../../src/hooks/useWorkspace';
import { createWorkspace, deleteWorkspace } from '../../src/db/mutations';

const WORKSPACE_COLORS = [
  '#1A1A1A', '#CC785C', '#059669', '#2563EB', '#7C3AED',
  '#DC2626', '#D97706', '#0891B2', '#BE185D', '#65A30D',
];

export default function HomeScreen() {
  const router = useRouter();
  const workspaces = useWorkspaces();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(WORKSPACE_COLORS[0]);
  const [newEmoji, setNewEmoji] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  async function handleCreate() {
    if (!newName.trim()) return;
    const ws = await createWorkspace(newName.trim(), newColor, newEmoji || undefined);
    setShowCreate(false);
    setNewName('');
    setNewEmoji('');
    router.push(`/(app)/${ws.id}`);
  }

  async function handleDelete(id: string, name: string) {
    Alert.alert(
      `Delete "${name}"?`,
      'This will permanently delete all tabs and content inside.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteWorkspace(id),
        },
      ],
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.lg,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text variant="h2" weight="700">
          ownspce
        </Text>
        <AnimatedPressable
          haptic
          onPress={() => setShowCreate(true)}
          style={{
            width: 36,
            height: 36,
            borderRadius: radius.full,
            backgroundColor: colors.accent,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 22, lineHeight: 24 }}>+</Text>
        </AnimatedPressable>
      </View>

      {/* Workspace list */}
      {workspaces.length === 0 ? (
        <EmptyState
          icon="🗂️"
          title="No workspaces yet"
          subtitle="Create your first workspace to get started."
          action={{ label: 'New Workspace', onPress: () => setShowCreate(true) }}
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}>
          {workspaces.map((ws) => (
            <AnimatedPressable
              key={ws.id}
              haptic
              onPress={() => router.push(`/(app)/${ws.id}`)}
              onLongPress={() => handleDelete(ws.id, ws.name)}
              style={[
                {
                  backgroundColor: colors.surface,
                  borderRadius: radius.lg,
                  padding: spacing.lg,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                },
                Platform.OS === 'ios' ? shadows.card : {},
              ]}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radius.md,
                  backgroundColor: ws.emoji ? colors.surfaceElevated : ws.color,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {ws.emoji ? (
                  <Text style={{ fontSize: 24 }}>{ws.emoji}</Text>
                ) : (
                  <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
                    {ws.name.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body" weight="500">{ws.name}</Text>
                <Text variant="caption" color="secondary">
                  {ws.updatedAt.toLocaleDateString()}
                </Text>
              </View>
              <Text style={{ color: colors.textTertiary, fontSize: 18 }}>›</Text>
            </AnimatedPressable>
          ))}
        </ScrollView>
      )}

      {/* Create Workspace Modal */}
      <Modal visible={showCreate} transparent animationType="slide" onRequestClose={() => setShowCreate(false)}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' }}
          onPress={() => setShowCreate(false)}
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
              <Text variant="h3">New Workspace</Text>

              {/* Name input */}
              <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder="Workspace name"
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

              {/* Emoji picker */}
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
                <Text style={{ fontSize: 24 }}>{newEmoji || '📂'}</Text>
                <Text variant="body" color="secondary">
                  {newEmoji ? 'Change emoji' : 'Pick an emoji (optional)'}
                </Text>
              </AnimatedPressable>

              {/* Color picker */}
              <View>
                <Text variant="label" color="secondary" style={{ marginBottom: spacing.sm }}>
                  Accent color
                </Text>
                <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
                  {WORKSPACE_COLORS.map((c) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setNewColor(c)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: radius.full,
                        backgroundColor: c,
                        borderWidth: newColor === c ? 3 : 0,
                        borderColor: colors.accent,
                      }}
                    />
                  ))}
                </View>
              </View>

              <Button label="Create Workspace" onPress={handleCreate} disabled={!newName.trim()} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <EmojiPicker
        visible={showEmojiPicker}
        onSelect={setNewEmoji}
        onClose={() => setShowEmojiPicker(false)}
      />
    </SafeAreaView>
  );
}

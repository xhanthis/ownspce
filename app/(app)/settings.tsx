import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../src/components/design-system/Text';
import { AnimatedPressable } from '../../src/components/design-system/AnimatedPressable';
import { colors, spacing, radius } from '../../src/components/design-system/tokens';
import * as FileSystem from 'expo-file-system';
import { database } from '../../src/db';
import { Q } from '@nozbe/watermelondb';

function SettingsRow({
  icon,
  label,
  subtitle,
  onPress,
  destructive = false,
}: {
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <AnimatedPressable
      haptic
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
      }}
    >
      <Text style={{ fontSize: 20, width: 28 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text variant="body" style={{ color: destructive ? colors.error : colors.textPrimary }}>
          {label}
        </Text>
        {subtitle && <Text variant="caption" color="secondary">{subtitle}</Text>}
      </View>
      <Text style={{ color: colors.textTertiary, fontSize: 16 }}>›</Text>
    </AnimatedPressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();

  async function handleExport() {
    try {
      const workspaces = await database.get('workspaces').query().fetch();
      const tabs = await database.get('tabs').query().fetch();
      const blocks = await database.get('blocks').query().fetch();

      const exportData = {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        workspaces: workspaces.map((w: any) => ({
          id: w.id, name: w.name, color: w.color, emoji: w.emoji,
        })),
        tabs: tabs.map((t: any) => ({
          id: t.id, workspaceId: t.workspaceId, title: t.title,
          templateType: t.templateType, emoji: t.emoji,
        })),
        blocks: blocks.map((b: any) => ({
          id: b.id, tabId: b.tabId, type: b.type,
          content: JSON.parse(b.contentJson), order: b.blockOrder,
        })),
      };

      const path = FileSystem.documentDirectory + 'ownspce-export.json';
      await FileSystem.writeAsStringAsync(path, JSON.stringify(exportData, null, 2));
      Alert.alert('Exported', `Saved to ${path}`);
    } catch (e) {
      Alert.alert('Export failed', String(e));
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
        <Text variant="body" weight="600">Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {/* Data */}
        <Text variant="caption" color="secondary" style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Data
        </Text>
        <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl }}>
          <SettingsRow
            icon="☁️"
            label="Connect Google Drive"
            subtitle="Sync your data (coming soon)"
            onPress={() => Alert.alert('Coming Soon', 'Google Drive sync will be available in v1.1')}
          />
          <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: spacing.lg }} />
          <SettingsRow
            icon="📦"
            label="Export All Data"
            subtitle="Download as JSON"
            onPress={handleExport}
          />
        </View>

        {/* About */}
        <Text variant="caption" color="secondary" style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          About
        </Text>
        <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg }}>
            <Text style={{ fontSize: 20, width: 28 }}>📱</Text>
            <View style={{ flex: 1 }}>
              <Text variant="body">ownspce</Text>
              <Text variant="caption" color="secondary">Version 1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Modal, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PAGE_TYPES } from '@ownspce/core';
import type { PageType } from '@ownspce/core';
import { api } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { HorizontalLogo } from '../../components/OwlLogo';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Dashboard'>;

interface PageRow {
  id: string;
  title: string;
  type: PageType;
  isPinned: boolean;
  updatedAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  scratch: '#3B82F6',
  rightnow: '#F97316',
  todo: '#22C55E',
  kanban: '#8B5CF6',
};

export default function DashboardScreen({ navigation }: Props) {
  const user = useAuthStore(s => s.user);
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageRow | null>(null);

  const { data: pages = [], isLoading, refetch } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const res = await api<{ data: PageRow[] }>('/api/pages');
      return res.data;
    },
  });

  const createPage = useCallback(async (type: PageType) => {
    setPickerVisible(false);
    const res = await api<{ data: PageRow }>('/api/pages', {
      method: 'POST',
      body: JSON.stringify({ type, title: 'Untitled' }),
    });
    queryClient.invalidateQueries({ queryKey: ['pages'] });
    navigation.navigate('PageEditor', { page: res.data });
  }, [navigation, queryClient]);

  const deletePage = useCallback(async (page: PageRow) => {
    setSelectedPage(null);
    Alert.alert(
      'Delete Page',
      `Are you sure you want to delete "${page.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await api(`/api/pages/${page.id}`, { method: 'DELETE' });
            queryClient.invalidateQueries({ queryKey: ['pages'] });
          },
        },
      ],
    );
  }, [queryClient]);

  const pinned = pages.filter(p => p.isPinned);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  const renderPage = ({ item }: { item: PageRow }) => (
    <TouchableOpacity
      style={styles.pageCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('PageEditor', { page: item })}
      onLongPress={() => setSelectedPage(item)}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle} numberOfLines={1}>{item.title}</Text>
        <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[item.type] + '20' }]}>
          <Text style={[styles.typeBadgeText, { color: TYPE_COLORS[item.type] }]}>{item.type}</Text>
        </View>
      </View>
      <Text style={styles.pageDate}>{formatDate(item.updatedAt)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <HorizontalLogo height={28} />
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.fab} onPress={() => setPickerVisible(true)}>
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.profileBtnText}>{'👤'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={pages}
        keyExtractor={item => item.id}
        renderItem={renderPage}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#6B6B6B" />}
        ListHeaderComponent={
          pinned.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pinned</Text>
              {pinned.map(p => (
                <TouchableOpacity key={p.id} style={styles.pinnedItem} onPress={() => navigation.navigate('PageEditor', { page: p })}>
                  <Text style={styles.pinnedText} numberOfLines={1}>{p.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No pages yet</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => setPickerVisible(true)}>
                <Text style={styles.emptyBtnText}>Create your first page</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      {/* New page type picker */}
      <Modal visible={pickerVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setPickerVisible(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>New Page</Text>
            <View style={styles.typeGrid}>
              {PAGE_TYPES.filter(pt => pt.type !== 'story').map(pt => (
                <TouchableOpacity key={pt.type} style={styles.typeCard} onPress={() => createPage(pt.type)}>
                  <Text style={styles.typeIcon}>{pt.icon}</Text>
                  <Text style={styles.typeLabel}>{pt.label}</Text>
                  <Text style={styles.typeDesc}>{pt.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Page actions bottom sheet */}
      <Modal visible={!!selectedPage} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setSelectedPage(null)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle} numberOfLines={1}>{selectedPage?.title}</Text>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => selectedPage && deletePage(selectedPage)}>
              <Text style={styles.deleteIcon}>🗑</Text>
              <Text style={styles.deleteText}>Delete Page</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  profileBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1E1E1E', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A2A2A' },
  profileBtnText: { fontSize: 18 },
  fab: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  fabText: { fontSize: 20, fontWeight: '600', color: '#0A0A0A', marginTop: -2 },
  list: { padding: 12 },
  pageCard: { backgroundColor: '#141414', borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#2A2A2A', marginBottom: 12, gap: 8 },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  pageTitle: { fontSize: 14, fontWeight: '600', color: '#F5F5F5', flex: 1 },
  typeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999 },
  typeBadgeText: { fontSize: 10, fontWeight: '600' },
  pageDate: { fontSize: 12, color: '#6B6B6B' },
  section: { marginBottom: 16, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#6B6B6B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  pinnedItem: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#141414', borderRadius: 8, marginBottom: 4 },
  pinnedText: { fontSize: 14, color: '#F5F5F5' },
  empty: { alignItems: 'center', paddingTop: 80, gap: 16 },
  emptyText: { fontSize: 14, color: '#6B6B6B' },
  emptyBtn: { backgroundColor: '#F5F5F5', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  emptyBtnText: { fontSize: 14, fontWeight: '600', color: '#0A0A0A' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#141414', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  sheetTitle: { fontSize: 18, fontWeight: '600', color: '#F5F5F5', marginBottom: 20 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  typeCard: { width: '47%', padding: 16, backgroundColor: '#1E1E1E', borderRadius: 10, borderWidth: 1, borderColor: '#2A2A2A', gap: 4 },
  typeIcon: { fontSize: 24 },
  typeLabel: { fontSize: 14, fontWeight: '600', color: '#F5F5F5' },
  typeDesc: { fontSize: 12, color: '#6B6B6B' },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 4, borderRadius: 10 },
  deleteIcon: { fontSize: 20 },
  deleteText: { fontSize: 16, color: '#EF4444', fontWeight: '500' },
});

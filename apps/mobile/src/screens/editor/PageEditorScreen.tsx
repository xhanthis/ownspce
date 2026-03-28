import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScratchEditor from './ScratchEditor';
import RightNowEditor from './RightNowEditor';
import TodoEditor from './TodoEditor';
import KanbanEditor from './KanbanEditor';

type Props = NativeStackScreenProps<any, 'PageEditor'>;

interface PageData {
  id: string;
  title: string;
  type: string;
  content: unknown;
  isPinned: boolean;
}

export default function PageEditorScreen({ navigation, route }: Props) {
  const { page: routePage } = route.params as { page: { id: string; type: string } };
  const insets = useSafeAreaInsets();

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['page', routePage.id],
    queryFn: async () => {
      const res = await api<{ data: PageData }>(`/api/pages/${routePage.id}`);
      return res.data;
    },
  });

  if (error) {
    return (
      <View style={[styles.loading, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12} style={{ position: 'absolute', top: insets.top + 8, left: 16 }}>
          <Text style={styles.back}>{'←'}</Text>
        </TouchableOpacity>
        <Text style={{ color: '#EF4444', fontSize: 14 }}>{(error as Error).message}</Text>
      </View>
    );
  }

  if (isLoading || !page) {
    return (
      <View style={[styles.loading, { paddingTop: insets.top }]}>
        <ActivityIndicator color="#F5F5F5" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={styles.back}>{'←'}</Text>
        </TouchableOpacity>
      </View>
      {renderEditor(page)}
    </View>
  );
}

function renderEditor(page: PageData) {
  switch (page.type) {
    case 'scratch':
      return <ScratchEditor page={page} />;
    case 'rightnow':
      return <RightNowEditor page={page} />;
    case 'todo':
      return <TodoEditor page={page} />;
    case 'kanban':
      return <KanbanEditor page={page} />;
    default:
      return <Text style={{ color: '#6B6B6B', textAlign: 'center', marginTop: 40 }}>Unsupported page type</Text>;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  loading: { flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  back: { fontSize: 24, color: '#F5F5F5' },
});

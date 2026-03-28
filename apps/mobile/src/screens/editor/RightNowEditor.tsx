import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, Alert,
} from 'react-native';
import { ACTIVE_MAX, ONDECK_MAX } from '@ownspce/core';
import type { RightNowItem, RightNowContent } from '@ownspce/core';
import { useAutoSave } from '../../hooks/useAutoSave';

interface Page { id: string; title: string; content: unknown }

function uid() { return Math.random().toString(36).slice(2, 10); }

export default function RightNowEditor({ page }: { page: Page }) {
  const initial = page.content as RightNowContent | null;
  const [title, setTitle] = useState(page.title);
  const [active, setActive] = useState<RightNowItem[]>(initial?.active ?? []);
  const [onDeck, setOnDeck] = useState<RightNowItem[]>(initial?.onDeck ?? []);
  const [holding, setHolding] = useState<RightNowItem[]>(initial?.holding ?? []);
  const [newText, setNewText] = useState('');

  const content: RightNowContent = { active, onDeck, holding };
  const { saveStatus } = useAutoSave(page.id, content, title);

  function addToHolding() {
    if (!newText.trim()) return;
    const item: RightNowItem = { id: uid(), text: newText.trim(), createdAt: new Date().toISOString() };
    setHolding([...holding, item]);
    setNewText('');
  }

  function completeActive(id: string) {
    const nextActive = active.filter(i => i.id !== id);
    const nextOnDeck = [...onDeck];
    if (nextOnDeck.length > 0 && nextActive.length < ACTIVE_MAX) {
      nextActive.push(nextOnDeck.shift()!);
    }
    setActive(nextActive);
    setOnDeck(nextOnDeck);
  }

  function moveItem(id: string, from: 'active' | 'onDeck' | 'holding', to: 'active' | 'onDeck' | 'holding') {
    const lanes = { active: [...active], onDeck: [...onDeck], holding: [...holding] };
    const maxes = { active: ACTIVE_MAX, onDeck: ONDECK_MAX, holding: Infinity };
    if (lanes[to].length >= maxes[to]) {
      Alert.alert('Full', `${to} lane is full`);
      return;
    }
    const idx = lanes[from].findIndex(i => i.id === id);
    if (idx < 0) return;
    const [item] = lanes[from].splice(idx, 1);
    lanes[to].push(item);
    setActive(lanes.active);
    setOnDeck(lanes.onDeck);
    setHolding(lanes.holding);
  }

  function removeItem(id: string, lane: 'active' | 'onDeck' | 'holding') {
    const lanes = { active: [...active], onDeck: [...onDeck], holding: [...holding] };
    lanes[lane] = lanes[lane].filter(i => i.id !== id);
    setActive(lanes.active);
    setOnDeck(lanes.onDeck);
    setHolding(lanes.holding);
  }

  function renderItem(item: RightNowItem, lane: 'active' | 'onDeck' | 'holding') {
    return (
      <View style={[styles.item, lane === 'active' && styles.activeItem]}>
        <Text style={styles.itemText} numberOfLines={2}>{item.text}</Text>
        <View style={styles.itemActions}>
          {lane === 'active' && (
            <TouchableOpacity onPress={() => completeActive(item.id)} hitSlop={8}>
              <Text style={styles.completeBtn}>{'✓'}</Text>
            </TouchableOpacity>
          )}
          {lane === 'holding' && (
            <>
              <TouchableOpacity onPress={() => moveItem(item.id, 'holding', 'onDeck')} hitSlop={8}>
                <Text style={styles.moveBtn}>{'→ Deck'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => moveItem(item.id, 'holding', 'active')} hitSlop={8}>
                <Text style={styles.moveBtn}>{'→ Active'}</Text>
              </TouchableOpacity>
            </>
          )}
          {lane === 'onDeck' && (
            <>
              <TouchableOpacity onPress={() => moveItem(item.id, 'onDeck', 'active')} hitSlop={8}>
                <Text style={styles.moveBtn}>{'→ Active'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => moveItem(item.id, 'onDeck', 'holding')} hitSlop={8}>
                <Text style={styles.moveBtn}>{'→ Hold'}</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity onPress={() => removeItem(item.id, lane)} hitSlop={8}>
            <Text style={styles.deleteBtn}>{'×'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardDismissMode="interactive">
      <View style={styles.titleRow}>
        <TextInput style={styles.titleInput} value={title} onChangeText={setTitle} placeholder="Right Now" placeholderTextColor="#6B6B6B" />
        <Text style={styles.status}>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : ''}</Text>
      </View>

      <View style={styles.addRow}>
        <TextInput
          style={styles.addInput}
          value={newText}
          onChangeText={setNewText}
          placeholder="Add to holding..."
          placeholderTextColor="#6B6B6B"
          onSubmitEditing={addToHolding}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={addToHolding}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <Lane label="Active" count={active.length} max={ACTIVE_MAX} accent items={active} lane="active" renderItem={renderItem} />
      <Lane label="On Deck" count={onDeck.length} max={ONDECK_MAX} items={onDeck} lane="onDeck" renderItem={renderItem} />
      <Lane label="Holding" count={holding.length} items={holding} lane="holding" renderItem={renderItem} />
    </ScrollView>
  );
}

function Lane({ label, count, max, accent, items, lane, renderItem }: {
  label: string; count: number; max?: number; accent?: boolean;
  items: RightNowItem[]; lane: 'active' | 'onDeck' | 'holding';
  renderItem: (item: RightNowItem, lane: 'active' | 'onDeck' | 'holding') => React.ReactNode;
}) {
  return (
    <View style={styles.lane}>
      <View style={styles.laneHeader}>
        <Text style={styles.laneTitle}>{label}</Text>
        <Text style={styles.laneCount}>{count}{max ? `/${max}` : ''}</Text>
        {max && count >= max && <Text style={styles.laneFull}>full</Text>}
      </View>
      <View style={[styles.laneBody, accent && styles.lanAccent]}>
        {items.length === 0 ? (
          <Text style={styles.emptyLane}>Empty</Text>
        ) : (
          items.map(item => <View key={item.id}>{renderItem(item, lane)}</View>)
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  titleInput: { flex: 1, fontSize: 20, fontWeight: '600', color: '#F5F5F5' },
  status: { fontSize: 12, color: '#6B6B6B' },
  addRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  addInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#F5F5F5', backgroundColor: '#1E1E1E', borderRadius: 8, borderWidth: 1, borderColor: '#2A2A2A' },
  addBtn: { backgroundColor: '#F5F5F5', paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { fontSize: 14, fontWeight: '600', color: '#0A0A0A' },
  lane: { marginBottom: 20 },
  laneHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  laneTitle: { fontSize: 14, fontWeight: '600', color: '#F5F5F5' },
  laneCount: { fontSize: 12, color: '#6B6B6B' },
  laneFull: { fontSize: 12, color: '#FF6B4A' },
  laneBody: { backgroundColor: '#141414', borderRadius: 10, padding: 8, borderWidth: 1, borderColor: '#2A2A2A', gap: 6 },
  lanAccent: { borderColor: 'rgba(255,107,74,0.4)' },
  emptyLane: { fontSize: 12, color: '#6B6B6B', textAlign: 'center', paddingVertical: 16 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', borderRadius: 8, padding: 12, gap: 8 },
  activeItem: { borderLeftWidth: 3, borderLeftColor: '#FF6B4A' },
  itemText: { flex: 1, fontSize: 14, color: '#F5F5F5' },
  itemActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  completeBtn: { fontSize: 16, color: '#22C55E' },
  moveBtn: { fontSize: 11, color: '#3B82F6', fontWeight: '600' },
  deleteBtn: { fontSize: 18, color: '#6B6B6B' },
});

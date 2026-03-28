import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { LABELS, LABEL_COLORS } from '@ownspce/core';
import type { TodoItem, TodoContent } from '@ownspce/core';
import { useAutoSave } from '../../hooks/useAutoSave';

interface Page { id: string; title: string; content: unknown }

function uid() { return Math.random().toString(36).slice(2, 10); }

export default function TodoEditor({ page }: { page: Page }) {
  const initial = page.content as TodoContent | null;
  const [title, setTitle] = useState(page.title);
  const [items, setItems] = useState<TodoItem[]>(initial?.items ?? []);
  const [newText, setNewText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const content: TodoContent = { items };
  const { saveStatus } = useAutoSave(page.id, content, title);

  function addItem() {
    if (!newText.trim()) return;
    setItems([...items, { id: uid(), text: newText.trim(), done: false }]);
    setNewText('');
    inputRef.current?.focus();
  }

  function toggle(id: string) {
    setItems(items.map(i => i.id === id ? { ...i, done: !i.done } : i));
  }

  function remove(id: string) {
    setItems(items.filter(i => i.id !== id));
  }

  function cycleLabel(id: string) {
    setItems(items.map(i => {
      if (i.id !== id) return i;
      const idx = LABELS.indexOf((i.label ?? '') as typeof LABELS[number]);
      return { ...i, label: idx === LABELS.length - 1 ? undefined : LABELS[idx + 1] };
    }));
  }

  const todo = items.filter(i => !i.done);
  const done = items.filter(i => i.done);

  return (
    <ScrollView style={styles.container} keyboardDismissMode="interactive">
      <View style={styles.titleRow}>
        <TextInput style={styles.titleInput} value={title} onChangeText={setTitle} placeholder="Untitled" placeholderTextColor="#6B6B6B" />
        <Text style={styles.status}>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : ''}</Text>
      </View>

      <View style={styles.addRow}>
        <TextInput
          ref={inputRef}
          style={styles.addInput}
          value={newText}
          onChangeText={setNewText}
          placeholder="Add item..."
          placeholderTextColor="#6B6B6B"
          onSubmitEditing={addItem}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={addItem}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {todo.map(item => (
        <ItemRow key={item.id} item={item} onToggle={toggle} onRemove={remove} onCycleLabel={cycleLabel} />
      ))}

      {done.length > 0 && (
        <View style={styles.doneSection}>
          <Text style={styles.doneLabel}>Done · {done.length}</Text>
          {done.map(item => (
            <ItemRow key={item.id} item={item} onToggle={toggle} onRemove={remove} onCycleLabel={cycleLabel} faded />
          ))}
        </View>
      )}

      {items.length === 0 && (
        <Text style={styles.emptyText}>Add your first item above</Text>
      )}
    </ScrollView>
  );
}

function ItemRow({ item, onToggle, onRemove, onCycleLabel, faded }: {
  item: TodoItem;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onCycleLabel: (id: string) => void;
  faded?: boolean;
}) {
  return (
    <View style={[styles.itemRow, faded && { opacity: 0.5 }]}>
      <TouchableOpacity onPress={() => onToggle(item.id)} style={[styles.checkbox, item.done && styles.checkboxDone]}>
        {item.done && <Text style={styles.checkmark}>{'✓'}</Text>}
      </TouchableOpacity>
      <Text style={[styles.itemText, item.done && styles.itemTextDone]} numberOfLines={2}>{item.text}</Text>
      {item.label && (
        <TouchableOpacity onPress={() => onCycleLabel(item.id)}>
          <View style={[styles.labelBadge, { backgroundColor: (LABEL_COLORS[item.label] ?? '#6B6B6B') + '30' }]}>
            <Text style={[styles.labelText, { color: LABEL_COLORS[item.label] ?? '#6B6B6B' }]}>{item.label}</Text>
          </View>
        </TouchableOpacity>
      )}
      {!item.label && (
        <TouchableOpacity onPress={() => onCycleLabel(item.id)}>
          <Text style={styles.addLabel}>+ label</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => onRemove(item.id)} hitSlop={8}>
        <Text style={styles.removeBtn}>{'×'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  titleInput: { flex: 1, fontSize: 20, fontWeight: '600', color: '#F5F5F5' },
  status: { fontSize: 12, color: '#6B6B6B' },
  addRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  addInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#F5F5F5', backgroundColor: '#1E1E1E', borderRadius: 8, borderWidth: 1, borderColor: '#2A2A2A' },
  addBtn: { backgroundColor: '#F5F5F5', paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { fontSize: 14, fontWeight: '600', color: '#0A0A0A' },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8, gap: 10, borderRadius: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#6B6B6B', alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: '#F5F5F5', borderColor: '#F5F5F5' },
  checkmark: { fontSize: 12, color: '#0A0A0A', fontWeight: '700' },
  itemText: { flex: 1, fontSize: 14, color: '#F5F5F5' },
  itemTextDone: { textDecorationLine: 'line-through', color: '#6B6B6B' },
  labelBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  labelText: { fontSize: 11, fontWeight: '600' },
  addLabel: { fontSize: 11, color: '#6B6B6B' },
  removeBtn: { fontSize: 18, color: '#6B6B6B' },
  doneSection: { marginTop: 20 },
  doneLabel: { fontSize: 12, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#6B6B6B', textAlign: 'center', marginTop: 40 },
});

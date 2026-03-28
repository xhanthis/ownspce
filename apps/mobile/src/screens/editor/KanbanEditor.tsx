import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from 'react-native';
import type { KanbanColumn, KanbanCard, KanbanContent } from '@ownspce/core';
import { useAutoSave } from '../../hooks/useAutoSave';

interface Page { id: string; title: string; content: unknown }

function uid() { return Math.random().toString(36).slice(2, 10); }

export default function KanbanEditor({ page }: { page: Page }) {
  const initial = page.content as KanbanContent | null;
  const [title, setTitle] = useState(page.title);
  const [columns, setColumns] = useState<KanbanColumn[]>(initial?.columns ?? []);

  const content: KanbanContent = { columns };
  const { saveStatus } = useAutoSave(page.id, content, title);

  function addColumn() {
    setColumns([...columns, { id: uid(), title: 'New Column', cards: [] }]);
  }

  function renameColumn(colId: string, name: string) {
    setColumns(columns.map(c => c.id === colId ? { ...c, title: name } : c));
  }

  function deleteColumn(colId: string) {
    Alert.alert('Delete column?', 'All cards will be removed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setColumns(columns.filter(c => c.id !== colId)) },
    ]);
  }

  function addCard(colId: string, cardTitle: string) {
    if (!cardTitle.trim()) return;
    setColumns(columns.map(c =>
      c.id === colId ? { ...c, cards: [...c.cards, { id: uid(), title: cardTitle.trim() }] } : c
    ));
  }

  function deleteCard(colId: string, cardId: string) {
    setColumns(columns.map(c =>
      c.id === colId ? { ...c, cards: c.cards.filter(k => k.id !== cardId) } : c
    ));
  }

  function moveCard(cardId: string, fromColId: string) {
    const otherCols = columns.filter(c => c.id !== fromColId);
    if (otherCols.length === 0) return;

    const buttons = otherCols.map(c => ({
      text: c.title,
      onPress: () => {
        const fromCol = columns.find(col => col.id === fromColId)!;
        const card = fromCol.cards.find(k => k.id === cardId)!;
        setColumns(columns.map(col => {
          if (col.id === fromColId) return { ...col, cards: col.cards.filter(k => k.id !== cardId) };
          if (col.id === c.id) return { ...col, cards: [...col.cards, card] };
          return col;
        }));
      },
    }));
    buttons.push({ text: 'Cancel', onPress: () => {} });
    Alert.alert('Move to...', undefined, buttons);
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <TextInput style={styles.titleInput} value={title} onChangeText={setTitle} placeholder="Untitled" placeholderTextColor="#6B6B6B" />
        <Text style={styles.status}>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : ''}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.board}>
        {columns.map(col => (
          <ColumnView
            key={col.id}
            column={col}
            onRename={renameColumn}
            onDelete={deleteColumn}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
            onMoveCard={moveCard}
          />
        ))}
        <TouchableOpacity style={styles.addColBtn} onPress={addColumn}>
          <Text style={styles.addColText}>+ Add column</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function ColumnView({ column, onRename, onDelete, onAddCard, onDeleteCard, onMoveCard }: {
  column: KanbanColumn;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onAddCard: (colId: string, title: string) => void;
  onDeleteCard: (colId: string, cardId: string) => void;
  onMoveCard: (cardId: string, fromColId: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [colTitle, setColTitle] = useState(column.title);
  const [newCard, setNewCard] = useState('');
  const [adding, setAdding] = useState(false);

  function submitRename() {
    setEditing(false);
    if (colTitle.trim()) onRename(column.id, colTitle.trim());
  }

  function submitCard() {
    if (newCard.trim()) {
      onAddCard(column.id, newCard);
      setNewCard('');
    }
    setAdding(false);
  }

  return (
    <View style={styles.column}>
      <View style={styles.colHeader}>
        {editing ? (
          <TextInput
            style={styles.colTitleInput}
            value={colTitle}
            onChangeText={setColTitle}
            onBlur={submitRename}
            onSubmitEditing={submitRename}
            autoFocus
          />
        ) : (
          <TouchableOpacity onPress={() => setEditing(true)} style={{ flex: 1 }}>
            <Text style={styles.colTitle}>{column.title}</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.colCount}>{column.cards.length}</Text>
        <TouchableOpacity onPress={() => onDelete(column.id)} hitSlop={8}>
          <Text style={styles.colDelete}>{'×'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.cardList} nestedScrollEnabled>
        {column.cards.map(card => (
          <TouchableOpacity
            key={card.id}
            style={styles.card}
            onLongPress={() => onMoveCard(card.id, column.id)}
            delayLongPress={300}
          >
            <Text style={styles.cardTitle} numberOfLines={3}>{card.title}</Text>
            <TouchableOpacity onPress={() => onDeleteCard(column.id, card.id)} hitSlop={8}>
              <Text style={styles.cardDelete}>{'×'}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {adding ? (
        <View style={styles.addCardForm}>
          <TextInput
            style={styles.addCardInput}
            value={newCard}
            onChangeText={setNewCard}
            placeholder="Card title..."
            placeholderTextColor="#6B6B6B"
            onSubmitEditing={submitCard}
            autoFocus
          />
          <View style={styles.addCardActions}>
            <TouchableOpacity onPress={submitCard} style={styles.addCardBtn}>
              <Text style={styles.addCardBtnText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAdding(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setAdding(true)} style={styles.addCardTrigger}>
          <Text style={styles.addCardTriggerText}>+ Add card</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16, gap: 8 },
  titleInput: { flex: 1, fontSize: 20, fontWeight: '600', color: '#F5F5F5' },
  status: { fontSize: 12, color: '#6B6B6B' },
  board: { paddingHorizontal: 12, gap: 12, paddingBottom: 24 },
  column: { width: 260, backgroundColor: '#141414', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#2A2A2A', maxHeight: 500 },
  colHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  colTitle: { fontSize: 14, fontWeight: '600', color: '#F5F5F5' },
  colTitleInput: { flex: 1, fontSize: 14, fontWeight: '600', color: '#F5F5F5', borderBottomWidth: 1, borderBottomColor: '#F5F5F5', paddingVertical: 0 },
  colCount: { fontSize: 12, color: '#6B6B6B' },
  colDelete: { fontSize: 18, color: '#6B6B6B' },
  cardList: { gap: 8 },
  card: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#1E1E1E', borderRadius: 8, padding: 10, marginBottom: 6, gap: 8, borderWidth: 1, borderColor: '#2A2A2A' },
  cardTitle: { flex: 1, fontSize: 13, color: '#F5F5F5' },
  cardDelete: { fontSize: 16, color: '#6B6B6B' },
  addCardForm: { gap: 8, marginTop: 8 },
  addCardInput: { fontSize: 13, color: '#F5F5F5', backgroundColor: '#1E1E1E', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, borderWidth: 1, borderColor: '#2A2A2A' },
  addCardActions: { flexDirection: 'row', gap: 8 },
  addCardBtn: { backgroundColor: '#F5F5F5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  addCardBtnText: { fontSize: 12, fontWeight: '600', color: '#0A0A0A' },
  cancelText: { fontSize: 12, color: '#6B6B6B', paddingVertical: 6 },
  addCardTrigger: { marginTop: 8, paddingVertical: 6 },
  addCardTriggerText: { fontSize: 12, color: '#6B6B6B' },
  addColBtn: { width: 200, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#2A2A2A', borderStyle: 'dashed' },
  addColText: { fontSize: 13, color: '#6B6B6B' },
});

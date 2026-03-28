import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView } from 'react-native';
import { useAutoSave } from '../../hooks/useAutoSave';
import type { ScratchContent } from '@ownspce/core';

interface Page {
  id: string;
  title: string;
  content: unknown;
}

export default function ScratchEditor({ page }: { page: Page }) {
  const initial = page.content as ScratchContent | null;
  const [title, setTitle] = useState(page.title);
  const [body, setBody] = useState(extractText(initial));

  const content: ScratchContent = { json: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: body }] }] } };
  const { saveStatus } = useAutoSave(page.id, content, title);

  return (
    <ScrollView style={styles.container} keyboardDismissMode="interactive">
      <View style={styles.titleRow}>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Untitled"
          placeholderTextColor="#6B6B6B"
        />
        <Text style={styles.status}>
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : ''}
        </Text>
      </View>
      <TextInput
        style={styles.body}
        value={body}
        onChangeText={setBody}
        placeholder="Start writing..."
        placeholderTextColor="#6B6B6B"
        multiline
        textAlignVertical="top"
      />
    </ScrollView>
  );
}

function extractText(content: ScratchContent | null): string {
  if (!content?.json) return '';
  try {
    const doc = content.json as { content?: { content?: { text?: string }[] }[] };
    return (doc.content ?? [])
      .map(block => (block.content ?? []).map(n => n.text ?? '').join(''))
      .join('\n');
  } catch {
    return '';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  titleInput: { flex: 1, fontSize: 20, fontWeight: '600', color: '#F5F5F5' },
  status: { fontSize: 12, color: '#6B6B6B' },
  body: { fontSize: 15, color: '#F5F5F5', lineHeight: 24, minHeight: 400 },
});

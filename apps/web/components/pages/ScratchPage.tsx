'use client';

import { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useAutoSave } from '@/hooks/useAutoSave';
import type { ScratchContent } from '@ownspce/core';

interface Page {
  id: string;
  title: string;
  content: unknown;
}

export default function ScratchPage({ page }: { page: Page }) {
  const initial = page.content as ScratchContent | null;
  const [title, setTitle] = useState(page.title);
  const contentRef = useRef<Record<string, unknown> | null>(null);
  const [editorJson, setEditorJson] = useState<Record<string, unknown>>(
    initial?.json ?? {}
  );

  const { saveStatus } = useAutoSave(
    page.id,
    { json: editorJson } as ScratchContent,
    title
  );

  const editor = useEditor({
    extensions: [StarterKit],
    content: initial?.json ?? '',
    editorProps: {
      attributes: {
        class:
          'outline-none min-h-[60vh] text-sm leading-relaxed prose dark:prose-invert max-w-none',
      },
    },
    onUpdate({ editor }) {
      const json = editor.getJSON();
      contentRef.current = json;
      setEditorJson(json);
    },
  });

  const toolbarButtons = editor
    ? [
        {
          label: 'B',
          action: () => editor.chain().focus().toggleBold().run(),
          active: editor.isActive('bold'),
        },
        {
          label: 'I',
          action: () => editor.chain().focus().toggleItalic().run(),
          active: editor.isActive('italic'),
        },
        {
          label: 'S',
          action: () => editor.chain().focus().toggleStrike().run(),
          active: editor.isActive('strike'),
        },
        {
          label: 'H1',
          action: () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          active: editor.isActive('heading', { level: 1 }),
        },
        {
          label: 'H2',
          action: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          active: editor.isActive('heading', { level: 2 }),
        },
        {
          label: '• List',
          action: () => editor.chain().focus().toggleBulletList().run(),
          active: editor.isActive('bulletList'),
        },
        {
          label: '1. List',
          action: () => editor.chain().focus().toggleOrderedList().run(),
          active: editor.isActive('orderedList'),
        },
        {
          label: '❝',
          action: () => editor.chain().focus().toggleBlockquote().run(),
          active: editor.isActive('blockquote'),
        },
      ]
    : [];

  return (
    <div className="p-8 max-w-3xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold bg-transparent outline-none border-none w-full"
          placeholder="Untitled"
        />
        <span className="text-xs text-zinc-400 shrink-0 ml-4">
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : ''}
        </span>
      </div>

      {editor && (
        <div className="flex items-center gap-1 mb-4 pb-3 border-b border-[#E0E0E0] dark:border-zinc-800">
          {toolbarButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                btn.active
                  ? 'bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A]'
                  : 'hover:bg-[#F2F2F2] dark:hover:bg-zinc-800 text-zinc-500'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}

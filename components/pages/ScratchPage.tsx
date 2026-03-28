'use client'

import { useEffect, useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useDebounce } from 'use-debounce'
import { savePage, loadPage } from '@/lib/storage'
import type { ScratchPage as ScratchPageType, PageIndexRow } from '@/lib/types'

interface Props { page: PageIndexRow }

export default function ScratchPage({ page }: Props) {
  const [title, setTitle] = useState(page.title)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved')
  const [ready, setReady] = useState(false)

  const persist = useCallback((content: string, currentTitle: string) => {
    setSaveStatus('saving')
    const data: ScratchPageType = {
      id: page.id, type: 'scratch', title: currentTitle,
      updatedAt: new Date().toISOString(), content,
    }
    savePage(page.id, data)
    fetch(`/api/pages/${page.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: currentTitle }),
    }).then(() => setSaveStatus('saved'))
  }, [page.id])

  const [debouncedPersist] = useDebounce(persist, 1000)

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[60vh] text-sm leading-relaxed prose dark:prose-invert max-w-none',
      },
    },
    onUpdate({ editor }) {
      if (!ready) return
      debouncedPersist(JSON.stringify(editor.getJSON()), title)
    },
  })

  // Load stored content
  useEffect(() => {
    if (!editor) return
    const stored = loadPage(page.id) as ScratchPageType | null
    if (stored?.type === 'scratch') {
      setTitle(stored.title)
      try {
        editor.commands.setContent(JSON.parse(stored.content))
      } catch {
        editor.commands.setContent(stored.content)
      }
    }
    setReady(true)
  }, [editor, page.id])

  function handleTitleChange(val: string) {
    setTitle(val)
    if (editor) debouncedPersist(JSON.stringify(editor.getJSON()), val)
  }

  return (
    <div className="p-8 max-w-3xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <input
          value={title}
          onChange={e => handleTitleChange(e.target.value)}
          className="text-xl font-semibold bg-transparent outline-none border-none w-full"
          placeholder="Untitled"
        />
        <span className="text-xs text-zinc-400 shrink-0 ml-4">{saveStatus === 'saving' ? 'Saving…' : 'Saved'}</span>
      </div>

      {/* Toolbar */}
      {editor && (
        <div className="flex items-center gap-1 mb-4 pb-3 border-b border-[#E0E0E0] dark:border-zinc-800">
          {[
            { label: 'B', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
            { label: 'I', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
            { label: 'S', action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
            { label: 'H1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
            { label: 'H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
            { label: '• List', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
            { label: '1. List', action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
            { label: '❝', action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
          ].map(btn => (
            <button
              key={btn.label}
              onClick={btn.action}
              className={`px-2 py-1 text-xs rounded transition-colors ${btn.active ? 'bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A]' : 'hover:bg-[#F2F2F2] dark:hover:bg-zinc-800 text-zinc-500'}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}

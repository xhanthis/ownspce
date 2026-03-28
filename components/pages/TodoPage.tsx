'use client'

import { useState, useCallback, KeyboardEvent } from 'react'
import { useDebounce } from 'use-debounce'
import { useEffect, useRef } from 'react'
import { savePage, loadPage } from '@/lib/storage'
import type { TodoPage as TodoPageType, TodoItem, PageIndexRow } from '@/lib/types'

function uid() { return Math.random().toString(36).slice(2, 10) }

const LABELS = ['work', 'personal', 'urgent', 'later']
const LABEL_COLORS: Record<string, string> = {
  work: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  personal: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  later: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
}

interface Props { page: PageIndexRow }

export default function TodoPage({ page }: Props) {
  const [title, setTitle] = useState(page.title)
  const [items, setItems] = useState<TodoItem[]>([])
  const [newText, setNewText] = useState('')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved')
  const inputRef = useRef<HTMLInputElement>(null)

  // Load from storage on mount
  useEffect(() => {
    const stored = loadPage(page.id) as TodoPageType | null
    if (stored?.type === 'todo') {
      setItems(stored.items)
      setTitle(stored.title)
    }
  }, [page.id])

  const persist = useCallback((nextItems: TodoItem[], nextTitle: string) => {
    setSaveStatus('saving')
    const content: TodoPageType = {
      id: page.id, type: 'todo', title: nextTitle,
      updatedAt: new Date().toISOString(), items: nextItems,
    }
    savePage(page.id, content)
    fetch(`/api/pages/${page.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: nextTitle }),
    })
    setSaveStatus('saved')
  }, [page.id])

  const [debouncedPersist] = useDebounce(persist, 800)

  function updateItems(next: TodoItem[]) {
    setItems(next)
    debouncedPersist(next, title)
  }

  function addItem() {
    if (!newText.trim()) return
    const next = [...items, { id: uid(), text: newText.trim(), done: false }]
    setNewText('')
    updateItems(next)
    inputRef.current?.focus()
  }

  function handleKey(e: KeyboardEvent) { if (e.key === 'Enter') addItem() }

  function toggle(id: string) {
    updateItems(items.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }

  function remove(id: string) {
    updateItems(items.filter(i => i.id !== id))
  }

  function cycleLabel(id: string) {
    updateItems(items.map(i => {
      if (i.id !== id) return i
      const idx = LABELS.indexOf(i.label ?? '')
      return { ...i, label: idx === LABELS.length - 1 ? undefined : LABELS[idx + 1] }
    }))
  }

  const todo = items.filter(i => !i.done)
  const done = items.filter(i => i.done)

  return (
    <div className="p-8 max-w-2xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <input
          value={title}
          onChange={e => { setTitle(e.target.value); debouncedPersist(items, e.target.value) }}
          className="text-xl font-semibold bg-transparent outline-none border-none w-full"
          placeholder="Untitled"
        />
        <span className="text-xs text-zinc-400 shrink-0 ml-4">{saveStatus === 'saving' ? 'Saving…' : 'Saved'}</span>
      </div>

      {/* Add item */}
      <div className="flex gap-2 mb-6">
        <input
          ref={inputRef}
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Add item…"
          className="flex-1 px-3 py-2 text-sm bg-[#F2F2F2] dark:bg-zinc-800 rounded-input outline-none border border-transparent focus:border-[#E0E0E0] dark:focus:border-zinc-600"
        />
        <button
          onClick={addItem}
          className="px-3 py-2 text-sm font-medium bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A] rounded-input hover:opacity-80 transition-opacity"
        >
          Add
        </button>
      </div>

      {/* Todo items */}
      <div className="flex flex-col gap-1">
        {todo.map(item => (
          <ItemRow key={item.id} item={item} onToggle={toggle} onRemove={remove} onCycleLabel={cycleLabel} />
        ))}
      </div>

      {/* Done */}
      {done.length > 0 && (
        <div className="mt-6">
          <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Done · {done.length}</p>
          <div className="flex flex-col gap-1 opacity-50">
            {done.map(item => (
              <ItemRow key={item.id} item={item} onToggle={toggle} onRemove={remove} onCycleLabel={cycleLabel} />
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <p className="text-sm text-zinc-400 text-center py-8">Add your first item above</p>
      )}
    </div>
  )
}

function ItemRow({ item, onToggle, onRemove, onCycleLabel }: {
  item: TodoItem
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onCycleLabel: (id: string) => void
}) {
  return (
    <div className="group flex items-center gap-3 px-3 py-2 rounded-input hover:bg-[#F2F2F2] dark:hover:bg-zinc-800 transition-colors">
      <button
        onClick={() => onToggle(item.id)}
        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${item.done ? 'bg-[#0A0A0A] dark:bg-white border-[#0A0A0A] dark:border-white' : 'border-[#E0E0E0] dark:border-zinc-600'}`}
      >
        {item.done && <span className="text-white dark:text-[#0A0A0A] text-[10px]">✓</span>}
      </button>
      <span className={`flex-1 text-sm ${item.done ? 'line-through text-zinc-400' : ''}`}>{item.text}</span>
      {item.label && (
        <button onClick={() => onCycleLabel(item.id)} className={`text-xs px-1.5 py-0.5 rounded-full ${LABEL_COLORS[item.label]}`}>
          {item.label}
        </button>
      )}
      {!item.label && (
        <button onClick={() => onCycleLabel(item.id)} className="hidden group-hover:block text-xs text-zinc-400 hover:text-zinc-600">
          + label
        </button>
      )}
      <button onClick={() => onRemove(item.id)} className="hidden group-hover:block text-zinc-300 hover:text-red-400 text-sm transition-colors">
        ×
      </button>
    </div>
  )
}

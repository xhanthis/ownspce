'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mutate } from 'swr'
import type { PageIndexRow, PageType } from '@/lib/types'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(d => d.data)

const PAGE_TYPES: { type: PageType; label: string; icon: string; description: string }[] = [
  { type: 'scratch', label: 'Scratch', icon: '✏️', description: 'Quick notes with rich text' },
  { type: 'rightnow', label: 'Right Now', icon: '✈️', description: 'ATC runway for your priorities' },
  { type: 'todo', label: 'Todo', icon: '✓', description: 'Simple checklist' },
  { type: 'kanban', label: 'Kanban', icon: '▦', description: 'Drag-and-drop board' },
]

const TYPE_BADGE: Record<PageType, string> = {
  scratch: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  rightnow: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  todo: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  kanban: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: pages = [] } = useSWR<PageIndexRow[]>('/api/pages', fetcher)
  const [newPageOpen, setNewPageOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  async function createPage(type: PageType) {
    setCreating(true)
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_type: type, title: 'Untitled' }),
    })
    const json = await res.json()
    setCreating(false)
    setNewPageOpen(false)
    mutate('/api/pages')
    router.push(`/pages/${json.data.id}`)
  }

  function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <Button onClick={() => setNewPageOpen(true)}>+ New Page</Button>
      </div>

      {pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <p className="text-zinc-400 text-sm">No pages yet.</p>
          <Button onClick={() => setNewPageOpen(true)}>Create your first page</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map(page => (
            <Link
              key={page.id}
              href={`/pages/${page.id}`}
              className="group flex flex-col gap-3 p-4 rounded-card border border-[#E0E0E0] dark:border-zinc-800 bg-[#F2F2F2] dark:bg-zinc-900 hover:border-[#0A0A0A] dark:hover:border-zinc-600 transition-colors fade-in"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-sm truncate">{page.title}</p>
                <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded-full ${TYPE_BADGE[page.page_type]}`}>
                  {page.page_type}
                </span>
              </div>
              <p className="text-xs text-zinc-400">{formatDate(page.updated_at)}</p>
            </Link>
          ))}
        </div>
      )}

      <Modal open={newPageOpen} onClose={() => setNewPageOpen(false)} title="New Page">
        <div className="grid grid-cols-2 gap-3">
          {PAGE_TYPES.map(pt => (
            <button
              key={pt.type}
              onClick={() => createPage(pt.type)}
              disabled={creating}
              className="flex flex-col gap-1 p-4 rounded-card border border-[#E0E0E0] dark:border-zinc-700 hover:border-[#0A0A0A] dark:hover:border-white text-left transition-colors disabled:opacity-50"
            >
              <span className="text-xl">{pt.icon}</span>
              <span className="font-medium text-sm">{pt.label}</span>
              <span className="text-xs text-zinc-400">{pt.description}</span>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}

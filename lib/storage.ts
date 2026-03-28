'use client'

import type { PageContent } from '@/lib/types'

const key = (pageId: string) => `ownspce_page_${pageId}`

export function loadPage(pageId: string): PageContent | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(key(pageId))
  if (!raw) return null
  try {
    return JSON.parse(raw) as PageContent
  } catch {
    return null
  }
}

export function savePage(pageId: string, content: PageContent): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key(pageId), JSON.stringify(content))
}

export function deletePage(pageId: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key(pageId))
}

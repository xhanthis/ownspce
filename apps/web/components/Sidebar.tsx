'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { PAGE_TYPES } from '@ownspce/core';
import type { PageType } from '@ownspce/core';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((d) => d.data);

interface PageRow {
  id: string;
  title: string;
  type: PageType;
  isPinned: boolean;
  updatedAt: string;
}

const TYPE_LABELS: Record<PageType, string> = {
  scratch: 'Scratch',
  rightnow: 'Right Now',
  todo: 'Todo',
  story: 'Story',
  kanban: 'Kanban',
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: pages = [] } = useSWR<PageRow[]>('/api/pages', fetcher);
  const [newPageOpen, setNewPageOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  async function createPage(type: PageType) {
    setCreating(true);
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, title: 'Untitled' }),
    });
    const json = await res.json();
    setCreating(false);
    setNewPageOpen(false);
    mutate('/api/pages');
    router.push(`/pages/${json.data.id}`);
  }

  const grouped = PAGE_TYPES.filter((pt) => pt.type !== 'story')
    .map((pt) => ({
      ...pt,
      pages: pages.filter((p) => p.type === pt.type),
    }))
    .filter((g) => g.pages.length > 0);

  return (
    <>
      <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-[#E0E0E0] dark:border-zinc-800 bg-[#F2F2F2] dark:bg-zinc-900">
        <div className="px-4 py-5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="ownspce"
              width={120}
              height={30}
              className="dark:hidden"
              priority
            />
            <Image
              src="/logo-dark.svg"
              alt="ownspce"
              width={120}
              height={30}
              className="hidden dark:block"
              priority
            />
          </Link>
        </div>

        <div className="px-3 mb-3">
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={() => setNewPageOpen(true)}
          >
            + New Page
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4 flex flex-col gap-4">
          {grouped.map((group) => (
            <div key={group.type}>
              <p className="px-2 mb-1 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                {TYPE_LABELS[group.type]}
              </p>
              {group.pages.map((page) => (
                <Link
                  key={page.id}
                  href={`/pages/${page.id}`}
                  className={`flex items-center px-2 py-1.5 rounded-input text-sm truncate transition-colors ${
                    pathname === `/pages/${page.id}`
                      ? 'bg-white dark:bg-zinc-800 font-medium'
                      : 'hover:bg-white dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {page.title}
                </Link>
              ))}
            </div>
          ))}
          {pages.length === 0 && (
            <p className="px-2 text-xs text-zinc-400">No pages yet</p>
          )}
        </nav>

        <div className="border-t border-[#E0E0E0] dark:border-zinc-800 px-3 py-3">
          <Link
            href="/profile"
            className="block px-2 py-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-[#0A0A0A] dark:hover:text-white rounded-input hover:bg-white dark:hover:bg-zinc-800 transition-colors"
          >
            Profile
          </Link>
        </div>
      </aside>

      <Modal
        open={newPageOpen}
        onClose={() => setNewPageOpen(false)}
        title="New Page"
      >
        <div className="grid grid-cols-2 gap-3">
          {PAGE_TYPES.filter((pt) => pt.type !== 'story').map((pt) => (
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
    </>
  );
}

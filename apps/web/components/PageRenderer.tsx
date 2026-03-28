'use client';

import type { PageType } from '@ownspce/core';
import ScratchPage from '@/components/pages/ScratchPage';
import RightNowPage from '@/components/pages/RightNowPage';
import TodoPage from '@/components/pages/TodoPage';
import KanbanPage from '@/components/pages/KanbanPage';

interface Page {
  id: string;
  title: string;
  type: PageType;
  content: unknown;
  isPinned: boolean;
}

const editors: Record<string, React.ComponentType<{ page: Page }>> = {
  scratch: ScratchPage,
  rightnow: RightNowPage,
  todo: TodoPage,
  kanban: KanbanPage,
};

export default function PageRenderer({ page }: { page: Page }) {
  const Editor = editors[page.type];
  if (!Editor) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400">
        Editor not available for this page type.
      </div>
    );
  }
  return <Editor page={page} />;
}

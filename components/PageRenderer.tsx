import type { PageIndexRow, PageType } from '@/lib/types'
import TodoPage from '@/components/pages/TodoPage'
import ScratchPage from '@/components/pages/ScratchPage'
import RightNowPage from '@/components/pages/RightNowPage'
import KanbanPage from '@/components/pages/KanbanPage'

const MAP: Record<PageType, React.ComponentType<{ page: PageIndexRow }>> = {
  todo: TodoPage,
  scratch: ScratchPage,
  rightnow: RightNowPage,
  kanban: KanbanPage,
}

export default function PageRenderer({ page }: { page: PageIndexRow }) {
  const Component = MAP[page.page_type]
  if (!Component) return <div className="p-8 text-zinc-400">Unknown page type: {page.page_type}</div>
  return <Component page={page} />
}

export type PageType = 'scratch' | 'rightnow' | 'todo' | 'kanban'

export interface BasePage {
  id: string
  type: PageType
  title: string
  updatedAt: string
}

export interface ScratchPage extends BasePage {
  type: 'scratch'
  content: string // TipTap JSON string
}

export interface RightNowItem {
  id: string
  text: string
  createdAt: string
}

export interface RightNowPage extends BasePage {
  type: 'rightnow'
  active: RightNowItem[]   // max 3
  onDeck: RightNowItem[]   // max 5
  holding: RightNowItem[]
}

export interface TodoItem {
  id: string
  text: string
  done: boolean
  label?: string
}

export interface TodoPage extends BasePage {
  type: 'todo'
  items: TodoItem[]
}

export interface KanbanCard {
  id: string
  title: string
  notes?: string
}

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
}

export interface KanbanPage extends BasePage {
  type: 'kanban'
  columns: KanbanColumn[]
}

export type PageContent = ScratchPage | RightNowPage | TodoPage | KanbanPage

// NeonDB row types
export interface PageIndexRow {
  id: string
  user_id: string
  page_type: PageType
  title: string
  drive_file_id: string | null
  updated_at: string
  is_deleted: boolean
}

export interface UserRow {
  id: string
  username: string
  password_hash: string
  theme: 'dark' | 'light'
  created_at: string
}

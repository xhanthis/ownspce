export type PageType = 'scratch' | 'rightnow' | 'todo' | 'story' | 'kanban';

export interface ScratchContent {
  json: Record<string, unknown>;
}

export interface RightNowItem {
  id: string;
  text: string;
  createdAt: string;
}

export interface RightNowContent {
  active: RightNowItem[];
  onDeck: RightNowItem[];
  holding: RightNowItem[];
}

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  label?: string;
}

export interface TodoContent {
  items: TodoItem[];
}

export interface KanbanCard {
  id: string;
  title: string;
  notes?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface KanbanContent {
  columns: KanbanColumn[];
}

export type PageContent =
  | ScratchContent
  | RightNowContent
  | TodoContent
  | KanbanContent;

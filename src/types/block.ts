export type BlockType =
  | 'text'
  | 'heading'
  | 'todo'
  | 'bullet'
  | 'numbered'
  | 'divider'
  | 'quote'
  | 'code'
  | 'priority_item'
  | 'task_item'
  | 'kanban_card';

export type HeadingLevel = 1 | 2 | 3;

export interface TextContent {
  text: string;
}

export interface HeadingContent {
  text: string;
  level: HeadingLevel;
}

export interface TodoContent {
  text: string;
  checked: boolean;
  depth?: number; // 0 = top-level, 1 = nested (max 1)
}

export interface BulletContent {
  text: string;
  depth?: number;
}

export interface NumberedContent {
  text: string;
  depth?: number;
}

export interface DividerContent {
  style?: 'solid' | 'dashed';
}

export interface QuoteContent {
  text: string;
}

export interface CodeContent {
  text: string;
  language?: string;
}

export interface PriorityItemContent {
  text: string;
  checked: boolean;
  section: 'now' | 'next' | 'later';
  archivedAt?: number;
}

export interface TaskItemContent {
  text: string;
  checked: boolean;
  sectionId: string;
  depth?: number;
}

export interface KanbanCardContent {
  title: string;
  description?: string;
  columnId: string;
  checklist?: { text: string; checked: boolean }[];
}

export type BlockContent =
  | TextContent
  | HeadingContent
  | TodoContent
  | BulletContent
  | NumberedContent
  | DividerContent
  | QuoteContent
  | CodeContent
  | PriorityItemContent
  | TaskItemContent
  | KanbanCardContent;

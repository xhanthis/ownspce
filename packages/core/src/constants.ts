import type { PageType } from './types/page';

export const ACTIVE_MAX = 3;
export const ONDECK_MAX = 5;

export const PAGE_TYPES: {
  type: PageType;
  label: string;
  icon: string;
  description: string;
}[] = [
  { type: 'scratch', label: 'Scratch', icon: '✏️', description: 'Blank canvas' },
  { type: 'rightnow', label: 'Right Now', icon: '🛬', description: 'Priority queue' },
  { type: 'todo', label: 'Todo', icon: '✅', description: 'Checklist' },
  { type: 'story', label: 'Story', icon: '📖', description: 'Long-form writing' },
  { type: 'kanban', label: 'Kanban', icon: '📋', description: 'Board view' },
];

export const LABELS = ['work', 'personal', 'urgent', 'ideas', 'health'] as const;

export const LABEL_COLORS: Record<string, string> = {
  work: '#3B82F6',
  personal: '#8B5CF6',
  urgent: '#EF4444',
  ideas: '#F59E0B',
  health: '#22C55E',
};

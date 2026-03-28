export type TemplateType = 'blank' | 'right_now' | 'story' | 'todo' | 'kanban';

export const TEMPLATE_LABELS: Record<TemplateType, string> = {
  blank: 'Blank',
  right_now: 'Right Now',
  story: 'Story',
  todo: 'Todo',
  kanban: 'Kanban',
};

export const TEMPLATE_DESCRIPTIONS: Record<TemplateType, string> = {
  blank: 'Freeform writing & notes',
  right_now: 'Focused priority list',
  story: 'Long-form article',
  todo: 'Task list with sections',
  kanban: 'Visual board',
};

export const TEMPLATE_ICONS: Record<TemplateType, string> = {
  blank: '📄',
  right_now: '🎯',
  story: '📖',
  todo: '✅',
  kanban: '📋',
};

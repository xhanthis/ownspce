import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'workspaces',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'emoji', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'tabs',
      columns: [
        { name: 'workspace_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'template_type', type: 'string' },
        { name: 'emoji', type: 'string', isOptional: true },
        { name: 'tab_order', type: 'number' },
        { name: 'settings', type: 'string', isOptional: true },
        { name: 'pinned', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'blocks',
      columns: [
        { name: 'tab_id', type: 'string', isIndexed: true },
        { name: 'type', type: 'string' },
        { name: 'content_json', type: 'string' },
        { name: 'block_order', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'sync_queue',
      columns: [
        { name: 'table_name', type: 'string' },
        { name: 'record_id', type: 'string' },
        { name: 'action', type: 'string' },
        { name: 'synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});

import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import { migrations } from './migrations';
import Workspace from './models/Workspace';
import Tab from './models/Tab';
import Block from './models/Block';
import SyncQueue from './models/SyncQueue';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: true,
  onSetUpError: (error) => {
    console.error('[DB] Setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Workspace, Tab, Block, SyncQueue],
});

// Convenience query helpers
export const workspacesCollection = database.get<Workspace>('workspaces');
export const tabsCollection = database.get<Tab>('tabs');
export const blocksCollection = database.get<Block>('blocks');
export const syncQueueCollection = database.get<SyncQueue>('sync_queue');

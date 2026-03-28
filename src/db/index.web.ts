import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { schema } from './schema';
import { migrations } from './migrations';
import Workspace from './models/Workspace';
import Tab from './models/Tab';
import Block from './models/Block';
import SyncQueue from './models/SyncQueue';

const adapter = new LokiJSAdapter({
  schema,
  migrations,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  dbName: 'ownspce',
  onSetUpError: (error: Error) => {
    console.error('[DB] Setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Workspace, Tab, Block, SyncQueue],
});

export const workspacesCollection = database.get<Workspace>('workspaces');
export const tabsCollection = database.get<Tab>('tabs');
export const blocksCollection = database.get<Block>('blocks');
export const syncQueueCollection = database.get<SyncQueue>('sync_queue');

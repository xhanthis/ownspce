import { database, workspacesCollection, tabsCollection, blocksCollection, syncQueueCollection } from './index';
import { generateId } from '../utils/id';
import { orderBetween } from '../utils/order';
import { BlockContent, BlockType } from '../types/block';
import { TemplateType } from '../types/template';
import { SyncAction, SyncTable } from '../types/sync';
import { serializeContent } from '../utils/contentJson';
import { Q } from '@nozbe/watermelondb';

// ─── Sync queue helper ────────────────────────────────────────────────────────
async function enqueueSync(table: SyncTable, recordId: string, action: SyncAction) {
  await syncQueueCollection.create((r) => {
    r._raw.id = generateId();
    r.tableName = table;
    r.recordId = recordId;
    r.action = action;
    r.synced = false;
  });
}

// ─── Workspace mutations ──────────────────────────────────────────────────────
export async function createWorkspace(name: string, color = '#1A1A1A', emoji?: string) {
  return database.write(async () => {
    const ws = await workspacesCollection.create((w) => {
      w._raw.id = generateId();
      w.name = name;
      w.color = color;
      w.emoji = emoji ?? null;
    });
    await enqueueSync('workspaces', ws.id, 'create');
    return ws;
  });
}

export async function updateWorkspace(id: string, changes: { name?: string; color?: string; emoji?: string }) {
  return database.write(async () => {
    const ws = await workspacesCollection.find(id);
    await ws.update((w) => {
      if (changes.name !== undefined) w.name = changes.name;
      if (changes.color !== undefined) w.color = changes.color;
      if (changes.emoji !== undefined) w.emoji = changes.emoji;
    });
    await enqueueSync('workspaces', id, 'update');
    return ws;
  });
}

export async function deleteWorkspace(id: string) {
  return database.write(async () => {
    const ws = await workspacesCollection.find(id);
    // Cascade: delete all tabs and their blocks
    const tabs = await tabsCollection.query(Q.where('workspace_id', id)).fetch();
    for (const tab of tabs) {
      const blocks = await blocksCollection.query(Q.where('tab_id', tab.id)).fetch();
      for (const block of blocks) {
        await block.markAsDeleted();
      }
      await tab.markAsDeleted();
    }
    await ws.markAsDeleted();
    await enqueueSync('workspaces', id, 'delete');
  });
}

// ─── Tab mutations ────────────────────────────────────────────────────────────
export async function createTab(
  workspaceId: string,
  title: string,
  templateType: TemplateType,
  emoji?: string,
) {
  return database.write(async () => {
    // Get current max order
    const existingTabs = await tabsCollection.query(Q.where('workspace_id', workspaceId)).fetch();
    const maxOrder = existingTabs.reduce((max, t) => Math.max(max, t.tabOrder), 0);

    const tab = await tabsCollection.create((t) => {
      t._raw.id = generateId();
      t.workspaceId = workspaceId;
      t.title = title;
      t.templateType = templateType;
      t.emoji = emoji ?? null;
      t.tabOrder = maxOrder + 1000;
      t.pinned = false;
    });
    await enqueueSync('tabs', tab.id, 'create');
    return tab;
  });
}

export async function updateTab(id: string, changes: { title?: string; emoji?: string; pinned?: boolean }) {
  return database.write(async () => {
    const tab = await tabsCollection.find(id);
    await tab.update((t) => {
      if (changes.title !== undefined) t.title = changes.title;
      if (changes.emoji !== undefined) t.emoji = changes.emoji;
      if (changes.pinned !== undefined) t.pinned = changes.pinned;
    });
    await enqueueSync('tabs', id, 'update');
    return tab;
  });
}

export async function deleteTab(id: string) {
  return database.write(async () => {
    const tab = await tabsCollection.find(id);
    const blocks = await blocksCollection.query(Q.where('tab_id', id)).fetch();
    for (const block of blocks) {
      await block.markAsDeleted();
    }
    await tab.markAsDeleted();
    await enqueueSync('tabs', id, 'delete');
  });
}

export async function reorderTab(id: string, beforeOrder: number | null, afterOrder: number | null) {
  return database.write(async () => {
    const tab = await tabsCollection.find(id);
    const newOrder = orderBetween(beforeOrder, afterOrder);
    await tab.update((t) => {
      t.tabOrder = newOrder;
    });
    await enqueueSync('tabs', id, 'update');
  });
}

// ─── Block mutations ──────────────────────────────────────────────────────────
export async function createBlock(
  tabId: string,
  type: BlockType,
  content: BlockContent,
  afterOrder: number | null = null,
) {
  return database.write(async () => {
    const block = await blocksCollection.create((b) => {
      b._raw.id = generateId();
      b.tabId = tabId;
      b.type = type;
      b.contentJson = serializeContent(content);
      b.blockOrder = afterOrder !== null ? afterOrder + 0.5 : 1000;
    });
    await enqueueSync('blocks', block.id, 'create');
    return block;
  });
}

export async function updateBlockContent(id: string, content: BlockContent) {
  return database.write(async () => {
    const block = await blocksCollection.find(id);
    await block.update((b) => {
      b.contentJson = serializeContent(content);
    });
    await enqueueSync('blocks', id, 'update');
    return block;
  });
}

export async function updateBlockType(id: string, type: BlockType, content: BlockContent) {
  return database.write(async () => {
    const block = await blocksCollection.find(id);
    await block.update((b) => {
      b.type = type;
      b.contentJson = serializeContent(content);
    });
    await enqueueSync('blocks', id, 'update');
    return block;
  });
}

export async function deleteBlock(id: string) {
  return database.write(async () => {
    const block = await blocksCollection.find(id);
    await block.markAsDeleted();
    await enqueueSync('blocks', id, 'delete');
  });
}

export async function reorderBlock(id: string, newOrder: number) {
  return database.write(async () => {
    const block = await blocksCollection.find(id);
    await block.update((b) => {
      b.blockOrder = newOrder;
    });
    await enqueueSync('blocks', id, 'update');
  });
}

import { useState, useEffect } from 'react';
import { Q } from '@nozbe/watermelondb';
import { tabsCollection } from '../db';
import Tab from '../db/models/Tab';

export function useTabs(workspaceId: string | null) {
  const [tabs, setTabs] = useState<Tab[]>([]);

  useEffect(() => {
    if (!workspaceId) {
      setTabs([]);
      return;
    }
    const subscription = tabsCollection
      .query(Q.where('workspace_id', workspaceId), Q.sortBy('tab_order', Q.asc))
      .observe()
      .subscribe(setTabs);
    return () => subscription.unsubscribe();
  }, [workspaceId]);

  return tabs;
}

export function useTab(id: string | null) {
  const [tab, setTab] = useState<Tab | null>(null);

  useEffect(() => {
    if (!id) {
      setTab(null);
      return;
    }
    const subscription = tabsCollection.findAndObserve(id).subscribe(setTab);
    return () => subscription.unsubscribe();
  }, [id]);

  return tab;
}

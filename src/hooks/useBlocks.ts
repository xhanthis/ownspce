import { useState, useEffect } from 'react';
import { Q } from '@nozbe/watermelondb';
import { blocksCollection } from '../db';
import Block from '../db/models/Block';

export function useBlocks(tabId: string | null) {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    if (!tabId) {
      setBlocks([]);
      return;
    }
    const subscription = blocksCollection
      .query(Q.where('tab_id', tabId), Q.sortBy('block_order', Q.asc))
      .observe()
      .subscribe(setBlocks);
    return () => subscription.unsubscribe();
  }, [tabId]);

  return blocks;
}

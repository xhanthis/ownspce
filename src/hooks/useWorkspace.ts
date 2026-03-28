import { useState, useEffect } from 'react';
import { Q } from '@nozbe/watermelondb';
import { workspacesCollection } from '../db';
import Workspace from '../db/models/Workspace';

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    const subscription = workspacesCollection
      .query(Q.sortBy('created_at', Q.asc))
      .observe()
      .subscribe(setWorkspaces);
    return () => subscription.unsubscribe();
  }, []);

  return workspaces;
}

export function useWorkspace(id: string | null) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    if (!id) {
      setWorkspace(null);
      return;
    }
    const subscription = workspacesCollection.findAndObserve(id).subscribe(setWorkspace);
    return () => subscription.unsubscribe();
  }, [id]);

  return workspace;
}

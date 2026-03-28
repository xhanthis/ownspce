import { create } from 'zustand';
import { SyncStatus } from '../types/sync';

interface SyncStore {
  status: SyncStatus;
  lastSyncedAt: number | null;
  pendingCount: number;
  errorMessage: string | null;
  setStatus: (s: SyncStatus) => void;
  setLastSynced: (ts: number) => void;
  setPendingCount: (n: number) => void;
  setError: (msg: string | null) => void;
}

export const useSyncStore = create<SyncStore>((set) => ({
  status: 'idle',
  lastSyncedAt: null,
  pendingCount: 0,
  errorMessage: null,
  setStatus: (s) => set({ status: s }),
  setLastSynced: (ts) => set({ lastSyncedAt: ts }),
  setPendingCount: (n) => set({ pendingCount: n }),
  setError: (msg) => set({ errorMessage: msg }),
}));

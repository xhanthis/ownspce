import { create } from 'zustand';

interface UIStore {
  activeWorkspaceId: string | null;
  activeTabId: string | null;
  sidebarOpen: boolean;
  setActiveWorkspace: (id: string) => void;
  setActiveTab: (id: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeWorkspaceId: null,
  activeTabId: null,
  sidebarOpen: false,
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
  setActiveTab: (id) => set({ activeTabId: id }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));

import { create } from 'zustand';

interface EditorStore {
  focusedBlockId: string | null;
  isReordering: boolean;
  setFocusedBlock: (id: string | null) => void;
  setReordering: (v: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  focusedBlockId: null,
  isReordering: false,
  setFocusedBlock: (id) => set({ focusedBlockId: id }),
  setReordering: (v) => set({ isReordering: v }),
}));

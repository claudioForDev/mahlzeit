import { create } from 'zustand';
import * as noteService from '../services/noteService';

interface NoteState {
  text: string;
  saving: boolean;
  error: string | null;
  actions: {
    loadNote: (recipeId: string) => Promise<void>;
    saveNote: (recipeId: string, text: string) => Promise<boolean>; // true = saved
  };
}

export const useNoteStore = create<NoteState>()((set) => {
  // Returns whether the action succeeded, e.g. so the UI only resets input on success
  const run = async (fn: () => Promise<void>) => {
    set({ error: null });
    try {
      await fn();
      return true;
    } catch (e) {
      set({ error: (e as Error).message });
      return false;
    }
  };

  return {
    text: '',
    saving: false,
    error: null,
    actions: {
      loadNote: async (recipeId) => {
        await run(async () => {
          set({ text: '' });
          set({ text: await noteService.getNote(recipeId) });
        });
      },
      saveNote: (recipeId, text) =>
        run(async () => {
          set({ saving: true });
          try {
            await noteService.saveNote(recipeId, text);
            set({ text });
          } finally {
            set({ saving: false });
          }
        }),
    },
  };
});

export const useNoteActions = () => useNoteStore((s) => s.actions);

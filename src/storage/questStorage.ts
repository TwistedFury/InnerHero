import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProgressState = {
  completed: string[];
  completeQuest: (id: string) => void;
  undoQuest: (id: string) => void;
  resetChain: (ids: string[]) => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      completed: [], // quest ids

      completeQuest: (id: string) =>
        set((state) =>
          state.completed.includes(id) ? state : { completed: [...state.completed, id] }
        ),

      undoQuest: (id: string) =>
        set((state) => ({ completed: state.completed.filter((q_id: string) => q_id !== id) })),

      resetChain: (ids: string[]) =>
        set((state) => ({ completed: state.completed.filter((q_id: string) => !ids.includes(q_id)) })),
    }),
    {
      name: 'quest-progress',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
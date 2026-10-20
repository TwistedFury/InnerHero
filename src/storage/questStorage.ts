import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ProgressState } from '../types/quest';

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      completed: [],
      progress: {},
      responses: [],
      drafts: {},
      stepIndexes: {},

      saveAnswer: (questId, stepId, answer) =>
        set((state) => {
          const attempt = state.progress[questId]?.completions ?? 0;
          const responses = state.responses.filter(
            (response) =>
              !(response.questId === questId && response.stepId === stepId && response.attempt === attempt),
          );
          return {
            responses: [
              ...responses,
              { questId, stepId, answer, attempt, createdAt: new Date().toISOString() },
            ],
            drafts: {
              ...state.drafts,
              [questId]: { ...state.drafts[questId], [stepId]: answer },
            },
          };
        }),

      advanceStep: (questId) =>
        set((state) => ({
          stepIndexes: {
            ...state.stepIndexes,
            [questId]: (state.stepIndexes[questId] ?? 0) + 1,
          },
        })),
      
      startQuest: (id, questVersion) =>
        set((state) => {
          if (state.progress[id]?.status === 'in_progress') return state;
          return {
            progress: {
              ...state.progress,
              [id]: {
                status: 'in_progress',
                startedAt: new Date().toISOString(),
                completions: state.progress[id]?.completions ?? 0,
                questVersion
              },
            },
          };
        }),
      
      completeQuest: (id, questVersion) =>
        set((state) => {
          const prev = state.progress[id];
          const now = new Date().toISOString();
          const { [id]: _clearedDraft, ...drafts } = state.drafts;
          return {
            completed: state.completed.includes(id) ? state.completed : [...state.completed, id],
            progress: {
              ...state.progress,
              [id]: {
                status: 'completed',
                startedAt: prev?.startedAt ?? now,
                completedAt: now,
                completions: (prev?.completions ?? 0) + 1,
                questVersion,
              },
            },
            drafts,
            stepIndexes: { ...state.stepIndexes, [id]: 0 },
          };
        }),

      undoQuest: (id) =>
        set((state) => ({
          completed: state.completed.filter((questId) => questId !== id),
          stepIndexes: { ...state.stepIndexes, [id]: 0 },
        })),

      resetChain: (ids) =>
        set((state) => ({
          completed: state.completed.filter((questId) => !ids.includes(questId)),
          stepIndexes: Object.fromEntries(
            Object.entries(state.stepIndexes).filter(([id]) => !ids.includes(id)),
          ),
        })),
    }),
    {
      name: 'quest-progress',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

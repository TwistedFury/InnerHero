import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { QuestAnswer, QuestProgress, QuestResponse } from '../types';

type ProgressState = {
  completed: string[];
  progress: Record<string, QuestProgress>;
  responses: QuestResponse[];
  drafts: Record<string, Record<string, QuestAnswer>>;
  stepIndexes: Record<string, number>;
  saveAnswer: (questId: string, stepId: string, answer: QuestAnswer) => void;
  advanceStep: (questId: string) => void;
  completeQuest: (id: string, questVersion: string) => void;
  undoQuest: (id: string) => void;
  resetChain: (ids: string[]) => void;
};

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

      completeQuest: (id, questVersion) =>
        set((state) => {
          const previous = state.progress[id];
          const nextProgress: QuestProgress = {
            status: 'completed',
            startedAt: previous?.startedAt ?? new Date().toISOString(),
            completedAt: new Date().toISOString(),
            completions: (previous?.completions ?? 0) + 1,
            questVersion,
          };
          return {
            completed: state.completed.includes(id) ? state.completed : [...state.completed, id],
            progress: { ...state.progress, [id]: nextProgress },
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

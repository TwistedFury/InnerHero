import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import milestones from '../data/milestones.json';
import type { Milestone, MilestoneProgress, MilestoneState } from '../types/milestone';
import type { QuestProgress } from '../types/quest';

const milestoneDefinitions = milestones as Milestone[];

function createInitialProgress(): MilestoneProgress[] {
  return milestoneDefinitions.map((milestone) => ({
    milestoneId: milestone.id,
    completed: false,
  }));
}

// Same rule questFinder.ts uses: a quest is "done" once it has been finished at least once.
// A milestone is earned when every quest in required_quests is done and, if
// required_total is set, at least that many quests overall are done.
function isEarned(milestone: Milestone, questProgress: Record<string, QuestProgress>): boolean {
  const done = (id: string) => (questProgress[id]?.completions ?? 0) > 0;
  const required = milestone.required_quests ?? [];
  const total = milestone.required_total ?? 0;

  if (required.length === 0 && total === 0) return false;

  const doneCount = Object.keys(questProgress).filter(done).length;
  return required.every(done) && doneCount >= total;
}

export const useMilestones = create<MilestoneState>()(
  persist(
    (set) => ({
      milestones: milestoneDefinitions,
      progress: createInitialProgress(),
      completeMilestone: (milestoneId) =>
        set((state) => ({
          progress: state.progress.map((milestone) =>
            milestone.milestoneId === milestoneId && !milestone.completed
              ? { ...milestone, completed: true, completedAt: new Date().toISOString() }
              : milestone,
          ),
        })),
      syncMilestones: (questProgress) =>
        set((state) => {
          const next = state.progress.map((entry) => {
            if (entry.completed) return entry;
            const definition = state.milestones.find((m) => m.id === entry.milestoneId);
            return definition && isEarned(definition, questProgress)
              ? { ...entry, completed: true, completedAt: new Date().toISOString() }
              : entry;
          });

          // Nothing new earned: hand back the same state so nothing redraws.
          return next.every((entry, i) => entry === state.progress[i]) ? state : { progress: next };
        }),
      resetMilestones: () =>
        set(() => ({
          progress: createInitialProgress(),
        })),
    }),
    {
      name: 'milestone-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      partialize: (state) => ({ progress: state.progress }),
      merge: (persistedState, currentState) => {
        const persistedProgress = (
          persistedState as Partial<Pick<MilestoneState, 'progress'>> | undefined
        )?.progress;
        const progressById = new Map(
          persistedProgress?.map((milestone) => [milestone.milestoneId, milestone]),
        );

        return {
          ...currentState,
          progress: currentState.milestones.map(
            (milestone) => progressById.get(milestone.id) ?? {
              milestoneId: milestone.id,
              completed: false,
            },
          ),
        };
      },
    },
  ),
);
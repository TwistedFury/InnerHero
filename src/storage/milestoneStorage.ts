import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import milestones from '../data/milestones.json';
import type { Milestone, MilestoneProgress, MilestoneState } from '../types/milestone';

const milestoneDefinitions = milestones as Milestone[];

function createInitialProgress(): MilestoneProgress[] {
  return milestoneDefinitions.map((milestone) => ({
    milestoneId: milestone.id,
    completed: false,
  }));
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
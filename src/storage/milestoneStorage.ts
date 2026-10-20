import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MilestoneState } from '../types/milestone'

export const useMilestones = create<MilestoneState>()(
  persist(
    (set) => ({
      milestones: [],
      progress: [],
        completeMilestone: (milestoneId) =>
            set((state) => ({
                progress: state.progress.map((m) =>
                    m.milestoneId === milestoneId
                        ? { ...m, completed: true, completedAt: new Date().toISOString() }
                        : m
                ),
            })),
        resetMilestones: () =>
            set((state) => ({
                progress: state.milestones.map((milestone) => ({
                    milestoneId: milestone.id,
                    completed: false,
                })),
            })),
    }),
    {
      name: 'milestone-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
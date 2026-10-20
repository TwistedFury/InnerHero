import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateDisplayName } from '../helper/nameGenerator';
import { UserState } from '../types/user'

const createUserId = () =>
  `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const createInitialUser = () => ({
  userId: createUserId(),
  createdAt: new Date().toISOString(),
  onboardingCompleted: false,
  profile: {
    selectedGoals: [],
    displayName: generateDisplayName(),
  },
  notificationsEnabled: false,
});

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      ...createInitialUser(),

      completeOnboarding: () =>
        set({
          onboardingCompleted: true,
        }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...updates,
          },
        })),

      updatePreferences: (updates) => set(updates),

      resetUser: () => set(createInitialUser()),
    }),
    {
      name: 'user-profile',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);

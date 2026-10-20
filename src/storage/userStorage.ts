import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateDisplayName } from '../helper/nameGenerator';

type UserProfile = {
  displayName?: string;
  avatarUri?: string;
  selectedGoals: string[];
};

type UserState = {
  // fields
  userId: string;
  createdAt: string;
  onboardingCompleted: boolean;
  profile: UserProfile;
  notificationsEnabled: boolean;
  reminderTime?: string;

  // functions
  completeOnboarding: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updatePreferences: (updates: {
    notificationsEnabled?: boolean;
    reminderTime?: string;
  }) => void;
  resetUser: () => void;
};

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

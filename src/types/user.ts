export type UserProfile = {
  displayName?: string;
  avatarUri?: string;
  selectedGoals: string[];
};

export type UserState = {
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
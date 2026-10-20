export type Milestone = {
    id: string;
    displayName: string;
    description: string;
    requiredQuests: string[];
}

export type MilestoneProgress = {
    milestoneId: string;
    completed: boolean;
    completedAt?: string;
}

export type MilestoneState = {
    milestones: Milestone[];
    progress: MilestoneProgress[];
    completeMilestone: (milestoneId: string) => void;
    resetMilestones: () => void;
};
import { QuestProgress } from './quest';

export type Milestone = {
    id: string;
    display_name: string;
    description: string;
    required_quests: string[];
    required_total?: number;
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
    syncMilestones: (questProgress: Record<string, QuestProgress>) => void;
};
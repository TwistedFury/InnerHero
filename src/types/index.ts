export interface Quest {
    id: string;
    name: string;
    theory: string;
    quest_path: string;
    chain_id: string;
    chain_index: number;
    prerequisites: string[]; // These are the ids of the other quests
    tag: string;
    description: string;
    icon: any;
}

type QuestProgress = {
    status: 'in_progress' | 'completed' | 'skipped';
    startedAt: string;      // ISO
    completedAt?: string;
    completions: number;    // For repeatable quests
    questVersion: number;
}

type ThoughtRecord = {
    questId: string;
    stepId: string;
    answer: any;
    createdAt: string;      // ISO
}
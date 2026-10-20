export type QuestStepType = 'mood' | 'text' | 'slider';

export interface QuestStep {
    id: string;
    type: QuestStepType;
    prompt: string;
    required?: boolean;
    min?: number;
    max?: number;
}

export type QuestAnswer = string | number;

export interface QuestResponse {
    questId: string;
    stepId: string;
    answer: QuestAnswer;
    createdAt: string;
    attempt: number;
}

export interface QuestProgress {
    status: 'in_progress' | 'completed' | 'skipped';
    startedAt: string;
    completedAt?: string;
    completions: number;
    questVersion: string;
}

export interface Quest {
    id: string;
    name: string;
    theory: string;
    quest_path: string;
    chain_id: string;
    chain_index: number;
    prerequisites: string[];
    tag: string;
    description: string;
    icon: string;
    version: string;
    steps: QuestStep[];
    estimated_minutes: number;
    repeatable: boolean;
}

export type ProgressState = {
  completed: string[];
  progress: Record<string, QuestProgress>;
  responses: QuestResponse[];
  drafts: Record<string, Record<string, QuestAnswer>>;
  stepIndexes: Record<string, number>;
  saveAnswer: (questId: string, stepId: string, answer: QuestAnswer) => void;
  advanceStep: (questId: string) => void;
  startQuest: (questId: string, questVersion: string) => void;
  completeQuest: (id: string, questVersion: string) => void;
  undoQuest: (id: string) => void;
  resetChain: (ids: string[]) => void;
};
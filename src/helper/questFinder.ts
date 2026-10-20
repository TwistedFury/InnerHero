import quests from "../data/quests.json";
import type { Quest, QuestProgress } from "../types/quest";

export default function findQuest(questId: string)
{
    return quests.find(({ id }) => id === questId) as Quest | undefined;
}

export function retrieveAvailableQuests(
  progress: Record<string, QuestProgress>,
): Quest[] {
  return (quests as Quest[]).filter((q) => {
    const status = getQuestStatus(q, progress);
    return status === 'available' || status === 'in_progress';
  });
}

export type QuestStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export function getQuestStatus(
  quest: Quest,
  progress: Record<string, QuestProgress>,
): QuestStatus {
  const done = (id: string) => (progress[id]?.completions ?? 0) > 0;
  if (progress[quest.id]?.status === 'in_progress') return 'in_progress';
  if (done(quest.id)) return quest.repeatable ? 'available' : 'completed';
  return quest.prerequisites.every(done) ? 'available' : 'locked';
}

export function getChain(chainId: string): Quest[] {
  return (quests as Quest[])
    .filter((quest) => quest.chain_id === chainId)
    .sort((a, b) => a.chain_index - b.chain_index);
}
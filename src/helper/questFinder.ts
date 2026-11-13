import quests from "../data/quests.json";
import chains from "../data/chains.json";
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

type Progress = Record<string, QuestProgress>;

function isChainRepeatable(chainId: string): boolean {
  return (chains as { chain_id: string; repeatable?: boolean }[]).some(
    (chain) => chain.chain_id === chainId && chain.repeatable === true,
  );
}

// How many full passes through the chain are finished: the fewest times
// any quest in the chain has been completed. Chains that can't repeat always give 0.
function chainRounds(chainId: string, progress: Progress): number {
  if (!isChainRepeatable(chainId)) return 0;
  const members = getChain(chainId);
  if (members.length === 0) return 0;
  return Math.min(...members.map((q) => progress[q.id]?.completions ?? 0));
}

// "Done" means done in the current pass through the chain.
export function isDone(quest: Quest, progress: Progress): boolean {
  return (progress[quest.id]?.completions ?? 0) > chainRounds(quest.chain_id, progress);
}

export function getQuestStatus(
  quest: Quest,
  progress: Record<string, QuestProgress>,
): QuestStatus {
  const done = (id: string) => {
    const target = findQuest(id);
    return target ? isDone(target, progress) : (progress[id]?.completions ?? 0) > 0;
  };
  if (progress[quest.id]?.status === 'in_progress') return 'in_progress';
  if (done(quest.id)) return quest.repeatable ? 'available' : 'completed';
  return quest.prerequisites.every(done) ? 'available' : 'locked';
}

export function getChain(chainId: string): Quest[] {
  return (quests as Quest[])
    .filter((quest) => quest.chain_id === chainId)
    .sort((a, b) => a.chain_index - b.chain_index);
}
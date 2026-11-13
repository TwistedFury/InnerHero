import type { Quest, QuestProgress } from '../types/quest';
import { getQuestStatus } from './questFinder';

export type SortMode = 'suggested' | 'shortest' | 'path';

export const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: 'suggested', label: 'Suggested' },
  { key: 'shortest', label: 'Shortest first' },
  { key: 'path', label: 'By path' },
];

type Progress = Record<string, QuestProgress>;

function suggestedRank(quest: Quest, progress: Progress): number {
  if (getQuestStatus(quest, progress) === 'in_progress') return 0;
  const completions = progress[quest.id]?.completions ?? 0;
  return completions > 0 && quest.repeatable ? 2 : 1;
}

export function sortQuests(quests: Quest[], progress: Progress, mode: SortMode): Quest[] {
  // Remember the original order so ties never get shuffled.
  const items = quests.map((quest, position) => ({ quest, position }));

  // For "By path": paths appear in the order they first show up in quests.json.
  const pathOrder = new Map<string, number>();
  quests.forEach((quest) => {
    if (!pathOrder.has(quest.quest_path)) pathOrder.set(quest.quest_path, pathOrder.size);
  });

  items.sort((a, b) => {
    let difference = 0;

    if (mode === 'suggested') {
      difference =
        (b.quest.priority ?? 0) - (a.quest.priority ?? 0) ||
        suggestedRank(a.quest, progress) - suggestedRank(b.quest, progress);
    } else if (mode === 'shortest') {
      difference = a.quest.estimated_minutes - b.quest.estimated_minutes;
    } else {
      difference =
        (pathOrder.get(a.quest.quest_path) ?? 0) - (pathOrder.get(b.quest.quest_path) ?? 0) ||
        a.quest.chain_index - b.quest.chain_index;
    }

    return difference || a.position - b.position;
  });

  return items.map((item) => item.quest);
}
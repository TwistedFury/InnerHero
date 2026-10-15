import quests from "../data/quests.json";
import type { Quest } from "../types";

export default function FindQuest(questId: string)
{
    return quests.find(({ id }) => id === questId) as Quest | undefined;
}

export function RetrieveAvailableQuests(completedIds: string[]): Quest[] {
  const completed = new Set(completedIds);

  return (quests as Quest[]).filter((quest) => {
    if (completed.has(quest.id)) {
      return false;
    }

    return quest.prerequisites.every((prerequisiteId) =>
      completed.has(prerequisiteId)
    );
  });
}
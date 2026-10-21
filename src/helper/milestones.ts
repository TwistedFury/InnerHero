import milestones from '../../src/data/milestones.json';

export function getMilestoneById(id: string) {
  return milestones.find((m) => m.id === id);
}

export function getMilestonesForQuest(questId: string) {
  return milestones.filter((m) => m.required_quests.includes(questId));
}
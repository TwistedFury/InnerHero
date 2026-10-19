import quests from '../data/quests.json';

export const getChain = (chainId: string) =>
  quests
    .filter((q) => q.chain_id === chainId)
    .sort((a, b) => a.chain_index - b.chain_index);

export const getCurrentQuest = (chainId: string, completed: string[]) =>
  getChain(chainId).find((q) => !completed.includes(q.id)) ?? null; // null = chain finished
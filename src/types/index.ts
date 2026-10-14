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
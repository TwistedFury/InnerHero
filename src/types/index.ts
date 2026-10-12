export interface Quest {
    id: string;
    name: string;
    theory: string;
    quest_path: string;
    chain: boolean;
    total_chain: number;
    place_in_chain: number;
}
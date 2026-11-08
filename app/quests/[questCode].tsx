import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import findQuest from '../../src/helper/questFinder';
import { QuestRunner } from "../../src/components/quests/questController";

import PageBackground from '../../src/components/pageBackground';

export default function QuestDisplay() {
    const { questCode } = useLocalSearchParams<{ questCode: string }>();
    const quest = findQuest(questCode);

    return quest
        ? <PageBackground><QuestRunner quest={quest} /></PageBackground>
        : <View><Text>No quest found for code: {questCode}</Text></View>;
}
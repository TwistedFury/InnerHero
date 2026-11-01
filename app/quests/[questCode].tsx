import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import findQuest from '../../src/helper/questFinder';
import { QuestRunner } from "../../src/components/quests/questController";

export default function QuestDisplay()
{
    const { questCode } = useLocalSearchParams<{ questCode: string }>();
    const quest = findQuest(questCode);

    return quest
        ? <QuestRunner quest={quest} />
        : <View><Text>No quest found for code: {questCode}</Text></View>;
}
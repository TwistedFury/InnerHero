import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import FindQuest from '../../src/helper/questFinder';
import { QuestRunner } from "../../src/components/QuestController";

export default function QuestDisplay()
{
    const { questCode } = useLocalSearchParams<{ questCode: string }>();
    const quest = FindQuest(questCode);

    return quest
        ? <QuestRunner quest={quest} />
        : <View><Text>No quest found for code: {questCode}</Text></View>;
}
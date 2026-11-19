import { View, Text } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import findQuest from '../../src/helper/questFinder';
import { QuestRunner } from "../../src/components/quests/questController";
import { colors } from '../../src/styling/theme';

import PageBackground from '../../src/components/pageBackground';

export default function QuestDisplay() {
    const { questCode } = useLocalSearchParams<{ questCode: string }>();
    const quest = findQuest(questCode);

    if (!quest) {
        return <View><Text>No quest found for code: {questCode}</Text></View>;
    }

    // Calm quests draw their own full-screen dark space, so they skip the notebook background
    if (quest.theme === 'calm') {
        return (
            <>
                <Stack.Screen
                    options={{
                        animation: 'fade',
                        animationDuration: 800,
                        contentStyle: { backgroundColor: colors.primaryDark },
                    }}
                />
                <QuestRunner quest={quest} />
            </>
        );
    }

    return <PageBackground><QuestRunner quest={quest} /></PageBackground>;
}
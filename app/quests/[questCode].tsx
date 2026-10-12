import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router';

import quests from "../../src/data/quests.json";
import type { Quest } from "../../src/types";

export default function QC()
{
    const { questCode } = useLocalSearchParams<{ questCode: string }>();
    const quest: Quest | undefined = quests.find(({ id }) => id === questCode);

    return (
        <View>
            {quest ? (
                <>
                    <Text>{quest.name}</Text>
                    <Text>Code: {quest.id}</Text>
                    <Text>Theory: {quest.theory}</Text>
                    <Text>Path: {quest.quest_path}</Text>
                    <Text>Prerequisites: {quest.prerequisites.join(", ")}</Text>
                </>
            ) : (
                <Text>No quest found for code: {questCode}</Text>
            )}
        </View>
    )
}
import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router';

export default function QC()
{
    const { questCode } = useLocalSearchParams<{ questCode: string }>();

    return (
        <View>
            <Text>Hey! You are viewing a quest with the code: {questCode}</Text>
        </View>
    )
}
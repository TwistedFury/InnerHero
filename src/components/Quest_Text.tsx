import FindQuest from '../helper/questFinder'
import { Text } from 'react-native'

export default function Quest_Text(questId: string, tDisplayId: string)
{
    const quest = FindQuest(questId);

    return (
        <Text>
            {quest ? 
                tDisplayId
                : ''
            }
        </Text>
    );
}
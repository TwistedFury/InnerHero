import { ScrollView } from 'react-native'
import ShowQuest from '../../src/components/QuestCard'

export default function QC()
{
    return (
        <ScrollView>
            <>{ShowQuest('cbt-1', '../quests/[questCode]', 1, "no prog")}</>
            <>{ShowQuest('cbt-2', '../quests/[questCode]', 1, "In Progress 2 of 4")}</>
            <>{ShowQuest('cbt-3', '../quests/[questCode]', 0, "In Progress 3 of 4")}</>
            <>{ShowQuest('cbt-4', '../quests/[questCode]', 0, "In Progress 4 of 4")}</>
            <>{ShowQuest('sample', '../quests/[questCode]', 0, "no prog")}</>
        </ScrollView>
    )
}
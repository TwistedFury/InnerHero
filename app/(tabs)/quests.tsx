import { Fragment } from 'react';
import { ScrollView, Text } from 'react-native';
import ShowQuest from '../../src/components/quests/questCard';
import { retrieveAvailableQuests, getQuestStatus, getChain } from '../../src/helper/questFinder';
import { useProgress } from '../../src/storage/questStorage'

export default function QuestPage()
{
    const progress = useProgress((storage) => storage.progress);
    const quests = retrieveAvailableQuests(progress);

    return (
        <ScrollView>
            {quests.length === 0 ? (
                <Text>All caught up!</Text>
            ) : quests.map((quest) => {
                const chainLength = getChain(quest.chain_id).length;
                const status = getQuestStatus(quest, progress);
                const progressLabel =
                    status === 'completed'
                    ? 'Completed'
                    : `Quest ${quest.chain_index + 1} of ${chainLength}`;
                const completed = (progress[quest.id]?.completions ?? 0) > 0;

                return (
                    <Fragment key={quest.id}>
                        {ShowQuest(
                            quest.id,
                            '../quests/[questCode]',
                            `${quest.estimated_minutes} minutes`,
                            progress[quest.id]?.completions > 0 ?
                                `Completed ${progress[quest.id]?.completions} times`
                                : progressLabel,
                            completed,
                        )}
                    </Fragment>
                );
            })}
        </ScrollView>
    )
}
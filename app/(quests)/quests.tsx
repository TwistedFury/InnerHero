import { Fragment } from 'react';
import { ScrollView } from 'react-native';
import ShowQuest from '../../src/components/QuestCard';
import { RetrieveAvailableQuests } from '../../src/helper/questFinder';
import { getChain } from '../../src/helper/chainUtils'

export default function QuestPage()
{
    const quests = RetrieveAvailableQuests([]);

    return (
        <ScrollView>
            {quests.map((quest) => {
                const chainLength = getChain(quest.chain_id).length;
                const progressLabel = `Quest ${quest.chain_index + 1} of ${chainLength}`;

                return (
                    <Fragment key={quest.id}>
                        {ShowQuest(
                            quest.id,
                            '../quests/[questCode]',
                            `${quest.estimated_minutes} minutes`,
                            progressLabel,
                        )}
                    </Fragment>
                );
            })}
        </ScrollView>
    )
}
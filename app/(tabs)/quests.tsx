import { ScrollView, StyleSheet, Text, View } from 'react-native';
import QuestCard from '../../src/components/quests/questCard';
import { retrieveAvailableQuests, getQuestStatus, getChain } from '../../src/helper/questFinder';
import { useProgress } from '../../src/storage/questStorage';
import { colors, fonts } from '../../src/styling/theme';
import { Fragment, useState } from 'react';
import SortBar from '../../src/components/quests/sortBar';
import { sortQuests, type SortMode } from '../../src/helper/questSorter';

import PageBackground from '../../src/components/pageBackground';

export default function QuestPage() {
  const progress = useProgress((storage) => storage.progress);
  const [sortMode, setSortMode] = useState<SortMode>('suggested');
  const quests = sortQuests(retrieveAvailableQuests(progress), progress, sortMode);

  return (
    <PageBackground variant="wood">
      <ScrollView style={styles.board} contentContainerStyle={styles.boardContent}>
        <View style={styles.sign}>
          <Text style={styles.signText}>Quest Board</Text>
        </View>

        {quests.length > 1 && <SortBar sortMode={sortMode} setSortMode={setSortMode} />}

        {quests.length === 0 ? (
          <Text style={styles.empty}>{"The board is bare. You're all caught up!"}</Text>
        ) : (
          quests.map((quest, index) => {
            const chainLength = getChain(quest.chain_id).length;
            const status = getQuestStatus(quest, progress);
            const completions = progress[quest.id]?.completions ?? 0;

            const progressLabel =
              status === 'completed'
                ? 'Completed'
                : `Quest ${quest.chain_index + 1} of ${chainLength}`;

            const previous = quests[index - 1];
            const startsNewPath =
              sortMode === 'path' && (!previous || previous.quest_path !== quest.quest_path);

            return (
              <Fragment key={quest.id}>
                {startsNewPath && <Text style={styles.pathLabel}>{quest.quest_path}</Text>}
                <QuestCard
                  index={index}
                  questCode={quest.id}
                  pathToQuests="../quests/[questCode]"
                  duration={`${quest.estimated_minutes} minutes`}
                  progressLabel={
                    completions > 0
                      ? `Completed ${completions} ${completions === 1 ? 'time' : 'times'}`
                      : progressLabel
                  }
                  completed={completions > 0}
                />
              </Fragment>
            );
          })
        )}
      </ScrollView>
    </PageBackground>
  );
}

const styles = StyleSheet.create({
  board: { flex: 1 },
  boardContent: { padding: 20, paddingTop: 28, paddingBottom: 40 },
  sign: {
    alignSelf: 'center',
    marginBottom: 28,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.border,
  },
  signText: { fontFamily: fonts.serif, fontSize: 22, color: colors.onDark },
  empty: {
    fontFamily: fonts.serif,
    fontSize: 18,
    textAlign: 'center',
    color: colors.onDarkMuted,
  },
  pathLabel: {
    fontFamily: fonts.serif,
    fontSize: 16,
    color: colors.onDarkMuted,
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
});
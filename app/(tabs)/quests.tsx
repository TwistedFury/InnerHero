import { ScrollView, StyleSheet, Text, View } from 'react-native';
import QuestCard from '../../src/components/quests/questCard';
import { retrieveAvailableQuests, getQuestStatus, getChain } from '../../src/helper/questFinder';
import { useProgress } from '../../src/storage/questStorage';
import { colors, fonts } from '../../src/styling/theme';

export default function QuestPage() {
  const progress = useProgress((storage) => storage.progress);
  const quests = retrieveAvailableQuests(progress);

  return (
    <ScrollView style={styles.board} contentContainerStyle={styles.boardContent}>
      <View style={styles.sign}>
        <Text style={styles.signText}>Quest Board</Text>
      </View>

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

          return (
            <QuestCard
              key={quest.id}
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
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  board: { flex: 1, backgroundColor: colors.primaryDark },
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
});
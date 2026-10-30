import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeHeader from '../../src/components/home/homeHeader';
import MilestoneProgress from '../../src/components/home/milestoneProgress';
import NextQuest from '../../src/components/home/nextQuest';
import QuestOptions from '../../src/components/home/questOptions';
import quests from '../../src/data/quests.json';
import { retrieveAvailableQuests } from '../../src/helper/questFinder';
import { useProgress } from '../../src/storage/questStorage';
import type { Quest } from '../../src/types/quest';
import HelpLinks from '../../src/components/profile/helpLinks';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const progress = useProgress((state) => state.progress);
  const availableQuests = retrieveAvailableQuests(progress);
  const quest = availableQuests.find((item) => progress[item.id]?.status === 'in_progress')
    ?? availableQuests[0]
    ?? (quests[0] as Quest);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <HomeHeader />
      <NextQuest quest={quest} progress={progress[quest.id]} />
      <MilestoneProgress />
      <QuestOptions quests={availableQuests.slice(0, 4)} />
      <HelpLinks />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F7F4EE',
  },
});
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import type { Quest, QuestProgress } from '../../types/quest';
import { getChain } from '../../helper/questFinder';
import { colors, fonts } from '../../styling/theme';

type NextQuestProps = {
  quest: Quest;
  progress?: QuestProgress;
  imageSource?: ImageSourcePropType;
};

export default function NextQuest({ quest, progress, imageSource }: NextQuestProps) {
  const router = useRouter();
  const chainLength = getChain(quest.chain_id).length;
  const currentStep = Math.min(
    (progress?.completions ?? 0) > 0 ? quest.steps.length : 1,
    quest.steps.length,
  );
  const isInProgress = progress?.status === 'in_progress';
  const progressLabel = isInProgress
    ? `Your ${quest.tag.toLowerCase()} · ready for step ${currentStep} of ${quest.steps.length}`
    : `Start your next quest · quest ${quest.chain_index + 1} of ${chainLength}`;

  const cardContent = (
    <>
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>
          {isInProgress ? 'PICK UP WHERE YOU LEFT OFF' : 'YOUR NEXT QUEST'}
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.metaRow}>
          <Text style={styles.tag}>{quest.tag}</Text>
          <Text style={styles.duration}>{quest.estimated_minutes} min</Text>
        </View>
        <Text style={styles.title}>{quest.name}</Text>
        <Text style={styles.description}>{progressLabel}</Text>
        <View style={styles.action}>
          <Text style={styles.actionText}>
            {isInProgress ? 'Continue quest' : 'Start quest'}
          </Text>
          <ArrowRight color={colors.onDark} size={26} strokeWidth={2} />
        </View>
        <Text style={styles.source}>Source: {quest.theory}</Text>
      </View>
    </>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${isInProgress ? 'Continue' : 'Start'} ${quest.name}`}
      onPress={() =>
        router.push({
          pathname: '/quests/[questCode]',
          params: { questCode: quest.id },
        })
      }
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {imageSource ? (
        <ImageBackground source={imageSource} style={styles.cardBackground}>
          {cardContent}
        </ImageBackground>
      ) : (
        cardContent
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 28,
    backgroundColor: colors.primaryDark,
  },
  cardBackground: {
    backgroundColor: colors.primaryDark,
  },
  cardPressed: {
    opacity: 0.9,
  },
  hero: {
    height: 126,
    justifyContent: 'flex-start',
    padding: 22,
    backgroundColor: '#163B35',
  },
  heroLabel: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.onDark,
    color: colors.primaryDark,
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  body: {
    padding: 24,
    gap: 12,
    backgroundColor: colors.primaryDark,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tag: {
    color: colors.onDarkMuted,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    textTransform: 'uppercase',
  },
  duration: {
    color: colors.onDarkMuted,
    fontFamily: fonts.sans,
    fontSize: 14,
  },
  title: {
    color: colors.onDark,
    fontFamily: fonts.serif,
    fontSize: 30,
    lineHeight: 37,
  },
  description: {
    color: colors.onDarkMuted,
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 22,
  },
  action: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderRadius: 18,
    backgroundColor: colors.primary,
  },
  actionText: {
    color: colors.onDark,
    fontFamily: fonts.sansBold,
    fontSize: 17,
  },
  source: {
    color: colors.onDarkMuted,
    fontFamily: fonts.sans,
    fontSize: 11,
  },
});
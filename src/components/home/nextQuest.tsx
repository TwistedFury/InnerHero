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

const leather = require('../../../assets/pages/leather2.jpg');

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
  
  // Replace any trailing " - N" in the quest name with a non-breaking space, so it doesn't wrap to the next line
  const displayName = quest.name.replace(/\s+-\s+(\d+)$/, '\u00A0$1');
  const cardContent = (
    // The notebook cover: leather everywhere behind the label and strap
    <ImageBackground source={leather} resizeMode="cover" style={styles.cover}>
      <View pointerEvents="none" style={styles.coverTint} />

      {/* Paper label stuck on the cover */}
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>
          {isInProgress ? 'PICK UP WHERE YOU LEFT OFF' : 'YOUR NEXT QUEST'}
        </Text>
      </View>

      {/* The strap that wraps around the notebook */}
      <ImageBackground source={leather} resizeMode="cover" style={styles.band}>
        <View pointerEvents="none" style={styles.bandTint} />
        <View pointerEvents="none" style={styles.bandEdgeTop} />
        <View pointerEvents="none" style={styles.bandEdgeBottom} />
        <View pointerEvents="none" style={[styles.rivet, styles.rivetLeft]} />
        <View pointerEvents="none" style={[styles.rivet, styles.rivetRight]} />

        <View style={styles.body}>
          <View style={styles.metaRow}>
            <Text style={styles.tag}>{quest.tag}</Text>
            <Text style={styles.duration}>{quest.estimated_minutes} min</Text>
          </View>
          <Text style={styles.title}>{displayName}</Text>
          <Text style={styles.description}>{progressLabel}</Text>
          <View style={styles.action}>
            <Text style={styles.actionText}>
              {isInProgress ? 'Continue quest' : 'Start quest'}
            </Text>
            <ArrowRight color={colors.onDark} size={26} strokeWidth={2} />
          </View>
          <Text style={styles.source}>Source: {quest.theory}</Text>
        </View>
      </ImageBackground>
    </ImageBackground>
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
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
  },
  cardBackground: {
    backgroundColor: colors.primaryDark,
  },
  cardPressed: {
    opacity: 0.92,
  },

  // ---------- Notebook cover ----------
  cover: {
    paddingBottom: 18, // strip of cover visible below the strap
    backgroundColor: colors.primary,
  },
  // slightly darkens the cover so the strap stands out against it
  coverTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(30, 15, 8, 0.35)',
  },
  hero: {
    height: 90,
    justifyContent: 'flex-start',
    padding: 22,
  },
  // a paper label stuck on the cover, slightly crooked
  heroLabel: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    color: colors.text,
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 1,
    transform: [{ rotate: '-2deg' }],
  },

  // ---------- Strap ----------
  band: {
    backgroundColor: colors.primaryDark,
  },
  // warm saddle-brown tint so the strap looks different from the cover
  bandTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(68, 22, 26, 0.54)',
  },
  // gold binding along the strap's top and bottom edges
  bandEdgeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.gold,
    opacity: 0.8,
  },
  bandEdgeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.gold,
    opacity: 0.8,
  },
  // gold studs holding the strap on
  rivet: {
    position: 'absolute',
    top: 14,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#afa23f',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.4)',
  },
  rivetLeft: { left: 20 },
  rivetRight: { right: 20 },

  // ---------- Text inside the strap ----------
  body: {
    padding: 24,
    paddingTop: 34, // room so the rivets don't touch the text
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap', // duration drops to the next line if space runs out
    gap: 8,
  },
  tag: {
    flexShrink: 1,
    color: colors.onDarkMuted,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  duration: {
    flexShrink: 0,
    color: colors.onDarkMuted,
    fontFamily: fonts.sans,
    fontSize: 14,
  },
  title: {
    color: colors.onDark,
    fontFamily: fonts.heading,
    fontSize: 32,
    lineHeight: 38,
  },
  description: {
    color: colors.onDarkMuted,
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 22,
  },
  action: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.gold,
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
    fontSize: 12,
  },
});
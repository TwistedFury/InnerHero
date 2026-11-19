import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sprout } from 'lucide-react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import type { Quest, QuestAnswer } from '../../types/quest';
import { colors, fonts } from '../../styling/theme';
import CalmFrame from './calmFrame';
import { CalmButton, RadialDisc } from './calmParts';
import { sentencesOf } from './calmStep';
import MoodFace, { MOOD_LABELS } from './moodFace';
import HelpLinks from '../profile/helpLinks';

type CalmCompleteProps = {
  quest: Quest;
  answers: Record<string, QuestAnswer>;
  milestones: { id: string; display_name: string; description: string }[];
  unlocked: { id: string; name: string }[];
  onBack: () => void;
  onOpenQuest: (id: string) => void;
};

// Turns a saved answer into a 0-10 mood level, or undefined if it isn't one
const toLevel = (answer: QuestAnswer | undefined) => {
  const n =
    typeof answer === 'number'
      ? answer
      : typeof answer === 'string' && answer.trim() !== ''
        ? Number(answer)
        : NaN;
  return Number.isInteger(n) && n >= 0 && n <= 10 ? n : undefined;
};

// The seal: a glowing ring that settles into place with one soft tap
function Seal() {
  const settle = useSharedValue(1.3);

  useEffect(() => {
    settle.value = withDelay(300, withSpring(1, { damping: 9, stiffness: 80 }));
    const timer = setTimeout(
      () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
      600,
    );
    return () => clearTimeout(timer);
  }, [settle]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: settle.value }] }));

  return (
    <Animated.View entering={FadeIn.duration(1200).delay(300)}>
      <Animated.View style={[styles.sealWrap, style]}>
        <View style={styles.sealGlow} pointerEvents="none">
          <RadialDisc
            id="sealGlow"
            size={220}
            stops={[
              { offset: 0, color: colors.gold, opacity: 0.4 },
              { offset: 0.6, color: colors.gold, opacity: 0.12 },
              { offset: 1, color: colors.gold, opacity: 0 },
            ]}
          />
        </View>
        <View style={styles.sealRing}>
          <Text style={styles.sealCheck}>✓</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

export default function CalmComplete({
  quest,
  answers,
  milestones,
  unlocked,
  onBack,
  onOpenQuest,
}: CalmCompleteProps) {
  const insets = useSafeAreaInsets();

  // Mood before and after, from the first and last mood steps of this run
  const moodSteps = quest.steps.filter((step) => step.type === 'mood');
  const before = moodSteps.length > 1 ? toLevel(answers[moodSteps[0].id]) : undefined;
  const after =
    moodSteps.length > 1 ? toLevel(answers[moodSteps[moodSteps.length - 1].id]) : undefined;
  const hasMood = before !== undefined && after !== undefined;

  const note = sentencesOf(quest.closing_note ?? '');
  const hasNext = !!quest.next_note || unlocked.length > 0;

  // Everything fades in one after another. Each delay is worked out from the ones before it.
  const gap = Math.min(1500, 6000 / Math.max(note.length, 1));
  const noteStart = 1700; // after the seal and the label
  const noteDelays = note.map((_, i) => noteStart + i * gap);

  const moodDelay = noteStart + note.length * gap + 300;
  const milestonesStart = moodDelay + (hasMood ? 1400 : 0);
  const milestoneDelays = milestones.map((_, i) => milestonesStart + i * 900);

  const nextDelay = milestonesStart + milestones.length * 900;
  const buttonDelay = nextDelay + (hasNext ? 1000 : 0);

  return (
    <CalmFrame scene="rest">
      <Stack.Screen options={{ animation: 'fade', animationDuration: 900 }} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Seal />

        <Animated.Text entering={FadeIn.duration(1200).delay(1100)} style={styles.label}>
          Entry sealed · {quest.name}
        </Animated.Text>

        <View style={styles.noteBlock}>
          {note.map((sentence, i) => (
            <Animated.Text
              key={i}
              entering={FadeIn.duration(1400).delay(noteDelays[i])}
              style={styles.note}
            >
              {sentence}
            </Animated.Text>
          ))}
        </View>

        {hasMood && (
          <Animated.View
            entering={FadeIn.duration(1200).delay(moodDelay)}
            accessible
            accessibilityLabel={`Mood before: ${before} out of 10. Mood after: ${after} out of 10.`}
            style={styles.moodBlock}
          >
            <View style={styles.moodSide}>
              <MoodFace level={before} size={64} />
              <Text style={styles.small}>Before</Text>
              <Text style={styles.moodText}>{MOOD_LABELS[before]}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
            <View style={styles.moodSide}>
              <MoodFace level={after} size={64} />
              <Text style={styles.small}>After</Text>
              <Text style={styles.moodText}>{MOOD_LABELS[after]}</Text>
            </View>
          </Animated.View>
        )}

        {milestones.map((milestone, i) => (
          <Animated.View
            key={milestone.id}
            entering={FadeIn.duration(1200).delay(milestoneDelays[i])}
            accessible
            accessibilityLabel={`Milestone earned: ${milestone.display_name}`}
            style={styles.milestone}
          >
            <Sprout color={colors.gold} size={26} strokeWidth={1.8} />
            <View style={styles.milestoneText}>
              <Text style={styles.small}>Milestone earned</Text>
              <Text style={styles.milestoneName}>{milestone.display_name}</Text>
              <Text style={styles.milestoneDesc}>{milestone.description}</Text>
            </View>
          </Animated.View>
        ))}

        {hasNext && (
          <Animated.View entering={FadeIn.duration(1200).delay(nextDelay)} style={styles.nextBlock}>
            {!!quest.next_note && <Text style={styles.nextNote}>{quest.next_note}</Text>}
            {unlocked.map((q) => (
              <Pressable
                key={q.id}
                accessibilityRole="button"
                accessibilityLabel={`Start ${q.name}`}
                onPress={() => onOpenQuest(q.id)}
                style={({ pressed }) => [styles.unlocked, pressed && { opacity: 0.6 }]}
              >
                <Text style={styles.unlockedName}>{q.name}</Text>
                <Text style={styles.unlockedArrow}>→</Text>
              </Pressable>
            ))}
          </Animated.View>
        )}

        <Animated.View entering={FadeIn.duration(1000).delay(buttonDelay)} style={styles.footer}>
          <CalmButton label="Back to the Quest Board" onPress={onBack} />
        </Animated.View>

        {/* Kept readable on purpose: this is the page people may need it on */}
        <Animated.View entering={FadeIn.duration(1000).delay(buttonDelay + 600)} style={styles.help}>
          <HelpLinks />
        </Animated.View>
      </ScrollView>
    </CalmFrame>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 28, gap: 28, alignItems: 'center' },

  sealWrap: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' },
  sealGlow: { position: 'absolute', left: -50, top: -50 },
  sealRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  sealCheck: { color: colors.onDark, fontFamily: fonts.sansBold, fontSize: 38, lineHeight: 44 },

  label: {
    textAlign: 'center',
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.gold,
  },
  noteBlock: { gap: 14, alignSelf: 'stretch' },
  note: {
    textAlign: 'center',
    fontFamily: fonts.serif,
    fontSize: 21,
    lineHeight: 32,
    color: colors.onDark,
  },

  small: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.onDarkMuted,
  },
  moodBlock: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 22 },
  moodSide: { alignItems: 'center', gap: 6 },
  moodText: { fontFamily: fonts.serif, fontSize: 15, color: colors.onDark },
  arrow: { fontFamily: fonts.sans, fontSize: 22, color: colors.onDarkMuted },

  milestone: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  milestoneText: { flex: 1, gap: 2 },
  milestoneName: { fontFamily: fonts.heading, fontSize: 22, color: colors.onDark },
  milestoneDesc: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, color: colors.onDarkMuted },

  nextBlock: { alignSelf: 'stretch', gap: 14 },
  nextNote: {
    textAlign: 'center',
    fontFamily: fonts.serif,
    fontSize: 17,
    lineHeight: 26,
    color: colors.onDarkMuted,
  },
  unlocked: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  unlockedName: { flex: 1, fontFamily: fonts.serif, fontSize: 17, color: colors.onDark },
  unlockedArrow: { fontFamily: fonts.sansBold, fontSize: 20, color: colors.gold },

  footer: { marginTop: 4 },
  help: { alignSelf: 'stretch', backgroundColor: colors.bg, borderRadius: 16, padding: 16 },
});
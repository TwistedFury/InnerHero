import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  FadeIn,
  ZoomIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, fonts } from '../../styling/theme';
import { useMilestones } from '../../storage/milestoneStorage';
import { useProgress } from '../../storage/questStorage';
import { getIcon } from '../../helper/icons';
import type { Milestone } from '../../types/milestone';

const MilestoneIcon = getIcon('bookmark');

function MilestoneCard({
  milestone,
  earned,
  done,
  total,
  index,
}: {
  milestone: Milestone;
  earned: boolean;
  done: number;
  total: number;
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const flip = useSharedValue(0); // 0 = front showing, 1 = back showing
  const fill = useSharedValue(0); // progress bar, 0 to 1

  const ratio = earned ? 1 : total > 0 ? done / total : 0;

  const toggle = () => {
    const next = !flipped;
    setFlipped(next);
    Haptics.selectionAsync();
    flip.value = withSpring(next ? 1 : 0, { damping: 14, stiffness: 110 });
    fill.value = next
      ? withDelay(250, withTiming(ratio, { duration: 600, easing: Easing.out(Easing.cubic) }))
      : withTiming(0, { duration: 300 });
  };

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateY: `${interpolate(flip.value, [0, 1], [0, 180])}deg` },
    ],
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateY: `${interpolate(flip.value, [0, 1], [180, 360])}deg` },
    ],
  }));
  const barStyle = useAnimatedStyle(() => ({ width: `${fill.value * 100}%` }));

  const face = earned ? styles.faceEarned : styles.faceLocked;
  const progressText = total > 0 ? `${done} of ${total} quests` : '';

  return (
    <Animated.View
      entering={
        earned
          ? ZoomIn.delay(500 + index * 110).springify().damping(10)
          : FadeIn.delay(500 + index * 110).duration(500)
      }
      style={styles.cardWrap}
    >
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={`${milestone.display_name}, ${earned ? 'earned' : progressText}`}
        accessibilityHint="Turns the card over"
        style={styles.card}
      >
        {/* front */}
        <Animated.View style={[styles.face, face, frontStyle]}>
          <MilestoneIcon
            color={earned ? colors.gold : colors.muted}
            size={20}
            strokeWidth={1.8}
          />
          <Text style={[styles.name, !earned && styles.nameLocked]} numberOfLines={2}>
            {milestone.display_name}
          </Text>
          {earned ? (
            <View style={styles.stamp}>
              <Text style={styles.stampText}>✓</Text>
            </View>
          ) : (
            <Text style={styles.small}>{progressText}</Text>
          )}
        </Animated.View>

        {/* back */}
        <Animated.View style={[styles.face, styles.back, face, backStyle]}>
          <Text style={styles.description} numberOfLines={3}>
            {milestone.description}
          </Text>
          {total > 0 && (
            <View style={styles.progressBlock}>
              <View style={styles.track}>
                <Animated.View style={[styles.fillBar, barStyle]} />
              </View>
              <Text style={styles.small}>{earned ? 'Complete' : progressText}</Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default function Milestones() {
  const completed = useProgress((state) => state.completed);
  const milestones = useMilestones((state) => state.milestones);
  const milestoneProgress = useMilestones((state) => state.progress);

  const isEarned = (milestone: Milestone) =>
    milestoneProgress.some(
      (entry) => entry.milestoneId === milestone.id && entry.completed,
    );

  // Earned ones first, then the rest in their usual order
  const ordered = [...milestones].sort((a, b) => Number(isEarned(b)) - Number(isEarned(a)));
  const earnedCount = ordered.filter(isEarned).length;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Milestones</Text>
      {earnedCount === 0 && (
        <Text style={styles.empty}>Your first milestone is still ahead.</Text>
      )}
      <View style={styles.grid}>
        {ordered.map((milestone, index) => {
          const required = milestone.required_quests ?? [];
          return (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              earned={isEarned(milestone)}
              done={completed.filter((id) => required.includes(id)).length}
              total={required.length}
              index={index}
            />
          );
        })}
      </View>
      <Text style={styles.hint}>Tap a card to turn it over.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 28 },
  title: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    marginBottom: 10,
  },
  // shown before any milestone is earned, like a note written to yourself
  empty: {
    color: colors.muted,
    fontFamily: fonts.handwriting,
    fontSize: 20,
    marginBottom: 10,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cardWrap: { width: '48%' },
  card: { height: 136 },
  face: {
    ...StyleSheet.absoluteFill,
    backfaceVisibility: 'hidden',
    borderRadius: 6,
    borderWidth: 1.5,
    padding: 12,
    gap: 6,
  },
  back: { justifyContent: 'space-between' },
  faceEarned: { backgroundColor: colors.sand, borderColor: colors.gold },
  faceLocked: {
    backgroundColor: colors.sand,
    borderColor: colors.border,
    borderStyle: 'dashed',
    opacity: 0.7,
  },
  name: { color: colors.text, fontFamily: fonts.sansMedium, fontSize: 14 },
  nameLocked: { color: colors.muted },
  small: { color: colors.muted, fontFamily: fonts.sans, fontSize: 12 },
  description: { color: colors.text, fontFamily: fonts.sans, fontSize: 13, lineHeight: 18 },
  progressBlock: { gap: 6 },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(107, 91, 74, 0.25)',
  },
  fillBar: { height: 6, borderRadius: 3, backgroundColor: colors.gold },
  stamp: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.seal,
    transform: [{ rotate: '-12deg' }],
  },
  stampText: { color: colors.onDark, fontSize: 14, fontWeight: '700' },
  hint: {
    color: colors.muted,
    fontFamily: fonts.handwriting,
    fontSize: 18,
    marginTop: 10,
  },
});
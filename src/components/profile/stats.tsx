import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { colors, fonts } from '../../styling/theme';
import { useProgress } from '../../storage/questStorage';

// Counts up from 0 to the real number, quickly at first and then slowing down
function CountUp({ to, style }: { to: number; style: StyleProp<TextStyle> }) {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const steps = Math.min(to, 20);

    if (steps === 0) timers.push(setTimeout(() => setShown(0), 0));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const eased = 1 - (1 - t) * (1 - t);
      timers.push(
        setTimeout(() => setShown(Math.round(to * t)), 450 + 800 * eased),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [to, reduceMotion]);

  return <Text style={style}>{reduceMotion ? to : shown}</Text>;
}

export default function Stats() {
  const completed = useProgress((state) => state.completed);
  const progress = useProgress((state) => state.progress);
  const techniquesExplored = new Set(
    completed.map((questId) => progress[questId]?.questVersion ?? questId),
  ).size;

  return (
    <View style={styles.statsRow}>
      <View
        accessible
        accessibilityLabel={`${completed.length} quests completed`}
        style={styles.statCard}
      >
        <CountUp to={completed.length} style={styles.statValue} />
        <Text style={styles.statLabel}>Quests completed</Text>
      </View>
      <View
        accessible
        accessibilityLabel={`${techniquesExplored} techniques explored`}
        style={styles.statCard}
      >
        <CountUp to={techniquesExplored} style={styles.statValue} />
        <Text style={styles.statLabel}>Techniques explored</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 6,
    borderWidth: 1.5,
    flex: 1,
    minHeight: 80,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statValue: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 30,
    lineHeight: 36,
  },
  statLabel: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 12,
    marginTop: 3,
  },
});
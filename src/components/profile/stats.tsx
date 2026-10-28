import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../../styling/theme';
import { useProgress } from '../../storage/questStorage';

export default function Stats() {
  const completed = useProgress((state) => state.completed);
  const progress = useProgress((state) => state.progress);
  const techniquesExplored = new Set(
    completed.map((questId) => progress[questId]?.questVersion ?? questId),
  ).size;

  return (
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{completed.length}</Text>
        <Text style={styles.statLabel}>Quests completed</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{techniquesExplored}</Text>
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
    backgroundColor: '#FCFBF7',
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    minHeight: 67,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statValue: {
    color: colors.primaryDark,
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 28,
  },
  statLabel: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 9,
    marginTop: 3,
  },
});
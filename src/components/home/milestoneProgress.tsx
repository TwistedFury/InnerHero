import { Sprout } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useMilestones } from '../../storage/milestoneStorage';
import { useProgress } from '../../storage/questStorage';
import { colors, fonts } from '../../styling/theme';

export default function MilestoneProgress() {
  const completedQuestIds = useProgress((state) => state.completed);
  const milestones = useMilestones((state) => state.milestones);
  const milestoneProgress = useMilestones((state) => state.progress);
  const nextMilestone = milestones.find(
    (milestone) =>
      !milestoneProgress.some(
        (progress) => progress.milestoneId === milestone.id && progress.completed,
      ),
  );

  if (!nextMilestone) {
    return null;
  }

  const completedRequirements = nextMilestone.required_quests.filter((questId) =>
    completedQuestIds.includes(questId),
  ).length;
  const totalRequirements = nextMilestone.required_quests.length;
  const completionPercentage =
    totalRequirements === 0 ? 0 : (completedRequirements / totalRequirements) * 100;

  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>Practice, not perfection</Text>
        <Text style={styles.link}>Your milestones</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${nextMilestone.display_name}, ${completedRequirements} of ${totalRequirements} quests complete`}
        style={styles.card}
      >
        <View style={styles.iconCircle}>
          <Sprout color="#B77722" size={28} strokeWidth={1.8} />
        </View>
        <View style={styles.details}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {nextMilestone.display_name}
            </Text>
            <Text style={styles.count}>
              {completedRequirements} / {totalRequirements}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
          </View>
          <Text style={styles.description} numberOfLines={1}>
            {nextMilestone.description}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 32,
  },
  headingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  heading: {
    color: colors.primaryDark,
    fontFamily: fonts.sans,
    fontSize: 23,
  },
  link: {
    color: colors.primary,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.sand,
    borderRadius: 18,
    flexDirection: 'row',
    gap: 16,
    minHeight: 104,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  details: {
    flex: 1,
    gap: 8,
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: colors.primaryDark,
    flex: 1,
    fontFamily: fonts.sansMedium,
    fontSize: 18,
  },
  count: {
    color: colors.primaryDark,
    fontFamily: fonts.sans,
    fontSize: 14,
    marginLeft: 8,
  },
  progressTrack: {
    backgroundColor: '#D8CCB2',
    borderRadius: 4,
    height: 6,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#B77722',
    borderRadius: 4,
    height: '100%',
  },
  description: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 14,
  },
});

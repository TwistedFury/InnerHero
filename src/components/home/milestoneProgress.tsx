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
        <View style={styles.headingDivider} />
        <Text style={styles.link}>Your milestones</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${nextMilestone.display_name}, ${completedRequirements} of ${totalRequirements} quests complete`}
        style={styles.card}
      >
        <View style={styles.iconCircle}>
          <Sprout color={colors.gold} size={28} strokeWidth={1.8} />
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
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  heading: {
    color: colors.text,
    flexShrink: 1,
    fontFamily: fonts.heading,
    fontSize: 24,
  },
  link: {
    color: colors.primary,
    flexShrink: 0,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
  },
  headingDivider: {
    flex: 1,
    height: 1,
    marginHorizontal: 10,
    backgroundColor: colors.border,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.sand,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderRadius: 6,
    flexDirection: 'row',
    gap: 16,
    minHeight: 104,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.gold,
    borderWidth: 2,
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
    color: colors.text,
    flex: 1,
    fontFamily: fonts.serif,
    fontSize: 19,
  },
  count: {
    color: colors.text,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    marginLeft: 8,
  },
  progressTrack: {
    backgroundColor: colors.track,
    borderRadius: 4,
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.gold,
    borderRadius: 4,
    height: '100%',
  },
  description: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 14,
  },
});
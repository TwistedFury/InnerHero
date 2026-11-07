import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../../styling/theme';
import { useMilestones } from '../../storage/milestoneStorage';
import { useProgress } from '../../storage/questStorage';
import { getIcon } from '../../helper/icons';

const MilestoneIcon = getIcon('bookmark');

export default function Milestones() {
  const completed = useProgress((state) => state.completed);
  const milestones = useMilestones((state) => state.milestones);
  const milestoneProgress = useMilestones((state) => state.progress);

  const earnedMilestones = milestones.filter((milestone) =>
    milestoneProgress.some(
      (milestoneState) => milestoneState.milestoneId === milestone.id && milestoneState.completed,
    ),
  );
  const nextMilestone = milestones.find(
    (milestone) =>
      !milestoneProgress.some(
        (milestoneState) =>
          milestoneState.milestoneId === milestone.id && milestoneState.completed,
      ),
  );

  return (
    <View style={styles.milestonesSection}>
      <Text style={styles.milestonesTitle}>Milestones earned</Text>
      {earnedMilestones.length > 0 ? (
        <View style={styles.milestoneRow}>
          {earnedMilestones.map((milestone) => (
            <View key={milestone.id} style={styles.milestoneCard}>
              <MilestoneIcon color={colors.gold} size={18} strokeWidth={1.8} />
              <Text style={styles.milestoneName} numberOfLines={1}>
                {milestone.display_name}
              </Text>
              <Text style={styles.milestoneDescription} numberOfLines={1}>
                {milestone.description}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyMilestones}>Your first milestone is still ahead.</Text>
      )}
      {nextMilestone ? (
        <View style={styles.nextMilestone}>
          <MilestoneIcon color={colors.primary} size={15} strokeWidth={1.8} />
          <Text style={styles.nextMilestoneText} numberOfLines={1}>
            Next: {nextMilestone.display_name}
          </Text>
          <Text style={styles.nextMilestoneProgress}>
            {completed.filter((questId) => nextMilestone.required_quests.includes(questId)).length}{' '}
            of {nextMilestone.required_quests.length} quests
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  milestonesSection: {
    marginBottom: 28,
  },
  milestonesTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    marginBottom: 10,
  },
  milestoneRow: {
    flexDirection: 'row',
    gap: 10,
  },
  milestoneCard: {
    backgroundColor: colors.sand,
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 6,
    flex: 1,
    minHeight: 90,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  milestoneName: {
    color: colors.text,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    marginTop: 6,
  },
  milestoneDescription: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 11,
    marginTop: 4,
  },
  // shown before any milestone is earned, like a note written to yourself
  emptyMilestones: {
    backgroundColor: colors.sand,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 6,
    color: colors.muted,
    fontFamily: fonts.handwriting,
    fontSize: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  nextMilestone: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  nextMilestoneText: {
    color: colors.muted,
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 12,
    marginLeft: 6,
  },
  nextMilestoneProgress: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 12,
  },
});
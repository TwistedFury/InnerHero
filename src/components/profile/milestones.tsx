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
              <MilestoneIcon color="#B77722" size={18} strokeWidth={1.8} />
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
    color: colors.primaryDark,
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    marginBottom: 10,
  },
  milestoneRow: {
    flexDirection: 'row',
    gap: 10,
  },
  milestoneCard: {
    backgroundColor: '#F3E6CE',
    borderRadius: 10,
    flex: 1,
    minHeight: 76,
    paddingHorizontal: 11,
    paddingVertical: 11,
  },
  milestoneName: {
    color: colors.primaryDark,
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    marginTop: 5,
  },
  milestoneDescription: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 8,
    marginTop: 4,
  },
  emptyMilestones: {
    backgroundColor: '#F3E6CE',
    borderRadius: 10,
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  nextMilestone: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 9,
  },
  nextMilestoneText: {
    color: colors.muted,
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 9,
    marginLeft: 6,
  },
  nextMilestoneProgress: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 9,
  },
});
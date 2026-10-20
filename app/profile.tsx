import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useUser } from '../src/storage/userStorage';
import { useProgress } from '../src/storage/questStorage';
import { useMilestones } from '../src/storage/milestoneStorage';
import { generateDisplayName } from '../src/helper/nameGenerator';
import { getIcon } from '../src/helper/icons';
import { colors, fonts } from '../src/styling/theme';

const EditIcon = getIcon('edit');
const ShieldIcon = getIcon('shield');
const MilestoneIcon = getIcon('bookmark');

function formatPracticeDate(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return 'Practicing since today';

  return `Practicing since ${date.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })}`;
}

export default function Profile() {
  const displayName = useUser((state) => state.profile.displayName ?? '');
  const createdAt = useUser((state) => state.createdAt);
  const updateProfile = useUser((state) => state.updateProfile);
  const completed = useProgress((state) => state.completed);
  const progress = useProgress((state) => state.progress);
  const milestones = useMilestones((state) => state.milestones);
  const milestoneProgress = useMilestones((state) => state.progress);
  const [nameDraft, setNameDraft] = useState(displayName);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const techniquesExplored = new Set(
    completed.map((questId) => progress[questId]?.questVersion ?? questId),
  ).size;
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

  const handleSave = () => {
    const trimmedName = nameDraft.trim();

    if (!trimmedName) {
      setError('Please enter a name.');
      return;
    }

    updateProfile({ displayName: trimmedName });
    setNameDraft(trimmedName);
    setError('');
    setIsEditing(false);
  };

  const handleGenerateName = () => {
    setNameDraft(generateDisplayName());
    setError('');
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.panel}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.eyebrow}>YOUR FIELD NOTES</Text>
          <Text style={styles.title}>A practice of your own.</Text>

          <View style={styles.identity}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTree}>△</Text>
              <View style={styles.avatarTrunk} />
              <View style={styles.avatarGround} />
            </View>
            <View style={styles.identityCopy}>
              <Text style={styles.name}>{displayName || 'Quiet Cedar'}</Text>
              <Text style={styles.alias}>Generated alias · no real name needed</Text>
              <Text style={styles.practiceDate}>{formatPracticeDate(createdAt)}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isEditing ? 'Close name editor' : 'Edit name'}
              accessibilityState={{ expanded: isEditing }}
              onPress={() => {
                setIsEditing((editing) => !editing);
                setError('');
              }}
              style={({ pressed }) => [
                styles.editButton,
                isEditing && styles.editButtonActive,
                pressed && styles.buttonPressed,
              ]}
            >
              <EditIcon
                color={isEditing ? colors.onDark : colors.primary}
                size={19}
                strokeWidth={1.8}
              />
            </Pressable>
          </View>

          <View style={styles.privacyCard}>
            <View style={styles.privacyHeading}>
              <ShieldIcon size={16} color={colors.primary} strokeWidth={2} />
              <Text style={styles.privacyTitle}>Private by design</Text>
            </View>
            <Text style={styles.privacyCopy}>
              No account or identifying data collected. Your profile, reflections and progress
              stay on this device. No cloud syncing.
            </Text>
          </View>

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

          <View style={styles.milestonesSection}>
            <Text style={styles.milestonesTitle}>Milestones earned</Text>
            {earnedMilestones.length > 0 ? (
              <View style={styles.milestoneRow}>
                {earnedMilestones.map((milestone) => (
                  <View key={milestone.id} style={styles.milestoneCard}>
                    <MilestoneIcon color="#B77722" size={18} strokeWidth={1.8} />
                    <Text style={styles.milestoneName} numberOfLines={1}>
                      {milestone.displayName}
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
                  Next: {nextMilestone.displayName}
                </Text>
                <Text style={styles.nextMilestoneProgress}>
                  {completed.filter((questId) => nextMilestone.requiredQuests.includes(questId)).length}{' '}
                  of {nextMilestone.requiredQuests.length} quests
                </Text>
              </View>
            ) : null}
          </View>

          {isEditing ? (
            <View style={styles.editSection}>
              <Text style={styles.sectionTitle}>Your name</Text>
              <TextInput
                value={nameDraft}
                placeholder="What should we call you?"
                placeholderTextColor={colors.muted}
                onChangeText={(value) => {
                  setNameDraft(value);
                  setError('');
                }}
                accessibilityLabel="Your name"
                autoCapitalize="words"
                onSubmitEditing={handleSave}
                returnKeyType="done"
                style={styles.input}
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save name"
                onPress={handleSave}
                style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.saveButtonText}>Save name</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Generate random name"
                onPress={handleGenerateName}
                style={({ pressed }) => [styles.generateButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.generateButtonText}>Generate random name</Text>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#20231F',
  },
  panel: {
    flex: 1,
    marginTop: 10,
    overflow: 'hidden',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 40,
  },
  eyebrow: {
    color: colors.primary,
    fontFamily: fonts.sansMedium,
    fontSize: 9,
    letterSpacing: 0.7,
    marginBottom: 7,
  },
  title: {
    color: colors.primaryDark,
    fontFamily: fonts.serif,
    fontSize: 25,
    lineHeight: 31,
    marginBottom: 20,
  },
  identity: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 24,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#123A32',
    borderRadius: 40,
    height: 60,
    justifyContent: 'center',
    marginRight: 14,
    overflow: 'hidden',
    width: 60,
  },
  avatarTree: {
    color: colors.onDark,
    fontFamily: 'Georgia',
    fontSize: 36,
    lineHeight: 38,
    marginTop: -3,
  },
  avatarTrunk: {
    backgroundColor: colors.onDark,
    height: 16,
    marginTop: -8,
    width: 2,
  },
  avatarGround: {
    backgroundColor: colors.onDark,
    height: 1,
    marginTop: 2,
    width: 30,
  },
  identityCopy: {
    flex: 1,
  },
  editButton: {
    alignItems: 'center',
    backgroundColor: colors.tint,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginLeft: 8,
    width: 40,
  },
  editButtonActive: {
    backgroundColor: colors.primary,
  },
  name: {
    color: colors.primaryDark,
    fontFamily: fonts.serif,
    fontSize: 21,
    marginBottom: 3,
  },
  alias: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 9,
    marginBottom: 3,
  },
  practiceDate: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 9,
  },
  privacyCard: {
    backgroundColor: '#E8EEE7',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  privacyHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  privacyTitle: {
    color: colors.primary,
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    marginLeft: 7,
  },
  privacyCopy: {
    color: '#3D5A53',
    fontFamily: fonts.sans,
    fontSize: 10,
    lineHeight: 14,
  },
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
  editSection: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: 22,
  },
  sectionTitle: {
    color: colors.primaryDark,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    color: colors.text,
    fontFamily: fonts.sans,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  error: {
    color: '#B42318',
    fontFamily: fonts.sans,
    fontSize: 12,
    marginTop: 7,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 9,
    marginTop: 14,
    paddingVertical: 12,
  },
  saveButtonText: {
    color: colors.onDark,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
  },
  generateButton: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  generateButtonText: {
    color: colors.primary,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
  },
  buttonPressed: {
    opacity: 0.78,
  },
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

import { Pressable, Text, StyleSheet, View } from 'react-native';
import { createElement } from 'react';
import { useRouter, type RelativePathString } from 'expo-router';

import findQuest from '../../helper/questFinder';
import { colors, fonts } from '../../styling/theme';
import { getIcon } from '../../helper/icons';

type QuestCardProps = {
  questCode: string;
  pathToQuests: RelativePathString;
  duration: string;
  progressLabel?: string;
  completed: boolean;
  index: number; // position in the list, used to pick a tilt
};

// Each card takes the next tilt in this list, then it starts over
const TILTS = ['-1.2deg', '0.8deg', '-0.5deg', '1.1deg'];

export default function QuestCard({
  questCode,
  pathToQuests,
  duration,
  progressLabel,
  completed,
  index,
}: QuestCardProps) {
  const router = useRouter();
  const quest = findQuest(questCode);

  const Icon = getIcon(quest?.icon);
  const Bookmark = getIcon('bookmark');

  const ink = completed ? colors.muted : colors.text;
  const accent = completed ? colors.muted : colors.primary;

  return (
    <Pressable
      onPress={() =>
        router.navigate({ pathname: pathToQuests, params: { questCode } })
      }
      accessibilityRole="button"
      accessibilityLabel={`${quest?.name}, ${duration}`}
      style={({ pressed }) => [
        styles.card,
        { opacity: completed ? 0.85 : 1 },
        {
          transform: [
            { rotate: pressed ? '0deg' : TILTS[index % TILTS.length] },
            { scale: pressed ? 1.02 : 1 },
          ],
        },
      ]}
    >
      <View style={styles.pin} />

      <View style={styles.topRow}>
        <View style={[styles.tag, { borderColor: accent }]}>
          <Text style={[styles.tagText, { color: accent }]}>{quest?.tag}</Text>
        </View>
        <Text style={[styles.duration, { color: colors.muted }]}>{duration}</Text>
      </View>

      <View style={styles.titleRow}>
        <View style={styles.iconTile}>
          {createElement(Icon, { style: { width: 22, height: 22, color: accent } })}
        </View>
        <Text style={[styles.title, { color: ink }]}>{quest?.name}</Text>
      </View>

      <Text style={[styles.description, { color: ink }]}>{quest?.description}</Text>

      {!!progressLabel && (
        <View style={styles.progressRow}>
          {createElement(Bookmark, { style: { width: 18, height: 18, color: accent } })}
          <Text style={[styles.progressText, { color: accent }]}>{progressLabel}</Text>
        </View>
      )}

      <Text style={styles.source}>{quest?.theory}</Text>

      {completed && (
        <View style={styles.seal}>
          <Text style={styles.sealText}>✓</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    paddingTop: 22,
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    // different radius per corner = looks hand-cut
    borderTopLeftRadius: 4,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 9,
    marginBottom: 20,
    // shadow (iOS and web use these four, Android uses elevation)
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  pin: {
    position: 'absolute',
    top: -7,
    left: '50%',
    marginLeft: -7,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.seal,
    borderWidth: 2,
    borderColor: '#5A1D1A',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
  },
  tagText: { fontFamily: fonts.sansMedium, fontSize: 12 },
  duration: { fontFamily: fonts.sans, fontSize: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconTile: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.tint,
  },
  title: { flex: 1, fontFamily: fonts.serif, fontSize: 19 },
  description: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 21 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  progressText: { fontFamily: fonts.sansBold, fontSize: 12 },
  source: {
    fontFamily: fonts.sans,
    fontSize: 11,
    lineHeight: 16,
    color: colors.muted,
  },
  seal: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.seal,
    transform: [{ rotate: '-12deg' }],
  },
  sealText: { color: colors.onDark, fontSize: 20, fontWeight: '700' },
});
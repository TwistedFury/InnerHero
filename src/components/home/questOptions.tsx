import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getIcon } from '../../helper/icons';
import type { Quest } from '../../types/quest';
import { colors, fonts } from '../../styling/theme';

import PaperSheet from '../paperSheet';

type QuestOptionsProps = {
  quests: Quest[];
};

// Same idea as the Quest Board: each note takes the next tilt in the list
const TILTS = ['-1.5deg', '1deg', '-0.6deg', '1.4deg'];

export default function QuestOptions({ quests }: QuestOptionsProps) {
  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>Choose your next step</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View all quests"
          onPress={() => router.push('/quests')}
        >
          <Text style={styles.allQuests}>All quests →</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.cards}
        showsHorizontalScrollIndicator={false}
      >
        {quests.map((quest, index) => {
          const Icon = getIcon(quest.icon);

          return (
            <Pressable
              key={quest.id}
              accessibilityRole="button"
              accessibilityLabel={`${quest.name}, ${quest.estimated_minutes} minutes`}
              onPress={() =>
                router.push({
                  pathname: '/quests/[questCode]',
                  params: { questCode: quest.id },
                })
              }
              style={({ pressed }) => [
                styles.card,
                {
                  transform: [
                    { rotate: pressed ? '0deg' : TILTS[index % TILTS.length] },
                    { scale: pressed ? 1.03 : 1 },
                  ],
                },
              ]}
            >
              <PaperSheet seed={`next-${quest.id}`} style={styles.paper}>
                <Icon color={colors.primary} size={25} strokeWidth={1.8} />
                <Text style={styles.name} numberOfLines={1}>
                  {quest.name}
                </Text>
                <Text style={styles.meta} numberOfLines={1}>
                  {quest.tag.split(' · ')[0]} · {quest.estimated_minutes} min
                </Text>
              </PaperSheet>

              {/* outside the paper so the clipping doesn't cut it off */}
              <View style={styles.pin} />
            </Pressable>
          );
        })}
      </ScrollView>
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
    marginBottom: 6,
  },
  heading: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 24,
  },
  allQuests: {
    color: colors.primary,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
  },
  // extra top and bottom space so the tilt and shadow don't get cut off
  cards: {
    gap: 16,
    paddingTop: 16,
    paddingBottom: 18,
    paddingRight: 20,
  },
  // outer layer: shadow, tilt, size (no clipping here, or the shadow vanishes)
  card: {
    width: 228,
  },
  // inner layer: the paper itself, clipped to the corners
  paper: {
    overflow: 'hidden',
    minHeight: 112,
    justifyContent: 'center',
    padding: 18,
    paddingTop: 22,
  },
  // blown up slightly so the photo's pale edges fall outside the clip
  paperImage: {
    transform: [{ scale: 1.08 }],
  },
  pin: {
    position: 'absolute',
    top: 4,
    left: '50%',
    marginLeft: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.seal,
    borderWidth: 2,
    borderColor: '#5A1D1A',
  },
  name: {
    marginTop: 10,
    color: colors.text,
    fontFamily: fonts.serif,
    fontSize: 16,
  },
  meta: {
    marginTop: 5,
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 13,
  },
});
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getIcon } from '../../helper/icons';
import type { Quest } from '../../types/quest';
import { colors, fonts } from '../../styling/theme';

type QuestOptionsProps = {
  quests: Quest[];
};

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
        {quests.map((quest) => {
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
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            >
              <Icon color={colors.primary} size={25} strokeWidth={1.8} />
              <Text style={styles.name} numberOfLines={1}>
                {quest.name}
              </Text>
              <Text style={styles.meta} numberOfLines={1}>
                {quest.tag.split(' · ')[0]} · {quest.estimated_minutes} min
              </Text>
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
    marginBottom: 14,
  },
  heading: {
    color: colors.primaryDark,
    fontFamily: fonts.sans,
    fontSize: 22,
  },
  allQuests: {
    color: colors.primary,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
  },
  cards: {
    gap: 14,
    paddingRight: 20,
  },
  card: {
    width: 228,
    minHeight: 106,
    justifyContent: 'center',
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  cardPressed: {
    opacity: 0.88,
    borderColor: colors.primary,
  },
  name: {
    marginTop: 10,
    color: colors.primaryDark,
    fontFamily: fonts.sansMedium,
    fontSize: 15,
  },
  meta: {
    marginTop: 5,
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 13,
  },
});

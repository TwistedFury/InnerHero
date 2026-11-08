import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { QuestAnswer, QuestListItem, QuestStep } from '../../types/quest';
import { colors, fonts } from '../../styling/theme';

type QuestProps = {
  step: QuestStep;
  value: QuestAnswer | undefined;
  onChange: (answer: QuestAnswer) => void;
  list_answer: string[];
};

const toRankedAnswer = (items: QuestListItem[]): QuestListItem[] =>
  items.map((item, index) => ({
    item: item.item ?? '',
    rank: String(index + 1),
  }));

export default function QuestRank({ step, value, onChange, list_answer }: QuestProps) {
  const hasSavedRanking = Array.isArray(value) && value.length > 0;
  const items: QuestListItem[] = hasSavedRanking
    ? value
    : list_answer.map((item) => ({ item, rank: '' }));

  // Save the starting order right away, so "leave it as is" counts as an answer
  useEffect(() => {
    if (!hasSavedRanking && list_answer.length > 0) {
      onChange(toRankedAnswer(list_answer.map((item) => ({ item }))));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveItem = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;

    const nextItems = [...items];
    [nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
    onChange(toRankedAnswer(nextItems));
  };

  if (items.length === 0) {
    return (
      <Text style={styles.empty}>There are no activities to rank yet.</Text>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.instructions}>Use the arrows to move each activity into place.</Text>

      {!!step.min_label && <Text style={styles.endLabel}>▲ {step.min_label}</Text>}

      {items.map((item, index) => (
        <View key={`${item.item}-${index}`} style={styles.item}>
          <View style={styles.rank}>
            <Text style={styles.rankText}>{index + 1}</Text>
          </View>
          <Text style={styles.label}>{item.item}</Text>
          <View style={styles.controls}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Move ${item.item} up`}
              accessibilityState={{ disabled: index === 0 }}
              disabled={index === 0}
              onPress={() => moveItem(index, -1)}
              style={({ pressed }) => [
                styles.control,
                index === 0 && styles.controlDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.controlText}>↑</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Move ${item.item} down`}
              accessibilityState={{ disabled: index === items.length - 1 }}
              disabled={index === items.length - 1}
              onPress={() => moveItem(index, 1)}
              style={({ pressed }) => [
                styles.control,
                index === items.length - 1 && styles.controlDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.controlText}>↓</Text>
            </Pressable>
          </View>
        </View>
      ))}

      {!!step.max_label && <Text style={styles.endLabel}>▼ {step.max_label}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // gap belongs here, not on the ScrollView's own style
  content: { gap: 10, paddingBottom: 8 },
  instructions: {
    color: colors.muted,
    fontFamily: fonts.handwriting,
    fontSize: 20,
  },
  endLabel: {
    color: colors.muted,
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  empty: {
    color: colors.muted,
    fontFamily: fonts.handwriting,
    fontSize: 22,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 64,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 6,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderRadius: 6,
  },
  rank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  rankText: {
    color: colors.onDark,
    fontFamily: fonts.sansBold,
    fontSize: 15,
  },
  label: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.handwriting,
    fontSize: 22,
    lineHeight: 26,
  },
  controls: { flexDirection: 'row' },
  control: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlDisabled: { opacity: 0.25 },
  controlText: {
    color: colors.primary,
    fontFamily: fonts.sansBold,
    fontSize: 22,
  },
  pressed: { opacity: 0.6 },
});
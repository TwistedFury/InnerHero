import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import type { QuestAnswer, QuestListItem, QuestStep } from '../../types/quest';

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

export default function QuestRank({ value, onChange, list_answer }: QuestProps) {
  const items: QuestListItem[] = Array.isArray(value) && value.length
    ? value
    : list_answer.map((item) => ({ item, rank: '' }));

  const moveItem = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;

    const nextItems = [...items];
    [nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
    onChange(toRankedAnswer(nextItems));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.instructions}>Move each activity into your preferred order.</Text>
      {items.map((item, index) => (
        <View key={`${item.item}-${index}`} style={styles.item}>
          <Text style={styles.rank}>{index + 1}</Text>
          <Text style={styles.label}>{item.item}</Text>
          <View style={styles.controls}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Move ${item.item} up`}
              accessibilityState={{ disabled: index === 0 }}
              disabled={index === 0}
              onPress={() => moveItem(index, -1)}
              style={[styles.control, index === 0 && styles.controlDisabled]}
            >
              <Text style={styles.controlText}>↑</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Move ${item.item} down`}
              accessibilityState={{ disabled: index === items.length - 1 }}
              disabled={index === items.length - 1}
              onPress={() => moveItem(index, 1)}
              style={[styles.control, index === items.length - 1 && styles.controlDisabled]}
            >
              <Text style={styles.controlText}>↓</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  instructions: { color: '#687076', fontSize: 15 },
  item: {
    alignItems: 'center',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 58,
    padding: 10,
  },
  rank: {
    alignItems: 'center',
    backgroundColor: '#1D4ED8',
    borderRadius: 16,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    minWidth: 32,
    overflow: 'hidden',
    paddingVertical: 6,
    textAlign: 'center',
  },
  label: { color: '#17202A', flex: 1, fontSize: 16 },
  controls: { flexDirection: 'row', gap: 6 },
  control: {
    alignItems: 'center',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 36,
    padding: 6,
  },
  controlDisabled: { opacity: 0.35 },
  controlText: { color: '#17202A', fontSize: 18 },
});
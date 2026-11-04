import { StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import type { QuestAnswer, QuestListItem, QuestStep } from '../../types/quest';

type QuestProps = {
  step: QuestStep;
  value: QuestAnswer | undefined;
  onChange: (answer: QuestAnswer) => void;
  list_answer: string[];
};

export default function QuestSchedule({ value, onChange, list_answer }: QuestProps) {
  const items: QuestListItem[] = Array.isArray(value) && value.length
    ? value
    : list_answer.map((item) => ({ item, day: '', time: '' }));

  const updateItem = (index: number, field: 'day' | 'time', text: string) => {
    const nextItems = items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: text } : item,
    );
    onChange(nextItems);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.instructions}>
        Choose a specific day and time for each activity.
      </Text>
      {items.map((item, index) => (
        <View key={`${item.item}-${index}`} style={styles.item}>
          <Text style={styles.activity}>{item.item}</Text>
          <View style={styles.fields}>
            <View style={styles.field}>
              <Text style={styles.label}>Day</Text>
              <TextInput
                value={item.day ?? ''}
                onChangeText={(text) => updateItem(index, 'day', text)}
                placeholder="e.g. Monday"
                accessibilityLabel={`${item.item} day`}
                style={styles.input}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Time</Text>
              <TextInput
                value={item.time ?? ''}
                onChangeText={(text) => updateItem(index, 'time', text)}
                placeholder="e.g. 7:00 PM"
                accessibilityLabel={`${item.item} time`}
                style={styles.input}
              />
            </View>
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
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
  },
  activity: { color: '#17202A', fontSize: 16, fontWeight: '700' },
  fields: { flexDirection: 'row', gap: 10 },
  field: { flex: 1, gap: 6 },
  label: { color: '#687076', fontSize: 14, fontWeight: '600' },
  input: {
    minHeight: 46,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    fontSize: 16,
  },
});
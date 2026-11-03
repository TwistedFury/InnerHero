import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { QuestListItem, QuestStep } from '../../types/quest';

type QuestListProps = {
  step: QuestStep;
  value: QuestListItem[] | undefined;
  onChange: (answer: QuestListItem[]) => void;
};

const formatLabel = (field: string) =>
  field.charAt(0).toUpperCase() + field.slice(1).replace(/[-_]/g, ' ');

export default function QuestList({ step, value, onChange }: QuestListProps) {
  const fields = step.fields?.length ? step.fields : ['item'];
  const items = value?.length ? value : [{}];
  const canAdd = step.max_items === undefined || items.length < step.max_items;

  const updateItem = (index: number, field: string, text: string) => {
    const nextItems = items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: text } : item,
    );
    onChange(nextItems);
  };

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.itemLabel}>Item {index + 1}</Text>
          {fields.map((field) => (
            <TextInput
              key={field}
              value={item[field] ?? ''}
              onChangeText={(text) => updateItem(index, field, text)}
              placeholder={formatLabel(field)}
              accessibilityLabel={`Item ${index + 1}, ${formatLabel(field)}`}
              style={styles.input}
            />
          ))}
        </View>
      ))}
      {canAdd ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add another item"
          onPress={() => onChange([...items, {}])}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+ Add item</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  item: {
    gap: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
  },
  itemLabel: { color: '#17202A', fontSize: 15, fontWeight: '700' },
  input: {
    minHeight: 46,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    fontSize: 16,
  },
  addButton: {
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#1D4ED8',
    borderRadius: 10,
  },
  addButtonText: { color: '#1D4ED8', fontSize: 16, fontWeight: '700' },
});
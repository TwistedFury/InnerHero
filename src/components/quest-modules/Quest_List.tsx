import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { QuestListItem, QuestStep } from '../../types/quest';
import { colors, fonts } from '../../styling/theme';

type QuestListProps = {
  step: QuestStep;
  value: QuestListItem[] | undefined;
  onChange: (answer: QuestListItem[]) => void;
};

// Fields that hold a 0 to 10 rating get a number keyboard and sit side by side
const RATING_FIELDS = ['enjoyment', 'importance'];

const formatLabel = (field: string) =>
  field.charAt(0).toUpperCase() + field.slice(1).replace(/[-_]/g, ' ');

export default function QuestList({ step, value, onChange }: QuestListProps) {
  const fields = step.fields?.length ? step.fields : ['item'];
  const textFields = fields.filter((field) => !RATING_FIELDS.includes(field));
  const ratingFields = fields.filter((field) => RATING_FIELDS.includes(field));
  const items = value?.length ? value : [{}];
  const canAdd = step.max_items === undefined || items.length < step.max_items;

  // How many rows have something written in them
  const filledCount = items.filter((item) =>
    Object.values(item).some((text) => (text ?? '').trim() !== ''),
  ).length;

  let countText = '';
  if (step.min_items !== undefined && step.max_items === undefined) {
    countText = `${filledCount} of ${step.min_items} so far`;
  } else if (step.max_items !== undefined) {
    countText = `Up to ${step.max_items}`;
  }

  const updateItem = (index: number, field: string, text: string) => {
    const nextItems = items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: text } : item,
    );
    onChange(nextItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const renderInput = (item: QuestListItem, index: number, field: string, isRating: boolean) => (
    <TextInput
      key={field}
      value={item[field] ?? ''}
      onChangeText={(text) => updateItem(index, field, text)}
      placeholder={isRating ? `${formatLabel(field)} (0–10)` : formatLabel(field)}
      placeholderTextColor={colors.muted}
      accessibilityLabel={`Item ${index + 1}, ${formatLabel(field)}`}
      keyboardType={isRating ? 'number-pad' : 'default'}
      maxLength={isRating ? 2 : undefined}
      style={[styles.input, isRating && styles.ratingInput]}
    />
  );

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {!!countText && <Text style={styles.count}>{countText}</Text>}

      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.itemHeader}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{index + 1}</Text>
            </View>
            {items.length > 1 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove item ${index + 1}`}
                onPress={() => removeItem(index)}
                style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
              >
                <Text style={styles.removeText}>×</Text>
              </Pressable>
            )}
          </View>

          {textFields.map((field) => renderInput(item, index, field, false))}

          {ratingFields.length > 0 && (
            <View style={styles.ratingRow}>
              {ratingFields.map((field) => renderInput(item, index, field, true))}
            </View>
          )}
        </View>
      ))}

      {canAdd ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add another item"
          onPress={() => onChange([...items, {}])}
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        >
          <Text style={styles.addButtonText}>+ Add another</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // gap belongs here, not on the ScrollView's own style
  content: { gap: 14, paddingBottom: 8 },
  count: {
    color: colors.muted,
    fontFamily: fonts.handwriting,
    fontSize: 20,
  },
  item: {
    gap: 8,
    padding: 14,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderRadius: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  badgeText: {
    color: colors.onDark,
    fontFamily: fonts.sansBold,
    fontSize: 14,
  },
  remove: {
    width: 44,
    height: 44,
    marginRight: -10,
    marginTop: -8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 26,
    lineHeight: 28,
  },
  // written on a line, like handwriting in a notebook
  input: {
    minHeight: 48,
    paddingHorizontal: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
    color: colors.text,
    fontFamily: fonts.handwriting,
    fontSize: 22,
  },
  ratingRow: { flexDirection: 'row', gap: 12 },
  ratingInput: { flex: 1 },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderRadius: 6,
  },
  addButtonText: {
    color: colors.primary,
    fontFamily: fonts.sansBold,
    fontSize: 16,
  },
  pressed: { opacity: 0.7 },
});
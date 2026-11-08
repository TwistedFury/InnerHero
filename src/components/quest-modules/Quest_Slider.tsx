import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { QuestStep, QuestAnswer } from '../../types/quest';
import { colors, fonts } from '../../styling/theme';

type QuestProps = {
  step: QuestStep;
  value: QuestAnswer | undefined;
  onChange: (answer: QuestAnswer) => void;
};

export default function QuestSlider({ step, value, onChange }: QuestProps) {
  const min = step.min ?? 1;
  const max = step.max ?? 10;
  const numbers = Array.from({ length: max - min + 1 }, (_, index) => min + index);
  const selected = typeof value === 'number' ? value : undefined;

  // A long scale is a count ("how many?"), not a rating, so it wraps into a grid
  const isCount = numbers.length > 11;

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={[styles.bigNumber, selected === undefined && styles.bigNumberEmpty]}>
          {selected !== undefined ? selected : '–'}
        </Text>
        <Text style={styles.outOf}>out of {max}</Text>
      </View>

      <View
        accessibilityRole="radiogroup"
        style={isCount ? styles.grid : styles.row}
      >
        {numbers.map((number) => {
          const isSelected = selected === number;
          return (
            <Pressable
              key={number}
              onPress={() => onChange(number)}
              accessibilityRole="radio"
              accessibilityLabel={`${number} out of ${max}`}
              accessibilityState={{ selected: isSelected }}
              style={[
                isCount ? styles.gridChoice : styles.rowChoice,
                isSelected && styles.choiceSelected,
              ]}
            >
              <Text style={isSelected ? styles.choiceTextSelected : styles.choiceText}>
                {number}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {!!(step.min_label || step.max_label) && (
        <View style={styles.endLabels}>
          <Text style={styles.endText}>{step.min_label}</Text>
          <Text style={styles.endText}>{step.max_label}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  display: { alignItems: 'center', gap: 2 },
  bigNumber: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 64,
    lineHeight: 72,
  },
  bigNumberEmpty: { color: colors.border },
  outOf: {
    color: colors.muted,
    fontFamily: fonts.handwriting,
    fontSize: 20,
  },

  // Ratings: one row, buttons share the width equally
  row: { flexDirection: 'row', gap: 4 },
  rowChoice: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },

  // Counts: wrapping grid of bigger buttons
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  gridChoice: {
    width: 56,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },

  choiceSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.gold,
  },
  choiceText: {
    color: colors.text,
    fontFamily: fonts.sansMedium,
    fontSize: 16,
  },
  choiceTextSelected: {
    color: colors.onDark,
    fontFamily: fonts.sansBold,
    fontSize: 16,
  },

  endLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  endText: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 13,
  },
});
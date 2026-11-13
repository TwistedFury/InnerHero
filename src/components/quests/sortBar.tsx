import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../styling/theme';
import { SORT_OPTIONS, type SortMode } from '../../helper/questSorter';

export default function SortBar({
  sortMode,
  setSortMode,
}: {
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
}) {
  return (
    <View style={styles.row}>
      {SORT_OPTIONS.map((option) => {
        const selected = option.key === sortMode;
        return (
          <Pressable
            key={option.key}
            accessibilityRole="button"
            accessibilityLabel={`Sort quests: ${option.label}`}
            accessibilityState={{ selected }}
            onPress={() => setSortMode(option.key)}
            style={({ pressed }) => [
              styles.pill,
              selected && styles.pillSelected,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 24,
  },
  pill: {
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pillSelected: {
    backgroundColor: colors.primary,
  },
  pillText: {
    color: colors.onDarkMuted,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
  },
  pillTextSelected: {
    color: colors.onDark,
  },
  pressed: {
    opacity: 0.78,
  },
});
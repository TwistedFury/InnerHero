import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { QuestAnswer, QuestListItem, QuestStep } from '../../types/quest';
import { colors, fonts } from '../../styling/theme';

type QuestProps = {
  step: QuestStep;
  value: QuestAnswer | undefined;
  onChange: (answer: QuestAnswer) => void;
  list_answer: string[];
};

const DAYS = [
  { full: 'Monday', short: 'Mon' },
  { full: 'Tuesday', short: 'Tue' },
  { full: 'Wednesday', short: 'Wed' },
  { full: 'Thursday', short: 'Thu' },
  { full: 'Friday', short: 'Fri' },
  { full: 'Saturday', short: 'Sat' },
  { full: 'Sunday', short: 'Sun' },
];

// 6 AM through 10 PM, as 24-hour numbers
const HOURS = Array.from({ length: 17 }, (_, index) => index + 6);
const MINUTES = ['00', '30'];

// 19 -> "7 PM"
const hourLabel = (hour24: number) => `${hour24 % 12 || 12} ${hour24 >= 12 ? 'PM' : 'AM'}`;

// (19, '30') -> "7:30 PM"
const formatTime = (hour24: number, minute: string) =>
  `${hour24 % 12 || 12}:${minute} ${hour24 >= 12 ? 'PM' : 'AM'}`;

// "7:30 PM" -> { hour24: 19, minute: '30' }. Anything we don't recognize gives undefined.
const parseTime = (time: string | undefined) => {
  const match = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i.exec((time ?? '').trim());
  if (!match) return undefined;
  const hour24 = (Number(match[1]) % 12) + (match[3].toUpperCase() === 'PM' ? 12 : 0);
  return { hour24, minute: match[2] };
};

function Chip({
  label,
  selected,
  disabled,
  accessibilityLabel,
  onPress,
  style,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
  onPress: () => void;
  style?: object;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected, disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        style,
        selected && styles.chipSelected,
        disabled && styles.chipDisabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={selected ? styles.chipTextSelected : styles.chipText}>{label}</Text>
    </Pressable>
  );
}

export default function QuestSchedule({ value, onChange, list_answer }: QuestProps) {
  const items: QuestListItem[] = Array.isArray(value) && value.length
    ? value
    : list_answer.map((item) => ({ item, day: '', time: '' }));

  const updateItem = (index: number, changes: Partial<QuestListItem>) => {
    const nextItems: QuestListItem[] = items.map((item, itemIndex) =>
      itemIndex === index
        ? {
            item: changes.item ?? item.item,
            day: changes.day ?? item.day,
            time: changes.time ?? item.time,
          }
        : item,
    );
    onChange(nextItems);
  };

  if (items.length === 0) {
    return <Text style={styles.empty}>There are no activities to schedule yet.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.instructions}>
        Choose a specific day and time for each activity.
      </Text>

      {items.map((item, index) => {
        const time = parseTime(item.time);
        const hasDay = !!item.day;

        return (
          <View key={`${item.item}-${index}`} style={styles.item}>
            <Text style={styles.activity}>{item.item}</Text>

            <Text style={styles.label}>DAY</Text>
            <View style={styles.dayRow} accessibilityRole="radiogroup">
              {DAYS.map((day) => (
                <Chip
                  key={day.full}
                  label={day.short}
                  selected={item.day === day.full}
                  accessibilityLabel={day.full}
                  onPress={() => updateItem(index, { day: day.full })}
                  style={styles.dayChip}
                />
              ))}
            </View>

            <Text style={styles.label}>TIME</Text>
            <View style={styles.timeGrid} accessibilityRole="radiogroup">
              {HOURS.map((hour24) => (
                <Chip
                  key={hour24}
                  label={hourLabel(hour24)}
                  selected={time?.hour24 === hour24}
                  accessibilityLabel={hourLabel(hour24)}
                  onPress={() =>
                    updateItem(index, { time: formatTime(hour24, time?.minute ?? '00') })
                  }
                  style={styles.timeChip}
                />
              ))}
            </View>

            <View style={styles.minuteRow} accessibilityRole="radiogroup">
              {MINUTES.map((minute) => (
                <Chip
                  key={minute}
                  label={`:${minute}`}
                  selected={!!time && time.minute === minute}
                  disabled={!time}
                  accessibilityLabel={`${minute} minutes past the hour`}
                  onPress={() => time && updateItem(index, { time: formatTime(time.hour24, minute) })}
                  style={styles.minuteChip}
                />
              ))}
            </View>

            <Text style={styles.summary}>
              {hasDay && time
                ? `${item.day} · ${formatTime(time.hour24, time.minute)}`
                : 'Pick a day and a time'}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // gap belongs here, not on the ScrollView's own style
  content: { gap: 14, paddingBottom: 8 },
  instructions: {
    color: colors.muted,
    fontFamily: fonts.handwriting,
    fontSize: 20,
  },
  empty: {
    color: colors.muted,
    fontFamily: fonts.handwriting,
    fontSize: 22,
  },
  item: {
    gap: 10,
    padding: 14,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderRadius: 6,
  },
  activity: {
    color: colors.text,
    fontFamily: fonts.handwriting,
    fontSize: 24,
    lineHeight: 28,
  },
  label: {
    color: colors.muted,
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1.2,
  },

  dayRow: { flexDirection: 'row', gap: 4 },
  dayChip: { flex: 1, minHeight: 44 },

  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  timeChip: { width: 62, minHeight: 44 },

  minuteRow: { flexDirection: 'row', gap: 6 },
  minuteChip: { width: 62, minHeight: 44 },

  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 6,
    backgroundColor: colors.bg,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.gold,
  },
  chipDisabled: { opacity: 0.4 },
  chipText: {
    color: colors.text,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
  },
  chipTextSelected: {
    color: colors.onDark,
    fontFamily: fonts.sansBold,
    fontSize: 14,
  },

  summary: {
    color: colors.primary,
    fontFamily: fonts.handwriting,
    fontSize: 22,
    marginTop: 2,
  },
  pressed: { opacity: 0.7 },
});
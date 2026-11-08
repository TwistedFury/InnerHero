import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors, fonts, moodColors } from '../../styling/theme';

type QuestProps = {
  value: number | string | undefined;
  onChange: (answer: number) => void;
};

const LABELS = [
  'Awful', 'Really low', 'Low', 'Down', 'Meh', 'Okay',
  'Fine', 'Good', 'Really good', 'Great', 'Amazing',
];

function MoodFace({ level }: { level: number | undefined }) {
  const number = level ?? 5;
  const faceColor = level === undefined ? '#CBD5E1' : moodColors[level];
  // 0 = frown, 5 = flat line, 10 = big smile
  const curve = 50 + number * 3.6;

  return (
    <Svg width={110} height={110} viewBox="0 0 100 100">
      <Circle cx={50} cy={50} r={46} fill={faceColor} />
      <Circle cx={35} cy={40} r={5} fill="#17202A" />
      <Circle cx={65} cy={40} r={5} fill="#17202A" />
      <Path
        d={`M 30 68 Q 50 ${curve} 70 68`}
        stroke="#17202A"
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export default function QuestMood({ value, onChange }: QuestProps) {
  const parsed = value === undefined || value === '' ? NaN : Number(value);
  const selected = Number.isInteger(parsed) && parsed >= 0 && parsed <= 10 ? parsed : undefined;

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <MoodFace level={selected} />
        <Text style={styles.label}>
          {selected !== undefined ? `${selected} – ${LABELS[selected]}` : 'How are you feeling?'}
        </Text>
      </View>

      <View style={styles.row}>
        {LABELS.map((_, number) => (
          <Pressable
            key={number}
            onPress={() => onChange(number)}
            accessibilityRole="radio"
            accessibilityLabel={`${number} out of 10, ${LABELS[number]}`}
            accessibilityState={{ selected: selected === number }}
            style={[
              styles.choice,
              selected === number && { backgroundColor: moodColors[number], borderColor: moodColors[number] },
            ]}
          >
            <Text style={selected === number ? styles.choiceTextSelected : styles.choiceText}>
              {number}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.endLabels}>
        <Text style={styles.endText}>Low</Text>
        <Text style={styles.endText}>High</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  display: { alignItems: 'center', gap: 8 },
  label: { color: colors.text, fontSize: 18, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 4 },
  choice: {
    flex: 1,
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 10,
  },
  choiceText: { color: colors.text },
  choiceTextSelected: { color: colors.primary, fontWeight: '700' },
  endLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  endText: { color: '#687076', fontSize: 14 },
});
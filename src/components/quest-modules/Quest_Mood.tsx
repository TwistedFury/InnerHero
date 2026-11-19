import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors, fonts, moodColors } from '../../styling/theme';
import { RadialDisc } from '../quests/calmParts';

type QuestProps = {
  value: number | string | undefined;
  onChange: (answer: number) => void;
  calm?: boolean; // dark, glowing version (used by calm quests)
};

const LABELS = [
  'Awful', 'Really low', 'Low', 'Down', 'Meh', 'Okay',
  'Fine', 'Good', 'Really good', 'Great', 'Amazing',
];

function MoodFace({ level, calm }: { level: number | undefined; calm?: boolean }) {
  const number = level ?? 5;
  const empty = level === undefined;
  const faceColor = empty ? (calm ? 'rgba(255,255,255,0.12)' : '#CBD5E1') : moodColors[level];
  const ink = calm && empty ? colors.onDark : '#17202A';
  // 0 = frown, 5 = flat line, 10 = big smile
  const curve = 50 + number * 3.6;

  return (
    <Svg width={110} height={110} viewBox="0 0 100 100">
      <Circle cx={50} cy={50} r={46} fill={faceColor} />
      <Circle cx={35} cy={40} r={5} fill={ink} />
      <Circle cx={65} cy={40} r={5} fill={ink} />
      <Path
        d={`M 30 68 Q 50 ${curve} 70 68`}
        stroke={ink}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export default function QuestMood({ value, onChange, calm }: QuestProps) {
  const parsed = value === undefined || value === '' ? NaN : Number(value);
  const selected = Number.isInteger(parsed) && parsed >= 0 && parsed <= 10 ? parsed : undefined;

  // The face squashes a little, then springs back, whenever the choice changes
  const pop = useSharedValue(1);
  useEffect(() => {
    if (!calm || selected === undefined) return;
    pop.value = withSequence(
      withTiming(0.86, { duration: 90 }),
      withSpring(1, { damping: 8, stiffness: 180 }),
    );
  }, [selected, calm, pop]);

  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));

  const label = selected !== undefined ? `${selected} – ${LABELS[selected]}` : 'How are you feeling?';

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <View style={styles.faceWrap}>
          {calm && selected !== undefined && (
            <View style={styles.glow} pointerEvents="none">
              <RadialDisc
                id="moodGlow"
                size={200}
                stops={[
                  { offset: 0, color: moodColors[selected], opacity: 0.5 },
                  { offset: 0.6, color: moodColors[selected], opacity: 0.15 },
                  { offset: 1, color: moodColors[selected], opacity: 0 },
                ]}
              />
            </View>
          )}
          <Animated.View style={popStyle}>
            <MoodFace level={selected} calm={calm} />
          </Animated.View>
        </View>

        {calm ? (
          <Animated.Text key={label} entering={FadeIn.duration(500)} style={styles.calmLabel}>
            {label}
          </Animated.Text>
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </View>

      <View style={styles.row}>
        {LABELS.map((_, number) => (
          <Pressable
            key={number}
            onPress={() => {
              if (calm) Haptics.selectionAsync();
              onChange(number);
            }}
            accessibilityRole="radio"
            accessibilityLabel={`${number} out of 10, ${LABELS[number]}`}
            accessibilityState={{ selected: selected === number }}
            style={[
              styles.choice,
              calm && styles.calmChoice,
              selected === number && { backgroundColor: moodColors[number], borderColor: moodColors[number] },
            ]}
          >
            <Text
              style={
                selected === number
                  ? calm
                    ? styles.calmChoiceTextSelected
                    : styles.choiceTextSelected
                  : calm
                    ? styles.calmChoiceText
                    : styles.choiceText
              }
            >
              {number}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.endLabels}>
        <Text style={calm ? styles.calmEndText : styles.endText}>Low</Text>
        <Text style={calm ? styles.calmEndText : styles.endText}>High</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  display: { alignItems: 'center', gap: 8 },
  faceWrap: { width: 110, height: 110, alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', left: -45, top: -45 },
  label: { color: colors.text, fontSize: 18, fontWeight: '700' },
  calmLabel: { color: colors.onDark, fontFamily: fonts.serif, fontSize: 20, marginTop: 6 },
  row: { flexDirection: 'row', gap: 4 },
  choice: {
    flex: 1,
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 10,
  },
  // calm: thin glowing circles instead of boxes
  calmChoice: {
    aspectRatio: 1,
    justifyContent: 'center',
    paddingVertical: 0,
    borderRadius: 999,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  choiceText: { color: colors.text },
  choiceTextSelected: { color: colors.primary, fontWeight: '700' },
  calmChoiceText: { color: colors.onDark, fontFamily: fonts.sans, fontSize: 13 },
  calmChoiceTextSelected: { color: '#17202A', fontFamily: fonts.sansBold, fontSize: 13 },
  endLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  endText: { color: '#687076', fontSize: 14 },
  calmEndText: { color: colors.onDarkMuted, fontFamily: fonts.sans, fontSize: 13 },
});
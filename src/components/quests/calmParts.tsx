import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, fonts } from '../../styling/theme';

// Fixed positions so the lights don't jump around on re-render
const MOTES = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  size: 2 + (i % 3),
  duration: 4000 + (i % 5) * 1100,
  delay: (i % 6) * 500,
}));

// One drifting, twinkling light
function Mote({ left, top, size, duration, delay }: (typeof MOTES)[number]) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
  }, [delay, duration, t]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [0.1, 0.65]),
    transform: [{ translateY: interpolate(t.value, [0, 1], [0, -26]) }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: `${left}%`,
          top: `${top}%`,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.onDark,
        },
        style,
      ]}
    />
  );
}

// All the lights together (skipped if the phone has Reduce Motion on)
export function Motes() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;
  return (
    <>
      {MOTES.map((m, i) => (
        <Mote key={i} {...m} />
      ))}
    </>
  );
}

// A soft circle that fades out toward its edge (this is what makes the glow)
export function RadialDisc({
  size,
  id,
  stops,
}: {
  size: number;
  id: string;
  stops: { offset: number; color: string; opacity: number }[];
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id={id} cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">
          {stops.map((s) => (
            <Stop key={s.offset} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
          ))}
        </RadialGradient>
      </Defs>
      <Circle cx="50" cy="50" r="50" fill={`url(#${id})`} />
    </Svg>
  );
}

export function CalmButton({
  label,
  onPress,
  quiet,
}: {
  label: string;
  onPress: () => void;
  quiet?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [quiet ? styles.quiet : styles.pill, pressed && { opacity: 0.6 }]}
    >
      <Text style={quiet ? styles.quietText : styles.pillText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 14,
    paddingHorizontal: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  pillText: { fontFamily: fonts.sansMedium, fontSize: 16, letterSpacing: 1, color: colors.onDark },
  quiet: { paddingVertical: 8, paddingHorizontal: 16 },
  quietText: { fontFamily: fonts.sans, fontSize: 14, color: colors.onDarkMuted },
});
import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { colors, fonts } from '../../styling/theme';

import { Motes, RadialDisc } from './calmParts'

type Phase = 'idle' | 'in' | 'out' | 'done';

type BreathingSceneProps = {
  prompt: string;
  inhaleSeconds: number;
  exhaleSeconds: number;
  cycles: number;
  onContinue: () => void;
};

// 16 dots around a circle, for the slowly turning ring
const ORBIT_DOTS = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  return {
    x: 50 + 48 * Math.cos(angle),
    y: 50 + 48 * Math.sin(angle),
    r: i % 4 === 0 ? 1.5 : 0.8,
  };
});

// The ring of dots, turning once every 90 seconds
function Orbit({ size }: { size: number }) {
  const spin = useSharedValue(0);

  useEffect(() => {
    spin.value = withRepeat(withTiming(360, { duration: 90000, easing: Easing.linear }), -1, false);
  }, [spin]);

  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value}deg` }] }));

  return (
    <Animated.View style={style}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {ORBIT_DOTS.map((d, i) => (
          <Circle key={i} cx={d.x} cy={d.y} r={d.r} fill={colors.onDark} fillOpacity={0.75} />
        ))}
      </Svg>
    </Animated.View>
  );
}

// Wraps anything so it grows/shrinks and brightens/dims with the breath
function Layer({
  progress,
  scale,
  fade,
  children,
}: {
  progress: SharedValue<number>;
  scale: [number, number];
  fade: [number, number];
  children: ReactNode;
}) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], fade),
    transform: [{ scale: interpolate(progress.value, [0, 1], scale) }],
  }));

  return <Animated.View style={[StyleSheet.absoluteFill, styles.center, style]}>{children}</Animated.View>;
}

function PillButton({
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

/* ---------- the scene ---------- */

export default function BreathingScene({
  prompt,
  inhaleSeconds,
  exhaleSeconds,
  cycles,
  onContinue,
}: BreathingSceneProps) {
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const ORB = Math.min(width * 0.56, 240);
  const EDGE = ORB * 0.72; // how far above/below the centre the text sits

  const [phase, setPhase] = useState<Phase>('idle');
  const [round, setRound] = useState(0);
  const progress = useSharedValue(0); // 0 = lungs empty, 1 = lungs full

  useEffect(() => {
    if (phase === 'idle' || phase === 'done') {
      progress.value = withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.sin) });
      return;
    }

    const inhaling = phase === 'in';
    const seconds = inhaling ? inhaleSeconds : exhaleSeconds;

    progress.value = withTiming(inhaling ? 1 : 0, {
      duration: seconds * 1000,
      easing: Easing.inOut(Easing.sin),
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const timer = setTimeout(() => {
      if (inhaling) {
        setPhase('out');
      } else if (round + 1 >= cycles) {
        setPhase('done');
      } else {
        setRound(round + 1);
        setPhase('in');
      }
    }, seconds * 1000);

    return () => clearTimeout(timer);
  }, [phase, round, inhaleSeconds, exhaleSeconds, cycles, progress]);

  // the whole screen brightens a little on each inhale
  const washStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.4]),
  }));

  const running = phase === 'in' || phase === 'out';
  const label = phase === 'in' ? 'Breathe in' : phase === 'out' ? 'Breathe out' : phase === 'done' ? 'Rest here' : '';
  const buttonGroup = running ? 'running' : phase;

  const begin = () => {
    setRound(0);
    setPhase('in');
  };
  const stop = () => {
    setRound(0);
    setPhase('idle');
  };

  return (
    <Animated.View entering={FadeIn.duration(1200)} style={styles.root}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.primary }, washStyle]}
      />

      {!reduceMotion && <Motes />}

      {/* the orb, centred on the screen */}
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <Layer progress={progress} scale={[0.55, 1]} fade={[0.35, 1]}>
          <RadialDisc
            id="halo"
            size={ORB * 1.8}
            stops={[
              { offset: 0, color: colors.gold, opacity: 0.35 },
              { offset: 0.5, color: colors.gold, opacity: 0.12 },
              { offset: 1, color: colors.gold, opacity: 0 },
            ]}
          />
        </Layer>

        <Layer progress={progress} scale={[0.6, 1.08]} fade={[0.15, 0.55]}>
          <View style={[styles.ring, { width: ORB * 1.25, height: ORB * 1.25, borderRadius: ORB }]} />
        </Layer>

        {!reduceMotion && (
          <Layer progress={progress} scale={[0.6, 1.05]} fade={[0.3, 0.9]}>
            <Orbit size={ORB * 1.15} />
          </Layer>
        )}

        <Layer progress={progress} scale={[0.55, 0.95]} fade={[0.2, 0.6]}>
          <View style={[styles.ring, { width: ORB, height: ORB, borderRadius: ORB }]} />
        </Layer>

        <Layer progress={progress} scale={[0.45, 0.9]} fade={[0.7, 1]}>
          <RadialDisc
            id="core"
            size={ORB}
            stops={[
              { offset: 0, color: colors.onDark, opacity: 0.95 },
              { offset: 0.55, color: colors.gold, opacity: 0.55 },
              { offset: 1, color: colors.primary, opacity: 0 },
            ]}
          />
        </Layer>
      </View>

      {/* text above the orb */}
      <View style={styles.topArea}>
        {phase === 'idle' && (
          <Animated.Text
            key="prompt"
            entering={FadeIn.duration(1000).delay(600)}
            exiting={FadeOut.duration(500)}
            style={[styles.prompt, { bottom: EDGE }]}
          >
            {prompt}
          </Animated.Text>
        )}
        {label !== '' && (
          <Animated.Text
            key={label}
            entering={FadeIn.duration(800)}
            exiting={FadeOut.duration(600)}
            accessibilityLiveRegion="polite"
            style={[styles.label, { bottom: EDGE }]}
          >
            {label}
          </Animated.Text>
        )}
      </View>

      {/* buttons below the orb */}
      <View style={styles.bottomArea}>
        <Animated.View
          key={buttonGroup}
          entering={FadeIn.duration(700).delay(300)}
          exiting={FadeOut.duration(250)}
          style={[styles.bottomGroup, { top: EDGE }]}
        >
          {running && (
            <View style={styles.dots}>
              {Array.from({ length: cycles }, (_, i) => (
                <View key={i} style={[styles.dot, { opacity: i <= round ? 0.9 : 0.25 }]} />
              ))}
            </View>
          )}
          {phase === 'idle' && (
            <>
              <PillButton label="Begin" onPress={begin} />
              <PillButton label="Skip this" onPress={onContinue} quiet />
            </>
          )}
          {running && <PillButton label="Stop" onPress={stop} quiet />}
          {phase === 'done' && (
            <>
              <PillButton label="Continue" onPress={onContinue} />
              <PillButton label="Again" onPress={begin} quiet />
            </>
          )}
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primaryDark, overflow: 'hidden' },
  center: { alignItems: 'center', justifyContent: 'center' },
  ring: { borderWidth: 1, borderColor: colors.gold },
  topArea: { position: 'absolute', top: 0, left: 0, right: 0, bottom: '50%' },
  bottomArea: { position: 'absolute', top: '50%', left: 0, right: 0, bottom: 0 },
  bottomGroup: { position: 'absolute', left: 0, right: 0, alignItems: 'center', gap: 14 },
  prompt: {
    position: 'absolute',
    left: 28,
    right: 28,
    textAlign: 'center',
    fontFamily: fonts.serif,
    fontSize: 18,
    lineHeight: 27,
    color: colors.onDark,
  },
  label: {
    position: 'absolute',
    left: 28,
    right: 28,
    textAlign: 'center',
    fontFamily: fonts.heading,
    fontSize: 34,
    color: colors.onDark,
  },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.onDark },
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
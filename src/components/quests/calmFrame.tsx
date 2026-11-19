import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../styling/theme';
import { Motes, RadialDisc } from './calmParts';

export default function CalmFrame({
  scene,
  children,
}: {
  scene?: 'rest' | 'expand';
  children: ReactNode;
}) {
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const HALO = Math.min(width * 1.1, 460);

  const ambient = useSharedValue(0); // slow back-and-forth, 0 to 1
  const grow = useSharedValue(0); // 0 = resting, 1 = fully widened

  useEffect(() => {
    if (reduceMotion) return;
    ambient.value = withRepeat(
      withTiming(1, { duration: 7000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [ambient, reduceMotion]);

  useEffect(() => {
    grow.value = withTiming(scene === 'expand' ? 1 : 0, {
      duration: scene === 'expand' ? 60000 : 1800,
      easing: Easing.out(Easing.quad),
    });
  }, [scene, grow]);

  const haloStyle = useAnimatedStyle(() => ({
    opacity: interpolate(ambient.value, [0, 1], [0.55, 0.9]),
    transform: [{ scale: 0.85 + 0.15 * ambient.value + 1.6 * grow.value }],
  }));

  return (
    <View style={styles.root}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.center, haloStyle]}>
        <RadialDisc
          id="frameHalo"
          size={HALO}
          stops={[
            { offset: 0, color: colors.gold, opacity: 0.28 },
            { offset: 0.5, color: colors.gold, opacity: 0.1 },
            { offset: 1, color: colors.gold, opacity: 0 },
          ]}
        />
      </Animated.View>

      <Motes />

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primaryDark, overflow: 'hidden' },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
});
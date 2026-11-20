import type { ReactNode } from 'react';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

export default function Reveal({ index, children }: { index: number; children: ReactNode }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 90).duration(450)}
      layout={LinearTransition.springify().damping(18)}
    >
      {children}
    </Animated.View>
  );
}
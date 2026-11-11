import { type ReactNode } from 'react';
import {
  Image,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

// Add more paper photos here and each card will pick one of them
// I don't like how 2-4 look, but I don't have a better idea right now.
// Maybe I can make a single paper image and then randomly add some stains and tears to it.
const SHEETS = [
    require('../../assets/pages/quest-paper.png'),
];

// Turns text into a steady number: same text, same number, every time
const hash = (text: string) => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

// A number from 0 to 1 for a given seed and "slot", so each trait comes out independent
const rand = (seed: number, slot: number) => {
  let x = (seed + Math.imul(slot + 1, 0x9e3779b9)) >>> 0;
  x ^= x >>> 15;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
};

type PaperSheetProps = {
  seed: string;
  style?: StyleProp<ViewStyle>;
  inset?: number; // how far the paper sits inside the card, so the edges show
  children?: ReactNode;
};

export default function PaperSheet({ seed, style, inset = 10, children }: PaperSheetProps) {
  const h = hash(seed);

  const sheet = SHEETS[Math.floor(rand(h, 0) * SHEETS.length)];
  const flipX = rand(h, 2) < 0.5 ? -1 : 1;
  const flipY = rand(h, 3) < 0.5 ? -1 : 1;
  const flips = [{ scaleX: flipX }, { scaleY: flipY }];

  const layer = { position: 'absolute' as const, top: inset, left: inset, right: inset, bottom: inset };

  return (
    <View style={style}>
      {/* the shadow: same picture, painted black, nudged down and right */}
      <View
        pointerEvents="none"
        style={[layer, { transform: [{ translateX: 2 }, { translateY: 4 }, ...flips] }]}
      >
        <Image source={sheet} resizeMode="stretch" style={[styles.fill, styles.shadow]} />
      </View>
      <View pointerEvents="none" style={[layer, { transform: flips }]}>
        <Image source={sheet} resizeMode="stretch" style={styles.fill} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { width: '100%', height: '100%' },
  shadow: { tintColor: '#000000', opacity: 0.22 },
});
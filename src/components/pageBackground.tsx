import { ImageBackground, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import { colors } from '../styling/theme';

const parchment = require('../../assets/pages/parchment.jpg');
const wood = require('../../assets/pages/wood_wall.jpg');

type PageBackgroundProps = {
  children: ReactNode;
  variant?: 'parchment' | 'wood';
};

export default function PageBackground({ children, variant = 'parchment' }: PageBackgroundProps) {
  const isWood = variant === 'wood';

  return (
    <ImageBackground
      source={isWood ? wood : parchment}
      resizeMode="cover"
      style={[styles.fill, { backgroundColor: isWood ? colors.primaryDark : colors.bg }]}
    >
      <View
        pointerEvents="none"
        style={[styles.wash, isWood ? styles.darkWash : styles.creamWash]}
      />
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  wash: { ...StyleSheet.absoluteFill },
  // washes the parchment out so text on top stays readable
  creamWash: { backgroundColor: 'rgba(243, 233, 210, 0.5)' },
  // calms the bright spot at the top of the wood so the sign stays readable
  darkWash: { backgroundColor: 'rgba(25, 14, 8, 0.35)' },
});
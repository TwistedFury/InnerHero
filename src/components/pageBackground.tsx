import { ImageBackground, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import { colors } from '../styling/theme';

const parchment = require('../../assets/pages/parchment.jpg');

export default function PageBackground({ children }: { children: ReactNode }) {
  return (
    <ImageBackground source={parchment} resizeMode="cover" style={styles.fill}>
        <View pointerEvents="none" style={styles.wash} />
        {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.bg },
  // washes the texture out so text on top stays readable
  wash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(243, 233, 210, 0.5)',
  },
});
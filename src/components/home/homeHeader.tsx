import { Compass, ShieldCheck } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../styling/theme';

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brand}>
          <Compass color={colors.primaryDark} size={20} strokeWidth={2} />
          <Text style={styles.brandText}>inner hero</Text>
        </View>
        <View style={styles.deviceStatus}>
          <ShieldCheck color={colors.muted} size={13} strokeWidth={2} />
          <Text style={styles.deviceStatusText}>Only on this device</Text>
        </View>
      </View>

      <Text style={styles.eyebrow}>YOUR SPACE, AT YOUR PACE</Text>
      <Text style={styles.title}>
        A small step.{'\n'}A little more room.
      </Text>
      <Text style={styles.subtitle}>{"You don't have to work it all out today."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  brandText: {
    color: colors.primaryDark,
    fontFamily: fonts.sans,
    fontSize: 16,
  },
  deviceStatus: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  deviceStatusText: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 10,
  },
  eyebrow: {
    color: colors.primary,
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  title: {
    color: colors.primaryDark,
    fontFamily: fonts.serif,
    fontSize: 29,
    lineHeight: 34,
    marginBottom: 10,
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 14,
  },
});

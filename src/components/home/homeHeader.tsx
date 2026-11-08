import { Compass, ShieldCheck } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../styling/theme';
import { useUser } from '../../storage/userStorage';

export default function HomeHeader() {
  const displayName = useUser((state) => state.profile.displayName ?? '');
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
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
      <Text style={styles.dateStamp}>{today.toUpperCase()}</Text>
      <Text style={styles.greeting}>
        {timeOfDay}
        {displayName ? (
          <>
            {', '}
            <Text style={styles.greetingName}>{displayName}</Text>
          </>
        ) : null}
        {'.'}
      </Text>
      <Text style={styles.title}>Your story, one page at a time.</Text>
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
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
  },
  // looks like a small stamped label
  deviceStatus: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 6,
  },
  deviceStatusText: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 32,
    lineHeight: 38,
    marginBottom: 10,
  },
  dateStamp: {
    color: colors.muted,
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  greeting: {
    color: colors.primary,
    fontFamily: fonts.handwriting,
    fontSize: 26,
    marginBottom: 4,
  },
  greetingName: {
    fontFamily: fonts.handwritingBold,
  },
});
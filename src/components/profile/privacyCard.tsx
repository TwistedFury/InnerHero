import { View, Text, StyleSheet } from 'react-native';
import { getIcon } from '../../helper/icons';
import { colors, fonts } from '../../styling/theme';

const ShieldIcon = getIcon('shield');

export default function PrivacyCard() {
  return (
    <View style={styles.privacyCard}>
      <View style={styles.privacyHeading}>
        <ShieldIcon size={16} color={colors.primary} strokeWidth={2} />
        <Text style={styles.privacyTitle}>Private by design</Text>
      </View>
      <Text style={styles.privacyCopy}>
        No account or identifying data collected. Your profile, reflections and progress stay on
        this device. No cloud syncing.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  privacyCard: {
    backgroundColor: colors.tint,
    borderColor: colors.moss,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  privacyHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  privacyTitle: {
    color: colors.moss,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    marginLeft: 7,
  },
  privacyCopy: {
    color: colors.text,
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
  },
});
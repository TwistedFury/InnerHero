import { Text, Pressable, Linking, StyleSheet, View } from 'react-native';
import { colors, fonts } from '../../styling/theme';

export default function HelpLinks({
  showDivider = true,
  large = false,
}: {
  showDivider?: boolean;
  large?: boolean;
}) {
  const textStyle = [styles.getHelpText, large && styles.getHelpTextLarge];
  const linkStyle = [styles.link, large && styles.linkLarge];

  return (
    <View
      style={[
        styles.container,
        !showDivider && styles.noDivider,
        large && styles.containerLarge,
      ]}
    >
      <Text style={textStyle}>
        Inner Hero supports personal practice. It is not a replacement for professional treatment.
      </Text>
      <View style={styles.crisisRow}>
        <Text style={textStyle}>In Crisis? Text or Call </Text>
        <Pressable onPress={() => Linking.openURL('tel:988')}>
          <Text style={linkStyle}>988</Text>
        </Pressable>
        <Text style={textStyle}> (U.S. & Canada)</Text>
      </View>
      <View style={styles.crisisRow}>
        <Text style={textStyle}>Find hotlines for other countries at </Text>
        <Pressable onPress={() => Linking.openURL('https://findahelpline.com')}>
          <Text style={linkStyle}>findahelpline.com</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 4,
  },
  noDivider: {
    borderTopWidth: 0,
    marginTop: 0,
    paddingTop: 0,
  },
  containerLarge: {
    gap: 8,
  },
  crisisRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  getHelpText: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
  },
  getHelpTextLarge: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  link: {
    color: colors.primary,
    fontFamily: fonts.sansMedium,
    textDecorationLine: 'underline',
    fontSize: 12,
  },
  linkLarge: {
    fontSize: 15,
  },
});
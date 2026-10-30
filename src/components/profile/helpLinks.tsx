import { Text, Pressable, Linking, StyleSheet, View } from 'react-native';
import { colors, fonts } from '../../styling/theme';

export default function HelpLinks() {
    return (
        <View style={styles.container}>
          <Text style={styles.getHelpText}>
            Inner Hero supports personal practice. It is not a replacement for professional treatment.
          </Text>
          <View style={styles.crisisRow}>
            <Text style={styles.getHelpText}>In Crisis? Text or Call </Text>
            <Pressable onPress={() => Linking.openURL('tel:988')}>
              <Text style={styles.link}>988</Text>
            </Pressable>
            <Text style={styles.getHelpText}> (U.S. & Canada)</Text>
          </View>
          <View style={styles.crisisRow}>
            <Text style={styles.getHelpText}>Find hotlines for other countries at </Text>
            <Pressable onPress={() => Linking.openURL('https://findahelpline.com')}>
              <Text style={styles.link}>findahelpline.com</Text>
            </Pressable>
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  crisisRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  getHelpText: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 10,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
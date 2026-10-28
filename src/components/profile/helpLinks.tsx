import { Text, Pressable, Linking, StyleSheet } from 'react-native';
import { colors, fonts } from '../../styling/theme';

export default function HelpLinks() {
    return (
        <Text>
          <Text style={styles.getHelpText}>
            Inner Hero supports personal practice. It is not a replacement for professional treatment.
          </Text>
          {'\n'}
          <Text style={styles.getHelpText}>
            In Crisis? Text or Call <Pressable onPress={() => Linking.openURL('tel:988')}><Text style={styles.link}>988</Text></Pressable> (U.S. & Canada) or find hotlines for other countries at <Pressable onPress={() => Linking.openURL('https://findahelpline.com')}>
              <Text style={styles.link}>findahelpline.com</Text>
            </Pressable>
          </Text>
        </Text>
    );
}

const styles = StyleSheet.create({
  getHelpText: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 10,
    marginTop: 20,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
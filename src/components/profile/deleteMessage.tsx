import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../../styling/theme';

export default function DeleteMessage({ deleteMessage }: { deleteMessage: string }) {
    return (
        <View style={styles.deleteMessage} accessibilityRole="alert">
          <Text style={styles.deleteMessageText}>{deleteMessage}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  
  deleteMessage: {
    backgroundColor: colors.primaryDark,
    borderRadius: 10,
    bottom: 20,
    left: 20,
    paddingHorizontal: 14,
    paddingVertical: 11,
    position: 'absolute',
    right: 20,
  },
  deleteMessageText: {
    color: colors.onDark,
    fontFamily: fonts.sans,
    fontSize: 11,
    textAlign: 'center',
  },
});
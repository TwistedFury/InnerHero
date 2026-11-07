import { TextInput, View, StyleSheet } from 'react-native';
import { useFonts, Caveat_400Regular } from '@expo-google-fonts/caveat';

import { colors, fonts } from '../../styling/theme';

type QuestProps = {
  value: string | undefined;
  onChange: (answer: string) => void;
};

export default function QuestText({ value, onChange }: QuestProps) {
  const [fontsLoaded] = useFonts({ Caveat_400Regular });

  return (
    <View style={styles.paper}>
      <TextInput
        multiline
        value={typeof value === 'string' ? value : ''}
        onChangeText={onChange}
        placeholder="Write your thoughts here..."
        placeholderTextColor="#A8A29E"
        style={[styles.textInput, fontsLoaded && styles.handwriting]}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  paper: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F4A6A6',
  },
  textInput: {
    minHeight: 220,
    padding: 16,
    fontSize: 18,
    color: colors.text,
  },
  handwriting: {
    fontFamily: fonts.handwriting,
    fontSize: 24,
    lineHeight: 32,
  },
});
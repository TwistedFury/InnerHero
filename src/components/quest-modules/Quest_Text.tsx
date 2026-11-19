import { useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { useFonts, Caveat_400Regular } from '@expo-google-fonts/caveat';

import { colors, fonts } from '../../styling/theme';

type QuestProps = {
  value: string | undefined;
  onChange: (answer: string) => void;
  calm?: boolean; // dark, glowing version (used by calm quests)
};

export default function QuestText({ value, onChange, calm }: QuestProps) {
  const [fontsLoaded] = useFonts({ Caveat_400Regular });
  const [focused, setFocused] = useState(false);

  return (
    <View style={calm ? [styles.calmPaper, focused && styles.calmPaperFocused] : styles.paper}>
      <TextInput
        multiline
        value={typeof value === 'string' ? value : ''}
        onChangeText={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Write your thoughts here..."
        placeholderTextColor={calm ? colors.onDarkMuted : '#A8A29E'}
        selectionColor={calm ? colors.gold : undefined}
        keyboardAppearance={calm ? 'dark' : 'default'}
        style={[styles.textInput, fontsLoaded && styles.handwriting, calm && styles.calmInput]}
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
  // calm: a faint pane of glass that lights up gold when you tap into it
  calmPaper: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderRadius: 16,
  },
  calmPaperFocused: { borderColor: colors.gold },
  textInput: {
    minHeight: 220,
    padding: 16,
    fontSize: 18,
    color: colors.text,
  },
  calmInput: { minHeight: 160, color: colors.onDark },
  handwriting: {
    fontFamily: fonts.handwriting,
    fontSize: 24,
    lineHeight: 32,
  },
});
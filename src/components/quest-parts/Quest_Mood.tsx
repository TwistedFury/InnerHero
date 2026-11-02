import { Pressable, StyleSheet, Text, View } from 'react-native';

type QuestProps = {
    value: string | undefined,
    onChange: (answer: string) => void,
}

export default function QuestMood({value, onChange}: QuestProps) {
    return (
        <View style={styles.moodList}>
        {['Very low', 'Low', 'Okay', 'Good', 'Great'].map((mood) => (
            <Pressable
            key={mood}
            onPress={() => onChange(mood)}
            accessibilityRole="radio"
            accessibilityState={{ selected: value === mood }}
            style={[styles.moodChoice, value === mood && styles.choiceSelected]}
            >
            <Text style={value === mood ? styles.choiceTextSelected : styles.choiceText}>{mood}</Text>
            </Pressable>
        ))}
        </View>
  );
}

const styles = StyleSheet.create({
    moodList: { gap: 8 },
    moodChoice: { borderColor: '#CBD5E1', borderRadius: 10, borderWidth: 1, padding: 14 },
    choiceRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 6 
  },
  choice: { 
    alignItems: 'center', 
    borderColor: '#CBD5E1', 
    borderRadius: 8, 
    borderWidth: 1, 
    minWidth: 28, 
    padding: 8 
  },
  choiceSelected: { 
    backgroundColor: '#1D4ED8', 
    borderColor: '#1D4ED8' 
  },
  choiceText: { 
    color: '#17202A' 
  },
  choiceTextSelected: { 
    color: '#FFFFFF', 
    fontWeight: '700' 
  },
});
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { QuestStep, QuestAnswer } from '../../types/quest';

type QuestProps = {
    step: QuestStep;
    value: QuestAnswer | undefined;
    onChange: (answer: QuestAnswer) => void;
}

export default function QuestSlider({step, value, onChange}: QuestProps) {
    const min = step.min ?? 1;
    const max = step.max ?? 10;
    return (
      <View style={styles.choiceRow}>
        {Array.from({ length: max - min + 1 }, (_, index) => min + index).map((number) => (
          <Pressable
            key={number}
            onPress={() => onChange(number)}
            accessibilityRole="radio"
            accessibilityState={{ selected: value === number }}
            style={[styles.choice, value === number && styles.choiceSelected]}
          >
            <Text style={value === number ? styles.choiceTextSelected : styles.choiceText}>{number}</Text>
          </Pressable>
        ))}
      </View>
    );
}

const styles = StyleSheet.create({
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
import { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Quest, QuestAnswer, QuestStep } from '../types';
import { useProgress } from '../storage/questStorage';
import { useRouter } from 'expo-router'

function StepInput({
  step,
  value,
  onChange,
}: {
  step: QuestStep;
  value: QuestAnswer | undefined;
  onChange: (answer: QuestAnswer) => void;
}) {
  if (step.type === 'text') {
    return (
      <TextInput
        multiline
        value={typeof value === 'string' ? value : ''}
        onChangeText={onChange}
        placeholder="Write your thoughts here"
        style={styles.textInput}
        textAlignVertical="top"
      />
    );
  }

  if (step.type === 'slider') {
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

export function QuestRunner({ quest }: { quest: Quest }) {
  const { drafts, stepIndexes } = useProgress();
  const stepIndex = stepIndexes[quest.id] ?? 0;
  const step = quest.steps[stepIndex];
  if (!step) return <View style={styles.container}><Text style={styles.completeTitle}>Quest complete</Text><Text>Your responses have been saved on this device.</Text></View>;
  return <QuestStepRunner key={step.id} quest={quest} step={step} stepIndex={stepIndex} initialAnswer={drafts[quest.id]?.[step.id]} />;
}

function QuestStepRunner({ quest, step, stepIndex, initialAnswer }: {
  quest: Quest;
  step: QuestStep;
  stepIndex: number;
  initialAnswer: QuestAnswer | undefined;
}) {
  const { saveAnswer, advanceStep, completeQuest, startQuest } = useProgress();
  const [answer, setAnswer] = useState<QuestAnswer | undefined>(initialAnswer);
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = () => {
    if (stepIndex === 0) {
      startQuest(quest.id, quest.version);
    }

    if (step.required !== false && (answer === undefined || answer === '')) {
      setError('Please answer this step before continuing.');
      return;
    }

    saveAnswer(quest.id, step.id, answer ?? '');
    if (stepIndex === quest.steps.length - 1) {
      completeQuest(quest.id, quest.version);
      router.replace('/quests');
      return;
    }
    advanceStep(quest.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>Step {stepIndex + 1} of {quest.steps.length}</Text>
      <Text style={styles.title}>{quest.name}</Text>
      <Text style={styles.prompt}>{step.prompt}</Text>
      <StepInput
        step={step}
        value={answer}
        onChange={(nextAnswer) => {
          setAnswer(nextAnswer);
          setError('');
        }}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        title={stepIndex === quest.steps.length - 1 ? 'Save and complete' : 'Save and continue'}
        onPress={submit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  progress: { color: '#687076', fontSize: 14 },
  title: { fontSize: 28, fontWeight: '700' },
  prompt: { fontSize: 18, lineHeight: 26 },
  textInput: {
    minHeight: 160,
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  choiceRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  choice: { alignItems: 'center', borderColor: '#CBD5E1', borderRadius: 8, borderWidth: 1, minWidth: 28, padding: 8 },
  choiceSelected: { backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' },
  choiceText: { color: '#17202A' },
  choiceTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  moodList: { gap: 8 },
  moodChoice: { borderColor: '#CBD5E1', borderRadius: 10, borderWidth: 1, padding: 14 },
  error: { color: '#B42318' },
  completeTitle: { fontSize: 28, fontWeight: '700' },
  chainScreen: { padding: 20, marginTop: 100, backgroundColor: '#bebdbd87' },
});

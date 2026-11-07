import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import type { Quest, QuestAnswer, QuestStep } from '../../types/quest';
import { useProgress } from '../../storage/questStorage';
import { useRouter } from 'expo-router'

/* Components */
import QuestText from '../quest-parts/Quest_Text';
import QuestSlider from '../quest-parts/Quest_Slider';
import QuestMood from '../quest-parts/Quest_Mood';
import QuestList from '../quest-parts/Quest_List';
import QuestRank from '../quest-parts/Quest_Rank';
import QuestSchedule from '../quest-parts/Quest_Schedule';

const getListItems = (answer: QuestAnswer | undefined): string[] =>
  Array.isArray(answer)
    ? answer
        .map((item) => item.item)
        .filter((item): item is string => Boolean(item))
    : [];

function StepInput({
  step,
  value,
  previousListAnswer,
  onChange,
}: {
  step: QuestStep;
  value: QuestAnswer | undefined;
  previousListAnswer: QuestAnswer | undefined;
  onChange: (answer: QuestAnswer) => void;
}) {
  if (step.type === 'text') {
    return <QuestText value={typeof value === 'string' ? value : ''} onChange={(answer) => onChange(answer)} />;
  }

  if (step.type === 'slider') {
    return <QuestSlider step={step} value={typeof value === 'number' ? value : undefined} onChange={(answer) => onChange(answer)} />;
  }

  if (step.type === 'mood') {
    return <QuestMood value={typeof value === 'number' ? value : undefined} onChange={(answer) => onChange(answer)} />;
  }

  if (step.type === 'list') {
    return (
      <QuestList
        step={step}
        value={Array.isArray(value) ? value : undefined}
        onChange={(answer) => onChange(answer)}
      />
    );
  }

  if (step.type === 'rank') {
    return (
      <QuestRank
        step={step}
        value={Array.isArray(value) ? value : undefined}
        onChange={(answer) => onChange(answer)}
        list_answer={getListItems(previousListAnswer)}
      />
    );
  }

  if (step.type === 'schedule') {
    return (
      <QuestSchedule
        step={step}
        value={Array.isArray(value) ? value : undefined}
        onChange={(answer) => onChange(answer)}
        list_answer={getListItems(previousListAnswer)}
      />
    );
  }

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
  const { drafts, saveAnswer, advanceStep, completeQuest, startQuest } = useProgress();
  const [answer, setAnswer] = useState<QuestAnswer | undefined>(initialAnswer);
  const [error, setError] = useState('');
  const router = useRouter();
  const previousListStep = quest.steps
    .slice(0, stepIndex)
    .reverse()
    .find((candidate) => candidate.type === 'list');

  const submit = () => {
    if (stepIndex === 0) {
      startQuest(quest.id, quest.version);
    }

    const isEmptyList =
      Array.isArray(answer) &&
      answer.every((item) => Object.values(item).every((value) => value.trim() === ''));
    if (step.required !== false && (answer === undefined || answer === '' || isEmptyList)) {
      setError('Please answer this step before continuing.');
      return;
    }

    if (step.min_items !== undefined && Array.isArray(answer) && answer.length < step.min_items) {
      setError(`Please provide at least ${step.min_items} items before continuing.`);
      return;
    }

    saveAnswer(quest.id, step.id, answer ?? '');
    if (stepIndex === quest.steps.length - 1) {
      completeQuest(quest.id, quest.version);
      router.replace({
        pathname: '/quest-complete',
        params: {
          questId: quest.id,
        }
      });
      return;
    }
    advanceStep(quest.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>Step {stepIndex + 1} of {quest.steps.length}</Text>
      <Text style={styles.title}>{quest.name}</Text>
      <Text style={styles.prompt}>{step.prompt}</Text>
      {step.type !== 'info' ?
      <StepInput
        step={step}
        value={answer}
        previousListAnswer={previousListStep ? drafts[quest.id]?.[previousListStep.id] : undefined}
        onChange={(nextAnswer) => {
          setAnswer(nextAnswer);
          setError('');
        }}
      />
      : null}
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
  error: { color: '#B42318' },
  completeTitle: { fontSize: 28, fontWeight: '700' },
  chainScreen: { padding: 20, marginTop: 100, backgroundColor: '#bebdbd87' },
});

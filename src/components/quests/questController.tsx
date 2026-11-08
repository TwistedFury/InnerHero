import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Quest, QuestAnswer, QuestStep } from '../../types/quest';
import { useProgress } from '../../storage/questStorage';
import { useRouter } from 'expo-router';
import { colors, fonts } from '../../styling/theme';

/* Components */
import QuestText from '../quest-modules/Quest_Text';
import QuestSlider from '../quest-modules/Quest_Slider';
import QuestMood from '../quest-modules/Quest_Mood';
import QuestList from '../quest-modules/Quest_List';
import QuestRank from '../quest-modules/Quest_Rank';
import QuestSchedule from '../quest-modules/Quest_Schedule';

const getListItems = (answer: QuestAnswer | undefined): string[] =>
  Array.isArray(answer)
    ? answer
        .map((item) => item.item)
        .filter((item): item is string => Boolean(item))
    : [];

// True if there's something other than spaces
const hasText = (text: string | undefined) => (text ?? '').trim() !== '';

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

  return null;
}

export function QuestRunner({ quest }: { quest: Quest }) {
  const { drafts, stepIndexes } = useProgress();
  const stepIndex = stepIndexes[quest.id] ?? 0;
  const step = quest.steps[stepIndex];
  if (!step) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quest complete</Text>
        <Text style={styles.prompt}>Your responses have been saved on this device.</Text>
      </View>
    );
  }
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
  const isLastStep = stepIndex === quest.steps.length - 1;
  const previousListStep = quest.steps
    .slice(0, stepIndex)
    .reverse()
    .find((candidate) => candidate.type === 'list');

  const submit = () => {
    if (stepIndex === 0) {
      startQuest(quest.id, quest.version);
    }

    let finalAnswer: QuestAnswer | undefined = answer;

    // For lists, throw away rows where the main field is blank
    if (step.type === 'list' && Array.isArray(answer)) {
      const mainField = step.fields?.[0] ?? 'item';
      finalAnswer = answer.filter((row) => hasText(row[mainField]));
    }

    const isBlank =
      finalAnswer === undefined ||
      (typeof finalAnswer === 'string' && finalAnswer.trim() === '') ||
      (Array.isArray(finalAnswer) && finalAnswer.length === 0);

    if (step.required !== false && isBlank) {
      setError('This page is still blank. Add an answer to turn the page.');
      return;
    }

    if (
      step.min_items !== undefined &&
      Array.isArray(finalAnswer) &&
      finalAnswer.length < step.min_items
    ) {
      setError(
        `Add at least ${step.min_items} items to turn the page. You have ${finalAnswer.length} so far.`,
      );
      return;
    }

    // Every scheduled activity needs both a day and a time
    if (step.type === 'schedule' && Array.isArray(finalAnswer)) {
      const unscheduled = finalAnswer.filter((row) => !row.day || !row.time).length;
      if (unscheduled > 0) {
        setError(
          `${unscheduled} ${unscheduled === 1 ? 'activity still needs' : 'activities still need'} a day and a time.`,
        );
        return;
      }
    }

    saveAnswer(quest.id, step.id, finalAnswer ?? '');
    if (isLastStep) {
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
      <Text style={styles.progress}>PAGE {stepIndex + 1} OF {quest.steps.length}</Text>
      <Text style={styles.title}>{quest.name}</Text>
      <View style={styles.divider} />
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
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isLastStep ? 'Seal this entry and finish the quest' : 'Save and turn the page'}
        onPress={submit}
        style={({ pressed }) => [
          styles.button,
          isLastStep && styles.sealButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>
          {isLastStep ? 'Seal this entry' : 'Turn the page'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
    backgroundColor: colors.bg,
  },
  progress: {
    color: colors.muted,
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1.2,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 30,
    lineHeight: 36,
  },
  divider: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  prompt: {
    color: colors.text,
    fontFamily: fonts.serif,
    fontSize: 20,
    lineHeight: 29,
  },
  error: {
    color: colors.seal,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: colors.primary,
  },
  // the last step's button turns wax-seal red
  sealButton: {
    backgroundColor: colors.seal,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: colors.onDark,
    fontFamily: fonts.sansBold,
    fontSize: 17,
  },
});
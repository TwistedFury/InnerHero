import { useEffect } from 'react';
import { Text, ScrollView, Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProgress } from '../../src/storage/questStorage';
import { getQuestStatus } from '../../src/helper/questFinder';
import quests from '../../src/data/quests.json';
import { useMilestones } from '../../src/storage/milestoneStorage';
import { getMilestonesForQuest } from '../../src/helper/milestones';

// Which steps to compare, and what to call them on screen
const TRACKED: Record<string, string> = {
  belief: 'Belief',
  mood: 'Mood',
};

function ChangeRow({
  label,
  before,
  after,
}: {
  label: string;
  before?: string | number;
  after: string | number;
}) {
  // No earlier run to compare against
  if (before === undefined) {
    return <Text>{label}: {String(after)} (first time!)</Text>;
  }
  // Both are numbers, so we can do math
  if (typeof before === 'number' && typeof after === 'number') {
    const diff = after - before;
    const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '•';
    return <Text>{label}: {before} → {after}   {arrow} {Math.abs(diff)}</Text>;
  }
  // Words (like mood): just show old → new
  return <Text>{label}: {String(before)} → {String(after)}</Text>;
}

export default function QuestComplete() {
  const { questId } = useLocalSearchParams<{ questId: string }>();
  const responses = useProgress((s) => s.responses);
  const completed = useProgress((s) => s.completed);

  const mine = responses.filter((r) => r.questId === questId);

  const attempts = Array.from(new Set(mine.map((r) => r.attempt))).sort((a, b) => a - b);
  const latest = attempts[attempts.length - 1];
  const previous = attempts[attempts.length - 2]; // undefined on a first run

  // This run's answers, limited to the steps we want to compare
  const latestAnswers = mine.filter(
    (r) => r.attempt === latest && r.stepId in TRACKED,
  );

  const router = useRouter();
  const progress = useProgress((s) => s.progress);

  const upNext = quests.filter(
    (q) =>
    q.prerequisites.includes(questId) &&
    getQuestStatus(q as Parameters<typeof getQuestStatus>[0], progress) === 'available',
  );

  const completeMilestone = useMilestones((s) => s.completeMilestone);

  useEffect(() => {
    getMilestonesForQuest(questId)
      .filter((milestone) =>
        milestone.required_quests.every((requiredQuest) => completed.includes(requiredQuest)),
      )
      .forEach((milestone) => completeMilestone(milestone.id));
  }, [completed, completeMilestone, questId]);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Quest complete!</Text>
      {latestAnswers.map((r) => {
        const before = mine.find(
          (p) => p.attempt === previous && p.stepId === r.stepId,
        )?.answer;
        return (
          <ChangeRow
            key={r.stepId}
            label={TRACKED[r.stepId]}
            before={before}
            after={r.answer}
          />
        );
      })}
      {progress.questId?.completions === 1 && upNext.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text>Unlocked</Text>
          {upNext.map((q) => (
            <Pressable
              key={q.id}
              onPress={() =>
                router.replace({
                  pathname: '/quests/[questCode]',
                  params: { questCode: q.id },
                })
              }
            >
              <Text>{q.name} →</Text>
            </Pressable>
          ))}
        </View>
      )}

      <Pressable onPress={() => router.replace('/quests')}>
        <Text>Back to quests</Text>
      </Pressable>
    </ScrollView>
  );
}
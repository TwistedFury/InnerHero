import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sprout } from 'lucide-react-native';
import { useProgress } from '../../src/storage/questStorage';
import { getQuestStatus } from '../../src/helper/questFinder';
import quests from '../../src/data/quests.json';
import { useMilestones } from '../../src/storage/milestoneStorage';
import { getMilestonesForQuest } from '../../src/helper/milestones';
import type { Quest, QuestAnswer, QuestListItem } from '../../src/types/quest';
import PageBackground from '../../src/components/pageBackground';
import MoodFace, { MOOD_LABELS } from '../../src/components/quests/moodFace';
import HelpLinks from '../../src/components/profile/helpLinks';
import { colors, fonts } from '../../src/styling/theme';

import PaperSheet from '../../src/components/paperSheet';

// Which steps to compare with an earlier run, and what to call them
const TRACKED: Record<string, string> = {
  belief: 'Belief',
  mood: 'Mood',
};

const hasText = (text: string | undefined) => (text ?? '').trim() !== '';

// Cuts long writing down to a short snippet, at a word boundary
const shorten = (text: string, max = 120) => {
  const clean = text.trim().replace(/\s+/g, ' ');
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : max)}…`;
};

// The row with the highest number in a field (the first one wins a tie)
const topBy = (rows: QuestListItem[], field: string) => {
  let best: QuestListItem | undefined;
  let bestScore = -Infinity;
  for (const row of rows) {
    const raw = row[field];
    if (!hasText(raw)) continue;
    const score = Number(raw);
    if (!Number.isNaN(score) && score > bestScore) {
      best = row;
      bestScore = score;
    }
  }
  return best;
};

function PaperCard({ seed, children }: { seed: string; children: ReactNode }) {
  return (
    <PaperSheet seed={seed} style={styles.cardPaper}>
      {children}
    </PaperSheet>
  );
}

function ChangeRow({
  label,
  before,
  after,
}: {
  label: string;
  before: QuestAnswer;
  after: QuestAnswer;
}) {
  // Both are numbers, so we can do math
  if (typeof before === 'number' && typeof after === 'number') {
    const diff = after - before;
    const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '•';
    const words = diff > 0 ? `up ${diff}` : diff < 0 ? `down ${Math.abs(diff)}` : 'no change';
    return (
      <View
        accessible
        accessibilityLabel={`${label} went from ${before} to ${after}, ${words}`}
        style={styles.changeRow}
      >
        <Text style={styles.smallLabel}>{label}</Text>
        <View style={styles.changeValueBox}>
          <Text style={styles.changeValue}>{before} → {after}</Text>
          <Text style={styles.hand}>{arrow} {words}</Text>
        </View>
      </View>
    );
  }

  // Anything else (an older saved answer): just show old → new
  return (
    <View
      accessible
      accessibilityLabel={`${label} went from ${String(before)} to ${String(after)}`}
      style={styles.changeRow}
    >
      <Text style={styles.smallLabel}>{label}</Text>
      <Text style={styles.changeValue}>{String(before)} → {String(after)}</Text>
    </View>
  );
}

export default function QuestComplete() {
  const { questId } = useLocalSearchParams<{ questId: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const responses = useProgress((s) => s.responses);
  const completed = useProgress((s) => s.completed);
  const progress = useProgress((s) => s.progress);
  const completeMilestone = useMilestones((s) => s.completeMilestone);

  // Milestones already earned BEFORE this page opened. Anything earned after that is new.
  const [alreadyEarned] = useState(
    () =>
      new Set(
        useMilestones
          .getState()
          .progress.filter((entry) => entry.completed)
          .map((entry) => entry.milestoneId),
      ),
  );

  const quest = quests.find((q) => q.id === questId) as Quest | undefined;
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const mine = responses.filter((r) => r.questId === questId);
  const attempts = Array.from(new Set(mine.map((r) => r.attempt))).sort((a, b) => a - b);
  const latest = attempts[attempts.length - 1];
  const previous = attempts[attempts.length - 2]; // undefined on a first run

  // This run's answers, by step id
  const answers: Record<string, QuestAnswer> = {};
  mine
    .filter((r) => r.attempt === latest)
    .forEach((r) => {
      answers[r.stepId] = r.answer;
    });

  // Pull the things worth showing out of this run's answers, in step order
  let moodLevel: number | undefined;
  let moodText: string | undefined;
  const quotes: string[] = [];
  let listTotal = 0;
  let rated: QuestListItem[] = [];
  let ratedMain = 'item';
  let firstRung: string | undefined;
  let plan: QuestListItem[] = [];

  (quest?.steps ?? []).forEach((step) => {
    const answer = answers[step.id];
    if (answer === undefined) return;

    if (step.type === 'mood' && !Array.isArray(answer)) {
      const level = Number(answer);
      if (Number.isInteger(level) && level >= 0 && level <= 10) moodLevel = level;
      else if (typeof answer === 'string' && hasText(answer)) moodText = answer;
    } else if (step.type === 'text' && typeof answer === 'string') {
      if (hasText(answer) && quotes.length < 2) quotes.push(shorten(answer));
    } else if (step.type === 'list' && Array.isArray(answer)) {
      const main = step.fields?.[0] ?? 'item';
      const filled = answer.filter((row) => hasText(row[main]));
      listTotal += filled.length;
      if (step.fields?.includes('enjoyment') || step.fields?.includes('importance')) {
        rated = filled;
        ratedMain = main;
      }
    } else if (step.type === 'rank' && Array.isArray(answer)) {
      firstRung = answer.find((row) => row.rank === '1')?.item;
    } else if (step.type === 'schedule' && Array.isArray(answer)) {
      plan = answer.filter((row) => row.day && row.time);
    }
  });

  const enjoyedName = topBy(rated, 'enjoyment')?.[ratedMain];
  const importantName = topBy(rated, 'importance')?.[ratedMain];
  const hasReflection =
    moodLevel !== undefined ||
    !!moodText ||
    quotes.length > 0 ||
    listTotal > 0 ||
    !!firstRung ||
    plan.length > 0;

  // Only compare with an earlier run when there is one
  const changes = mine
    .filter((r) => r.attempt === latest && r.stepId in TRACKED)
    .map((r) => ({
      stepId: r.stepId,
      after: r.answer,
      before:
        previous === undefined
          ? undefined
          : mine.find((p) => p.attempt === previous && p.stepId === r.stepId)?.answer,
    }))
    .filter((change) => change.before !== undefined);

  // Milestones that THIS quest just finished
  const newMilestones = getMilestonesForQuest(questId).filter(
    (milestone) =>
      milestone.required_quests.every((requiredQuest) => completed.includes(requiredQuest)) &&
      !alreadyEarned.has(milestone.id),
  );

  const upNext = quests.filter(
    (q) =>
    (q.prerequisites as string[]).includes(questId) &&
    getQuestStatus(q as Parameters<typeof getQuestStatus>[0], progress) === 'available',
  );
  const showUnlocked = progress[questId]?.completions === 1 && upNext.length > 0;
  const showNext = showUnlocked || !!quest?.next_note;

  useEffect(() => {
    getMilestonesForQuest(questId)
      .filter((milestone) =>
        milestone.required_quests.every((requiredQuest) => completed.includes(requiredQuest)),
      )
      .forEach((milestone) => completeMilestone(milestone.id));
  }, [completed, completeMilestone, questId]);

  return (
    <PageBackground>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.seal}>
            <View style={styles.sealRing}>
              <Text style={styles.sealCheck}>✓</Text>
            </View>
          </View>
          <Text style={styles.title}>Entry sealed</Text>
          {!!quest && <Text style={styles.questName}>{quest.name}</Text>}
          <Text style={styles.date}>{today.toUpperCase()}</Text>
        </View>

        {!!quest?.closing_note && (
          <PaperCard seed={`${quest.id}-note`}>
            <Text style={styles.closingNote}>{quest.closing_note}</Text>
          </PaperCard>
        )}

        {newMilestones.map((milestone) => (
          <View
            key={milestone.id}
            accessible
            accessibilityLabel={`Milestone earned: ${milestone.display_name}`}
            style={styles.milestone}
          >
            <View style={styles.milestoneIcon}>
              <Sprout color={colors.gold} size={30} strokeWidth={1.8} />
            </View>
            <View style={styles.milestoneText}>
              <Text style={styles.smallLabel}>MILESTONE EARNED</Text>
              <Text style={styles.milestoneName}>{milestone.display_name}</Text>
              <Text style={styles.milestoneDescription}>{milestone.description}</Text>
            </View>
          </View>
        ))}

        {hasReflection && (
          <View style={styles.section}>
            <Text style={styles.heading}>From your page</Text>
            <PaperCard seed={`${questId}-page`}>
              {moodLevel !== undefined && (
                <View
                  accessible
                  accessibilityLabel={`Mood ${moodLevel} out of 10, ${MOOD_LABELS[moodLevel]}`}
                  style={styles.moodRow}
                >
                  <MoodFace level={moodLevel} size={64} />
                  <View style={styles.moodText}>
                    <Text style={styles.smallLabel}>MOOD</Text>
                    <Text style={styles.hand}>
                      {moodLevel} of 10 · {MOOD_LABELS[moodLevel]}
                    </Text>
                  </View>
                </View>
              )}

              {!!moodText && (
                <View>
                  <Text style={styles.smallLabel}>MOOD</Text>
                  <Text style={styles.hand}>{moodText}</Text>
                </View>
              )}

              {quotes.map((quote, index) => (
                <Text key={index} style={styles.quote}>“{quote}”</Text>
              ))}

              {listTotal > 0 && (
                <Text style={styles.plain}>
                  You listed {listTotal} {listTotal === 1 ? 'thing' : 'things'}.
                </Text>
              )}

              {!!enjoyedName && !!importantName && enjoyedName === importantName ? (
                <View>
                  <Text style={styles.smallLabel}>MOST ENJOYABLE AND MOST IMPORTANT</Text>
                  <Text style={styles.hand}>{enjoyedName}</Text>
                </View>
              ) : (
                <>
                  {!!enjoyedName && (
                    <View>
                      <Text style={styles.smallLabel}>MOST ENJOYABLE</Text>
                      <Text style={styles.hand}>{enjoyedName}</Text>
                    </View>
                  )}
                  {!!importantName && (
                    <View>
                      <Text style={styles.smallLabel}>MOST IMPORTANT</Text>
                      <Text style={styles.hand}>{importantName}</Text>
                    </View>
                  )}
                </>
              )}

              {!!firstRung && (
                <View>
                  <Text style={styles.smallLabel}>YOUR FIRST RUNG</Text>
                  <Text style={styles.hand}>{firstRung}</Text>
                </View>
              )}

              {plan.length > 0 && (
                <View>
                  <Text style={styles.smallLabel}>YOUR PLAN</Text>
                  {plan.map((row, index) => (
                    <Text key={index} style={styles.hand}>
                      {row.item} · {row.day}, {row.time}
                    </Text>
                  ))}
                </View>
              )}
            </PaperCard>
          </View>
        )}

        {changes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>Since last time</Text>
            <PaperCard seed={`${questId}-since`}>
              {changes.map((change, index) => (
                <View key={change.stepId}>
                  {index > 0 && <View style={styles.divider} />}
                  <ChangeRow
                    label={TRACKED[change.stepId]}
                    before={change.before as QuestAnswer}
                    after={change.after}
                  />
                </View>
              ))}
            </PaperCard>
          </View>
        )}

        {showNext && (
          <View style={styles.section}>
            <Text style={styles.heading}>{"What's next"}</Text>
            {!!quest?.next_note && <Text style={styles.nextNote}>{quest.next_note}</Text>}
            {showUnlocked &&
              upNext.map((q) => (
                <Pressable
                  key={q.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Start ${q.name}`}
                  onPress={() =>
                    router.replace({
                      pathname: '/quests/[questCode]',
                      params: { questCode: q.id },
                    })
                  }
                  style={({ pressed }) => [styles.unlocked, pressed && styles.pressed]}
                >
                  <Text style={styles.unlockedName}>{q.name}</Text>
                  <Text style={styles.unlockedArrow}>→</Text>
                </Pressable>
              ))}
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to the Quest Board"
          onPress={() => router.replace('/quests')}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>Back to the Quest Board</Text>
        </Pressable>

        <HelpLinks />
      </ScrollView>
    </PageBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 28 },

  header: { alignItems: 'center', gap: 6 },
  // the wax seal: a red disc with a lighter ring pressed into it
  seal: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: colors.seal,
    borderWidth: 3,
    borderColor: '#5A1D1A',
    transform: [{ rotate: '-8deg' }],
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  sealRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(246, 235, 211, 0.45)',
  },
  sealCheck: {
    color: colors.onDark,
    fontFamily: fonts.sansBold,
    fontSize: 40,
    lineHeight: 46,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 36,
    lineHeight: 42,
    textAlign: 'center',
  },
  questName: {
    color: colors.primary,
    fontFamily: fonts.handwriting,
    fontSize: 26,
    textAlign: 'center',
  },
  date: {
    color: colors.muted,
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1.2,
  },

  section: { gap: 12 },
  heading: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 24,
  },
  cardPaper: {
    padding: 28,
    gap: 16,
  },
  closingNote: {
    color: colors.text,
    fontFamily: fonts.handwriting,
    fontSize: 26,
    lineHeight: 32,
  },

  smallLabel: {
    color: colors.muted,
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  hand: {
    color: colors.text,
    fontFamily: fonts.handwriting,
    fontSize: 24,
    lineHeight: 28,
  },
  quote: {
    color: colors.text,
    fontFamily: fonts.handwriting,
    fontSize: 24,
    lineHeight: 28,
  },
  plain: {
    color: colors.text,
    fontFamily: fonts.serif,
    fontSize: 16,
  },

  moodRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  moodText: { flex: 1 },

  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  changeValueBox: { alignItems: 'flex-end' },
  changeValue: {
    color: colors.text,
    fontFamily: fonts.serif,
    fontSize: 24,
  },
  divider: {
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(107, 91, 74, 0.55)',
    marginVertical: 14,
  },

  milestone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: colors.sand,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderRadius: 6,
  },
  milestoneIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.gold,
    borderWidth: 2,
  },
  milestoneText: { flex: 1, gap: 2 },
  milestoneName: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 22,
  },
  milestoneDescription: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },

  nextNote: {
    color: colors.primary,
    fontFamily: fonts.handwriting,
    fontSize: 24,
    lineHeight: 28,
  },
  unlocked: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 60,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderRadius: 6,
  },
  unlockedName: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.serif,
    fontSize: 18,
  },
  unlockedArrow: {
    color: colors.primary,
    fontFamily: fonts.sansBold,
    fontSize: 22,
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
  buttonText: {
    color: colors.onDark,
    fontFamily: fonts.sansBold,
    fontSize: 17,
  },
  pressed: { opacity: 0.8 },
});
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors, fonts } from '../../styling/theme';
import { CalmButton } from './calmParts';

type CalmStepProps = {
  prompt: string;
  stepIndex: number;
  stepCount: number;
  isLastStep: boolean;
  error: string;
  onContinue: () => void;
  framed?: boolean; // true = put the input on a light card (for inputs not restyled for the dark)
  children?: ReactNode; // the answer input, for pages that ask a question
};

// Cuts a paragraph into sentences so they can appear one at a time
export const sentencesOf = (text: string): string[] => {
  const found = text.match(/[^.!?]+[.!?]+['")]*\s*/g) ?? [];
  const rest = text.slice(found.join('').length).trim();
  return [...found.map((s) => s.trim()), ...(rest ? [rest] : [])].filter(Boolean);
};

const isHint = (s: string) => s.startsWith('(') && s.endsWith(')');

export default function CalmStep({
  prompt,
  stepIndex,
  stepCount,
  isLastStep,
  error,
  onContinue,
  framed,
  children,
}: CalmStepProps) {
  const insets = useSafeAreaInsets();
  const sentences = sentencesOf(prompt);
  const hasLabel = /^Step \d/i.test(sentences[0] ?? '');

  // Long pages speed up a little so nobody waits more than about 10 seconds
  const gap = Math.min(1700, 9000 / Math.max(sentences.length, 1));
  const lastIn = (sentences.length - 1) * gap + 500; // when the last sentence starts fading in
  const inputDelay = lastIn + 700;
  const buttonDelay = children ? inputDelay + 500 : sentences.length * gap + 900;

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[styles.root, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}
    >
      <Animated.View entering={FadeIn.duration(1000)} style={styles.dots}>
        {Array.from({ length: stepCount }, (_, i) => (
          <View key={i} style={[styles.dot, { opacity: i === stepIndex ? 0.9 : 0.25 }]} />
        ))}
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {sentences.map((sentence, i) => (
          <Animated.Text
            key={i}
            entering={FadeIn.duration(1400).delay(i * gap + 500)}
            style={
              i === 0 && hasLabel ? styles.label : isHint(sentence) ? styles.hint : styles.line
            }
          >
            {sentence}
          </Animated.Text>
        ))}

        {children ? (
          <Animated.View
            entering={FadeIn.duration(1000).delay(inputDelay)}
            style={framed ? styles.framed : styles.input}
          >
            {children}
          </Animated.View>
        ) : null}
      </ScrollView>

      <Animated.View entering={FadeIn.duration(900).delay(buttonDelay)} style={styles.footer}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <CalmButton label={isLastStep ? 'Finish' : 'Continue'} onPress={onContinue} />
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 28 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.onDark },
  body: { flexGrow: 1, justifyContent: 'center', gap: 18, paddingVertical: 24 },
  label: {
    textAlign: 'center',
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.gold,
  },
  line: {
    textAlign: 'center',
    fontFamily: fonts.serif,
    fontSize: 21,
    lineHeight: 32,
    color: colors.onDark,
  },
  hint: {
    textAlign: 'center',
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.onDarkMuted,
  },
  input: { marginTop: 8 },
  framed: { backgroundColor: colors.bg, borderRadius: 16, padding: 16 },
  footer: { alignItems: 'center', gap: 12, minHeight: 80 },
  error: { fontFamily: fonts.sansMedium, fontSize: 14, textAlign: 'center', color: colors.gold },
});
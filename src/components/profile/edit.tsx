import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, fonts } from '../../styling/theme';
import { generateDisplayName } from '../../helper/nameGenerator';

type EditProps = {
  isEditing: boolean;
  nameDraft: string;
  error: string;
  onNameChange: (value: string) => void;
  onSave: () => void;
  onGenerateName: () => void;
};

const TICKS = 7; // how many names flicker past
const TICK_MS = 70; // how long each one stays

export default function Edit({
  isEditing,
  nameDraft,
  error,
  onNameChange,
  onSave,
  onGenerateName,
}: EditProps) {
  const [rolling, setRolling] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const shake = useSharedValue(0);
  const pop = useSharedValue(1);

  // Cancel any unfinished name roll if the page goes away
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // Shake the field when an error appears
  useEffect(() => {
    if (!error) return;
    shake.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withRepeat(withTiming(8, { duration: 100 }), 4, true),
      withTiming(0, { duration: 50 }),
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, [error, shake]);

  const inputStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }, { scale: pop.value }],
  }));

  const roll = () => {
    if (rolling) return;
    setRolling(true);

    // flicker through a few random names...
    for (let i = 0; i < TICKS; i++) {
      timers.current.push(
        setTimeout(() => {
          onNameChange(generateDisplayName());
          Haptics.selectionAsync();
          pop.value = withSequence(
            withTiming(1.03, { duration: 35 }),
            withTiming(1, { duration: 35 }),
          );
        }, i * TICK_MS),
      );
    }

    // ...then settle on the real one
    timers.current.push(
      setTimeout(() => {
        onGenerateName();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        pop.value = withSequence(
          withTiming(1.06, { duration: 90 }),
          withSpring(1, { damping: 8 }),
        );
        setRolling(false);
      }, TICKS * TICK_MS + 40),
    );
  };

  return (
    <View>
      {isEditing ? (
        <Animated.View
          entering={FadeInDown.springify().damping(16)}
          exiting={FadeOutUp.duration(200)}
          style={styles.editSection}
        >
          <Text style={styles.sectionTitle}>Your name</Text>
          <Animated.View style={inputStyle}>
            <TextInput
              value={nameDraft}
              placeholder="What should we call you?"
              placeholderTextColor={colors.muted}
              onChangeText={onNameChange}
              accessibilityLabel="Your name"
              autoCapitalize="words"
              onSubmitEditing={onSave}
              returnKeyType="done"
              style={styles.input}
            />
          </Animated.View>

          {error ? (
            <Animated.Text entering={FadeIn.duration(200)} style={styles.error}>
              {error}
            </Animated.Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save name"
            onPress={onSave}
            style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.saveButtonText}>Save name</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Generate random name"
            accessibilityState={{ disabled: rolling }}
            disabled={rolling}
            onPress={roll}
            style={({ pressed }) => [styles.generateButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.generateButtonText}>Generate random name</Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  editSection: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: 22,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1.5,
    color: colors.text,
    fontFamily: fonts.handwriting,
    fontSize: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  error: {
    color: colors.seal,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    marginTop: 7,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginTop: 14,
    minHeight: 48,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: colors.onDark,
    fontFamily: fonts.sansBold,
    fontSize: 15,
  },
  generateButton: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 10,
  },
  generateButtonText: {
    color: colors.primary,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
  },
  buttonPressed: {
    opacity: 0.78,
  },
});
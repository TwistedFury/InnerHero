import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, fonts } from '../../styling/theme';
import { getIcon } from '../../helper/icons';
import { useUser } from '../../storage/userStorage';

const EditIcon = getIcon('edit');

function formatPracticeDate(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return 'Practicing since today';

  return `Practicing since ${date.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })}`;
}

type IdentityProps = {
  isEditing: boolean;
  onToggleEditing: () => void;
};

export default function Identity({ isEditing, onToggleEditing }: IdentityProps) {
  const createdAt = useUser((state) => state.createdAt);
  const displayName = useUser((state) => state.profile.displayName ?? '');
  const name = displayName || 'Quiet Cedar';

  const reduceMotion = useReducedMotion();
  const breathe = useSharedValue(0); // slow 0-to-1 loop for the glowing ring
  const sway = useSharedValue(0); // tree rotation, in degrees
  const press = useSharedValue(0); // edit button squeeze

  useEffect(() => {
    if (reduceMotion) return;
    breathe.value = withRepeat(
      withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [breathe, reduceMotion]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: interpolate(breathe.value, [0, 1], [0.1, 0.55]),
    transform: [{ scale: interpolate(breathe.value, [0, 1], [1, 1.18]) }],
  }));
  const swayStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${sway.value}deg` }] }));
  const buttonStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 - 0.08 * press.value }] }));

  const rustle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sway.value = withSequence(
      withTiming(-10, { duration: 120 }),
      withTiming(8, { duration: 140 }),
      withTiming(-5, { duration: 120 }),
      withSpring(0, { damping: 6, stiffness: 120 }),
    );
  };

  return (
    <View style={styles.identity}>
      {/* decorative, so it's hidden from screen readers */}
      <Pressable onPress={rustle} accessible={false} style={styles.avatarWrap}>
        <Animated.View pointerEvents="none" style={[styles.pulseRing, ringStyle]} />
        <View style={styles.avatar}>
          <Animated.View style={[styles.tree, swayStyle]}>
            <Text style={styles.avatarTree}>△</Text>
            <View style={styles.avatarTrunk} />
            <View style={styles.avatarGround} />
          </Animated.View>
        </View>
      </Pressable>

      <View style={styles.identityCopy}>
        <Animated.Text key={name} entering={FadeIn.duration(450)} style={styles.name}>
          {name}
        </Animated.Text>
        <Text style={styles.practiceDate}>{formatPracticeDate(createdAt)}</Text>
      </View>

      <Animated.View style={buttonStyle}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isEditing ? 'Close name editor' : 'Edit name'}
          accessibilityState={{ expanded: isEditing }}
          onPress={onToggleEditing}
          onPressIn={() => {
            press.value = withSpring(1, { damping: 15, stiffness: 300 });
          }}
          onPressOut={() => {
            press.value = withSpring(0, { damping: 12, stiffness: 250 });
          }}
          style={[styles.editButton, isEditing && styles.editButtonActive]}
        >
          <EditIcon
            color={isEditing ? colors.onDark : colors.primary}
            size={19}
            strokeWidth={1.8}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 24,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    marginRight: 14,
  },
  // a gold ring behind the badge that swells and fades, slowly, like a breath
  pulseRing: {
    ...StyleSheet.absoluteFill,
    borderRadius: 32,
    borderColor: colors.gold,
    borderWidth: 2,
  },
  // leather badge with a gold ring
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderColor: colors.gold,
    borderWidth: 2,
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 64,
  },
  tree: {
    alignItems: 'center',
    transformOrigin: '50% 90%', // sways from the base, not the middle
  },
  avatarTree: {
    color: colors.onDark,
    fontFamily: 'Georgia',
    fontSize: 36,
    lineHeight: 38,
    marginTop: -3,
  },
  avatarTrunk: {
    backgroundColor: colors.onDark,
    height: 16,
    marginTop: -8,
    width: 2,
  },
  avatarGround: {
    backgroundColor: colors.onDark,
    height: 1,
    marginTop: 2,
    width: 30,
  },
  identityCopy: {
    flex: 1,
  },
  editButton: {
    alignItems: 'center',
    backgroundColor: colors.tint,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    marginLeft: 8,
    width: 44,
  },
  editButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  name: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 24,
    marginBottom: 3,
  },
  alias: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 12,
    marginBottom: 3,
  },
  practiceDate: {
    color: colors.muted,
    fontFamily: fonts.handwriting,
    fontSize: 18,
  },
});
import { Pressable, StyleSheet, Text, View } from 'react-native';
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

  return (
    <View style={styles.identity}>
      <View style={styles.avatar}>
        <Text style={styles.avatarTree}>△</Text>
        <View style={styles.avatarTrunk} />
        <View style={styles.avatarGround} />
      </View>
      <View style={styles.identityCopy}>
        <Text style={styles.name}>{displayName || 'Quiet Cedar'}</Text>
        <Text style={styles.alias}>Generated alias · no real name needed</Text>
        <Text style={styles.practiceDate}>{formatPracticeDate(createdAt)}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isEditing ? 'Close name editor' : 'Edit name'}
        accessibilityState={{ expanded: isEditing }}
        onPress={onToggleEditing}
        style={({ pressed }) => [
          styles.editButton,
          isEditing && styles.editButtonActive,
          pressed && styles.buttonPressed,
        ]}
      >
        <EditIcon
          color={isEditing ? colors.onDark : colors.primary}
          size={19}
          strokeWidth={1.8}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 24,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#123A32',
    borderRadius: 40,
    height: 60,
    justifyContent: 'center',
    marginRight: 14,
    overflow: 'hidden',
    width: 60,
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
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginLeft: 8,
    width: 40,
  },
  editButtonActive: {
    backgroundColor: colors.primary,
  },
  name: {
    color: colors.primaryDark,
    fontFamily: fonts.serif,
    fontSize: 21,
    marginBottom: 3,
  },
  alias: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 9,
    marginBottom: 3,
  },
  practiceDate: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 9,
  },
  buttonPressed: {
    opacity: 0.78,
  },
});
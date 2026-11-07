import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../styling/theme';
import { getIcon } from '../../helper/icons';

const MenuIcon = getIcon('menu');

export default function TitleOptions({
    isMenuVisible,
    setIsMenuVisible,
}: {
    isMenuVisible: boolean;
    setIsMenuVisible: (visible: boolean) => void;
}) {
    return (
        <View>
            <Text style={styles.eyebrow}>YOUR FIELD NOTES</Text>
            <View style={styles.titleRow}>
                <Text style={styles.title}>A practice of your own.</Text>
                <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open more options"
                accessibilityState={{ expanded: isMenuVisible }}
                onPress={() => setIsMenuVisible(true)}
                style={({ pressed }) => [
                    styles.menuButton,
                    pressed && styles.buttonPressed,
                ]}
                >
                <MenuIcon color={colors.primary} size={21} strokeWidth={1.8} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.primary,
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    marginBottom: 7,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 28,
    lineHeight: 34,
    flex: 1,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 20,
  },
  menuButton: {
    alignItems: 'center',
    backgroundColor: colors.tint,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    marginLeft: 12,
    marginTop: -5,
    width: 44,
  },
  buttonPressed: {
    opacity: 0.78,
  },
});
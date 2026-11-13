import { Modal, View, Pressable, Text, StyleSheet } from 'react-native';
import { fonts, colors } from '../../styling/theme'

export default function Menu(
    { 
        isMenuVisible, 
        setIsMenuVisible, 
        isDeleting, 
        confirmDeleteData,
        openAbout
    }: { 
        isMenuVisible: boolean; 
        setIsMenuVisible: (visible: boolean) => void; 
        isDeleting: boolean; 
        confirmDeleteData: () => void;
        openAbout: () => void;
    }) {
    return (
      <Modal
        visible={isMenuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <View style={styles.menuModal}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close more options"
            onPress={() => setIsMenuVisible(false)}
            style={styles.menuBackdrop}
          />
          <View style={styles.sideMenu}>
            <View style={styles.sideMenuHeader}>
              <Text style={styles.sideMenuTitle}>More options</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close more options"
                onPress={() => setIsMenuVisible(false)}
                style={({ pressed }) => [styles.closeMenuButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.closeMenuText}>×</Text>
              </Pressable>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="About Inner Hero"
              onPress={openAbout}
              style={({ pressed }) => [styles.menuAboutButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.menuAboutTitle}>About Inner Hero</Text>
              <Text style={styles.menuAboutDescription}>
                Why it was made and the research behind it.
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete my data"
              disabled={isDeleting}
              onPress={confirmDeleteData}
              style={({ pressed }) => [
                styles.menuDeleteButton,
                isDeleting && styles.deleteButtonDisabled,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.menuDeleteTitle}>Delete my data</Text>
              <Text style={styles.menuDeleteDescription}>
                Permanently remove all saved data from this device.
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
}

const styles = StyleSheet.create({
  menuModal: {
    flex: 1,
    flexDirection: 'row',
  },
  menuBackdrop: {
    backgroundColor: 'rgba(30, 18, 10, 0.5)',
    flex: 1,
  },
  sideMenu: {
    backgroundColor: colors.bg,
    borderLeftColor: colors.border,
    borderLeftWidth: 2,
    elevation: 8,
    maxWidth: 320,
    paddingHorizontal: 20,
    paddingTop: 56,
    shadowColor: '#000',
    shadowOffset: { height: 0, width: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    width: '82%',
  },
  sideMenuHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  sideMenuTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 24,
  },
  closeMenuButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  closeMenuText: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 28,
    lineHeight: 30,
  },
  menuDeleteButton: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.seal,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  menuDeleteTitle: {
    color: colors.seal,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    marginBottom: 5,
  },
  menuDeleteDescription: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    opacity: 0.78,
  },
  menuAboutButton: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  menuAboutTitle: {
    color: colors.text,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    marginBottom: 5,
  },
  menuAboutDescription: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
});
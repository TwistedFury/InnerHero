import { Modal, View, Pressable, Text, StyleSheet } from 'react-native';
import { fonts, colors } from '../../styling/theme'

export default function Menu(
    { 
        isMenuVisible, 
        setIsMenuVisible, 
        isDeleting, 
        confirmDeleteData 
    }: { 
        isMenuVisible: boolean; 
        setIsMenuVisible: (visible: boolean) => void; 
        isDeleting: boolean; 
        confirmDeleteData: () => void 
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
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    flex: 1,
  },
  sideMenu: {
    backgroundColor: colors.bg,
    elevation: 8,
    maxWidth: 320,
    paddingHorizontal: 20,
    paddingTop: 56,
    shadowColor: '#000',
    shadowOffset: { height: 0, width: -3 },
    shadowOpacity: 0.18,
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
    color: colors.primaryDark,
    fontFamily: fonts.serif,
    fontSize: 22,
  },
  closeMenuButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  closeMenuText: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 28,
    lineHeight: 30,
  },
  menuDeleteButton: {
    backgroundColor: '#F8E9E5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  menuDeleteTitle: {
    color: '#7A2E2E',
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    marginBottom: 5,
  },
  menuDeleteDescription: {
    color: '#8B5550',
    fontFamily: fonts.sans,
    fontSize: 10,
    lineHeight: 14,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    opacity: 0.78,
  },
});
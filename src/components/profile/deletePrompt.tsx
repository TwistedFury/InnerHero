import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts } from '../../styling/theme';

export default function DeletePrompt({
  isDeletePromptVisible,
  setIsDeletePromptVisible,
  isDeleting,
  DeleteData,
}: {
  isDeletePromptVisible: boolean;
  setIsDeletePromptVisible: (visible: boolean) => void;
  isDeleting: boolean;
  DeleteData: () => Promise<void>;
}) {
    return (
        <Modal
        visible={isDeletePromptVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDeletePromptVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmationCard}>
            <Text style={styles.confirmationTitle}>Are You Sure?</Text>
            <Text style={styles.confirmationText}>
              This will permanently delete your profile, reflections, quest progress, and
              milestones from this device.
            </Text>
            <View style={styles.confirmationActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cancel deleting my data"
                onPress={() => setIsDeletePromptVisible(false)}
                style={({ pressed }) => [styles.cancelButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Confirm delete my data"
                disabled={isDeleting}
                onPress={() => {
                  setIsDeletePromptVisible(false);
                  void DeleteData();
                }}
                style={({ pressed }) => [
                  styles.confirmDeleteButton,
                  isDeleting && styles.deleteButtonDisabled,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.deleteButtonText}>Delete My Data</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
}

const styles = StyleSheet.create({
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: colors.onDark,
    fontFamily: fonts.sansMedium,
    fontSize: 10,
  },
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  confirmationCard: {
    backgroundColor: colors.bg,
    borderRadius: 14,
    maxWidth: 380,
    padding: 20,
    width: '100%',
  },
  confirmationTitle: {
    color: colors.primaryDark,
    fontFamily: fonts.serif,
    fontSize: 22,
    marginBottom: 9,
  },
  confirmationText: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
  },
  confirmationActions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: colors.primary,
    fontFamily: fonts.sansMedium,
    fontSize: 11,
  },
  confirmDeleteButton: {
    backgroundColor: '#A33A32',
    borderRadius: 8,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  buttonPressed: {
    opacity: 0.78,
  },
});
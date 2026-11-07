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
    fontFamily: fonts.sansBold,
    fontSize: 14,
  },
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(30, 18, 10, 0.55)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  confirmationCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderRadius: 6,
    maxWidth: 380,
    padding: 22,
    width: '100%',
  },
  confirmationTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 24,
    marginBottom: 10,
  },
  confirmationText: {
    color: colors.text,
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
  },
  confirmationActions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 22,
  },
  cancelButton: {
    borderColor: colors.primary,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: colors.primary,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
  },
  confirmDeleteButton: {
    backgroundColor: colors.seal,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonPressed: {
    opacity: 0.78,
  },
});
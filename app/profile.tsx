import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { deleteAllSavedData } from '../src/helper/dataDeleter';
import { useUser } from '../src/storage/userStorage';
import { useProgress } from '../src/storage/questStorage';
import { useMilestones } from '../src/storage/milestoneStorage';
import { generateDisplayName } from '../src/helper/nameGenerator';
import { getIcon } from '../src/helper/icons';
import { colors, fonts } from '../src/styling/theme';

/* Components */
import Identity from '../src/components/profile/identity';
import PrivacyCard from '../src/components/profile/privacyCard';
import Stats from '../src/components/profile/stats';
import Milestones from '../src/components/profile/milestones';
import Edit from '../src/components/profile/edit';
import HelpLinks from '../src/components/profile/helpLinks';

const MenuIcon = getIcon('menu');

export default function Profile() {
  const displayName = useUser((state) => state.profile.displayName ?? '');
  const updateProfile = useUser((state) => state.updateProfile);
  const resetProgress = useProgress((state) => state.resetProgress);
  const resetMilestones = useMilestones((state) => state.resetMilestones);
  const resetUser = useUser((state) => state.resetUser);
  const [nameDraft, setNameDraft] = useState(displayName);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletePromptVisible, setIsDeletePromptVisible] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  const DeleteData = async () => {
    setIsDeleting(true);
    try {
      await deleteAllSavedData();
      resetUser();
      resetProgress();
      resetMilestones();
      setNameDraft('');
      setIsEditing(false);
      setDeleteMessage('All saved data has been deleted.');
    } catch (deleteError) {
      console.error('Unable to delete saved data', deleteError);
      setDeleteMessage('We could not delete your saved data. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeleteData = () => {
    setIsMenuVisible(false);
    setDeleteMessage('');
    setIsDeletePromptVisible(true);
  };

  const handleToggleEditing = () => {
    setIsEditing((editing) => !editing);
    setError('');
  };

  const handleSave = () => {
    const trimmedName = nameDraft.trim();

    if (!trimmedName) {
      setError('Please enter a name.');
      return;
    }

    updateProfile({ displayName: trimmedName });
    setNameDraft(trimmedName);
    setError('');
    setIsEditing(false);
  };

  const handleGenerateName = () => {
    setNameDraft(generateDisplayName());
    setError('');
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.panel}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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

          <Identity 
            isEditing={isEditing}
            onToggleEditing={handleToggleEditing}
          />

          <PrivacyCard />

          <Stats />

          <Milestones />

          <Edit
            isEditing={isEditing}
            nameDraft={nameDraft}
            error={error}
            onNameChange={(value) => {
              setNameDraft(value);
              setError('');
            }}
            onSave={handleSave}
            onGenerateName={handleGenerateName}
          />

          <HelpLinks />

        </ScrollView>
      </View>
      {deleteMessage ? (
        <View style={styles.deleteMessage} accessibilityRole="alert">
          <Text style={styles.deleteMessageText}>{deleteMessage}</Text>
        </View>
      ) : null}
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#20231F',
  },
  panel: {
    flex: 1,
    marginTop: 10,
    overflow: 'hidden',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 40,
  },
  eyebrow: {
    color: colors.primary,
    fontFamily: fonts.sansMedium,
    fontSize: 9,
    letterSpacing: 0.7,
    marginBottom: 7,
  },
  title: {
    color: colors.primaryDark,
    fontFamily: fonts.serif,
    fontSize: 25,
    lineHeight: 31,
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
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginLeft: 12,
    marginTop: -5,
    width: 40,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: colors.onDark,
    fontFamily: fonts.sansMedium,
    fontSize: 10,
  },
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
  deleteMessage: {
    backgroundColor: colors.primaryDark,
    borderRadius: 10,
    bottom: 20,
    left: 20,
    paddingHorizontal: 14,
    paddingVertical: 11,
    position: 'absolute',
    right: 20,
  },
  deleteMessageText: {
    color: colors.onDark,
    fontFamily: fonts.sans,
    fontSize: 11,
    textAlign: 'center',
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
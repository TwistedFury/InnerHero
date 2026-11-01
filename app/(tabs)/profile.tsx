import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { deleteAllSavedData } from '../../src/helper/dataDeleter';
import { useUser } from '../../src/storage/userStorage';
import { useProgress } from '../../src/storage/questStorage';
import { useMilestones } from '../../src/storage/milestoneStorage';
import { generateDisplayName } from '../../src/helper/nameGenerator';
import { colors } from '../../src/styling/theme';

/* Components */
import Identity from '../../src/components/profile/identity';
import PrivacyCard from '../../src/components/profile/privacyCard';
import Stats from '../../src/components/profile/stats';
import Milestones from '../../src/components/profile/milestones';
import Edit from '../../src/components/profile/edit';
import HelpLinks from '../../src/components/profile/helpLinks';
import DeleteMessage from '../../src/components/profile/deleteMessage';
import Menu from '../../src/components/profile/menu';
import DeletePrompt from '../../src/components/profile/deletePrompt';
import TitleOptions from '../../src/components/profile/titleOptions';

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
      <View style={styles.panel}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TitleOptions
            isMenuVisible={isMenuVisible}
            setIsMenuVisible={setIsMenuVisible}
          />

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
        <DeleteMessage deleteMessage={deleteMessage} />
      ) : null}
      <Menu 
        isMenuVisible={isMenuVisible}
        setIsMenuVisible={setIsMenuVisible}
        isDeleting={isDeleting}
        confirmDeleteData={confirmDeleteData}
      />
      <DeletePrompt
        isDeletePromptVisible={isDeletePromptVisible}
        setIsDeletePromptVisible={setIsDeletePromptVisible}
        isDeleting={isDeleting}
        DeleteData={DeleteData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  panel: {
    flex: 1,
    marginTop: 10,
    overflow: 'hidden',
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 40,
  },
});
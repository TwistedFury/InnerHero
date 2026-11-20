import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import Reveal from '../../src/components/profile/reveal';
import { ScrollView, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { deleteAllSavedData } from '../../src/helper/dataDeleter';
import { useUser } from '../../src/storage/userStorage';
import { useProgress } from '../../src/storage/questStorage';
import { useMilestones } from '../../src/storage/milestoneStorage';
import { generateDisplayName } from '../../src/helper/nameGenerator';

/* Components */
import Identity from '../../src/components/profile/identity';
import PrivacyCard from '../../src/components/profile/privacyCard';
import Stats from '../../src/components/profile/stats';
import Milestones from '../../src/components/profile/milestones';
import Edit from '../../src/components/profile/edit';
import HelpLinks from '../../src/components/profile/helpLinks';
import DeleteMessage from '../../src/components/profile/menu/deleteMessage';
import Menu from '../../src/components/profile/menu/menu';
import DeletePrompt from '../../src/components/profile/menu/deletePrompt';
import AboutModal from '../../src/components/profile/menu/aboutMenu';
import OtherResourcesModal from '../../src/components/profile/menu/otherResources';
import TitleOptions from '../../src/components/profile/titleOptions';
import PageBackground from '../../src/components/pageBackground';

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
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isOTRVisible, setIsOTRVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletePromptVisible, setIsDeletePromptVisible] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  // Bumping this number makes the page rebuild itself, so the entrance plays on every visit
  const [visit, setVisit] = useState(0);
  const firstFocus = useRef(true);

  // For scrolling down to the name editor when it opens
  const scrollRef = useRef<ScrollView>(null);
  const viewportHeight = useRef(0); // how tall the visible part of the page is
  const wantsScroll = useRef(false); // true between tapping edit and the panel appearing

  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false; // the first visit already animates by itself
        return;
      }
      setVisit((v) => v + 1);
    }, []),
  );

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

  const openAbout = () => {
    setIsMenuVisible(false);
    // iPhones can ignore a pop-up that opens while another is still closing,
    // so we wait a moment before showing the About page.
    setTimeout(() => setIsAboutVisible(true), 350);
  };

  const openOTR = () => {
    setIsMenuVisible(false);
    // Same reasoning as `openAbout`
    setTimeout(() => setIsOTRVisible(true), 350);
  }

  const handleToggleEditing = () => {
    if (!isEditing) wantsScroll.current = true; // opening: scroll once the panel exists
    setIsEditing((editing) => !editing);
    setError('');
  };

  // Runs when the editor's space on the page changes size, which happens when it opens
  const handleEditLayout = (event: LayoutChangeEvent) => {
    if (!wantsScroll.current) return;
    const { y, height } = event.nativeEvent.layout;
    if (height === 0) return; // the panel hasn't appeared yet
    wantsScroll.current = false;

    // Scroll so the bottom of the panel sits just above the bottom of the screen
    const target = Math.max(0, y + height - viewportHeight.current + 24);

    // wait a moment for the layout to settle, same as the list pages
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: target, animated: true });
    }, 100);
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

    // wait for the panel to finish fading out and the page to shrink, then go back to the top
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, 350);
  };

  const handleGenerateName = () => {
    setNameDraft(generateDisplayName());
    setError('');
  };

  return (
    <PageBackground>
      <View style={styles.panel}>
        <ScrollView
          ref={scrollRef}
          key={visit}
          onLayout={(event) => {
            viewportHeight.current = event.nativeEvent.layout.height;
          }}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TitleOptions
            isMenuVisible={isMenuVisible}
            setIsMenuVisible={setIsMenuVisible}
          />
          <Reveal index={0}>
            <Identity
              isEditing={isEditing}
              onToggleEditing={handleToggleEditing}
            />
          </Reveal>
          <Reveal index={1}>
            <PrivacyCard />
          </Reveal>
          <Reveal index={2}>
            <Stats />
          </Reveal>
          <Reveal index={3}>
            <Milestones />
          </Reveal>
          <View onLayout={handleEditLayout}>
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
          </View>
          <Reveal index={4}>
            <HelpLinks />
          </Reveal>
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
        openAbout={openAbout}
        openOTR={openOTR}
      />
      <AboutModal
        isAboutVisible={isAboutVisible}
        setIsAboutVisible={setIsAboutVisible}
      />
      <OtherResourcesModal
        isOTRVisible={isOTRVisible}
        setIsOTRVisible={setIsOTRVisible}
      />
      <DeletePrompt
        isDeletePromptVisible={isDeletePromptVisible}
        setIsDeletePromptVisible={setIsDeletePromptVisible}
        isDeleting={isDeleting}
        DeleteData={DeleteData}
      />
    </PageBackground>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    marginTop: 10,
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 40,
  },
});
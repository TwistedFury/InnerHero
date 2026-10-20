import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useUser } from '../src/storage/userStorage';
import { generateDisplayName } from '../src/helper/nameGenerator';

export default function Profile() {
  const displayName = useUser((state) => state.profile.displayName ?? '');
  const updateProfile = useUser((state) => state.updateProfile);
  const [nameDraft, setNameDraft] = useState(displayName);
  const [error, setError] = useState('');

  const handleSave = () => {
    const trimmedName = nameDraft.trim();

    if (!trimmedName) {
      setError('Please enter a name.');
      return;
    }

    updateProfile({ displayName: trimmedName });
    setNameDraft(trimmedName);
    setError('');
  };

  const handleGenerateName = () => {
    setNameDraft(generateDisplayName());
    setError('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your name</Text>
      <TextInput
        value={nameDraft}
        placeholder="What should we call you?"
        onChangeText={(value) => {
          setNameDraft(value);
          setError('');
        }}
        accessibilityLabel="Your name"
        autoCapitalize="words"
        onSubmitEditing={handleSave}
        returnKeyType="done"
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save name</Text>
      </Pressable>

      <Pressable onPress={handleGenerateName} style={styles.generateButton}>
        <Text style={styles.generateButtonText}>Generate random name</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderColor: '#D0D5D2',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  error: {
    color: '#B42318',
    marginTop: 8,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#2F6B5A',
    borderRadius: 8,
    marginTop: 16,
    padding: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  generateButton: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  generateButtonText: {
    color: '#2F6B5A',
    fontWeight: '600',
  },
});

import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts } from '../../styling/theme';

type EditProps = {
  isEditing: boolean;
  nameDraft: string;
  error: string;
  onNameChange: (value: string) => void;
  onSave: () => void;
  onGenerateName: () => void;
};

export default function Edit({
  isEditing,
  nameDraft,
  error,
  onNameChange,
  onSave,
  onGenerateName,
}: EditProps) {
  return (
    <View>
      {isEditing ? (
        <View style={styles.editSection}>
          <Text style={styles.sectionTitle}>Your name</Text>
          <TextInput
            value={nameDraft}
            placeholder="What should we call you?"
            placeholderTextColor={colors.muted}
            onChangeText={onNameChange}
            accessibilityLabel="Your name"
            autoCapitalize="words"
            onSubmitEditing={onSave}
            returnKeyType="done"
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save name"
            onPress={onSave}
            style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.saveButtonText}>Save name</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Generate random name"
            onPress={onGenerateName}
            style={({ pressed }) => [styles.generateButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.generateButtonText}>Generate random name</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  editSection: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: 22,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1.5,
    color: colors.text,
    fontFamily: fonts.handwriting,
    fontSize: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  error: {
    color: colors.seal,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    marginTop: 7,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginTop: 14,
    minHeight: 48,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: colors.onDark,
    fontFamily: fonts.sansBold,
    fontSize: 15,
  },
  generateButton: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 10,
  },
  generateButtonText: {
    color: colors.primary,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
  },
  buttonPressed: {
    opacity: 0.78,
  },
});
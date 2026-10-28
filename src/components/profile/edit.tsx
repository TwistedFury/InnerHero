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
    color: colors.primaryDark,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    color: colors.text,
    fontFamily: fonts.sans,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  error: {
    color: '#B42318',
    fontFamily: fonts.sans,
    fontSize: 12,
    marginTop: 7,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 9,
    marginTop: 14,
    paddingVertical: 12,
  },
  saveButtonText: {
    color: colors.onDark,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
  },
  generateButton: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  generateButtonText: {
    color: colors.primary,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
  },
  buttonPressed: {
    opacity: 0.78,
  },
});
import { Pressable, Text, TextInput, View } from 'react-native';
import { useUser } from '../src/storage/userStorage';
import { generateDisplayName } from '../src/helper/nameGenerator'

export default function Profile() {
  const displayName = useUser((state) => state.profile.displayName ?? '');
  const updateProfile = useUser((state) => state.updateProfile);

  return (
    <View>
      <TextInput
        value={displayName}
        placeholder="What should we call you?"
        onChangeText={(value) => updateProfile({ displayName: value })}
      />

      <Pressable onPress={() => updateProfile({ displayName: generateDisplayName() })}>
        <Text>Generate random name</Text>
      </Pressable>
    </View>
  );
}

import { TextInput, View, StyleSheet } from 'react-native'

type QuestProps = {
    value: string | undefined,
    onChange: (answer: string) => void,
}

export default function QuestText({ value, onChange }: QuestProps)
{
    return (
        <View>
            <TextInput
                multiline
                value={typeof value === 'string' ? value : ''}
                onChangeText={onChange}
                placeholder="Write your thoughts here"
                style={styles.textInput}
                textAlignVertical="top"
            />
      </View>
    );
}

const styles = StyleSheet.create({
    textInput: {
    minHeight: 160,
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
});
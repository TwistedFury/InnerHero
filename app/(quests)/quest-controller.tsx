import { View, Text, Button, StyleSheet } from 'react-native';
import { useProgress } from '../../src/storage/questStorage';
import { getChain, getCurrentQuest } from '../../src/helper/chainUtils';

export default function ChainScreen({ chainId }: { chainId: string }) {
  const completed = useProgress((s) => s.completed);
  const completeQuest = useProgress((s) => s.completeQuest);
  const undoQuest = useProgress((s) => s.undoQuest);

  const chain = getChain(chainId);
  const current = getCurrentQuest(chainId, completed);
  const doneCount = chain.filter((q) => completed.includes(q.id)).length;

  if (!current) return <Text>Chain complete! 🎉</Text>;

  const previous = chain
    .filter((q) => completed.includes(q.id))
    .at(-1);

  return (
    <View style={styles.chainScreen}>
      <Text>Quest {doneCount + 1} of {chain.length}</Text>
      <Text>{current.name}</Text>

      <Button title="Complete & continue" onPress={() => completeQuest(current.id)} />
      {previous && (
        <Button title="Go back" onPress={() => undoQuest(previous.id)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    chainScreen: {
        padding: 20,
        marginTop: 100,
        backgroundColor: "#bebdbd87"
    }
});
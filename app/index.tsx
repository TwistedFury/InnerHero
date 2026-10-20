import { useRouter } from 'expo-router'
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Button } from 'react-native';
import { useForm, Controller } from 'react-hook-form'
import quests from "../src/data/quests.json";
import type { Quest } from "../src/types/quest";

import { useEffect, useState } from "react";
import { useProgress } from "../src/storage/questStorage"

function useHydrated() {
  const [hydrated, setHydrated] = useState(useProgress.persist.hasHydrated());
  useEffect(() => {
    const unsub = useProgress.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);
  return hydrated;
}

const sampleQuest = quests[0] as Quest;

export default function Page() {
  // Navigation:
  const router = useRouter();
  // Hook Form Data:
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      questCode: ""
    },
  });
  const onSubmit = (data: { questCode: string }) => router.navigate({
    pathname: '/quests/[questCode]',
    params: {
      questCode: data.questCode
    },
  });

  // Wait for quests to saturate
  const hydrated = useHydrated();
  if (!hydrated) return null;

  return (
    <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.main}>
        <Text style={styles.title}>Hello World</Text>
        <Text style={styles.subtitle}>This is the first page of your app.</Text>
        <Pressable style={styles.profileButton} onPress={() => router.navigate('/profile')}>
          <Text style={styles.profileButtonText}>Go to Profile</Text>
        </Pressable>

        <Pressable style={styles.questsButton} onPress={() => router.navigate('/quests')}>
          <Text style={styles.questsButtonText}>Go to Quests</Text>
        </Pressable>

        <Pressable
          style={styles.sampleQuestButton}
          onPress={() => router.navigate({
            pathname: '/quests/[questCode]',
            params: { questCode: sampleQuest.id },
          })}
        >
          <Text style={styles.sampleQuestButtonText}>Open Sample Quest</Text>
        </Pressable>

        <Pressable style={styles.questPgButton} onPress={() => router.navigate('/')}>
          <Text style={styles.questPgButtonText}>Go to Quest Progress</Text>
        </Pressable>

        <Pressable style={styles.questCompButton} onPress={() => router.navigate('/quest-complete')}>
          <Text style={styles.questCompButtonText}>Go to Quest Complete</Text>
        </Pressable>

        <Controller
          control={control}
          rules={{ required: "A code is required."}}
          render={( { field: { onChange, onBlur, value } }) => (
            <TextInput 
              style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Quest Code"
            />
          )}
          name="questCode"
          />
          {errors.questCode && <Text style={{ color: 'red'}}>{errors.questCode.message}</Text>}

          <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      </View>
      
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    width: "100%",
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  profileButton: {
    backgroundColor: "#edff68",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  profileButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  questsButton: {
    backgroundColor: "#edff68",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  questsButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  sampleQuestButton: {
    backgroundColor: "#b8f2e6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  sampleQuestButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  questPgButton: {
    backgroundColor: "#edff68",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  questPgButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  questCompButton: {
    backgroundColor: "#edff68",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  questCompButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});

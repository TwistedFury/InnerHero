import AsyncStorage from '@react-native-async-storage/async-storage';

export async function deleteAllSavedData(): Promise<void> {
	await AsyncStorage.clear();
}

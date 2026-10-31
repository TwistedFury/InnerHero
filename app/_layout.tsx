import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	useFonts as useInterFonts,
} from '@expo-google-fonts/inter';
import { Lora_500Medium, useFonts as useLoraFonts } from '@expo-google-fonts/lora';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useMilestones } from '../src/storage/milestoneStorage';
import { useProgress } from '../src/storage/questStorage';
import { useUser } from '../src/storage/userStorage';

function useStoresHydrated() {
	const [hydrated, setHydrated] = useState(
		() =>
			useUser.persist.hasHydrated() &&
			useProgress.persist.hasHydrated() &&
			useMilestones.persist.hasHydrated(),
	);

	useEffect(() => {
		if (Platform.OS === 'android') {
			NavigationBar.NavigationBar.setHidden(true);
		}

		const updateHydration = () => {
			setHydrated(
				useUser.persist.hasHydrated() &&
					useProgress.persist.hasHydrated() &&
					useMilestones.persist.hasHydrated(),
			);
		};
		const unsubscribeUser = useUser.persist.onFinishHydration(updateHydration);
		const unsubscribeProgress = useProgress.persist.onFinishHydration(updateHydration);
		const unsubscribeMilestones = useMilestones.persist.onFinishHydration(updateHydration);

		return () => {
			unsubscribeUser();
			unsubscribeProgress();
			unsubscribeMilestones();
		};
	}, []);

	return hydrated;
}

export default function RootLayout() {
	const [interLoaded, interError] = useInterFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
	});
	const [loraLoaded, loraError] = useLoraFonts({
		Lora_500Medium,
	});
	const storesHydrated = useStoresHydrated();

	if (interError) {
		throw interError;
	}

	if (loraError) {
		throw loraError;
	}

	if (!interLoaded || !loraLoaded || !storesHydrated) {
		return null;
	}

	return (
		<>
			<StatusBar hidden />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: '#F7F4EE' },
				}}
			/>
		</>
	);
}

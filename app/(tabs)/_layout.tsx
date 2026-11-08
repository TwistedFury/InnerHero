import { Tabs } from 'expo-router';
import { BookOpen, House, ScrollText } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../../src/styling/theme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.onDark,
        tabBarInactiveTintColor: colors.onDarkFaint,
        tabBarStyle: {
          height: 62 + insets.bottom,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 10),
          backgroundColor: colors.primaryDark,
          borderTopWidth: 2,
          borderTopColor: colors.gold,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.sansMedium,
          fontSize: 12,
          letterSpacing: 0.4,
        },
        tabBarItemStyle: {
          transform: [{ translateY: -6 }],
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <House color={color} size={size} strokeWidth={1.8} />
          ),
        }}
      />

      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quest Board',
          tabBarIcon: ({ color, size }) => (
            <ScrollText color={color} size={size} strokeWidth={1.8} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Field Notes',
          tabBarIcon: ({ color, size }) => (
            <BookOpen color={color} size={size} strokeWidth={1.8} />
          ),
        }}
      />
    </Tabs>
  );
}
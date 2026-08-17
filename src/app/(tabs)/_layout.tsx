import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

import { colors, typography } from '@/design/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { ...typography.caption, marginTop: 2 },
        tabBarStyle: {
          height: 76,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: '#111113',
          borderTopColor: colors.border,
        },
      }}>
      <Tabs.Screen
        name="today"
        options={{ title: '今日', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="play-circle" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="progress"
        options={{ title: '進捗', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="chart-timeline-variant-shimmer" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'あなた', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-circle" color={color} size={size} /> }}
      />
    </Tabs>
  );
}


import { Tabs } from 'expo-router';
import { Home, CalendarHeart, Stethoscope, Settings } from 'lucide-react-native';
import { colors, typography } from '../../src/theme';
import { useI18n } from '../../src/i18n/I18nProvider';

export default function TabLayout() {
  const { t } = useI18n();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.teal[500],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.semibold,
          fontSize: 12,
          paddingBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray[200],
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cycle"
        options={{
          title: t('cycle'),
          tabBarIcon: ({ size, color }) => <CalendarHeart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="screening"
        options={{
          title: t('screening'),
          tabBarIcon: ({ size, color }) => <Stethoscope size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ size, color }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

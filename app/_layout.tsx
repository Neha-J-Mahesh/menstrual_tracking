import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { I18nProvider } from '@/src/i18n/I18nProvider';
import { ProfileProvider } from '@/src/context/ProfileProvider';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <I18nProvider>
      <ProfileProvider>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="create-profile" options={{ headerShown: false }} />
          <Stack.Screen name="screening/step-symptoms" options={{ headerShown: false }} />
          <Stack.Screen name="screening/step-pallor" options={{ headerShown: false }} />
          <Stack.Screen name="screening/step-hb" options={{ headerShown: false }} />
          <Stack.Screen name="screening/results" options={{ headerShown: false }} />
          <Stack.Screen name="screening/history" options={{ headerShown: false }} />
          <Stack.Screen name="cycle/log-period" options={{ headerShown: false }} />
          <Stack.Screen name="cycle/log-symptoms" options={{ headerShown: false }} />
          <Stack.Screen name="cycle/phase-detail" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="dark" />
      </ProfileProvider>
    </I18nProvider>
  );
}

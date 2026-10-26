import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { router, Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { PROTECTED_ROUTES } from '@/constants/session';
import { SessionProvider, useSession } from '@/hooks/use-session';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SessionProvider>
      <SessionGate />
    </SessionProvider>
  );
}

function SessionGate() {
  const { status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'expired' && pathname !== '/session-expired') {
      router.replace('/session-expired');
    } else if (status === 'signedOut' && PROTECTED_ROUTES.includes(pathname)) {
      router.replace('/login');
    }
  }, [status, pathname]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

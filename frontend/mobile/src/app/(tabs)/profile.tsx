import Constants from 'expo-constants';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppBar } from '@/components/app-bar';
import { BreakCard } from '@/components/profile/break-card';
import { IdentityCard } from '@/components/profile/identity-card';
import { SettingsCard } from '@/components/profile/settings-card';
import { Brand, InterFonts, Spacing } from '@/constants/theme';
import { useAvailability } from '@/hooks/use-availability';
import { useProfile } from '@/hooks/use-profile';
import { useSession } from '@/hooks/use-session';
import { getShiftStatusLabel } from '@/utils/availability';
import { formatShiftRange } from '@/utils/profile';

const FIGMA_STATUS_BAR_HEIGHT = 44;

export default function ProfileScreen() {
  const { signOut } = useSession();
  const { availability, requestUnavailability } = useAvailability();
  const { status, profile, reload } = useProfile();

  function handleLogOut() {
    signOut();
    router.replace('/login');
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AppBar title="Profile" onBellPress={() => router.navigate('/alerts')} />
      <ScrollView contentContainerStyle={styles.content}>
        {status === 'ready' && profile ? (
          <>
            <IdentityCard
              staff={profile.staff}
              shiftStatus={getShiftStatusLabel(availability, formatShiftRange(profile.shift))}
            />
            <BreakCard availability={availability} onRequestBreak={requestUnavailability} />
          </>
        ) : status === 'error' ? (
          <View style={styles.message}>
            <Text style={styles.messageText}>Couldn’t load your profile.</Text>
            <Pressable accessibilityRole="button" onPress={reload}>
              <Text style={styles.messageAction}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.message}>
            <Text style={styles.messageText}>Loading your profile…</Text>
          </View>
        )}
        <SettingsCard onLogOut={handleLogOut} />
        <Text style={styles.version}>ResolveX Staff v{Constants.expoConfig?.version ?? '—'}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.bgCanvas,
    paddingTop: FIGMA_STATUS_BAR_HEIGHT,
  },
  content: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  version: {
    fontFamily: InterFonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textTertiary,
  },
  message: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
  messageText: {
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textSecondary,
    textAlign: 'center',
  },
  messageAction: {
    fontFamily: InterFonts.medium,
    fontSize: 13,
    color: Brand.textLink,
  },
});

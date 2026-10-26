import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Pressable, View } from 'react-native';

import { Brand, FigmaSpace, InterFonts, Radius, Spacing } from '@/constants/theme';

const FIGMA_STATUS_BAR_HEIGHT = 44;

// Tokens used by this Figma frame that are not yet in the shared theme.
const WARNING_BG = '#fffbeb';

export default function SessionExpiredScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.body}>
        <View style={styles.mark}>
          <Image
            source={require('@/assets/images/session-expired/lock.svg')}
            style={styles.markIcon}
            contentFit="contain"
          />
        </View>
        <Text style={styles.title}>Session expired</Text>
        <Text style={styles.subtitle}>
          For security, staff sessions end after 12 hours or when your role changes. Sign in again
          to continue.
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => router.replace('/login')}
          accessibilityRole="button">
          <Image
            source={require('@/assets/images/session-expired/log-in.svg')}
            style={styles.buttonIcon}
            contentFit="contain"
          />
          <Text style={styles.buttonText}>Sign in again</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.bgCanvas,
    paddingTop: FIGMA_STATUS_BAR_HEIGHT,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: 40,
  },
  mark: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: WARNING_BG,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  markIcon: {
    width: 32,
    height: 32,
  },
  title: {
    fontFamily: InterFonts.semiBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.12,
    color: Brand.textPrimary,
  },
  subtitle: {
    width: 300,
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textSecondary,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: FigmaSpace.five,
    backgroundColor: Brand.bgBrand,
    borderRadius: Radius.md,
  },
  buttonText: {
    fontFamily: InterFonts.medium,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.textOnBrand,
  },
  buttonIcon: {
    width: 20,
    height: 20,
  },
});

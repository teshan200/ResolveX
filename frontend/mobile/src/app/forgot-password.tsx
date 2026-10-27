import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Brand, FigmaSpace, InterFonts, Radius, Ring, Spacing } from '@/constants/theme';

const FIGMA_STATUS_BAR_HEIGHT = 44;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Tokens used by this Figma frame that are not yet in the shared theme.
const Forgot = {
  bgBrandSubtle: '#eef8f6',
  borderSubtle: '#edf1f1',
  infoBg: '#eff6ff',
  infoBorder: '#bfdbfe',
  infoFg: '#1d4ed8',
  radiusLg: 12,
} as const;

function validateIdentifier(value: string) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return 'Enter your Staff ID or email';
  }
  if (trimmed.includes('@') && !EMAIL_PATTERN.test(trimmed)) {
    return 'Enter a valid email address';
  }
  return undefined;
}

export default function ForgotPasswordScreen() {
  const [identifier, setIdentifier] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/login');
    }
  }

  function handleChange(text: string) {
    setIdentifier(text);
    if (error) {
      setError(undefined);
    }
  }

  function handleSend() {
    Keyboard.dismiss();
    const nextError = validateIdentifier(identifier);
    setError(nextError);
    if (nextError) {
      return;
    }
    // TODO: call the password-reset API once the backend exists.
    Alert.alert(
      'Reset link not sent',
      'Password reset is not connected to a backend yet, so no email was sent.',
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.appBar}>
        <Pressable
          style={styles.iconButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Back">
          <Image
            source={require('@/assets/images/forgot-password/arrow-left.svg')}
            style={styles.appBarIcon}
            contentFit="contain"
          />
        </Pressable>
        <View style={styles.appBarTitles}>
          <Text style={styles.appBarOverline}>ResolveX Staff</Text>
          <Text style={styles.appBarTitle}>Reset password</Text>
        </View>
        <View style={styles.iconButton}>
          <Image
            source={require('@/assets/images/forgot-password/more-vertical.svg')}
            style={styles.appBarIcon}
            contentFit="contain"
          />
        </View>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.mark}>
            <Image
              source={require('@/assets/images/forgot-password/key.svg')}
              style={styles.markIcon}
              contentFit="contain"
            />
          </View>

          <View style={styles.titles}>
            <Text style={styles.title}>Forgot your password?</Text>
            <Text style={styles.subtitle}>
              Enter your staff ID or work email. We’ll send a reset link and a 6-digit code.
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Staff ID or email</Text>
            <View style={[styles.input, error ? styles.inputError : focused ? styles.inputFocused : null]}>
              <Image
                source={require('@/assets/images/forgot-password/user.svg')}
                style={styles.leadingIcon}
                contentFit="contain"
              />
              <TextInput
                style={styles.inputValue}
                value={identifier}
                onChangeText={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onSubmitEditing={handleSend}
                placeholder="ST-4820"
                placeholderTextColor={Brand.textTertiary}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="send"
                selectionColor={Brand.bgBrand}
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <Pressable style={styles.button} onPress={handleSend} accessibilityRole="button">
            <Text style={styles.buttonText}>Send reset link</Text>
            <Image
              source={require('@/assets/images/forgot-password/send.svg')}
              style={styles.buttonIcon}
              contentFit="contain"
            />
          </Pressable>

          <View style={styles.banner}>
            <Image
              source={require('@/assets/images/forgot-password/help-circle.svg')}
              style={styles.bannerIcon}
              contentFit="contain"
            />
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>No access to your email?</Text>
              <Text style={styles.bannerBody}>
                Your branch manager can reset your password from the Employees page.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.bgCanvas,
    paddingTop: FIGMA_STATUS_BAR_HEIGHT,
  },
  flex: {
    flex: 1,
  },
  appBar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    backgroundColor: Brand.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: Forgot.borderSubtle,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarIcon: {
    width: 20,
    height: 20,
  },
  appBarTitles: {
    flex: 1,
  },
  appBarOverline: {
    fontFamily: InterFonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textTertiary,
  },
  appBarTitle: {
    fontFamily: InterFonts.semiBold,
    fontSize: 18,
    lineHeight: 26,
    color: Brand.textPrimary,
  },
  body: {
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: FigmaSpace.five,
  },
  mark: {
    width: 56,
    height: 56,
    borderRadius: Forgot.radiusLg,
    backgroundColor: Forgot.bgBrandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  markIcon: {
    width: 26,
    height: 26,
  },
  titles: {
    alignSelf: 'stretch',
    gap: Spacing.two,
  },
  title: {
    fontFamily: InterFonts.semiBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.12,
    color: Brand.textPrimary,
  },
  subtitle: {
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textSecondary,
  },
  field: {
    alignSelf: 'stretch',
    gap: FigmaSpace.onePointFive,
  },
  label: {
    fontFamily: InterFonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textPrimary,
  },
  input: {
    alignSelf: 'stretch',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: FigmaSpace.three,
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderDefault,
    borderRadius: Radius.md,
  },
  inputFocused: {
    borderWidth: 1.5,
    borderColor: Brand.borderFocus,
    boxShadow: `0 0 0 3px ${Ring.focus}`,
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: Brand.dangerFg,
    boxShadow: `0 0 0 3px ${Ring.danger}`,
  },
  leadingIcon: {
    width: 18,
    height: 18,
  },
  inputValue: {
    flex: 1,
    padding: 0,
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
  errorText: {
    fontFamily: InterFonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.dangerFg,
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
  banner: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: FigmaSpace.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: FigmaSpace.three,
    backgroundColor: Forgot.infoBg,
    borderWidth: 1,
    borderColor: Forgot.infoBorder,
    borderRadius: Forgot.radiusLg,
  },
  bannerIcon: {
    width: 20,
    height: 20,
  },
  bannerText: {
    flex: 1,
    gap: Spacing.half,
  },
  bannerTitle: {
    fontFamily: InterFonts.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Forgot.infoFg,
  },
  bannerBody: {
    fontFamily: InterFonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textSecondary,
  },
});

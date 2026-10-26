import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
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
import { useSession } from '@/hooks/use-session';

const FIGMA_STATUS_BAR_HEIGHT = 44;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldName = 'identifier' | 'password';
type FormErrors = Partial<Record<FieldName, string>>;

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

function validatePassword(value: string) {
  if (value.length === 0) {
    return 'Enter your password';
  }
  return undefined;
}

export default function LoginScreen() {
  const { signIn } = useSession();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const passwordInputRef = useRef<TextInput>(null);

  function handleIdentifierChange(text: string) {
    setIdentifier(text);
    if (errors.identifier) {
      setErrors((current) => ({ ...current, identifier: undefined }));
    }
  }

  function handlePasswordChange(text: string) {
    setPassword(text);
    if (errors.password) {
      setErrors((current) => ({ ...current, password: undefined }));
    }
  }

  function handleSignIn() {
    Keyboard.dismiss();
    const nextErrors: FormErrors = {
      identifier: validateIdentifier(identifier),
      password: validatePassword(password),
    };
    setErrors(nextErrors);
    if (!nextErrors.identifier && !nextErrors.password) {
      // Local validation only: there is no backend authentication yet.
      signIn();
      router.replace('/home');
    }
  }

  function inputStateStyle(field: FieldName) {
    if (errors[field]) {
      return styles.inputError;
    }
    if (focusedField === field) {
      return styles.inputFocused;
    }
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.brand}>
            <View style={styles.mark}>
              <Image
                source={require('@/assets/images/login/check-square.svg')}
                style={styles.markIcon}
                contentFit="contain"
              />
            </View>
            <Text style={styles.title}>ResolveX Staff</Text>
            <Text style={styles.subtitle}>
              Sign in with the account your branch manager created for you.
            </Text>
          </View>

          <View style={styles.fields}>
            <View style={styles.field}>
              <Text style={styles.label}>Staff ID or email</Text>
              <View style={[styles.input, inputStateStyle('identifier')]}>
                <Image
                  source={require('@/assets/images/login/user.svg')}
                  style={styles.leadingIcon}
                  contentFit="contain"
                />
                <TextInput
                  style={styles.inputValue}
                  value={identifier}
                  onChangeText={handleIdentifierChange}
                  onFocus={() => setFocusedField('identifier')}
                  onBlur={() => setFocusedField(null)}
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  submitBehavior="submit"
                  selectionColor={Brand.bgBrand}
                />
              </View>
              {errors.identifier ? <Text style={styles.errorText}>{errors.identifier}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.input, inputStateStyle('password')]}>
                <Image
                  source={require('@/assets/images/login/lock.svg')}
                  style={styles.leadingIcon}
                  contentFit="contain"
                />
                <TextInput
                  ref={passwordInputRef}
                  style={[styles.inputValue, styles.inputValueMuted]}
                  value={password}
                  onChangeText={handlePasswordChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onSubmitEditing={handleSignIn}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  selectionColor={Brand.bgBrand}
                />
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <View style={styles.options}>
              <Pressable
                style={styles.checkbox}
                onPress={() => setRememberDevice((current) => !current)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: rememberDevice }}>
                <View style={[styles.checkboxBox, rememberDevice ? null : styles.checkboxBoxUnchecked]}>
                  <Image
                    source={require('@/assets/images/login/check.svg')}
                    style={[styles.checkboxIcon, rememberDevice ? null : styles.checkboxIconHidden]}
                    contentFit="contain"
                    tintColor={Brand.textOnBrand}
                  />
                </View>
                <Text style={styles.checkboxLabel}>Remember this device</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/forgot-password')} accessibilityRole="link">
                <Text style={styles.forgot}>Forgot?</Text>
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.button} onPress={handleSignIn} accessibilityRole="button">
            <Text style={styles.buttonText}>Sign in</Text>
            <Image
              source={require('@/assets/images/login/arrow-right.svg')}
              style={styles.buttonIcon}
              contentFit="contain"
            />
          </Pressable>

          <View style={styles.help}>
            <Image
              source={require('@/assets/images/login/help-circle.svg')}
              style={styles.helpIcon}
              contentFit="contain"
            />
            <Text style={styles.helpText}>Need access? Ask your branch manager</Text>
          </View>

          <Text style={styles.version}>v2.4.0 · Colombo Branch</Text>
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
  body: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    gap: Spacing.four,
  },
  brand: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: Spacing.three,
  },
  mark: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    backgroundColor: Brand.bgBrand,
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
  fields: {
    alignSelf: 'stretch',
    gap: Spacing.three,
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
  inputValueMuted: {
    color: Brand.textTertiary,
  },
  errorText: {
    fontFamily: InterFonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.dangerFg,
  },
  options: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: Radius.xs,
    backgroundColor: Brand.bgBrand,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  checkboxBoxUnchecked: {
    backgroundColor: Brand.bgSurface,
    borderWidth: 1.5,
    borderColor: Brand.borderStrong,
  },
  checkboxIcon: {
    width: 14,
    height: 14,
  },
  checkboxIconHidden: {
    opacity: 0,
  },
  checkboxLabel: {
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
  forgot: {
    fontFamily: InterFonts.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textLink,
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
  help: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FigmaSpace.onePointFive,
  },
  helpIcon: {
    width: 14,
    height: 14,
  },
  helpText: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textSecondary,
  },
  version: {
    fontFamily: InterFonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textTertiary,
  },
});

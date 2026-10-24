import { router } from 'expo-router';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { Brand, InterFonts, Radius, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Placeholder logo */}
      <Image
        source={require('../../assets/images/logo-glow.png')}
        style={styles.logo}
        contentFit="contain"
      />
      <Text style={styles.title}>Welcome to ResolveX Staff</Text>
      <Text style={styles.subtitle}>This is a minimal home screen placeholder.</Text>
      {/* Simple navigation back to login for testing */}
      <Text style={styles.link} onPress={() => router.replace('/login')}>
        ← Back to Sign‑in
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.bgCanvas,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: Spacing.three,
    borderRadius: Radius.md,
    backgroundColor: Brand.bgSurface,
  },
  title: {
    fontFamily: InterFonts.semiBold,
    fontSize: 24,
    color: Brand.textPrimary,
    marginBottom: Spacing.two,
  },
  subtitle: {
    fontFamily: InterFonts.regular,
    fontSize: 14,
    color: Brand.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.four,
  },
  link: {
    fontFamily: InterFonts.medium,
    fontSize: 13,
    color: Brand.textLink,
  },
});

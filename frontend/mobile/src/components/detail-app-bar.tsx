import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Radius, Spacing } from '@/constants/theme';

type DetailAppBarProps = {
  title: string;
  subtitle: string;
  onBack: () => void;
};

/**
 * Figma "App Bar / Detail" for pushed screens: back button, subtitle + title, and the overflow
 * icon. The design defines no overflow menu, so the icon is decorative for now.
 */
export function DetailAppBar({ title, subtitle, onBack }: DetailAppBarProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onBack}
        style={styles.iconButton}>
        <Image
          source={require('@/assets/images/forgot-password/arrow-left.svg')}
          style={styles.icon}
          contentFit="contain"
        />
      </Pressable>
      <View style={styles.titles}>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={styles.iconButton}>
        <Image
          source={require('@/assets/images/forgot-password/more-vertical.svg')}
          style={styles.icon}
          contentFit="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    backgroundColor: Brand.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: Brand.borderSubtle,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  titles: {
    flex: 1,
  },
  subtitle: {
    fontFamily: InterFonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textTertiary,
  },
  title: {
    fontFamily: InterFonts.semiBold,
    fontSize: 18,
    lineHeight: 26,
    color: Brand.textPrimary,
  },
});

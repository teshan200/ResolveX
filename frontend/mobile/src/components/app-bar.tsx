import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CountBadge } from '@/components/count-badge';
import { Brand, InterFonts, Radius, Spacing } from '@/constants/theme';
import { useNotifications } from '@/hooks/use-notifications';

type AppBarProps = {
  title: string;
  /** Called when the bell is pressed. */
  onBellPress?: () => void;
};

/** Root app bar from the Figma "App Bar / Root" component, with the live notification badge. */
export function AppBar({ title, onBellPress }: AppBarProps) {
  const { unreadCount } = useNotifications();

  return (
    <View style={styles.container}>
      <View style={styles.mark}>
        <Image
          source={require('@/assets/images/alerts/mark.svg')}
          style={styles.markIcon}
          contentFit="contain"
        />
      </View>
      <View style={styles.titles}>
        <Text style={styles.eyebrow}>ResolveX Staff</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={unreadCount > 0 ? `Alerts, ${unreadCount} unread` : 'Alerts'}
        onPress={onBellPress}
        style={styles.bell}>
        <Image
          source={require('@/assets/images/alerts/bell.svg')}
          style={styles.bellIcon}
          contentFit="contain"
        />
        <CountBadge count={unreadCount} style={styles.bellBadge} />
      </Pressable>
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
  mark: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Brand.bgBrand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markIcon: {
    width: 20,
    height: 20,
  },
  titles: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: InterFonts.semiBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.66,
    textTransform: 'uppercase',
    color: Brand.textBrand,
  },
  title: {
    fontFamily: InterFonts.semiBold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.05,
    color: Brand.textPrimary,
  },
  bell: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    width: 20,
    height: 20,
  },
  bellBadge: {
    position: 'absolute',
    top: 6,
    left: 28,
  },
});

import { Image } from 'expo-image';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CountBadge } from '@/components/count-badge';
import { Brand, FigmaSpace, InterFonts, Spacing } from '@/constants/theme';
import { TAB_ITEMS } from '@/constants/navigation';
import { useNotifications } from '@/hooks/use-notifications';
import { formatBadgeCount } from '@/utils/notifications';

/** Staff bottom navigation, rendered once by the (tabs) layout via the `tabBar` option. */
export function BottomNav({ state, navigation, insets }: BottomTabBarProps) {
  const { unreadCount } = useNotifications();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, FigmaSpace.five) },
      ]}>
      {state.routes.map((route, index) => {
        const item = TAB_ITEMS.find((tab) => tab.name === route.name);
        if (!item) {
          return null;
        }
        const focused = state.index === index;
        const badgeLabel = item.name === 'alerts' ? formatBadgeCount(unreadCount) : null;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            style={styles.item}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={
              badgeLabel ? `${item.label}, ${badgeLabel} unread` : item.label
            }>
            <View style={[styles.indicator, focused && styles.indicatorActive]}>
              <Image
                source={focused ? item.activeIcon : item.icon}
                style={styles.icon}
                contentFit="contain"
              />
              {badgeLabel && <CountBadge count={unreadCount} style={styles.badge} />}
            </View>
            <Text style={[styles.label, focused && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: Brand.bgSurface,
    borderTopWidth: 1,
    borderTopColor: Brand.borderSubtle,
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  item: {
    flex: 1,
    maxWidth: 80,
    minHeight: 52,
    alignItems: 'center',
    gap: Spacing.one,
  },
  indicator: {
    width: 56,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorActive: {
    backgroundColor: Brand.bgBrandMuted,
  },
  icon: {
    width: 22,
    height: 22,
  },
  label: {
    fontFamily: InterFonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textSecondary,
  },
  labelActive: {
    fontFamily: InterFonts.semiBold,
    color: Brand.textBrand,
  },
  badge: {
    position: 'absolute',
    top: 0,
    left: 34,
  },
});

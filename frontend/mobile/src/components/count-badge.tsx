import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { Brand, FigmaSpace, InterFonts } from '@/constants/theme';
import { formatBadgeCount } from '@/utils/notifications';

type CountBadgeProps = {
  count: number;
  style?: StyleProp<ViewStyle>;
};

/** Red count pill. Renders nothing for 0, shows "99+" above 99. */
export function CountBadge({ count, style }: CountBadgeProps) {
  const label = formatBadgeCount(count);
  if (label === null) {
    return null;
  }
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: FigmaSpace.onePointFive,
    borderRadius: 999,
    backgroundColor: Brand.dangerSolid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: InterFonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textOnBrand,
  },
});

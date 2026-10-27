import { Image } from 'expo-image';
import type { ImageSource } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Radius, Spacing } from '@/constants/theme';

const TABS = ['Details', 'Updates', 'Evidence'] as const;

export function DetailTabs() {
  return (
    <View style={tabStyles.track}>
      {TABS.map((tab, index) => {
        const active = index === 0;
        return (
          <View
            key={tab}
            accessibilityState={{ selected: active, disabled: !active }}
            style={[tabStyles.item, active && tabStyles.itemActive]}>
            <Text style={[tabStyles.label, active && tabStyles.labelActive]}>{tab}</Text>
          </View>
        );
      })}
    </View>
  );
}

export type TicketDetailRow = {
  label: string;
  value: string;
  icon: ImageSource;
};

export function TicketDetailsCard({ rows }: { rows: TicketDetailRow[] }) {
  return (
    <View style={styles.card}>
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <Image source={row.icon} style={styles.icon} contentFit="contain" />
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: Spacing.one,
    padding: Spacing.one,
    backgroundColor: Brand.bgMuted,
    borderRadius: Radius.md,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
  },
  itemActive: {
    backgroundColor: Brand.bgSurface,
    boxShadow: '0px 1px 1px 0px rgba(11, 19, 18, 0.04), 0px 1px 1.5px 0px rgba(11, 19, 18, 0.08)',
  },
  label: {
    fontFamily: InterFonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textSecondary,
  },
  labelActive: {
    color: Brand.textPrimary,
  },
});

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderSubtle,
    borderRadius: Radius.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  icon: {
    width: 16,
    height: 16,
  },
  label: {
    flex: 1,
    fontFamily: InterFonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textSecondary,
  },
  value: {
    fontFamily: InterFonts.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textPrimary,
  },
});

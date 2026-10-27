import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FilterChip } from '@/components/tickets/filter-chip';
import { Brand, InterFonts, Radius, Spacing } from '@/constants/theme';
import type { ActiveFilter, ActiveFilterKey } from '@/utils/tickets';

type TicketsToolbarProps = {
  activeFilterCount: number;
  sortLabel: string;
  countText: string;
  /** Both buttons open the same Filter & sort sheet. */
  onOpenSheet: () => void;
};

/** "Filters" and "Sort" buttons with the ticket count on the right. */
export function TicketsToolbar({
  activeFilterCount,
  sortLabel,
  countText,
  onOpenSheet,
}: TicketsToolbarProps) {
  return (
    <View style={styles.row}>
      <ToolbarButton
        icon={require('@/assets/images/tickets/filter.svg')}
        label={activeFilterCount > 0 ? `Filters · ${activeFilterCount}` : 'Filters'}
        onPress={onOpenSheet}
      />
      <ToolbarButton
        icon={require('@/assets/images/tickets/sort.svg')}
        label={`Sort: ${sortLabel}`}
        onPress={onOpenSheet}
      />
      <View style={styles.spacer} />
      <Text style={styles.count}>{countText}</Text>
    </View>
  );
}

function ToolbarButton({
  icon,
  label,
  onPress,
}: {
  icon: number;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.button}>
      <Image source={icon} style={styles.buttonIcon} contentFit="contain" />
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

type ActiveFiltersProps = {
  filters: ActiveFilter[];
  onRemove: (key: ActiveFilterKey) => void;
  onReset: () => void;
};

/** One removable chip per active filter, plus "Reset filters". */
export function ActiveFilters({ filters, onRemove, onReset }: ActiveFiltersProps) {
  return (
    <View style={styles.activeRow}>
      {filters.map((filter) => (
        <FilterChip
          key={filter.key}
          label={`${filter.label} ×`}
          accessibilityLabel={`Remove filter ${filter.label}`}
          selected
          onPress={() => onRemove(filter.key)}
        />
      ))}
      <Pressable accessibilityRole="button" onPress={onReset}>
        <Text style={styles.reset}>Reset filters</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  button: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderDefault,
    borderRadius: Radius.md,
  },
  buttonIcon: {
    width: 16,
    height: 16,
  },
  buttonText: {
    fontFamily: InterFonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textPrimary,
  },
  spacer: {
    flex: 1,
  },
  count: {
    fontFamily: InterFonts.medium,
    fontSize: 12,
    lineHeight: 17,
    color: Brand.textSecondary,
  },
  activeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.two,
  },
  reset: {
    fontFamily: InterFonts.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.bgBrand,
  },
});

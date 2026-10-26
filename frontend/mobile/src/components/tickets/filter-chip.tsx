import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Brand, InterFonts } from '@/constants/theme';

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
};

/** Figma "Filter Chip": outlined when off, filled brand green with a check when on. */
export function FilterChip({ label, selected, onPress, accessibilityLabel }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipSelected : styles.chipOutline]}>
      {selected && (
        <Image
          source={require('@/assets/images/tickets/chip-check.svg')}
          style={styles.check}
          contentFit="contain"
        />
      )}
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  chipOutline: {
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderDefault,
  },
  chipSelected: {
    backgroundColor: Brand.bgBrand,
  },
  check: {
    width: 14,
    height: 14,
  },
  label: {
    fontFamily: InterFonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textPrimary,
  },
  labelSelected: {
    color: Brand.textOnBrand,
  },
});

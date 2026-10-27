import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Radius, Spacing } from '@/constants/theme';

type SegmentedControlProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

/** Figma "Segmented Item" inside a muted track. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.track}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.value)}
            style={[styles.item, active && styles.itemActive]}>
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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

import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Brand, InterFonts, Spacing } from '@/constants/theme';

type ToggleProps = {
  value: boolean;
  label: string;
  /** Called with the new value when the user taps an enabled toggle. */
  onValueChange?: (value: boolean) => void;
  /** Blocks interaction without changing how the toggle looks. */
  locked?: boolean;
  accessibilityHint?: string;
};

/** Figma "Toggle" component (36x20 track, label on the right). */
export function Toggle({ value, label, onValueChange, locked = false, accessibilityHint }: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ checked: value, disabled: locked }}
      disabled={locked}
      onPress={() => onValueChange?.(!value)}
      style={styles.container}>
      <Image
        source={
          value
            ? require('@/assets/images/profile/toggle-on.svg')
            : require('@/assets/images/profile/toggle-off.svg')
        }
        style={styles.track}
        contentFit="contain"
      />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  track: {
    width: 36,
    height: 20,
  },
  label: {
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
});

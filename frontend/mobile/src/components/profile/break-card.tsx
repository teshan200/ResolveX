import { StyleSheet, Text, View } from 'react-native';

import { Toggle } from '@/components/toggle';
import { Brand, InterFonts, Radius, Spacing } from '@/constants/theme';
import type { AvailabilityState } from '@/types/availability';
import { isUnavailabilityToggleOn } from '@/utils/availability';

type BreakCardProps = {
  availability: AvailabilityState;
  onRequestBreak: () => void;
};

const HINTS: Record<AvailabilityState, string> = {
  available: 'Requests to go on break. A decision is needed before you become unavailable.',
  pending: 'Your break request is pending a decision.',
  unavailable: 'Your break request was approved.',
};

/**
 * Turning the toggle ON requests to become unavailable for tickets. Once ON (pending or
 * approved) it is locked: the design defines no way to cancel or end a break from here.
 */
export function BreakCard({ availability, onRequestBreak }: BreakCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Break</Text>
      <Toggle
        label="On Break"
        value={isUnavailabilityToggleOn(availability)}
        locked={availability !== 'available'}
        accessibilityHint={HINTS[availability]}
        onValueChange={(next) => {
          if (next) {
            onRequestBreak();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: Spacing.three,
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderSubtle,
    borderRadius: Radius.xl,
  },
  heading: {
    fontFamily: InterFonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.textPrimary,
  },
});

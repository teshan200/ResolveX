import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Radius } from '@/constants/theme';

type TicketActionBarProps = {
  onClaim?: () => void;
};

export function TicketActionBar({ onClaim }: TicketActionBarProps) {
  return (
    <View style={styles.bar}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !onClaim }}
        disabled={!onClaim}
        onPress={onClaim}
        style={[styles.claim, !onClaim && styles.disabled]}>
        <Image
          source={require('@/assets/images/tickets/action-claim.svg')}
          style={styles.claimIcon}
          contentFit="contain"
        />
        <Text style={styles.claimText}>Claim ticket</Text>
      </Pressable>
      <View style={styles.secondary}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          disabled
          style={[styles.secondaryButton, styles.disabled]}>
          <Image
            source={require('@/assets/images/tickets/action-note.svg')}
            style={styles.secondaryIcon}
            contentFit="contain"
          />
          <Text style={styles.secondaryText}>Add note</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          disabled
          style={[styles.secondaryButton, styles.disabled]}>
          <Image
            source={require('@/assets/images/tickets/action-history.svg')}
            style={styles.secondaryIcon}
            contentFit="contain"
          />
          <Text style={styles.secondaryText}>History</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Brand.bgSurface,
    borderTopWidth: 1,
    borderTopColor: Brand.borderSubtle,
  },
  disabled: {
    opacity: 0.5,
  },
  claim: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    backgroundColor: Brand.bgBrand,
    borderRadius: Radius.md,
  },
  claimIcon: {
    width: 20,
    height: 20,
  },
  claimText: {
    fontFamily: InterFonts.medium,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.textOnBrand,
  },
  secondary: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderDefault,
    borderRadius: Radius.md,
  },
  secondaryIcon: {
    width: 18,
    height: 18,
  },
  secondaryText: {
    fontFamily: InterFonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
});

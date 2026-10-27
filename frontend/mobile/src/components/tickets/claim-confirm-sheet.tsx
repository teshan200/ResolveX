import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand, InterFonts, Radius, Spacing } from '@/constants/theme';

const FIGMA_SCRIM = 'rgba(11, 19, 18, 0.48)';

type ClaimSheetFrameProps = {
  onClose: () => void;
  children: ReactNode;
};

export function ClaimSheetFrame({ onClose, children }: ClaimSheetFrameProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.overlay}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        onPress={onClose}
        style={styles.scrim}
      />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, Spacing.five) }]}>
        <View style={styles.handle} />
        {children}
      </View>
    </View>
  );
}

type ClaimConfirmSheetProps = {
  ticketNumber: string;
  ackSlaText: string;
  saving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ClaimConfirmSheet({
  ticketNumber,
  ackSlaText,
  saving,
  onConfirm,
  onCancel,
}: ClaimConfirmSheetProps) {
  return (
    <ClaimSheetFrame onClose={onCancel}>
      <Text style={styles.title}>Claim ticket {ticketNumber}?</Text>
      <Text style={styles.body}>
        You’ll own this ticket and the {ackSlaText} stops. Your supervisor will be notified.
      </Text>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: saving }}
          disabled={saving}
          onPress={onConfirm}
          style={[styles.button, styles.primary, saving && styles.disabled]}>
          <Text style={styles.primaryText}>Claim ticket</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: saving }}
          disabled={saving}
          onPress={onCancel}
          style={[styles.button, saving && styles.disabled]}>
          <Text style={styles.cancelText}>Not now</Text>
        </Pressable>
      </View>
    </ClaimSheetFrame>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: FIGMA_SCRIM,
  },
  sheet: {
    alignItems: 'stretch',
    gap: Spacing.three,
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    backgroundColor: Brand.bgSurface,
    borderTopLeftRadius: Radius.xl2,
    borderTopRightRadius: Radius.xl2,
    boxShadow: '0px 24px 24px 0px rgba(11, 19, 18, 0.16)',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Brand.borderStrong,
  },
  title: {
    fontFamily: InterFonts.semiBold,
    fontSize: 18,
    lineHeight: 26,
    color: Brand.textPrimary,
  },
  body: {
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textSecondary,
  },
  actions: {
    gap: Spacing.two,
  },
  button: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: Radius.md,
  },
  primary: {
    backgroundColor: Brand.bgBrand,
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    fontFamily: InterFonts.medium,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.textOnBrand,
  },
  cancelText: {
    fontFamily: InterFonts.medium,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.textSecondary,
  },
});

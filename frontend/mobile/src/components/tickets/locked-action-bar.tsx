import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Radius } from '@/constants/theme';

/** Figma "Action bar" for an escalated ticket: Resolve, Add update and Evidence are all locked. */
export function LockedActionBar() {
  return (
    <View style={styles.bar}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: true }}
        disabled
        style={styles.resolve}>
        <Image
          source={require('@/assets/images/tickets/action-resolve.svg')}
          style={styles.resolveIcon}
          contentFit="contain"
        />
        <Text style={styles.resolveText}>Resolve locked: ticket escalated</Text>
      </Pressable>
      <View style={styles.secondary}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          disabled
          style={styles.secondaryButton}>
          <Image
            source={require('@/assets/images/tickets/action-add-update.svg')}
            style={styles.secondaryIcon}
            contentFit="contain"
          />
          <Text style={styles.secondaryText}>Add update</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          disabled
          style={styles.secondaryButton}>
          <Image
            source={require('@/assets/images/tickets/action-evidence.svg')}
            style={styles.secondaryIcon}
            contentFit="contain"
          />
          <Text style={styles.secondaryText}>Evidence</Text>
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
  resolve: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    backgroundColor: Brand.bgMuted,
    borderRadius: Radius.md,
  },
  resolveIcon: {
    width: 20,
    height: 20,
  },
  resolveText: {
    fontFamily: InterFonts.medium,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.textDisabled,
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
    backgroundColor: Brand.bgMuted,
    borderWidth: 1,
    borderColor: Brand.borderSubtle,
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
    color: Brand.textDisabled,
  },
});

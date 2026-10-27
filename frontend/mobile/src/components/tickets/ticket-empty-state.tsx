import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Radius, Spacing } from '@/constants/theme';

type TicketEmptyStateProps = {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
};

/** Figma "Empty State / Page": inbox illustration, title, message and one action. */
export function TicketEmptyState({ title, message, actionLabel, onAction }: TicketEmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        <Image
          source={require('@/assets/images/tickets/inbox.svg')}
          style={styles.illustrationIcon}
          contentFit="contain"
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable accessibilityRole="button" onPress={onAction} style={styles.action}>
        <Text style={styles.actionText}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 48,
  },
  illustration: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: Brand.bgBrandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationIcon: {
    width: 32,
    height: 32,
  },
  title: {
    fontFamily: InterFonts.semiBold,
    fontSize: 18,
    lineHeight: 26,
    color: Brand.textPrimary,
  },
  message: {
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textSecondary,
    textAlign: 'center',
  },
  action: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    backgroundColor: Brand.bgBrandSubtle,
    borderRadius: Radius.md,
  },
  actionText: {
    fontFamily: InterFonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textBrand,
  },
});

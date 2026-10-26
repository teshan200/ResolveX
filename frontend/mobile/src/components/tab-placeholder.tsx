import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Spacing } from '@/constants/theme';

const FIGMA_STATUS_BAR_HEIGHT = 44;

type TabPlaceholderProps = {
  title: string;
  message: string;
  children?: ReactNode;
};

/** Temporary body for tab screens whose Figma layout has not been built yet. */
export function TabPlaceholder({ title, message, children }: TabPlaceholderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.bgCanvas,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: FIGMA_STATUS_BAR_HEIGHT,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    fontFamily: InterFonts.semiBold,
    fontSize: 24,
    lineHeight: 32,
    color: Brand.textPrimary,
  },
  message: {
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textSecondary,
    textAlign: 'center',
  },
});

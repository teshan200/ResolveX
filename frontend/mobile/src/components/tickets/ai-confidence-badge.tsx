import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Spacing, TicketColors } from '@/constants/theme';

export function AiConfidenceBadge({ confidence }: { confidence: number }) {
  return (
    <View style={styles.badge}>
      <Image
        source={require('@/assets/images/tickets/ai-sparkles.svg')}
        style={styles.icon}
        contentFit="contain"
      />
      <Text style={styles.label}>AI</Text>
      <Image
        source={require('@/assets/images/tickets/ai-dot.svg')}
        style={styles.dot}
        contentFit="contain"
      />
      <Text style={styles.value}>{confidence}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    backgroundColor: Brand.bgBrandSubtle,
    borderWidth: 1,
    borderColor: Brand.borderSubtle,
    borderRadius: 999,
  },
  icon: {
    width: 12,
    height: 12,
  },
  dot: {
    width: 6,
    height: 6,
  },
  label: {
    fontFamily: InterFonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textBrand,
  },
  value: {
    fontFamily: InterFonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    color: TicketColors.successFg,
  },
});

import { Image } from 'expo-image';
import type { ImageSource } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Radius } from '@/constants/theme';

type StatCardProps = {
  icon: ImageSource;
  value: number;
  label: string;
  backgroundColor: string;
  valueColor: string;
};

export function StatCard({ icon, value, label, backgroundColor, valueColor }: StatCardProps) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={[styles.card, { backgroundColor }]}>
      <Image source={icon} style={styles.icon} contentFit="contain" />
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Brand.borderSubtle,
    borderRadius: Radius.lg,
  },
  icon: {
    width: 18,
    height: 18,
  },
  value: {
    fontFamily: InterFonts.semiBold,
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: -0.3,
  },
  label: {
    fontFamily: InterFonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textSecondary,
  },
});

import { Image } from 'expo-image';
import type { ImageSource } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Radius, Spacing } from '@/constants/theme';

type SettingsCardProps = {
  onChangePassword?: () => void;
  onHelpAndSupport?: () => void;
  onLogOut: () => void;
};

export function SettingsCard({ onChangePassword, onHelpAndSupport, onLogOut }: SettingsCardProps) {
  return (
    <View style={styles.card}>
      <SettingsRow
        icon={require('@/assets/images/profile/key.svg')}
        label="Change password"
        showChevron
        onPress={onChangePassword}
      />
      <SettingsRow
        icon={require('@/assets/images/profile/help-circle.svg')}
        label="Help & support"
        showChevron
        onPress={onHelpAndSupport}
      />
      <SettingsRow
        icon={require('@/assets/images/profile/log-out.svg')}
        label="Log out"
        destructive
        onPress={onLogOut}
      />
    </View>
  );
}

function SettingsRow({
  icon,
  label,
  showChevron = false,
  destructive = false,
  onPress,
}: {
  icon: ImageSource;
  label: string;
  showChevron?: boolean;
  destructive?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.row}>
      <Image source={icon} style={styles.icon} contentFit="contain" />
      <Text style={[styles.label, destructive && styles.labelDestructive]}>{label}</Text>
      {showChevron && (
        <Image
          source={require('@/assets/images/profile/chevron-right.svg')}
          style={styles.chevron}
          contentFit="contain"
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.one,
    padding: Spacing.three,
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderSubtle,
    borderRadius: Radius.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  icon: {
    width: 18,
    height: 18,
  },
  label: {
    flex: 1,
    fontFamily: InterFonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
  labelDestructive: {
    color: Brand.dangerFg,
  },
  chevron: {
    width: 16,
    height: 16,
  },
});

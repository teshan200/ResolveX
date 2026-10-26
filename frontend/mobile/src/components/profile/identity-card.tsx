import { StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Radius, Spacing } from '@/constants/theme';
import type { StaffDetails } from '@/types/profile';
import { getInitials } from '@/utils/profile';

type IdentityCardProps = {
  staff: StaffDetails;
  /** Value of the "Shift Status" field: the shift time, "Pending" or "On Break". */
  shiftStatus: string;
};

export function IdentityCard({ staff, shiftStatus }: IdentityCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(staff.fullName)}</Text>
        </View>
        <View style={styles.name}>
          <Text style={styles.fullName}>{staff.fullName}</Text>
          <Text style={styles.role}>
            {staff.designation} · Level {staff.level}
          </Text>
          <Text style={styles.branch}>{staff.branchName}</Text>
        </View>
      </View>
      <View style={styles.infoGrid}>
        <InfoItem label="Staff ID" value={staff.staffId} />
        <InfoItem label="Designation" value={staff.designation} />
        <InfoItem label="Shift Status" value={shiftStatus} />
      </View>
    </View>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: Brand.bgBrandMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: InterFonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.textBrand,
  },
  name: {
    flex: 1,
    gap: 2,
  },
  fullName: {
    fontFamily: InterFonts.semiBold,
    fontSize: 18,
    lineHeight: 26,
    color: Brand.textPrimary,
  },
  role: {
    fontFamily: InterFonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textBrand,
  },
  branch: {
    fontFamily: InterFonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textTertiary,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
    backgroundColor: Brand.bgCanvas,
    borderRadius: Radius.lg,
  },
  infoItem: {
    width: '47%',
    flexGrow: 1,
    gap: 2,
  },
  infoLabel: {
    fontFamily: InterFonts.semiBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.66,
    textTransform: 'uppercase',
    color: Brand.textTertiary,
  },
  infoValue: {
    fontFamily: InterFonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
});

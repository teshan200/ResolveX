import { Image } from 'expo-image';
import type { ImageSource } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PriorityBadge, SlaTimer, StatusBadge } from '@/components/tickets/ticket-badges';
import { Brand, InterFonts, MonoFonts, Radius, Spacing, TicketColors } from '@/constants/theme';
import type { TicketStatus, TicketSummary } from '@/types/ticket';

type TicketCardProps = {
  ticket: TicketSummary;
  /** Called when the card or its action button is pressed. */
  onPress?: (ticket: TicketSummary) => void;
};

type TicketAction = {
  label: string;
  variant: 'primary' | 'subtle' | 'disabled';
  chevron: ImageSource;
};

const CHEVRON_GREEN = require('@/assets/images/home/chevron-right-green.svg');
const CHEVRON_WHITE = require('@/assets/images/home/chevron-right-white.svg');

// The action button follows the ticket's status. "Claim" uses the green chevron exactly as the
// Figma instance does (it sits on the green button, so it is not visible there).
// "Review" for in-progress tickets comes from the previous design; the latest frame does not show one.
const ACTIONS: Record<TicketStatus, TicketAction> = {
  assigned: { label: 'Claim', variant: 'primary', chevron: CHEVRON_GREEN },
  claimed: { label: 'Update', variant: 'subtle', chevron: CHEVRON_GREEN },
  inProgress: { label: 'Review', variant: 'subtle', chevron: CHEVRON_GREEN },
  escalated: { label: 'View only', variant: 'disabled', chevron: CHEVRON_WHITE },
};

const ACTION_STYLES = {
  primary: { container: 'actionPrimary', text: 'actionTextPrimary' },
  subtle: { container: 'actionSubtle', text: 'actionTextSubtle' },
  disabled: { container: 'actionDisabled', text: 'actionTextDisabled' },
} as const;

export function TicketCard({ ticket, onPress }: TicketCardProps) {
  const action = ACTIONS[ticket.status];
  const actionStyle = ACTION_STYLES[action.variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${ticket.ticketNumber} ${ticket.title}, ${ticket.priority} priority`}
      onPress={() => onPress?.(ticket)}
      style={styles.card}>
      <View style={[styles.stripe, { backgroundColor: TicketColors.priority[ticket.priority].solid }]} />
      <View style={styles.body}>
        <View style={styles.meta}>
          <View style={styles.idAndPriority}>
            <Text style={styles.ticketNumber}>{ticket.ticketNumber}</Text>
            <PriorityBadge priority={ticket.priority} />
          </View>
          <SlaTimer state={ticket.sla.state} label={ticket.sla.label} />
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>{ticket.title}</Text>
          <View style={styles.location}>
            <Image
              source={require('@/assets/images/home/store.svg')}
              style={styles.locationIcon}
              contentFit="contain"
            />
            <Text style={styles.locationText}>{ticket.branchName}</Text>
            <Text style={styles.locationDot}>·</Text>
            <Image
              source={require('@/assets/images/home/utensils.svg')}
              style={styles.locationIcon}
              contentFit="contain"
            />
            <Text style={styles.locationText}>{ticket.servicePoint}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <StatusBadge status={ticket.status} />
          <View style={[styles.action, styles[actionStyle.container]]}>
            <Text style={[styles.actionText, styles[actionStyle.text]]}>{action.label}</Text>
            <Image source={action.chevron} style={styles.actionIcon} contentFit="contain" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    overflow: 'hidden',
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderDefault,
    borderRadius: Radius.lg,
    boxShadow: '0px 1px 2px 0px rgba(11, 19, 18, 0.05)',
  },
  stripe: {
    width: 4,
  },
  body: {
    flex: 1,
    gap: 12,
    padding: Spacing.three,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idAndPriority: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  ticketNumber: {
    fontFamily: MonoFonts.medium,
    fontSize: 13,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
  titleBlock: {
    gap: Spacing.one,
  },
  title: {
    fontFamily: InterFonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.textPrimary,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationIcon: {
    width: 14,
    height: 14,
  },
  locationText: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textSecondary,
  },
  locationDot: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textTertiary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  action: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
  },
  actionPrimary: {
    backgroundColor: Brand.bgBrand,
  },
  actionSubtle: {
    backgroundColor: Brand.bgBrandSubtle,
  },
  actionDisabled: {
    backgroundColor: Brand.bgMuted,
    borderWidth: 1,
    borderColor: Brand.borderSubtle,
  },
  actionText: {
    fontFamily: InterFonts.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  actionTextPrimary: {
    color: Brand.textOnBrand,
  },
  actionTextSubtle: {
    color: Brand.textBrand,
  },
  actionTextDisabled: {
    color: Brand.textDisabled,
  },
  actionIcon: {
    width: 16,
    height: 16,
  },
});

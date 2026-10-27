import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Radius, TicketColors } from '@/constants/theme';
import type { TicketEscalation } from '@/types/ticket';
import { formatMinutesAgo } from '@/utils/ticket-timeline';

/** Figma "Banner" on the "Ticket — Escalated" screen. */
export function EscalationBanner({ escalation }: { escalation: TicketEscalation }) {
  return (
    <View style={styles.banner}>
      <Image
        source={require('@/assets/images/tickets/banner-escalated.svg')}
        style={styles.icon}
        contentFit="contain"
      />
      <View style={styles.text}>
        <Text style={styles.title}>
          Escalated to {escalation.escalatedTo} ({escalation.escalatedToRole})
        </Text>
        <Text style={styles.message}>
          {escalation.reason} {formatMinutesAgo(escalation.escalatedAt)}, so this ticket was
          escalated. It stays visible to you, but claiming, updating and resolving are locked.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: TicketColors.status.escalated.bg,
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: Radius.lg,
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: InterFonts.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.dangerFg,
  },
  message: {
    fontFamily: InterFonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textSecondary,
  },
});

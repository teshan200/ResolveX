import { StyleSheet, Text, View } from 'react-native';

import { PriorityBadge, SlaTimer } from '@/components/tickets/ticket-badges';
import { Brand, InterFonts, MonoFonts, Radius, Spacing, TicketColors } from '@/constants/theme';
import type { TicketSummary } from '@/types/ticket';

/** Compact summary of the ticket being worked on (Figma "Ticket context"). */
export function TicketContextCard({ ticket }: { ticket: TicketSummary }) {
  return (
    <View style={styles.card}>
      <View style={[styles.stripe, { backgroundColor: TicketColors.priority[ticket.priority].solid }]} />
      <View style={styles.body}>
        <View style={styles.top}>
          <View style={styles.idAndPriority}>
            <Text style={styles.ticketNumber}>{ticket.ticketNumber}</Text>
            <PriorityBadge priority={ticket.priority} />
          </View>
          <SlaTimer state={ticket.sla.state} label={ticket.sla.label} />
        </View>
        <Text style={styles.title}>
          {ticket.title} · {ticket.servicePoint}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    overflow: 'hidden',
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderSubtle,
    borderRadius: Radius.lg,
  },
  stripe: {
    width: 4,
  },
  body: {
    flex: 1,
    gap: Spacing.two,
    padding: 12,
  },
  top: {
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
  title: {
    fontFamily: InterFonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
});

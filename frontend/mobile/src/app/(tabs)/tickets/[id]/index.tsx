import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DetailAppBar } from '@/components/detail-app-bar';
import { EscalationBanner } from '@/components/tickets/escalation-banner';
import { LockedActionBar } from '@/components/tickets/locked-action-bar';
import { PriorityBadge, SlaTimer, StatusBadge } from '@/components/tickets/ticket-badges';
import { TicketTimeline } from '@/components/tickets/ticket-timeline';
import { Brand, InterFonts, Radius, Spacing } from '@/constants/theme';
import { useTicketDetail } from '@/hooks/use-ticket-detail';
import type { TicketDetail } from '@/types/ticket';

const FIGMA_STATUS_BAR_HEIGHT = 44;

function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/tickets');
  }
}

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { status, ticket } = useTicketDetail(id);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <DetailAppBar
        title={ticket ? `Ticket ${ticket.ticketNumber}` : 'Ticket'}
        subtitle={ticket ? `${ticket.branchName} · ${ticket.servicePoint}` : ''}
        onBack={goBack}
      />
      {status === 'ready' && ticket ? (
        <TicketDetailContent ticket={ticket} />
      ) : status === 'loading' ? (
        <Message text="Loading ticket…" />
      ) : status === 'notFound' ? (
        <Message text="We couldn’t find this ticket." onBack={goBack} />
      ) : (
        <Message text="Couldn’t load this ticket." onBack={goBack} />
      )}
    </View>
  );
}

function TicketDetailContent({ ticket }: { ticket: TicketDetail }) {
  const isEscalated = ticket.status === 'escalated';

  return (
    <>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.badges}>
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </View>

        {isEscalated && ticket.escalation && <EscalationBanner escalation={ticket.escalation} />}

        <View style={styles.complaint}>
          <View style={styles.complaintTitleRow}>
            <Text style={styles.complaintTitle}>{ticket.title}</Text>
            <SlaTimer state={ticket.sla.state} label={ticket.sla.label} />
          </View>
          {ticket.description !== '' && <Text style={styles.description}>{ticket.description}</Text>}
        </View>

        {ticket.timeline.length > 0 && <TicketTimeline events={ticket.timeline} />}
      </ScrollView>
      {isEscalated && <LockedActionBar />}
    </>
  );
}

function Message({ text, onBack }: { text: string; onBack?: () => void }) {
  return (
    <View style={styles.message}>
      <Text style={styles.messageText}>{text}</Text>
      {onBack && (
        <Pressable accessibilityRole="button" onPress={onBack}>
          <Text style={styles.messageAction}>Go back</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.bgCanvas,
    paddingTop: FIGMA_STATUS_BAR_HEIGHT,
  },
  content: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  complaint: {
    gap: Spacing.two,
    padding: Spacing.three,
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderSubtle,
    borderRadius: Radius.xl,
  },
  complaintTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  complaintTitle: {
    flexShrink: 1,
    fontFamily: InterFonts.semiBold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.05,
    color: Brand.textPrimary,
  },
  description: {
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textSecondary,
  },
  message: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
    paddingTop: Spacing.five,
  },
  messageText: {
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textSecondary,
    textAlign: 'center',
  },
  messageAction: {
    fontFamily: InterFonts.medium,
    fontSize: 13,
    color: Brand.textLink,
  },
});

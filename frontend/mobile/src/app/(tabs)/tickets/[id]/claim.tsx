import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { ClaimConfirmSheet, ClaimSheetFrame } from '@/components/tickets/claim-confirm-sheet';
import { Brand, InterFonts, Spacing } from '@/constants/theme';
import { useTicketDetail } from '@/hooks/use-ticket-detail';
import { ticketsRepository } from '@/services/tickets';
import { canClaimTicket, formatAckSla } from '@/utils/ticket-claim';

function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/tickets');
  }
}

export default function ClaimTicketScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { status, ticket } = useTicketDetail(id);
  const [saving, setSaving] = useState(false);
  const inFlight = useRef(false);

  async function handleConfirm() {
    if (!ticket || inFlight.current) {
      return;
    }
    inFlight.current = true;
    setSaving(true);
    try {
      await ticketsRepository.claimTicket(ticket.id);
      // Replaces the sheet, so Back from Update progress returns to the screen the claim started on.
      router.replace({ pathname: '/tickets/[id]/update-progress', params: { id: ticket.id } });
    } catch {
      inFlight.current = false;
      setSaving(false);
      Alert.alert('Ticket not claimed', 'We couldn’t claim this ticket. Please try again.');
    }
  }

  if (status === 'ready' && ticket && canClaimTicket(ticket)) {
    return (
      <ClaimConfirmSheet
        ticketNumber={ticket.ticketNumber}
        ackSlaText={formatAckSla(ticket.slaDetail)}
        saving={saving}
        onConfirm={handleConfirm}
        onCancel={goBack}
      />
    );
  }

  return (
    <ClaimSheetFrame onClose={goBack}>
      {status === 'loading' ? (
        <Message text="Loading ticket…" />
      ) : status === 'notFound' ? (
        <Message text="We couldn’t find this ticket." onBack={goBack} />
      ) : status === 'error' ? (
        <Message text="Couldn’t load this ticket." onBack={goBack} />
      ) : (
        <Message text="This ticket can’t be claimed right now." onBack={goBack} />
      )}
    </ClaimSheetFrame>
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
  message: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
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

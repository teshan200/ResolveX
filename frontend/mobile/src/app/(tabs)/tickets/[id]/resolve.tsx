import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { DetailAppBar } from '@/components/detail-app-bar';
import { ResolveForm } from '@/components/tickets/resolve-form';
import { Brand, InterFonts, Spacing } from '@/constants/theme';
import { useTicket } from '@/hooks/use-ticket';
import { ticketsRepository } from '@/services/tickets';
import { canUpdateProgress } from '@/utils/ticket-progress';

const FIGMA_STATUS_BAR_HEIGHT = 44;

function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/tickets');
  }
}

// Figma prototype flow: Resolve → Tickets. Replaces this screen so Back doesn't return to the form.
function goToTickets() {
  router.replace('/tickets');
}

export default function ResolveTicketScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { status, ticket } = useTicket(id);
  const [saving, setSaving] = useState(false);
  const submitting = useRef(false);

  async function submit(action: () => Promise<void>, failure: { title: string; message: string }) {
    if (!ticket || submitting.current) {
      return;
    }
    submitting.current = true;
    setSaving(true);
    try {
      await action();
      goToTickets();
    } catch {
      submitting.current = false;
      setSaving(false);
      Alert.alert(failure.title, failure.message);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <DetailAppBar
        title="Resolve ticket"
        subtitle={ticket ? `${ticket.ticketNumber} · ${ticket.title}` : 'Ticket'}
        onBack={goBack}
      />
      {status === 'ready' && ticket ? (
        canUpdateProgress(ticket) ? (
          <ResolveForm
            ticket={ticket}
            saving={saving}
            onDiscard={goBack}
            onResolve={(resolution) =>
              submit(() => ticketsRepository.resolveTicket(ticket.id, resolution), {
                title: 'Resolution not submitted',
                message: 'We couldn’t submit your resolution. Please try again.',
              })
            }
            onEscalate={(request) =>
              submit(() => ticketsRepository.escalateTicket(ticket.id, request), {
                title: 'Ticket not escalated',
                message: 'We couldn’t escalate this ticket. Please try again.',
              })
            }
          />
        ) : (
          <Message text="This ticket can’t be resolved right now." onBack={goBack} />
        )
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

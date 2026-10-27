import { Image } from 'expo-image';
import type { ImageSource } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Radius, TicketColors } from '@/constants/theme';
import type { TicketTimelineEvent, TicketTimelineEventKind } from '@/types/ticket';
import { formatEventTime } from '@/utils/ticket-timeline';

const EVENT: Record<TicketTimelineEventKind, { title: string; icon: ImageSource; bg: string }> = {
  claimed: {
    title: 'Ticket claimed',
    icon: require('@/assets/images/tickets/timeline-claimed.svg'),
    bg: TicketColors.status.claimed.bg,
  },
  progress: {
    title: 'Progress update',
    icon: require('@/assets/images/tickets/timeline-progress.svg'),
    bg: TicketColors.status.inProgress.bg,
  },
  escalated: {
    title: 'Escalated to Supervisor',
    icon: require('@/assets/images/tickets/timeline-escalated.svg'),
    bg: TicketColors.status.escalated.bg,
  },
};

/** Figma "Timeline" card: the ticket's history, newest first. */
export function TicketTimeline({ events }: { events: TicketTimelineEvent[] }) {
  return (
    <View style={styles.card}>
      {events.map((event, index) => {
        const { title, icon, bg } = EVENT[event.kind];
        return (
          <View key={event.id} style={styles.event}>
            <View style={styles.rail}>
              <View style={[styles.node, { backgroundColor: bg }]}>
                <Image source={icon} style={styles.nodeIcon} contentFit="contain" />
              </View>
              {index < events.length - 1 && <View style={styles.connector} />}
            </View>
            <View style={styles.body}>
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.time}>{formatEventTime(event.at)}</Text>
              </View>
              <Text style={styles.actor}>by {event.actor}</Text>
              {event.detail ? <Text style={styles.detail}>{event.detail}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: Brand.bgSurface,
    borderWidth: 1,
    borderColor: Brand.borderSubtle,
    borderRadius: Radius.xl,
  },
  event: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  rail: {
    alignItems: 'center',
  },
  node: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeIcon: {
    width: 16,
    height: 16,
  },
  connector: {
    flex: 1,
    width: 2,
    backgroundColor: Brand.borderDefault,
  },
  body: {
    flex: 1,
    gap: 4,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flexShrink: 1,
    fontFamily: InterFonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },
  time: {
    fontFamily: InterFonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textTertiary,
  },
  actor: {
    fontFamily: InterFonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textSecondary,
  },
  detail: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textSecondary,
  },
});

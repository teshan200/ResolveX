import { Image } from 'expo-image';
import type { ImageSource } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { InterFonts, MonoFonts, Radius, Spacing, TicketColors } from '@/constants/theme';
import type { SlaState, TicketPriority, TicketStatus } from '@/types/ticket';

const PRIORITY: Record<TicketPriority, { label: string; icon: ImageSource }> = {
  critical: { label: 'CRITICAL', icon: require('@/assets/images/home/priority-critical.svg') },
  high: { label: 'HIGH', icon: require('@/assets/images/home/priority-high.svg') },
  medium: { label: 'MEDIUM', icon: require('@/assets/images/home/priority-medium.svg') },
};

const STATUS: Record<TicketStatus, { label: string; icon: ImageSource }> = {
  assigned: { label: 'Assigned', icon: require('@/assets/images/home/status-assigned.svg') },
  claimed: { label: 'Claimed', icon: require('@/assets/images/home/status-claimed.svg') },
  inProgress: { label: 'In Progress', icon: require('@/assets/images/home/status-in-progress.svg') },
  escalated: { label: 'Escalated', icon: require('@/assets/images/home/status-escalated.svg') },
};

const SLA_ICON: Record<SlaState, ImageSource> = {
  onTrack: require('@/assets/images/home/sla-on-track.svg'),
  warning: require('@/assets/images/home/sla-warning.svg'),
  breached: require('@/assets/images/home/sla-breached.svg'),
};

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const { label, icon } = PRIORITY[priority];
  const colors = TicketColors.priority[priority];
  return (
    <View style={[styles.priority, { backgroundColor: colors.bg }]}>
      <Image source={icon} style={styles.priorityIcon} contentFit="contain" />
      <Text style={[styles.priorityText, { color: colors.fg }]}>{label}</Text>
    </View>
  );
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  const { label, icon } = STATUS[status];
  const colors = TicketColors.status[status];
  return (
    <View style={[styles.status, { backgroundColor: colors.bg }]}>
      <Image source={icon} style={styles.statusIcon} contentFit="contain" />
      <Text style={[styles.statusText, { color: colors.fg }]}>{label}</Text>
    </View>
  );
}

export function SlaTimer({ state, label }: { state: SlaState; label: string }) {
  const colors = TicketColors.sla[state];
  return (
    <View style={[styles.sla, { backgroundColor: colors.bg }]}>
      <Image source={SLA_ICON[state]} style={styles.statusIcon} contentFit="contain" />
      <Text style={[styles.slaText, { color: colors.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  priority: {
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.xs,
  },
  priorityIcon: {
    width: 12,
    height: 12,
  },
  priorityText: {
    fontFamily: InterFonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
  },
  status: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: 999,
  },
  statusIcon: {
    width: 14,
    height: 14,
  },
  statusText: {
    fontFamily: InterFonts.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  sla: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.two,
    borderRadius: 999,
  },
  slaText: {
    fontFamily: MonoFonts.medium,
    fontSize: 12,
    lineHeight: 16,
  },
});

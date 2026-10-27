import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Radius, TicketColors } from '@/constants/theme';
import type { SlaState, TicketSlaDetail } from '@/types/ticket';

const WARNING_BORDER = '#fde68a';
const WARNING_SOLID = '#d97706';

function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

type SlaCardProps = {
  state: SlaState;
  detail: TicketSlaDetail;
};

export function SlaCard({ state, detail }: SlaCardProps) {
  const colors = TicketColors.sla[state];
  const isWarning = state === 'warning';
  const progress = Math.min(1, Math.max(0, detail.elapsedSeconds / detail.totalSeconds));

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.bg,
          borderColor: isWarning ? WARNING_BORDER : Brand.borderSubtle,
        },
      ]}>
      <View style={styles.top}>
        <View style={styles.label}>
          <Image
            source={require('@/assets/images/tickets/detail-timer.svg')}
            style={styles.icon}
            contentFit="contain"
          />
          <Text style={[styles.labelText, { color: colors.fg }]}>{detail.phase}</Text>
        </View>
        <Text style={[styles.countdown, { color: colors.fg }]}>
          {formatClock(detail.totalSeconds - detail.elapsedSeconds)}
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${progress * 100}%`, backgroundColor: isWarning ? WARNING_SOLID : colors.fg },
          ]}
        />
      </View>
      <View style={styles.meta}>
        <Text style={styles.metaText}>
          Elapsed {formatClock(detail.elapsedSeconds)} of {formatClock(detail.totalSeconds)}
        </Text>
        <Text style={styles.metaText}>Then escalates to {detail.escalatesTo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderRadius: Radius.xl,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 18,
    height: 18,
  },
  labelText: {
    fontFamily: InterFonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  countdown: {
    fontFamily: InterFonts.semiBold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.05,
  },
  track: {
    height: 8,
    overflow: 'hidden',
    backgroundColor: Brand.bgMuted,
    borderRadius: 999,
  },
  fill: {
    height: 8,
    borderRadius: 999,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  metaText: {
    flexShrink: 1,
    fontFamily: InterFonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textSecondary,
  },
});

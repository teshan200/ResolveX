import type { TicketSlaDetail, TicketSummary } from '@/types/ticket';

export const DEFAULT_ACK_SLA_TEXT = '15-minute acknowledgement SLA';

export function canClaimTicket(ticket: TicketSummary): boolean {
  return ticket.status === 'assigned' && ticket.sla.state !== 'breached';
}

/**
 * `totalSeconds` is the full length of the SLA phase being timed (the countdown is
 * `totalSeconds - elapsedSeconds`), so it is only the acknowledgement duration while that phase
 * is the acknowledgement one.
 */
export function formatAckSla(slaDetail?: TicketSlaDetail): string {
  if (!slaDetail || !/^acknowledge/i.test(slaDetail.phase)) {
    return DEFAULT_ACK_SLA_TEXT;
  }
  const { totalSeconds } = slaDetail;
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0 || totalSeconds % 60 !== 0) {
    return DEFAULT_ACK_SLA_TEXT;
  }
  return `${totalSeconds / 60}-minute acknowledgement SLA`;
}

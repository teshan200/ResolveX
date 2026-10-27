import type { ProgressStatus, TicketSummary } from '@/types/ticket';

export const NOTE_MAX_LENGTH = 250;

export const PROGRESS_STATUS_OPTIONS: { value: ProgressStatus; label: string }[] = [
  { value: 'claimed', label: 'Claimed' },
  { value: 'inProgress', label: 'In Progress' },
];

/** Canned phrases from the design; tapping one adds it to the note. */
export const QUICK_SNIPPETS = [
  'Spoke with guest',
  'Kitchen re-firing',
  'Manager informed',
  'Item replaced',
] as const;

/**
 * Staff can only update progress on tickets they have claimed. Escalated and SLA-breached tickets
 * are view only, and assigned tickets must be claimed first.
 */
export function canUpdateProgress(ticket: TicketSummary): boolean {
  return (
    (ticket.status === 'claimed' || ticket.status === 'inProgress') && ticket.sla.state !== 'breached'
  );
}

/** Adds a snippet to the end of the note, as a new sentence, without exceeding the limit. */
export function appendSnippet(note: string, snippet: string, maxLength = NOTE_MAX_LENGTH): string {
  const trimmed = note.trim();
  const next = trimmed === '' ? snippet : `${trimmed}${/[.!?]$/.test(trimmed) ? ' ' : '. '}${snippet}`;
  return next.length <= maxLength ? next : note;
}

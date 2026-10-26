import type { SlaState, TicketPriority, TicketStatus, TicketSummary } from '@/types/ticket';
import type {
  FilterableStatus,
  TicketFilters,
  TicketSort,
} from '@/types/ticket-filters';

export const DEFAULT_FILTERS: TicketFilters = {
  statuses: [],
  escalation: 'any',
  sla: 'any',
  priority: 'all',
};

export const DEFAULT_SORT: TicketSort = 'priority';

/** Order and labels for the Status filter chips. */
export const STATUS_FILTER_OPTIONS: { value: FilterableStatus; label: string }[] = [
  { value: 'assigned', label: 'Assigned' },
  { value: 'claimed', label: 'Claimed' },
  { value: 'inProgress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

export const SORT_LABELS: Record<TicketSort, string> = {
  newest: 'Newest',
  oldest: 'Oldest',
  priority: 'Priority',
  slaStatus: 'SLA status',
  status: 'Status',
};

const PRIORITY_RANK: Record<TicketPriority, number> = { critical: 0, high: 1, medium: 2, normal: 3 };

/** Most urgent first. */
const SLA_RANK: Record<SlaState, number> = { breached: 0, warning: 1, onTrack: 2, met: 3 };

const STATUS_RANK: Record<TicketStatus, number> = {
  assigned: 0,
  claimed: 1,
  inProgress: 2,
  escalated: 3,
  resolved: 4,
  closed: 5,
};

const OPEN_STATUSES: FilterableStatus[] = ['assigned', 'claimed', 'inProgress'];

function matchesSla(ticket: TicketSummary, sla: TicketFilters['sla']): boolean {
  switch (sla) {
    case 'any':
      return true;
    // "SLA met" is styled as on track in the design, so it counts as on track here.
    case 'onTrack':
      return ticket.sla.state === 'onTrack' || ticket.sla.state === 'met';
    case 'atRisk':
      return ticket.sla.state === 'warning';
    case 'breached':
      return ticket.sla.state === 'breached';
  }
}

export function matchesFilters(ticket: TicketSummary, filters: TicketFilters): boolean {
  if (filters.statuses.length > 0) {
    // Escalated tickets have their own status, so they are only matched by the Escalation filter.
    if (!filters.statuses.includes(ticket.status as FilterableStatus)) return false;
  }
  if (filters.escalation === 'escalated' && ticket.status !== 'escalated') return false;
  if (filters.escalation === 'notEscalated' && ticket.status === 'escalated') return false;
  if (filters.priority !== 'all' && ticket.priority !== filters.priority) return false;
  return matchesSla(ticket, filters.sla);
}

export function filterTickets(
  tickets: readonly TicketSummary[],
  filters: TicketFilters,
): TicketSummary[] {
  return tickets.filter((ticket) => matchesFilters(ticket, filters));
}

const byNewest = (a: TicketSummary, b: TicketSummary) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

const byPriority = (a: TicketSummary, b: TicketSummary) =>
  PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];

/** Within the same SLA state, the older ticket is closer to its deadline. */
const bySlaUrgency = (a: TicketSummary, b: TicketSummary) =>
  SLA_RANK[a.sla.state] - SLA_RANK[b.sla.state] || -byNewest(a, b);

/** Returns a sorted copy. Ties fall back to the next most meaningful key. */
export function sortTickets(tickets: readonly TicketSummary[], sort: TicketSort): TicketSummary[] {
  const compare = (a: TicketSummary, b: TicketSummary): number => {
    switch (sort) {
      case 'newest':
        return byNewest(a, b);
      case 'oldest':
        return -byNewest(a, b);
      case 'priority':
        return byPriority(a, b) || bySlaUrgency(a, b);
      case 'slaStatus':
        return bySlaUrgency(a, b) || byPriority(a, b);
      case 'status':
        return STATUS_RANK[a.status] - STATUS_RANK[b.status] || byPriority(a, b) || byNewest(a, b);
    }
  };
  return [...tickets].sort(compare);
}

export function toggleStatusFilter(
  filters: TicketFilters,
  status: FilterableStatus,
): TicketFilters {
  const statuses = filters.statuses.includes(status)
    ? filters.statuses.filter((value) => value !== status)
    : [...filters.statuses, status];
  return { ...filters, statuses };
}

export type ActiveFilterKey = keyof TicketFilters;

export type ActiveFilter = { key: ActiveFilterKey; label: string };

const ESCALATION_LABELS = { escalated: 'Escalated', notEscalated: 'Not escalated' } as const;
const SLA_LABELS = { onTrack: 'On track', atRisk: 'At risk', breached: 'Breached' } as const;
const PRIORITY_LABELS: Record<TicketPriority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  normal: 'Normal',
};

/** One entry per filter group that is not at its default. Drives the chips and "Filters · N". */
export function getActiveFilters(filters: TicketFilters): ActiveFilter[] {
  const active: ActiveFilter[] = [];

  if (filters.statuses.length > 0) {
    const isOpenSet =
      filters.statuses.length === OPEN_STATUSES.length &&
      OPEN_STATUSES.every((status) => filters.statuses.includes(status));
    const names = STATUS_FILTER_OPTIONS.filter((option) => filters.statuses.includes(option.value)).map(
      (option) => option.label,
    );
    active.push({ key: 'statuses', label: `Status: ${isOpenSet ? 'Open' : names.join(', ')}` });
  }
  if (filters.escalation !== 'any') {
    active.push({ key: 'escalation', label: ESCALATION_LABELS[filters.escalation] });
  }
  if (filters.sla !== 'any') {
    active.push({ key: 'sla', label: `SLA: ${SLA_LABELS[filters.sla]}` });
  }
  if (filters.priority !== 'all') {
    active.push({ key: 'priority', label: `Priority: ${PRIORITY_LABELS[filters.priority]}` });
  }
  return active;
}

/** Returns the filters with one group put back to its default. */
export function clearFilter(filters: TicketFilters, key: ActiveFilterKey): TicketFilters {
  return { ...filters, [key]: DEFAULT_FILTERS[key] };
}

/** "6 tickets" with no filters, "3 of 6" when filtered. */
export function formatTicketCount(shown: number, total: number, hasActiveFilters: boolean): string {
  if (hasActiveFilters) {
    return `${shown} of ${total}`;
  }
  return `${total} ${total === 1 ? 'ticket' : 'tickets'}`;
}

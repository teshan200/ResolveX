import type { TicketPriority, TicketStatus } from '@/types/ticket';

/** Statuses offered by the "Status" filter. Escalation has its own filter group. */
export type FilterableStatus = Extract<
  TicketStatus,
  'assigned' | 'claimed' | 'inProgress' | 'resolved' | 'closed'
>;

export type EscalationFilter = 'any' | 'escalated' | 'notEscalated';

export type SlaFilter = 'any' | 'onTrack' | 'atRisk' | 'breached';

export type PriorityFilter = 'all' | TicketPriority;

export type TicketFilters = {
  /** Empty means "All". */
  statuses: FilterableStatus[];
  escalation: EscalationFilter;
  sla: SlaFilter;
  priority: PriorityFilter;
};

export type TicketSort = 'newest' | 'oldest' | 'priority' | 'slaStatus' | 'status';

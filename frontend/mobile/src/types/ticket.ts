export type TicketPriority = 'critical' | 'high' | 'medium' | 'normal';

export type TicketStatus =
  | 'assigned'
  | 'claimed'
  | 'inProgress'
  | 'escalated'
  | 'resolved'
  | 'closed';

export type SlaState = 'onTrack' | 'warning' | 'breached' | 'met';

/** The ticket fields shown on list cards. */
export type TicketSummary = {
  id: string;
  /** Human-readable reference, e.g. "#1038". */
  ticketNumber: string;
  title: string;
  priority: TicketPriority;
  status: TicketStatus;
  branchName: string;
  servicePoint: string;
  /** ISO 8601 timestamp. Used for "Newest" / "Oldest" sorting. */
  createdAt: string;
  sla: {
    state: SlaState;
    /** Text shown in the timer pill, e.g. "08:42 left" or "SLA met". */
    label: string;
  };
};

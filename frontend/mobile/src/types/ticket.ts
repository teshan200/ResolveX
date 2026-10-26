export type TicketPriority = 'critical' | 'high' | 'medium';

export type TicketStatus = 'assigned' | 'claimed' | 'inProgress' | 'escalated';

export type SlaState = 'onTrack' | 'warning' | 'breached';

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
  sla: {
    state: SlaState;
    /** Text shown in the timer pill, e.g. "08:42 left". */
    label: string;
  };
};

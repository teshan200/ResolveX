export type TicketPriority = 'critical' | 'high' | 'medium' | 'normal';

export type TicketStatus =
  | 'assigned'
  | 'claimed'
  | 'inProgress'
  | 'escalated'
  | 'resolved'
  | 'closed';

export type SlaState = 'onTrack' | 'warning' | 'breached' | 'met';

/** The statuses a staff member can move a ticket between on the "Update progress" screen. */
export type ProgressStatus = Extract<TicketStatus, 'claimed' | 'inProgress'>;

/** What the "Update progress" form submits. */
export type TicketProgressUpdate = {
  status: ProgressStatus;
  /** What the staff member did. Optional, up to 250 characters. */
  note: string;
};

export type TicketTimelineEventKind = 'claimed' | 'progress' | 'escalated';

export type TicketTimelineEvent = {
  id: string;
  kind: TicketTimelineEventKind;
  /** Who did it, e.g. "you" or "SLA engine". */
  actor: string;
  /** ISO 8601 timestamp. */
  at: string;
  detail?: string;
};

export type TicketEscalation = {
  escalatedTo: string;
  escalatedToRole: string;
  /** ISO 8601 timestamp. */
  escalatedAt: string;
  /** Why it was escalated, e.g. "Resolution SLA breached". */
  reason: string;
};

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

/** What the ticket detail screen shows besides the list-card fields. */
export type TicketDetailContent = {
  /** The customer's complaint. */
  description: string;
  /** Present when the ticket has been escalated. */
  escalation?: TicketEscalation;
  /** Newest first. */
  timeline: TicketTimelineEvent[];
};

export type TicketDetail = TicketSummary & TicketDetailContent;

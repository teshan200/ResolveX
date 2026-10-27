import type { TicketSummary } from '@/types/ticket';

export type StaffProfile = {
  firstName: string;
  branchName: string;
  /** e.g. "Waiter / Waitress". */
  roleTitle: string;
};

export type ShiftInfo = {
  onShift: boolean;
  /** ISO 8601 timestamp for the end of the current shift. */
  endsAt: string;
};

export type HomeStats = {
  myOpen: number;
  slaAtRisk: number;
  escalated: number;
};

/** Everything the Home screen displays, in one payload. */
export type HomeSummary = {
  staff: StaffProfile;
  shift: ShiftInfo;
  stats: HomeStats;
  urgentTickets: TicketSummary[];
};

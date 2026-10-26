import type { TicketProgressUpdate, TicketSummary } from '@/types/ticket';

/**
 * Data-access contract for tickets. Replace the mock implementation with one that calls the real
 * API; screens only depend on this interface. Filtering and sorting are done on the client for
 * now; they can move server-side later by extending this contract.
 */
export type TicketsRepository = {
  /** Every ticket assigned to the signed-in staff member. */
  listTickets(): Promise<TicketSummary[]>;
  /** One ticket, or null when it does not exist (or is not assigned to the staff member). */
  getTicket(id: string): Promise<TicketSummary | null>;
  /**
   * Submits a progress update. Resolving means the update was accepted; a rejection means it
   * was not saved.
   */
  updateProgress(id: string, update: TicketProgressUpdate): Promise<void>;
};

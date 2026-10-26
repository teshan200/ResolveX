import type { TicketSummary } from '@/types/ticket';

/**
 * Data-access contract for the Tickets screen. Replace the mock implementation with one that
 * calls the real API; the screen only depends on this interface. Filtering and sorting are done
 * on the client for now; they can move server-side later by extending this contract.
 */
export type TicketsRepository = {
  /** Every ticket assigned to the signed-in staff member. */
  listTickets(): Promise<TicketSummary[]>;
};

import { createMockTickets } from '@/mock-data/tickets';
import type { TicketSummary } from '@/types/ticket';

import type { TicketsRepository } from './repository';

const copy = (ticket: TicketSummary): TicketSummary => ({ ...ticket, sla: { ...ticket.sla } });

/**
 * In-memory stand-in for the tickets API. A submitted progress update changes the ticket's
 * status for the rest of the session so the list reflects it; the note is not kept, since
 * tickets only carry the fields shown on list cards.
 */
export function createMockTicketsRepository(
  seed: () => TicketSummary[] = createMockTickets,
): TicketsRepository {
  let tickets = seed();

  return {
    async listTickets() {
      return tickets.map(copy);
    },
    async getTicket(id) {
      const ticket = tickets.find((item) => item.id === id);
      return ticket ? copy(ticket) : null;
    },
    async updateProgress(id, update) {
      tickets = tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, status: update.status } : ticket,
      );
    },
  };
}

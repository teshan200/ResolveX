import { createMockTicketDetails, createMockTickets } from '@/mock-data/tickets';
import type { TicketDetailContent, TicketSummary } from '@/types/ticket';
import { canClaimTicket } from '@/utils/ticket-claim';

import type { TicketsRepository } from './repository';

const CURRENT_USER_LABEL = 'Dinesh K. (you)';

const copy = (ticket: TicketSummary): TicketSummary => ({ ...ticket, sla: { ...ticket.sla } });

/**
 * In-memory stand-in for the tickets API. A submitted progress update changes the ticket's
 * status for the rest of the session so the list reflects it; the note is not kept, since
 * tickets only carry the fields shown on list cards.
 */
export function createMockTicketsRepository(
  seed: () => TicketSummary[] = createMockTickets,
  seedDetails: () => Record<string, TicketDetailContent> = createMockTicketDetails,
): TicketsRepository {
  let tickets = seed();
  const details = seedDetails();

  return {
    async listTickets() {
      return tickets.map(copy);
    },
    async getTicket(id) {
      const ticket = tickets.find((item) => item.id === id);
      return ticket ? copy(ticket) : null;
    },
    async getTicketDetail(id) {
      const ticket = tickets.find((item) => item.id === id);
      if (!ticket) {
        return null;
      }
      const content = details[id] ?? { description: '', timeline: [] };
      return {
        ...copy(ticket),
        ...content,
        timeline: content.timeline.map((event) => ({ ...event })),
      };
    },
    async updateProgress(id, update) {
      tickets = tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, status: update.status } : ticket,
      );
    },
    async claimTicket(id) {
      const ticket = tickets.find((item) => item.id === id);
      if (!ticket || !canClaimTicket(ticket)) {
        throw new Error('Ticket cannot be claimed');
      }
      tickets = tickets.map((item) => (item.id === id ? { ...item, status: 'claimed' } : item));
      const content = details[id] ?? { description: '', timeline: [] };
      details[id] = {
        ...content,
        assignedTo: content.assignedTo ?? CURRENT_USER_LABEL,
        timeline: [
          { id: `e-${id}-claimed-${Date.now()}`, kind: 'claimed', actor: 'you', at: new Date().toISOString() },
          ...content.timeline,
        ],
      };
    },
  };
}

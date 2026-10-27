import { createMockTicketDetails, createMockTickets } from '@/mock-data/tickets';
import type { TicketDetailContent, TicketSummary } from '@/types/ticket';
import { canClaimTicket } from '@/utils/ticket-claim';
import { canUpdateProgress } from '@/utils/ticket-progress';

import type { TicketsRepository } from './repository';

const CURRENT_USER_LABEL = 'Dinesh K. (you)';

const UPLOAD_STEPS = 5;
const UPLOAD_STEP_MS = 300;

const copy =(ticket: TicketSummary): TicketSummary => ({ ...ticket, sla: { ...ticket.sla } });

/**
 * In-memory stand-in for the tickets API. A submitted progress update changes the ticket's
 * status for the rest of the session so the list reflects it, and adds a progress event with the
 * note to the ticket's timeline.
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
      const ticket = tickets.find((item) => item.id === id);
      if (!ticket || !canUpdateProgress(ticket)) {
        throw new Error('Ticket cannot be updated');
      }
      tickets = tickets.map((item) => (item.id === id ? { ...item, status: update.status } : item));
      const content = details[id] ?? { description: '', timeline: [] };
      const note = update.note.trim();
      details[id] = {
        ...content,
        timeline: [
          {
            id: `e-${id}-progress-${Date.now()}`,
            kind: 'progress',
            actor: 'you',
            at: new Date().toISOString(),
            ...(note !== '' ? { detail: note } : {}),
          },
          ...content.timeline,
        ],
      };
    },
    async uploadEvidenceFile(id, _file, onProgress) {
      if (!tickets.some((item) => item.id === id)) {
        throw new Error('Ticket not found');
      }
      for (let step = 1; step <= UPLOAD_STEPS; step += 1) {
        await new Promise((resolve) => setTimeout(resolve, UPLOAD_STEP_MS));
        onProgress(step / UPLOAD_STEPS);
      }
    },
    async attachEvidence(id, evidence) {
      const ticket = tickets.find((item) => item.id === id);
      if (!ticket || !canUpdateProgress(ticket) || evidence.files.length === 0) {
        throw new Error('Evidence cannot be attached');
      }
      // The mock keeps nothing: the timeline has no evidence event in the design.
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

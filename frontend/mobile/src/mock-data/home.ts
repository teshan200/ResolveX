import { createMockTickets } from '@/mock-data/tickets';
import type { HomeSummary } from '@/types/home';
import { sortTickets } from '@/utils/tickets';

const URGENT_TICKET_COUNT = 3;

/** Development-only data mirroring the Figma "Home" screen. */
export function createMockHomeSummary(): HomeSummary {
  const shiftEnd = new Date();
  shiftEnd.setHours(18, 0, 0, 0);

  // "Most urgent" is the top of the open tickets, in the same order the Tickets screen uses.
  const openTickets = createMockTickets().filter(
    (ticket) => ticket.status !== 'resolved' && ticket.status !== 'closed',
  );

  return {
    staff: {
      firstName: 'Dinesh',
      branchName: 'Colombo Branch',
      roleTitle: 'Waiter / Waitress',
    },
    shift: { onShift: true, endsAt: shiftEnd.toISOString() },
    stats: { myOpen: 4, slaAtRisk: 1, escalated: 1 },
    urgentTickets: sortTickets(openTickets, 'priority').slice(0, URGENT_TICKET_COUNT),
  };
}

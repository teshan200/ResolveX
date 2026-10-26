import { createMockTickets } from '@/mock-data/tickets';

import type { TicketsRepository } from './repository';

export function createMockTicketsRepository(): TicketsRepository {
  return {
    async listTickets() {
      return createMockTickets();
    },
  };
}

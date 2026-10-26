import { createMockTicketsRepository } from './mock-repository';

// The one tickets repository the app uses. Swap this for a repository backed by the real API
// when it exists.
export const ticketsRepository = createMockTicketsRepository();

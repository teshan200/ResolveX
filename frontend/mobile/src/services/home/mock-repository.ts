import { createMockHomeSummary } from '@/mock-data/home';

import type { HomeRepository } from './repository';

export function createMockHomeRepository(): HomeRepository {
  return {
    async getSummary() {
      return createMockHomeSummary();
    },
  };
}

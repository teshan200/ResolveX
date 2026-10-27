import { createMockProfile } from '@/mock-data/profile';

import type { AvailabilityRepository, ProfileRepository } from './repository';

export function createMockProfileRepository(): ProfileRepository {
  return {
    async getProfile() {
      return createMockProfile();
    },
  };
}

/** Simulates submitting a request. No decision is ever produced here. */
export function createMockAvailabilityRepository(): AvailabilityRepository {
  return {
    async requestUnavailability() {},
  };
}

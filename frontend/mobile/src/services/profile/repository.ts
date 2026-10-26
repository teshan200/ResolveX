import type { ProfileData } from '@/types/profile';

/**
 * Data-access contract for the Profile screen. Replace the mock implementation with one that
 * calls the real API; the UI and state only depend on these interfaces.
 */
export type ProfileRepository = {
  getProfile(): Promise<ProfileData>;
};

export type AvailabilityRepository = {
  /**
   * Records a request to become unavailable. Resolving means the request was submitted,
   * not approved: the decision arrives separately and is applied via `applyDecision`.
   */
  requestUnavailability(): Promise<void>;
};

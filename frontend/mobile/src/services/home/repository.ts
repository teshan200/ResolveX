import type { HomeSummary } from '@/types/home';

/**
 * Data-access contract for the Home screen. Replace the mock implementation with one that
 * calls the real API; the screen only depends on this interface.
 */
export type HomeRepository = {
  getSummary(): Promise<HomeSummary>;
};

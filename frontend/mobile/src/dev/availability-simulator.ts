import type { AvailabilityDecision } from '@/types/availability';

type AvailabilitySimulator = {
  approveAvailability: () => void;
  rejectAvailability: () => void;
};

declare global {
  var resolveXDev: AvailabilitySimulator | undefined;
}

/**
 * Development-only stand-in for the backend decision on an unavailability request.
 * While the app runs in dev, open the JS console (React Native DevTools, or the browser
 * console on web) and call `resolveXDev.approveAvailability()` or
 * `resolveXDev.rejectAvailability()`. It does nothing unless a request is pending.
 * Not available in production builds.
 */
export function registerAvailabilitySimulator(
  applyDecision: (decision: AvailabilityDecision) => void,
): () => void {
  if (!__DEV__) {
    return () => {};
  }
  globalThis.resolveXDev = {
    approveAvailability: () => applyDecision('approved'),
    rejectAvailability: () => applyDecision('rejected'),
  };
  return () => {
    globalThis.resolveXDev = undefined;
  };
}

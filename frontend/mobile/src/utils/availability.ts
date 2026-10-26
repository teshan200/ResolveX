import type { AvailabilityDecision, AvailabilityState } from '@/types/availability';

export type AvailabilityEvent =
  | { type: 'requestUnavailability' }
  | { type: 'requestFailed' }
  | { type: 'decisionReceived'; decision: AvailabilityDecision }
  | { type: 'reset' };

/**
 * Pure transition function. Events that make no sense for the current state are ignored, so
 * the state can never contradict itself (e.g. a decision can only resolve a pending request).
 */
export function reduceAvailability(
  state: AvailabilityState,
  event: AvailabilityEvent,
): AvailabilityState {
  switch (event.type) {
    case 'requestUnavailability':
      return state === 'available' ? 'pending' : state;
    case 'requestFailed':
      return state === 'pending' ? 'available' : state;
    case 'decisionReceived':
      if (state !== 'pending') return state;
      // Rejected: the staff member simply stays available.
      return event.decision === 'approved' ? 'unavailable' : 'available';
    case 'reset':
      return 'available';
  }
}

/** The toggle is ON whenever unavailability is requested or granted. */
export function isUnavailabilityToggleOn(state: AvailabilityState): boolean {
  return state !== 'available';
}

/** Text for the "Shift Status" field. The shift time is shown only while available. */
export function getShiftStatusLabel(state: AvailabilityState, shiftTime: string): string {
  switch (state) {
    case 'available':
      return shiftTime;
    case 'pending':
      return 'Pending';
    case 'unavailable':
      return 'On Break';
  }
}

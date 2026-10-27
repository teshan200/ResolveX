/**
 * The staff member's availability for handling tickets, which also encodes where an
 * unavailability request stands:
 *
 * - `available`   – can handle tickets (no request, or the last request was rejected).
 * - `pending`     – has requested to become unavailable; awaiting a decision.
 * - `unavailable` – the request was approved; not handling tickets.
 */
export type AvailabilityState = 'available' | 'pending' | 'unavailable';

/** The outcome of an unavailability request. Decided by the backend, never by the frontend. */
export type AvailabilityDecision = 'approved' | 'rejected';

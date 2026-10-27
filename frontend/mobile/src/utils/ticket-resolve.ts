export type ResolveOutcome = 'resolved' | 'unableToResolve';

export const RESOLVE_NOTE_MAX_LENGTH = 500;

/**
 * Sample people named in the design's banners and helper text. Replace with the ticket's real
 * reviewer and escalation target once the API provides them.
 */
export const RESOLUTION_REVIEWER = 'Kavinda P.';
export const ESCALATION_TARGET = { name: 'Ayesha P.', role: 'Branch Manager' } as const;

/** The reason options in the dropdown. The design shows only the first; "Other" is a catch-all. */
export const ESCALATION_REASONS = ['Needs a management decision', 'Other'] as const;

/** A note is required before a resolution or escalation can be submitted. */
export function canSubmitResolve(note: string): boolean {
  return note.trim() !== '';
}

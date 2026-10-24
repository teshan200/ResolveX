// Question options for the guest feedback form. These stand in for the form
// definition the backend will serve for a QR code (dynamic form engine).

export const dineTypes = ['Dine in', 'Takeaway', 'Delivery'] as const
export type DineType = (typeof dineTypes)[number]

export const problemAreas = ['Food', 'Service', 'Cleanliness', 'Waiting time', 'Other'] as const
export type ProblemArea = (typeof problemAreas)[number]

/** Ratings up to this value need a problem area and a description. */
export const LOW_RATING_MAX = 3

export const MAX_DESCRIPTION = 1000
export const MIN_DESCRIPTION = 10
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

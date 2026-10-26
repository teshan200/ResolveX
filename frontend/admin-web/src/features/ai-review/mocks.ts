import type { Employee, ReviewChip, ReviewDraft, ReviewItem } from './types'

// Mock data only, taken from the Figma "AI review queue" frames. No AI model is connected.
export const reviewItems: ReviewItem[] = [
  {
    id: '#1053',
    meta: 'Table 11 · 4 min ago',
    quote: '“The waiter ignored us for 20 minutes and then brought the wrong bill.”',
    confidence: 48,
    category: 'Service',
    subCategory: 'Wait time',
    priority: 'Medium',
  },
  {
    id: '#1054',
    meta: 'Table 3 · 9 min ago',
    quote: '“Chicken tasted strange, worried it was undercooked.”',
    confidence: 71,
    category: 'Food quality',
    subCategory: 'Safety',
    priority: 'High',
  },
  {
    id: '#1055',
    meta: 'Washrooms · 15 min ago',
    quote: '“Washroom had no soap, again.”',
    confidence: 68,
    category: 'Cleanliness',
    priority: 'Normal',
  },
]

/** Why the AI was unsure about the item that is open in the review panel. */
export const reviewReason =
  'Mentions both a wait and a billing error. Business rule “billing → Medium” conflicts with “wait > 15 min → High”.'

/** What the branch manager has already chosen for the open item. */
export const reviewDraft: ReviewDraft = {
  category: 'Service',
  subCategory: 'Wait time',
  priority: 'High',
  designation: 'Waiter / Waitress',
  employee: 'Dinesh Kumara',
}

export const categories: Record<string, string[]> = {
  Service: ['Wait time'],
  'Food quality': ['Safety', 'Temperature'],
  Cleanliness: ['Washrooms'],
}

export const designations = ['Waiter / Waitress', 'Barista']

/** Active employees at Colombo Branch for each designation. */
export const employeesByDesignation: Record<string, Employee[]> = {
  'Waiter / Waitress': [{ name: 'Dinesh Kumara', initials: 'DK', level: 1, openTickets: 4 }],
  Barista: [],
}

export const reviewChips: { key: ReviewChip; label: string }[] = [
  { key: 'waiting', label: 'Waiting' },
  { key: 'reviewed', label: 'Reviewed today' },
  { key: 'overridden', label: 'Overridden' },
]

export const startingCounts: Record<ReviewChip, number> = { waiting: 5, reviewed: 23, overridden: 6 }

/** Below this score a classification waits for a human (shown in the review panel). */
export const AUTO_ROUTE_THRESHOLD = 75

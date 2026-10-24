const MIN_MINUTES = 1
const MAX_MINUTES = 30 * 24 * 60

const unitMinutes: Record<string, number> = {
  m: 1,
  min: 1,
  mins: 1,
  minute: 1,
  minutes: 1,
  h: 60,
  hr: 60,
  hrs: 60,
  hour: 60,
  hours: 60,
  d: 24 * 60,
  day: 24 * 60,
  days: 24 * 60,
}

const token = /(\d+(?:\.\d+)?)\s*([a-z]+)/gi

/** Parses "5 min", "2 h", "1h 30m" or "1 day" into minutes. Returns null when it cannot. */
export function parseDuration(input: string): number | null {
  const text = input.trim()
  const matches = [...text.matchAll(token)]
  if (matches.length === 0) return null
  // Anything left after removing the "<number> <unit>" tokens makes the input invalid.
  if (text.replace(token, '').trim() !== '') return null

  let total = 0
  for (const match of matches) {
    const unit = unitMinutes[match[2].toLowerCase()]
    if (unit === undefined) return null
    total += Number(match[1]) * unit
  }
  return total
}

/** Returns an error message for a duration field, or null when valid. */
export function durationError(input: string): string | null {
  if (!input.trim()) return 'Enter a time, for example 30 min or 2 h'
  const minutes = parseDuration(input)
  if (minutes === null) return 'Use a number and unit, for example 30 min or 2 h'
  if (minutes < MIN_MINUTES) return 'Must be at least 1 minute'
  if (minutes > MAX_MINUTES) return 'Must be 30 days or less'
  return null
}

export const WARN_MIN = 50
export const WARN_MAX = 95

/** Returns an error message for the warn-at percentage, or null when valid. */
export function warnAtError(input: string): string | null {
  const text = input.trim()
  if (!text) return 'Enter a percentage'
  const match = /^(\d+)\s*%?$/.exec(text)
  if (!match) return 'Use a whole number, for example 80'
  const value = Number(match[1])
  if (value < WARN_MIN || value > WARN_MAX) return `Must be between ${WARN_MIN}% and ${WARN_MAX}%`
  return null
}

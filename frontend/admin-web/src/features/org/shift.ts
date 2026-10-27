// "Today" and the return times offered on the Branch Manager's Employees screen.
// The Figma design shows these as fixed sample values, so they are constants here too.

/** Shown in the date field of the "Expected return to shift" popover. */
export const RETURN_DATE_LONG = 'Sun, 19 Oct 2026'

/** Short form used inside labels, e.g. "19 Oct, 3:45 PM". */
export const RETURN_DATE_SHORT = '19 Oct'

export const RETURN_TIMES = ['3:15 PM', '3:30 PM', '3:45 PM', '4:00 PM', '4:15 PM', '4:30 PM']

/** "3:45 PM" → "15:45" (the compact value shown in the date & time field). */
export function to24Hour(time: string): string {
  const [clock, meridiem] = time.split(' ')
  const [hours, minutes] = clock.split(':').map(Number)
  const hour = (hours % 12) + (meridiem === 'PM' ? 12 : 0)
  return `${hour}:${String(minutes).padStart(2, '0')}`
}

/** Label stored on the employee once the return is scheduled, e.g. "19 Oct, 3:45 PM". */
export const returnLabel = (time: string) => `${RETURN_DATE_SHORT}, ${time}`

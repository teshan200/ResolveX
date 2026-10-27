/** "Good morning" / "Good afternoon" / "Good evening" for the given time. */
export function getGreeting(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/** e.g. "6:00 PM". */
export function formatShiftEnd(endsAt: string): string {
  return new Date(endsAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/** e.g. "12:20 PM". */
export function formatEventTime(at: string): string {
  return new Date(at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/** e.g. "5 min ago". */
export function formatMinutesAgo(at: string, now: number = Date.now()): string {
  const minutes = Math.max(1, Math.round((now - new Date(at).getTime()) / 60000));
  return `${minutes} min ago`;
}

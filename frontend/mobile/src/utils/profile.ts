import type { AssignedShift } from '@/types/profile';
import { formatShiftEnd } from '@/utils/home';

/** "Dinesh Kumara" -> "DK". */
export function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

/** "9:00 AM – 6:00 PM". */
export function formatShiftRange(shift: AssignedShift): string {
  return `${formatShiftEnd(shift.startsAt)} – ${formatShiftEnd(shift.endsAt)}`;
}

import type { ProfileData } from '@/types/profile';

/** Development-only data mirroring the Figma "Profile" screen. */
export function createMockProfile(): ProfileData {
  const startsAt = new Date();
  startsAt.setHours(9, 0, 0, 0);
  const endsAt = new Date();
  endsAt.setHours(18, 0, 0, 0);

  return {
    staff: {
      fullName: 'Dinesh Kumara',
      designation: 'Waiter / Waitress',
      level: 1,
      staffId: 'ST-4820',
      branchName: 'Colombo Branch',
    },
    shift: { startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString() },
  };
}

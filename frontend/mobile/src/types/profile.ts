export type StaffDetails = {
  fullName: string;
  /** e.g. "Waiter / Waitress". */
  designation: string;
  level: number;
  staffId: string;
  branchName: string;
};

/** The staff member's assigned shift (not their current availability). */
export type AssignedShift = {
  /** ISO 8601 timestamps. */
  startsAt: string;
  endsAt: string;
};

export type ProfileData = {
  staff: StaffDetails;
  shift: AssignedShift;
};

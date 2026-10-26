/** Drives the icon and tint of a notification row. */
export type NotificationKind = 'slaWarning' | 'escalated' | 'assigned' | 'resolved';

export type Notification = {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  /** ISO 8601 timestamp. */
  createdAt: string;
  read: boolean;
};

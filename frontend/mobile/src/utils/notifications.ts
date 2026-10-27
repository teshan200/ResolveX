import type { Notification } from '@/types/notification';

export const MAX_BADGE_COUNT = 99;

export function getUnreadCount(notifications: readonly Notification[]): number {
  return notifications.filter((notification) => !notification.read).length;
}

/** Text for a count badge, or null when no badge should be shown. */
export function formatBadgeCount(count: number): string | null {
  if (!Number.isFinite(count) || count <= 0) {
    return null;
  }
  return count > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : String(Math.floor(count));
}

export function markAsRead(notifications: readonly Notification[], id: string): Notification[] {
  return notifications.map((notification) =>
    notification.id === id ? { ...notification, read: true } : notification,
  );
}

export function markAllAsRead(notifications: readonly Notification[]): Notification[] {
  return notifications.map((notification) =>
    notification.read ? notification : { ...notification, read: true },
  );
}

export type NotificationGroup = {
  title: 'Today' | 'Yesterday' | 'Earlier';
  items: Notification[];
};

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Groups notifications by calendar day, newest first. Empty groups are omitted. */
export function groupNotificationsByDay(
  notifications: readonly Notification[],
  now: Date = new Date(),
): NotificationGroup[] {
  const today = startOfDay(now);
  const groups: NotificationGroup[] = [
    { title: 'Today', items: [] },
    { title: 'Yesterday', items: [] },
    { title: 'Earlier', items: [] },
  ];
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  for (const notification of sorted) {
    const day = startOfDay(new Date(notification.createdAt));
    const index = day >= today ? 0 : day >= today - DAY_MS ? 1 : 2;
    groups[index].items.push(notification);
  }
  return groups.filter((group) => group.items.length > 0);
}

/** "2 min ago" for recent items, "Yesterday, 8:41 PM" or a date for older ones. */
export function formatNotificationTime(createdAt: string, now: Date = new Date()): string {
  const created = new Date(createdAt);
  const diffMinutes = Math.floor((now.getTime() - created.getTime()) / 60000);
  const time = created.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const today = startOfDay(now);
  const day = startOfDay(created);

  if (day >= today) {
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    return `${Math.floor(diffMinutes / 60)} h ago`;
  }
  if (day >= today - DAY_MS) {
    return `Yesterday, ${time}`;
  }
  const date = created.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${date}, ${time}`;
}

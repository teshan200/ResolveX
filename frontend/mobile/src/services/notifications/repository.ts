import type { Notification } from '@/types/notification';

/**
 * Data-access contract for notifications. The UI and state only depend on this interface,
 * so the mock implementation can later be swapped for one that calls the real API.
 */
export type NotificationsRepository = {
  list(): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
};

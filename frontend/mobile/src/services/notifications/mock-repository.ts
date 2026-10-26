import { createMockNotifications } from '@/mock-data/notifications';
import type { Notification } from '@/types/notification';

import type { NotificationsRepository } from './repository';

/** In-memory stand-in for the future notifications API. */
export function createMockNotificationsRepository(
  seed: () => Notification[] = createMockNotifications,
): NotificationsRepository {
  let items = seed();

  return {
    async list() {
      return items.map((item) => ({ ...item }));
    },
    async markAsRead(id) {
      items = items.map((item) => (item.id === id ? { ...item, read: true } : item));
    },
    async markAllAsRead() {
      items = items.map((item) => ({ ...item, read: true }));
    },
  };
}

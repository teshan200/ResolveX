import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { useSession } from '@/hooks/use-session';
import { createMockNotificationsRepository } from '@/services/notifications/mock-repository';
import type { NotificationsRepository } from '@/services/notifications/repository';
import type { Notification } from '@/types/notification';
import { getUnreadCount, markAllAsRead, markAsRead } from '@/utils/notifications';

export type NotificationsStatus = 'idle' | 'loading' | 'ready' | 'error';

type NotificationsContextValue = {
  status: NotificationsStatus;
  notifications: Notification[];
  /** Always derived from `notifications`. */
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  reload: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

// Swap this for a repository backed by the real API when it exists.
const defaultRepository = createMockNotificationsRepository();

/**
 * Single source of truth for notifications. Lives above the tab navigator so state survives
 * tab switches; loads on sign-in and clears on sign-out/expiry.
 */
export function NotificationsProvider({
  children,
  repository = defaultRepository,
}: {
  children: ReactNode;
  repository?: NotificationsRepository;
}) {
  const { status: sessionStatus } = useSession();
  const isSignedIn = sessionStatus === 'active';
  const [status, setStatus] = useState<NotificationsStatus>('idle');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reloadToken, setReloadToken] = useState(0);
  const [wasSignedIn, setWasSignedIn] = useState(false);

  // Reset when the session starts or ends so one user's notifications never linger for the next.
  if (isSignedIn !== wasSignedIn) {
    setWasSignedIn(isSignedIn);
    setNotifications([]);
    setStatus(isSignedIn ? 'loading' : 'idle');
  }

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }
    let cancelled = false;
    repository
      .list()
      .then((items) => {
        if (!cancelled) {
          setNotifications(items);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, repository, reloadToken]);

  const reload = useCallback(() => {
    setStatus('loading');
    setReloadToken((token) => token + 1);
  }, []);

  // Updates apply immediately (optimistic); if the repository rejects, resync from it.
  const handleMarkAsRead = useCallback(
    (id: string) => {
      setNotifications((current) => markAsRead(current, id));
      repository.markAsRead(id).catch(reload);
    },
    [repository, reload],
  );

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((current) => markAllAsRead(current));
    repository.markAllAsRead().catch(reload);
  }, [repository, reload]);

  const unreadCount = useMemo(() => getUnreadCount(notifications), [notifications]);

  const value = useMemo(
    () => ({
      status,
      notifications,
      unreadCount,
      markAsRead: handleMarkAsRead,
      markAllAsRead: handleMarkAllAsRead,
      reload,
    }),
    [status, notifications, unreadCount, handleMarkAsRead, handleMarkAllAsRead, reload],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}

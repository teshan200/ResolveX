import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import type { ReactNode } from 'react';

import { SESSION_TIMEOUT_MS } from '@/constants/session';

export type SessionStatus = 'signedOut' | 'active' | 'expired';

type SessionContextValue = {
  status: SessionStatus;
  /** Starts a new session with a single deadline. Call only after successful authentication. */
  signIn: () => void;
  /** Clears the session and its timer. */
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>('signedOut');
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  const signIn = useCallback(() => {
    setExpiresAt(Date.now() + SESSION_TIMEOUT_MS);
    setStatus('active');
  }, []);

  const signOut = useCallback(() => {
    setExpiresAt(null);
    setStatus('signedOut');
  }, []);

  // One timer per session deadline; it is not tied to any screen.
  useEffect(() => {
    if (status !== 'active' || expiresAt === null) {
      return;
    }
    const expire = () => {
      setExpiresAt(null);
      setStatus('expired');
    };
    const timer = setTimeout(expire, Math.max(0, expiresAt - Date.now()));
    // Timers can be suspended while the app is backgrounded; re-check the deadline on resume.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && Date.now() >= expiresAt) {
        expire();
      }
    });
    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, [status, expiresAt]);

  const value = useMemo(() => ({ status, signIn, signOut }), [status, signIn, signOut]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

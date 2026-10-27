import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Alert } from 'react-native';

import { registerAvailabilitySimulator } from '@/dev/availability-simulator';
import { useSession } from '@/hooks/use-session';
import { createMockAvailabilityRepository } from '@/services/profile/mock-repository';
import type { AvailabilityRepository } from '@/services/profile/repository';
import type { AvailabilityDecision, AvailabilityState } from '@/types/availability';
import { reduceAvailability } from '@/utils/availability';
import type { AvailabilityEvent } from '@/utils/availability';

type AvailabilityContextValue = {
  availability: AvailabilityState;
  /** The staff member asks to become unavailable. Only valid while available. */
  requestUnavailability: () => void;
  /**
   * Applies the backend decision on a pending request. This is the integration point for
   * the real approval flow (push notification, polling, etc.); the frontend never decides.
   */
  applyDecision: (decision: AvailabilityDecision) => void;
};

const AvailabilityContext = createContext<AvailabilityContextValue | null>(null);

// Swap this for a repository backed by the real API when it exists.
const defaultRepository = createMockAvailabilityRepository();

/**
 * Single source of truth for availability. Lives above the tab navigator so the state survives
 * tab switches, and resets when the session ends. It never touches the session timer.
 */
export function AvailabilityProvider({
  children,
  repository = defaultRepository,
}: {
  children: ReactNode;
  repository?: AvailabilityRepository;
}) {
  const { status: sessionStatus } = useSession();
  const isSignedIn = sessionStatus === 'active';
  const [availability, setAvailability] = useState<AvailabilityState>('available');
  const [wasSignedIn, setWasSignedIn] = useState(false);

  // Start from `available` whenever a session starts or ends.
  if (isSignedIn !== wasSignedIn) {
    setWasSignedIn(isSignedIn);
    setAvailability('available');
  }

  const dispatch = useCallback((event: AvailabilityEvent) => {
    setAvailability((current) => reduceAvailability(current, event));
  }, []);

  const requestUnavailability = useCallback(() => {
    if (availability !== 'available') {
      return;
    }
    dispatch({ type: 'requestUnavailability' });
    repository.requestUnavailability().catch(() => {
      dispatch({ type: 'requestFailed' });
      Alert.alert('Request not sent', 'We couldn’t send your request. Please try again.');
    });
  }, [availability, dispatch, repository]);

  const applyDecision = useCallback(
    (decision: AvailabilityDecision) => dispatch({ type: 'decisionReceived', decision }),
    [dispatch],
  );

  useEffect(() => registerAvailabilitySimulator(applyDecision), [applyDecision]);

  const value = useMemo(
    () => ({ availability, requestUnavailability, applyDecision }),
    [availability, requestUnavailability, applyDecision],
  );

  return <AvailabilityContext.Provider value={value}>{children}</AvailabilityContext.Provider>;
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error('useAvailability must be used within an AvailabilityProvider');
  }
  return context;
}

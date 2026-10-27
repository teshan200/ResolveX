import { useCallback, useEffect, useState } from 'react';

import { createMockProfileRepository } from '@/services/profile/mock-repository';
import type { ProfileRepository } from '@/services/profile/repository';
import type { ProfileData } from '@/types/profile';

export type ProfileStatus = 'loading' | 'ready' | 'error';

// Swap this for a repository backed by the real API when it exists.
const defaultRepository = createMockProfileRepository();

/** Loads the staff profile and assigned shift shown on the Profile screen. */
export function useProfile(repository: ProfileRepository = defaultRepository) {
  const [status, setStatus] = useState<ProfileStatus>('loading');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    repository
      .getProfile()
      .then((result) => {
        if (!cancelled) {
          setProfile(result);
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
  }, [repository, reloadToken]);

  const reload = useCallback(() => {
    setStatus('loading');
    setReloadToken((token) => token + 1);
  }, []);

  return { status, profile, reload };
}

import { useCallback, useEffect, useState } from 'react';

import { createMockHomeRepository } from '@/services/home/mock-repository';
import type { HomeRepository } from '@/services/home/repository';
import type { HomeSummary } from '@/types/home';

export type HomeSummaryStatus = 'loading' | 'ready' | 'error';

// Swap this for a repository backed by the real API when it exists.
const defaultRepository = createMockHomeRepository();

/** Loads the data shown on the Home screen. */
export function useHomeSummary(repository: HomeRepository = defaultRepository) {
  const [status, setStatus] = useState<HomeSummaryStatus>('loading');
  const [summary, setSummary] = useState<HomeSummary | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    repository
      .getSummary()
      .then((result) => {
        if (!cancelled) {
          setSummary(result);
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

  return { status, summary, reload };
}

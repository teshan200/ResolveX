import { useCallback, useEffect, useState } from 'react';

import { createMockTicketsRepository } from '@/services/tickets/mock-repository';
import type { TicketsRepository } from '@/services/tickets/repository';
import type { TicketSummary } from '@/types/ticket';

export type TicketsStatus = 'loading' | 'ready' | 'error';

// Swap this for a repository backed by the real API when it exists.
const defaultRepository = createMockTicketsRepository();

/** Loads the tickets listed on the Tickets screen. */
export function useTickets(repository: TicketsRepository = defaultRepository) {
  const [status, setStatus] = useState<TicketsStatus>('loading');
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    repository
      .listTickets()
      .then((result) => {
        if (!cancelled) {
          setTickets(result);
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

  return { status, tickets, reload };
}

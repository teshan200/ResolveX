import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { ticketsRepository } from '@/services/tickets';
import type { TicketsRepository } from '@/services/tickets/repository';
import type { TicketSummary } from '@/types/ticket';

export type TicketsStatus = 'loading' | 'ready' | 'error';

/**
 * Loads the tickets listed on the Tickets screen. It refreshes whenever the screen regains focus
 * (for example after returning from "Update progress"), without showing the loading state again.
 */
export function useTickets(repository: TicketsRepository = ticketsRepository) {
  const [status, setStatus] = useState<TicketsStatus>('loading');
  const [tickets, setTickets] = useState<TicketSummary[]>([]);

  const fetchTickets = useCallback(
    async (isCancelled: () => boolean) => {
      try {
        const result = await repository.listTickets();
        if (!isCancelled()) {
          setTickets(result);
          setStatus('ready');
        }
      } catch {
        if (!isCancelled()) {
          // A failed background refresh keeps showing the tickets already loaded.
          setStatus((current) => (current === 'ready' ? current : 'error'));
        }
      }
    },
    [repository],
  );

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void fetchTickets(() => cancelled);
      return () => {
        cancelled = true;
      };
    }, [fetchTickets]),
  );

  const reload = useCallback(() => {
    setStatus('loading');
    void fetchTickets(() => false);
  }, [fetchTickets]);

  return { status, tickets, reload };
}

import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { TicketStatusState } from '@/hooks/use-ticket';
import { ticketsRepository } from '@/services/tickets';
import type { TicketsRepository } from '@/services/tickets/repository';
import type { TicketDetail } from '@/types/ticket';

/**
 * Loads one ticket, with its detail content, by id. It refreshes whenever the screen regains focus
 * (for example after claiming the ticket), without showing the loading state again.
 */
export function useTicketDetail(
  id: string | undefined,
  repository: TicketsRepository = ticketsRepository,
) {
  const [state, setState] = useState<{ status: TicketStatusState; ticket: TicketDetail | null }>({
    status: 'loading',
    ticket: null,
  });

  useFocusEffect(
    useCallback(() => {
      if (!id) {
        return;
      }
      let cancelled = false;
      repository
        .getTicketDetail(id)
        .then((ticket) => {
          if (!cancelled) {
            setState(ticket ? { status: 'ready', ticket } : { status: 'notFound', ticket: null });
          }
        })
        .catch(() => {
          if (!cancelled) {
            setState((current) =>
              current.status === 'ready' ? current : { status: 'error', ticket: null },
            );
          }
        });
      return () => {
        cancelled = true;
      };
    }, [id, repository]),
  );

  return id ? state : { status: 'notFound' as const, ticket: null };
}

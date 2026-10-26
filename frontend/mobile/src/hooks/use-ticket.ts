import { useEffect, useState } from 'react';

import { ticketsRepository } from '@/services/tickets';
import type { TicketsRepository } from '@/services/tickets/repository';
import type { TicketSummary } from '@/types/ticket';

export type TicketStatusState = 'loading' | 'ready' | 'notFound' | 'error';

/** Loads one ticket by id. */
export function useTicket(id: string | undefined, repository: TicketsRepository = ticketsRepository) {
  const [state, setState] = useState<{ status: TicketStatusState; ticket: TicketSummary | null }>({
    status: 'loading',
    ticket: null,
  });

  useEffect(() => {
    if (!id) {
      return;
    }
    let cancelled = false;
    repository
      .getTicket(id)
      .then((ticket) => {
        if (!cancelled) {
          setState(ticket ? { status: 'ready', ticket } : { status: 'notFound', ticket: null });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: 'error', ticket: null });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id, repository]);

  return id ? state : { status: 'notFound' as const, ticket: null };
}

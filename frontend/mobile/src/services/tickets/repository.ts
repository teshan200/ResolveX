import type {
  EvidenceFile,
  TicketDetail,
  TicketEvidence,
  TicketProgressUpdate,
  TicketSummary,
} from '@/types/ticket';

/**
 * Data-access contract for tickets. Replace the mock implementation with one that calls the real
 * API; screens only depend on this interface. Filtering and sorting are done on the client for
 * now; they can move server-side later by extending this contract.
 */
export type TicketsRepository = {
  /** Every ticket assigned to the signed-in staff member. */
  listTickets(): Promise<TicketSummary[]>;
  /** One ticket, or null when it does not exist (or is not assigned to the staff member). */
  getTicket(id: string): Promise<TicketSummary | null>;
  /** One ticket with its description, escalation and timeline, or null when it does not exist. */
  getTicketDetail(id: string): Promise<TicketDetail | null>;
  /**
   * Submits a progress update. Resolving means the update was accepted; a rejection means it
   * was not saved.
   */
  updateProgress(id: string, update: TicketProgressUpdate): Promise<void>;
  /**
   * Claims an assigned ticket for the signed-in staff member. Resolving means the claim was
   * accepted; a rejection means the ticket does not exist or can no longer be claimed.
   */
  claimTicket(id: string): Promise<void>;
  /**
   * Uploads one evidence file and scans it for malware. `onProgress` receives the fraction
   * uploaded (0 to 1). Resolving means the file was uploaded and scanned clean; a rejection means
   * it was not accepted.
   */
  uploadEvidenceFile(
    id: string,
    file: EvidenceFile,
    onProgress: (fraction: number) => void,
  ): Promise<void>;
  /**
   * Attaches already uploaded files and a caption to the ticket. A rejection means nothing was
   * attached.
   */
  attachEvidence(id: string, evidence: TicketEvidence): Promise<void>;
};

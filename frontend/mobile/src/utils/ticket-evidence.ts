import type { EvidenceFile } from '@/types/ticket';

export const EVIDENCE_MAX_BYTES = 10 * 1024 * 1024;

export const EVIDENCE_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'] as const;

const MB = 1024 * 1024;

/** "3.3 MB", or "820 KB" below one megabyte. */
export function formatFileSize(bytes: number): string {
  return bytes >= MB ? `${(bytes / MB).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** "64% · 2.1 of 3.3 MB" while a file is uploading. */
export function formatUploadProgress(fraction: number, totalBytes: number): string {
  const percent = Math.round(fraction * 100);
  const sent = `${((totalBytes * fraction) / MB).toFixed(1)}`;
  return `${percent}% · ${sent} of ${formatFileSize(totalBytes)}`;
}

/** "Attach 2 files" / "Attach 1 file". */
export function attachLabel(count: number): string {
  return count === 0 ? 'Attach files' : `Attach ${count} ${count === 1 ? 'file' : 'files'}`;
}

/** Why a file can't be attached, or null when it is fine. */
export function evidenceFileError(file: Pick<EvidenceFile, 'mimeType' | 'sizeBytes'>): string | null {
  if (!(EVIDENCE_MIME_TYPES as readonly string[]).includes(file.mimeType)) {
    return 'Only JPG, PNG or PDF files can be attached.';
  }
  if (file.sizeBytes > EVIDENCE_MAX_BYTES) {
    return 'Files can be up to 10 MB.';
  }
  return null;
}

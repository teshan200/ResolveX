import { MAX_PHOTO_BYTES, PHOTO_TYPES } from './options'

/** Returns an error message when the file cannot be attached, or null when it is fine. */
export function validatePhoto(file: File): string | null {
  if (!PHOTO_TYPES.includes(file.type)) return 'Unsupported file type. Use JPG, PNG or PDF.'
  if (file.size > MAX_PHOTO_BYTES) return 'File is too large. Use a file under 10 MB.'
  return null
}

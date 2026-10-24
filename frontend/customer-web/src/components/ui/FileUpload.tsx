import { useRef } from 'react'
import { CheckCircleIcon, ImageIcon, UploadIcon, XIcon } from '../icons'
import { cn } from './cn'

interface FileUploadProps {
  file: File | null
  onChange: (file: File | null) => void
  accept: string
  error?: string
}

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export function FileUpload({ file, onChange, accept, error }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const pick = (selected: File | undefined) => {
    onChange(selected ?? null)
    // Allow choosing the same file again after removing it.
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => pick(event.target.files?.[0])}
      />
      {file ? (
        <div
          className={cn(
            'flex items-center gap-3 rounded-lg border bg-surface p-3',
            error ? 'border-danger-solid' : 'border-line',
          )}
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-content-secondary">
            <ImageIcon className="size-5" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate text-sm/5 font-medium text-content">{file.name}</p>
            <p className="text-xs/4 text-content-tertiary">
              {formatSize(file.size)} · Uploaded · scanned clean
            </p>
          </div>
          {error ? null : <CheckCircleIcon className="size-[18px] shrink-0 text-success-solid" />}
          <button
            type="button"
            aria-label="Remove photo"
            onClick={() => pick(undefined)}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-content-tertiary hover:bg-muted focus-visible:outline-2 focus-visible:outline-line-focus"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-dashed bg-surface px-3 py-4 text-center',
            'hover:bg-muted focus-visible:outline-2 focus-visible:outline-line-focus',
            error ? 'border-danger-solid' : 'border-line-strong',
          )}
        >
          <UploadIcon className="size-5 text-content-brand" />
          <span className="text-sm/5 font-medium text-content">Tap to add a photo</span>
          <span className="text-xs/4 text-content-tertiary">JPG, PNG, WEBP or HEIC · up to 10 MB</span>
        </button>
      )}
      {error && <p className="text-xs/4 text-danger-fg">{error}</p>}
    </div>
  )
}

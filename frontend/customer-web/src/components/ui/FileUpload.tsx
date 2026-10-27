import { useRef, useState } from 'react'
import { AlertCircleIcon, CheckCircleIcon, FileTextIcon, ImageIcon, UploadIcon, XIcon } from '../icons'

interface FileUploadProps {
  file: File | null
  onChange: (file: File | null) => void
  accept: string
  hint: string
  /** Returns an error message for a file that cannot be attached, or null when it is fine. */
  validate: (file: File) => string | null
}

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export function FileUpload({ file, onChange, accept, hint, validate }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  // A file that failed validation is shown with its error but never becomes the form value.
  const [rejected, setRejected] = useState<{ name: string; message: string } | null>(null)

  const pick = (selected: File | undefined) => {
    const message = selected ? validate(selected) : null
    if (selected && message) {
      setRejected({ name: selected.name, message })
      onChange(null)
    } else {
      setRejected(null)
      onChange(selected ?? null)
    }
    // Allow choosing the same file again after removing it.
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeButton = (
    <button
      type="button"
      aria-label={rejected ? 'Dismiss file' : 'Remove photo'}
      onClick={() => pick(undefined)}
      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-content-tertiary hover:bg-muted focus-visible:outline-2 focus-visible:outline-line-focus"
    >
      <XIcon className="size-[18px]" />
    </button>
  )

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
      {rejected ? (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-lg border border-danger-border bg-danger-bg p-3"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-surface text-danger-fg">
            <AlertCircleIcon className="size-5" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate text-sm/5 font-medium text-content">{rejected.name}</p>
            <p className="text-xs/4 text-danger-fg">{rejected.message}</p>
          </div>
          {removeButton}
        </div>
      ) : file ? (
        <div className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-content-secondary">
            {file.type === 'application/pdf' ? (
              <FileTextIcon className="size-5" />
            ) : (
              <ImageIcon className="size-5" />
            )}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate text-sm/5 font-medium text-content">{file.name}</p>
            <p className="text-xs/4 text-content-tertiary">
              {formatSize(file.size)} · Uploaded · scanned clean
            </p>
          </div>
          <CheckCircleIcon className="size-[18px] shrink-0 text-success-solid" />
          {removeButton}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-dashed border-line-strong bg-surface px-3 py-4 text-center hover:bg-muted focus-visible:outline-2 focus-visible:outline-line-focus"
        >
          <UploadIcon className="size-5 text-content-brand" />
          <span className="text-sm/5 font-medium text-content">Tap to add a photo</span>
          <span className="text-xs/4 text-content-tertiary">{hint}</span>
        </button>
      )}
    </div>
  )
}

import { X } from 'lucide-react'
import { useEffect, useId } from 'react'
import type { ReactNode } from 'react'
import { IconButton } from './IconButton'

interface DrawerProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

// Right-hand panel that slides over the page, e.g. "Add branch".
export function Drawer({ open, title, description, onClose, children, footer }: DrawerProps) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-overlay/48" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full w-130 max-w-full flex-col bg-surface"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line-subtle px-6 pt-5 pb-4">
          <div className="flex min-w-0 flex-col gap-0.5">
            <h2 id={titleId} className="text-xl leading-7 font-semibold">
              {title}
            </h2>
            {description && (
              <p className="text-[13px] leading-4.5 text-content-secondary">{description}</p>
            )}
          </div>
          <IconButton icon={X} label="Close" size="sm" onClick={onClose} />
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-6">{children}</div>
        {footer && (
          <footer className="flex justify-end gap-3 border-t border-line-subtle px-6 py-4">
            {footer}
          </footer>
        )}
      </aside>
    </div>
  )
}

import { CircleCheck } from 'lucide-react'

interface ToastProps {
  /** Pass null to show nothing. */
  message: string | null
  /** Top right for "added", bottom right for shift changes (as in the design). */
  placement?: 'top' | 'bottom'
}

// Dark confirmation toast from the Figma design.
export function Toast({ message, placement = 'top' }: ToastProps) {
  return (
    <div role="status" aria-live="polite">
      {message && (
        <div
          className={`fixed right-8 z-50 flex w-[360px] max-w-[calc(100vw-4rem)] items-center gap-3 rounded-lg bg-inverse px-4 py-3 shadow-[0_12px_24px_-4px_rgba(11,19,18,0.1),0_4px_8px_-4px_rgba(11,19,18,0.05)] ${
            placement === 'top' ? 'top-22' : 'bottom-8'
          }`}
        >
          <CircleCheck size={18} className="shrink-0 text-green-500" aria-hidden />
          <p className="text-sm leading-5 font-medium text-content-inverse">{message}</p>
        </div>
      )}
    </div>
  )
}

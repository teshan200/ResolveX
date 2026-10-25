import { CircleCheck } from 'lucide-react'

/** Dark toast from the Figma design, shown top right. Pass null to render nothing. */
export function ReviewToast({ message }: { message: string | null }) {
  return (
    <div role="status" aria-live="polite">
      {message && (
        <div className="fixed top-22 right-8 z-50 flex w-[360px] max-w-[calc(100vw-4rem)] items-center gap-3 rounded-lg bg-inverse px-4 py-3 shadow-[0_12px_24px_-4px_rgba(11,19,18,0.1),0_4px_8px_-4px_rgba(11,19,18,0.05)]">
          <CircleCheck size={18} className="shrink-0 text-green-500" aria-hidden />
          <p className="text-sm leading-5 font-medium text-content-inverse">{message}</p>
        </div>
      )}
    </div>
  )
}

import { CircleAlert } from 'lucide-react'

interface AlertBannerProps {
  title: string
  description: string
  action?: string
  onAction?: () => void
}

export function AlertBanner({ title, description, action, onAction }: AlertBannerProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-danger-border bg-danger-bg px-4 py-3"
    >
      <CircleAlert size={20} className="shrink-0 text-danger-fg" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-sm leading-5 font-semibold text-danger-fg">{title}</p>
        <p className="text-[13px] leading-4.5 text-content-secondary">{description}</p>
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="cursor-pointer text-[13px] leading-4.5 font-medium whitespace-nowrap text-danger-fg hover:underline"
        >
          {action}
        </button>
      )}
    </div>
  )
}

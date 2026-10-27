import { AlertCircleIcon } from '../icons'

interface AlertBannerProps {
  title: string
  description?: string
}

export function AlertBanner({ title, description }: AlertBannerProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-danger-border bg-danger-bg px-4 py-3"
    >
      <AlertCircleIcon className="size-5 shrink-0 text-danger-fg" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-sm font-semibold text-danger-fg">{title}</p>
        {description && <p className="text-[13px]/[18px] text-content-secondary">{description}</p>}
      </div>
    </div>
  )
}

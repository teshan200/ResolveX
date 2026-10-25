import { Info, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

interface CalloutProps {
  tone: 'info' | 'warning'
  title: string
  children: ReactNode
  /** Link-style action on the right, e.g. "Review". */
  action?: { label: string; onClick: () => void }
}

const styles = {
  info: { box: 'border-info-border bg-info-bg', title: 'text-info-fg', Icon: Info },
  warning: { box: 'border-warning-border bg-warning-bg', title: 'text-warning-fg', Icon: TriangleAlert },
}

// Coloured note with an icon, a bold title and a line of text.
export function Callout({ tone, title, children, action }: CalloutProps) {
  const { box, title: titleColour, Icon } = styles[tone]
  return (
    <div className={`flex gap-3 rounded-lg border px-4 py-3 ${box}`}>
      <Icon size={18} className={`mt-0.5 shrink-0 ${titleColour}`} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className={`text-sm leading-5 font-semibold ${titleColour}`}>{title}</p>
        <p className="text-[13px] leading-4.5 text-content-secondary">{children}</p>
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={`h-fit shrink-0 cursor-pointer text-[13px] leading-4.5 font-semibold hover:underline ${titleColour}`}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

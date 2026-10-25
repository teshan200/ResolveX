import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">{title}</h1>
        <p className="text-sm leading-5 text-content-secondary">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 gap-3">{actions}</div>}
    </div>
  )
}

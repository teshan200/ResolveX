import { Badge } from '../components/ui'

export function TopBar({ roleLabel }: { roleLabel: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-end border-b border-line bg-surface px-6">
      <Badge tone="brand">{roleLabel}</Badge>
    </header>
  )
}

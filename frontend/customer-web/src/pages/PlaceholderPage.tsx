import { Card } from '../components/ui'

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-4">
      <Card className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-content">{title}</h1>
        <p className="text-sm text-content-secondary">This screen is not built yet.</p>
      </Card>
    </div>
  )
}

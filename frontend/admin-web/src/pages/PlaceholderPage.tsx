import { Card } from '../components/ui'

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <Card className="text-sm text-content-secondary">
        This screen has not been built yet.
      </Card>
    </div>
  )
}

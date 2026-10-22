import { useState } from 'react'
import { Badge, Button, Card, Input, Modal, PriorityBadge, StatusBadge } from './components/ui'

function App() {
  const [open, setOpen] = useState(false)

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-3xl font-bold text-brand">ResolveX Admin</h1>
      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
          <Button loading>Saving</Button>
        </div>
        <Input label="Company name" helper="As registered" placeholder="Enter name" />
        <Input label="Email" error="Enter a valid email" defaultValue="abc" />
        <div className="flex flex-wrap gap-2">
          <Badge tone="brand">Pro</Badge>
          <StatusBadge status="In Progress" />
          <PriorityBadge priority="Critical" />
        </div>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open modal
        </Button>
      </Card>
      <Modal
        open={open}
        title="Suspend tenant"
        onClose={() => setOpen(false)}
        footer={<Button onClick={() => setOpen(false)}>Close</Button>}
      >
        Modal content goes here.
      </Modal>
    </main>
  )
}

export default App

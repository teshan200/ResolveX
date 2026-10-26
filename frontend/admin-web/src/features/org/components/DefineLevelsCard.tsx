import { Lock, Plus, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button, Input } from '../../../components/ui'
import type { HierarchyLevel } from '../types'

// Numbered white card used for the two steps on Configure hierarchy.
export function StepCard({
  step,
  title,
  description,
  action,
  children,
}: {
  step: number
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface">
      <header className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs leading-4 font-semibold text-on-brand">
          {step}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base leading-6 font-semibold">{title}</h2>
          <p className="text-xs leading-4 text-content-tertiary">{description}</p>
        </div>
        {action}
      </header>
      {children}
    </section>
  )
}

interface DefineLevelsCardProps {
  /** Highest level first, including Branch Manager and Tenant Admin. */
  levels: HierarchyLevel[]
  onAdd: () => void
  onRename: (level: number, name: string) => void
  onRemove: (level: number) => void
}

const plural = (count: number) => `${count} ${count === 1 ? 'designation' : 'designations'}`

// Step 1: name the ordinary levels. Branch Manager (n+1) and Tenant Admin (n+2) are fixed and locked.
export function DefineLevelsCard({ levels, onAdd, onRename, onRemove }: DefineLevelsCardProps) {
  return (
    <StepCard
      step={1}
      title="Define levels"
      description="Ordinary levels run from Level 1 upward with no gaps. Name each one."
      action={
        <Button variant="outline" size="sm" className="font-medium!" onClick={onAdd}>
          <Plus size={16} />
          Add level
        </Button>
      }
    >
      <div className="flex flex-col gap-3 p-5">
        {levels.map((level) =>
          level.reserved ? (
            <div key={level.level} className="flex h-11.5 items-center gap-3 rounded-lg bg-brand px-4 text-on-brand">
              <span className="flex h-7 items-center rounded-md bg-brand-pressed px-3 text-xs leading-4 font-semibold">
                L{level.level}
              </span>
              <span className="flex-1 text-sm leading-5 font-semibold">{level.name}</span>
              <span className="text-xs leading-4 opacity-80">{level.name === 'Tenant Admin' ? 'n+2' : 'n+1'}</span>
              <Lock size={14} className="opacity-80" />
            </div>
          ) : (
            <div key={level.level} className="flex items-start gap-3 rounded-lg border border-line px-4 py-3">
              <span className="mt-1.5 flex h-7 shrink-0 items-center rounded-md bg-brand-subtle px-3 text-xs leading-4 font-semibold text-content-brand">
                L{level.level}
              </span>
              <div className="min-w-0 flex-1">
                <Input
                  aria-label={`Name of level ${level.level}`}
                  placeholder="Name this level"
                  value={level.name}
                  error={level.name.trim() === '' ? `Level ${level.level} needs a name` : undefined}
                  onChange={(event) => onRename(level.level, event.target.value)}
                />
              </div>
              <span className="mt-2.5 shrink-0 text-xs leading-4 text-content-tertiary">
                {plural(level.designations.length)}
              </span>
              {level.level === 1 ? (
                <span className="mt-2.5 flex w-20 shrink-0 items-center gap-1 text-xs leading-4 text-content-tertiary">
                  <Lock size={12} />
                  Required
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onRemove(level.level)}
                  className="mt-2.5 flex w-20 shrink-0 cursor-pointer items-center gap-1.5 text-[13px] leading-4.5 font-medium text-danger-fg hover:underline"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              )}
            </div>
          ),
        )}
      </div>
    </StepCard>
  )
}

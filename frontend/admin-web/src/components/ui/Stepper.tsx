import { cn } from './cn'

interface StepperProps {
  steps: string[]
  current: number
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, index) => {
        const number = index + 1
        const done = number < current
        const active = number === current

        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                'flex size-6 items-center justify-center rounded-full text-xs font-semibold',
                done || active
                  ? 'bg-brand text-on-brand'
                  : 'bg-muted text-content-tertiary',
              )}
            >
              {done ? '✓' : number}
            </span>
            <span
              className={cn(
                'text-sm font-medium',
                active ? 'text-content' : 'text-content-tertiary',
              )}
            >
              {label}
            </span>
            {number < steps.length && (
              <span aria-hidden className="mx-1 h-px w-6 bg-line-strong" />
            )}
          </li>
        )
      })}
    </ol>
  )
}

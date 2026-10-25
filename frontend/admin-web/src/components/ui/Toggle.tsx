import { cn } from './cn'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

// On/off switch with its label to the right, e.g. "Active — branch can receive feedback".
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm leading-5 text-content">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus',
          checked ? 'bg-brand' : 'bg-line-strong',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 size-4 rounded-full bg-surface transition-transform',
            checked && 'translate-x-4',
          )}
        />
      </button>
      {label}
    </label>
  )
}

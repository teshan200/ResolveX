import { Check } from 'lucide-react'
import type { ComponentProps } from 'react'

interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type'> {
  label: string
}

export function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm leading-5">
      <input type="checkbox" className="peer sr-only" {...props} />
      <span className="flex size-4.5 shrink-0 items-center justify-center rounded-xs border border-line-strong bg-surface text-transparent peer-checked:border-brand peer-checked:bg-brand peer-checked:text-on-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-line-focus">
        <Check size={14} />
      </span>
      {label}
    </label>
  )
}

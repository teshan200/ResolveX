interface RadioGroupProps<T extends string> {
  name: string
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
}

export function RadioGroup<T extends string>({
  name,
  label,
  value,
  options,
  onChange,
}: RadioGroupProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-x-5 gap-y-2">
      {options.map((option) => (
        <label key={option} className="flex cursor-pointer items-center gap-2 text-sm/5 text-content">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className="size-[18px] shrink-0 rounded-full border-[1.5px] border-line-strong bg-surface peer-checked:border-brand peer-checked:bg-brand peer-checked:shadow-[inset_0_0_0_3.5px_var(--color-surface)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-line-focus"
          />
          {option}
        </label>
      ))}
    </div>
  )
}

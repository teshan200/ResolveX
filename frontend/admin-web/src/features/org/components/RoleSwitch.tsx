import { cn } from '../../../components/ui/cn'

export type Role = 'ordinary' | 'manager'

const options: { value: Role; label: string }[] = [
  { value: 'ordinary', label: 'Ordinary employee' },
  { value: 'manager', label: 'Branch Manager' },
]

// Two-way switch for an employee's role.
export function RoleSwitch({ value, onChange }: { value: Role; onChange: (role: Role) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] leading-4.5 font-medium text-content">Role</span>
      <div role="radiogroup" aria-label="Role" className="flex h-11 gap-1 rounded-lg bg-muted p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 cursor-pointer rounded-md text-sm leading-5 transition-colors',
              value === option.value
                ? 'bg-surface font-medium text-content shadow-[0_1px_2px_rgba(11,19,18,0.12)]'
                : 'text-content-secondary hover:text-content',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

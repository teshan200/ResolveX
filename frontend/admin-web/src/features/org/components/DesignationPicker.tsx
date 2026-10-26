import { Check, ChevronDown, ChevronUp, Info, Network, Search, Settings } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../../components/ui/cn'
import type { DesignationGroup } from '../../../services/orgService'

interface DesignationPickerProps {
  groups: DesignationGroup[]
  value: string
  onChange: (designation: string) => void
  /** Designations the company defined but did not place on a level. */
  unusedCount: number
  error?: string
  /** 'branch' is the Branch Manager's wording: they can't edit the hierarchy, so there is no link to it. */
  variant?: 'tenant' | 'branch'
}

// Searchable designation list grouped by hierarchy level. Empty groups is the "No eligible designations" state.
export function DesignationPicker({ groups, value, onChange, unusedCount, error, variant = 'tenant' }: DesignationPickerProps) {
  const empty = groups.length === 0
  const [open, setOpen] = useState(empty)
  const [query, setQuery] = useState('')
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const total = groups.reduce((sum, group) => sum + group.designations.length, 0)
  const needle = query.trim().toLowerCase()
  const visible = groups
    .map((group) => ({
      ...group,
      designations: group.designations.filter((name) => name.toLowerCase().includes(needle)),
    }))
    .filter((group) => group.designations.length > 0)

  const Chevron = open ? ChevronUp : ChevronDown

  return (
    <div ref={root} className="relative flex flex-col gap-1.5">
      <span className="text-[13px] leading-4.5 font-medium text-content">Designation</span>
      <button
        type="button"
        aria-label="Designation"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'flex h-10 cursor-pointer items-center justify-between rounded-md border bg-surface px-3 text-left text-sm leading-5',
          error
            ? 'border-danger-fg'
            : open
              ? 'border-line-focus shadow-[inset_0_0_0_0.5px_var(--color-line-focus),0_0_0_3px_rgba(42,140,126,0.35)]'
              : 'border-line',
        )}
      >
        <span className={cn(value && !open ? 'text-content' : 'text-content-tertiary')}>
          {empty ? 'No eligible designations' : value || 'Select a designation'}
        </span>
        <Chevron size={18} className="text-content-tertiary" />
      </button>
      {error && <p className="text-xs text-danger-fg">{error}</p>}

      {open && (
        <div className="absolute top-full right-0 left-0 z-20 mt-1 rounded-lg border border-line bg-surface shadow-[0_12px_24px_-4px_rgba(11,19,18,0.1),0_4px_8px_-4px_rgba(11,19,18,0.05)]">
          {empty ? (
            <div className="flex flex-col items-center gap-1 px-6 py-5 text-center">
              <Network size={20} className="text-content-tertiary" />
              {variant === 'branch' ? (
                <>
                  <p className="text-[13px] leading-4.5 font-semibold">No designations available yet</p>
                  <p className="text-xs leading-4 text-content-secondary">
                    Your Tenant Admin needs to add designations to the company hierarchy (Tenant Admin › Hierarchy)
                    before you can add employees.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[13px] leading-4.5 font-semibold">No eligible designations yet</p>
                  <p className="text-xs leading-4 text-content-secondary">
                    Designations become available once you add them to a level in Hierarchy.
                  </p>
                  <Link
                    to="/tenant/hierarchy"
                    className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-md bg-brand-subtle px-3 text-[13px] font-medium text-content-brand hover:bg-brand-muted"
                  >
                    <Settings size={16} />
                    Configure hierarchy
                  </Link>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="p-1">
                <label className="flex h-10 items-center gap-2 rounded-md border border-line-focus px-3 shadow-[0_0_0_3px_rgba(42,140,126,0.35)]">
                  <Search size={18} className="shrink-0 text-content-tertiary" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={`Search ${total} eligible designations…`}
                    className="min-w-0 flex-1 bg-transparent text-sm leading-5 outline-none placeholder:text-content-tertiary"
                  />
                </label>
              </div>
              <ul role="listbox" className="max-h-65 overflow-y-auto px-1 pb-1">
                {visible.map((group) => (
                  <li key={group.level}>
                    <p className="px-3 pt-2 pb-1 text-[11px] leading-4 font-semibold tracking-[0.6px] text-content-tertiary uppercase">
                      Level {group.level}
                    </p>
                    <ul>
                      {group.designations.map((name) => (
                        <li key={name}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={name === value}
                            onClick={() => {
                              onChange(name)
                              setOpen(false)
                              setQuery('')
                            }}
                            className={cn(
                              'flex h-8 w-full cursor-pointer items-center justify-between rounded-md px-3 text-left text-sm leading-5',
                              name === value ? 'bg-brand-subtle text-content-brand' : 'hover:bg-muted',
                            )}
                          >
                            {name}
                            {name === value && <Check size={16} />}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
                {visible.length === 0 && (
                  <li className="px-3 py-4 text-center text-[13px] text-content-secondary">No designations match.</li>
                )}
              </ul>
              <p className="flex gap-2 border-t border-line-subtle px-4 py-3 text-xs leading-4 text-content-secondary">
                <Info size={14} className="mt-px shrink-0 text-content-tertiary" />
                {variant === 'branch'
                  ? 'Only designations in your company’s hierarchy are listed.'
                  : `Make someone a Branch Manager from Edit employee › Role. ${unusedCount} designations aren’t in your hierarchy.`}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

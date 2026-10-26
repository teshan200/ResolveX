import { ChevronDown, Lock } from 'lucide-react'
import { cn } from '../../../components/ui/cn'
import type { HierarchyLevel } from '../types'
import { DesignationTag } from './DesignationTag'

interface HierarchyTreeProps {
  /** Highest level first. */
  levels: HierarchyLevel[]
  /** The smaller tree shown beside the Configure form. */
  compact?: boolean
}

const reservedNote = (level: HierarchyLevel) =>
  level.name === 'Tenant Admin'
    ? `Level ${level.level} · n+2 · highest authority`
    : `Level ${level.level} · n+1 · one per branch, assigned in Employees`

function LevelMark({ level, reserved }: { level: number; reserved: boolean }) {
  return (
    <span
      className={cn(
        'flex h-7 shrink-0 items-center justify-center rounded-md px-3 text-xs leading-4 font-semibold',
        reserved ? 'bg-brand-pressed text-on-brand' : 'bg-brand-subtle text-content-brand',
      )}
    >
      L{level}
    </span>
  )
}

// The company's levels from top to bottom, with each designation on its level.
// Branch Manager and Tenant Admin are dark and locked because the hierarchy places them automatically.
export function HierarchyTree({ levels, compact = false }: HierarchyTreeProps) {
  return (
    <div className="flex flex-col items-stretch">
      {levels.map((level, index) => (
        <div key={level.level} className="flex flex-col items-stretch">
          {index > 0 && (
            <div className="flex flex-col items-center py-0.5 text-content-tertiary" aria-hidden>
              <span className="h-2 w-px bg-line" />
              <ChevronDown size={14} />
            </div>
          )}

          {level.reserved ? (
            <div
              className={cn(
                'flex items-center gap-3 rounded-lg bg-brand px-4 text-on-brand',
                compact ? 'h-9.5' : 'h-17',
              )}
            >
              <LevelMark level={level.level} reserved />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm leading-5 font-semibold">{level.name}</span>
                {!compact && <span className="truncate text-xs leading-4 opacity-80">{reservedNote(level)}</span>}
              </div>
              <Lock size={14} className="shrink-0 opacity-80" />
            </div>
          ) : (
            <div
              className={cn(
                'flex flex-col rounded-lg border-2 border-line-strong bg-surface',
                compact ? 'gap-2.5 p-3' : 'gap-3 p-4',
              )}
            >
              <div className="flex items-center gap-3">
                <LevelMark level={level.level} reserved={false} />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm leading-5 font-semibold">
                    Level {level.level}: {level.name}
                  </span>
                  {!compact && (
                    <span className="text-xs leading-4 text-content-tertiary">
                      {level.level === 1 ? 'Lowest level · required' : 'Ordinary level'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {level.designations.length === 0 ? (
                  <DesignationTag>No designations assigned</DesignationTag>
                ) : (
                  level.designations.map((name) => <DesignationTag key={name}>{name}</DesignationTag>)
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

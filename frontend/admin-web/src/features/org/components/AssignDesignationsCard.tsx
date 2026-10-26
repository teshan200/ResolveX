import { CircleAlert, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button, Select, Table } from '../../../components/ui'
import type { Column } from '../../../components/ui'
import { BRANCH_MANAGER_DESIGNATION } from '../mocks'
import type { Hierarchy, HierarchyLevel } from '../types'
import { StepCard } from './DefineLevelsCard'

interface AssignDesignationsCardProps {
  draft: Hierarchy
  /** Moves a designation onto an ordinary level, or off the hierarchy when level is null. */
  onAssign: (designation: string, level: number | null) => void
}

const levelLabel = (level: HierarchyLevel) => (level.name.trim() ? `Level ${level.level} — ${level.name}` : `Level ${level.level}`)

interface Row {
  designation: string
  level: HierarchyLevel
}

// Step 2: choose a designation and a level. Each designation sits on one level only.
export function AssignDesignationsCard({ draft, onAssign }: AssignDesignationsCardProps) {
  const ordinary = draft.levels.filter((level) => !level.reserved)
  const lowest = ordinary.find((level) => level.level === 1) ?? ordinary[ordinary.length - 1]
  const placedNames = ordinary.flatMap((level) => level.designations)
  const choices = [BRANCH_MANAGER_DESIGNATION, ...draft.unused, ...placedNames]

  const [designation, setDesignation] = useState(
    draft.unused.includes('Security Guard') ? 'Security Guard' : (draft.unused[0] ?? placedNames[0] ?? ''),
  )
  const [levelNumber, setLevelNumber] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const bmLevel = draft.levels.find((level) => level.name === BRANCH_MANAGER_DESIGNATION)?.level
  const target = ordinary.find((level) => level.level === levelNumber) ?? lowest
  const options = ordinary.map(levelLabel)

  const add = () => {
    if (designation === BRANCH_MANAGER_DESIGNATION) {
      setError(
        `Branch Manager is reserved at Level ${bmLevel} (n+1) and is assigned in Employees, not on an ordinary level.`,
      )
      return
    }
    setError(null)
    if (target) onAssign(designation, target.level)
  }

  const rows: Row[] = ordinary
    .slice()
    .sort((a, b) => b.level - a.level)
    .flatMap((level) => level.designations.map((name) => ({ designation: name, level })))

  const columns: Column<Row>[] = [
    {
      key: 'designation',
      header: 'Designation',
      render: (row) => <span className="truncate text-[13px] leading-4.5">{row.designation}</span>,
    },
    {
      key: 'level',
      header: 'Level',
      width: 300,
      render: (row) => (
        <div className="w-full max-w-60">
          <Select
            aria-label={`Level for ${row.designation}`}
            options={options}
            value={levelLabel(row.level)}
            onChange={(event) => {
              const next = ordinary.find((level) => levelLabel(level) === event.target.value)
              if (next) onAssign(row.designation, next.level)
            }}
          />
        </div>
      ),
    },
    {
      key: 'remove',
      header: '',
      width: 100,
      render: (row) => (
        <button
          type="button"
          onClick={() => onAssign(row.designation, null)}
          className="cursor-pointer text-[13px] leading-4.5 font-medium text-danger-fg hover:underline"
        >
          Remove
        </button>
      ),
    },
  ]

  return (
    <StepCard
      step={2}
      title="Assign designations"
      description="Choose a designation and one of your levels. Each designation sits on one level only."
    >
      <div className="flex flex-col gap-3 px-5 pt-4 pb-5">
        <div className="flex items-end gap-3">
          <div className="w-61">
            <Select
              label="Designation"
              options={choices}
              value={designation}
              error={error ?? undefined}
              hideErrorText
              onChange={(event) => {
                setDesignation(event.target.value)
                setError(null)
              }}
            />
          </div>
          <div className="w-61">
            <Select
              label="Level"
              options={options}
              value={target ? levelLabel(target) : ''}
              onChange={(event) => {
                const next = ordinary.find((level) => levelLabel(level) === event.target.value)
                if (next) setLevelNumber(next.level)
              }}
            />
          </div>
          <Button className="font-semibold!" onClick={add}>
            <Plus size={18} />
            Add assignment
          </Button>
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-xs leading-4 text-danger-fg">
            <CircleAlert size={14} className="shrink-0" />
            {error}
          </p>
        )}

        <div className="overflow-hidden rounded-lg border border-line">
          <Table columns={columns} rows={rows} rowKey={(row) => row.designation} rowHeight={45} />
        </div>

        <p className="text-xs leading-4 text-content-tertiary">
          Not used ({draft.unused.length}): {draft.unused.join(', ')}
        </p>
      </div>
    </StepCard>
  )
}

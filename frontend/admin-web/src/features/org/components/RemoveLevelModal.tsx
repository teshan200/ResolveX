import { Info } from 'lucide-react'
import { useState } from 'react'
import { Button, Modal } from '../../../components/ui'
import { countEmployeesWith } from '../../../services/orgService'
import type { Hierarchy } from '../types'
import { DesignationTag } from './DesignationTag'

interface RemoveLevelModalProps {
  draft: Hierarchy
  /** The ordinary level being removed, or null when the dialog is closed. */
  level: number | null
  onClose: () => void
  /** moveToLowest: keep the designations by moving them to Level 1. Otherwise they leave the hierarchy. */
  onConfirm: (level: number, moveToLowest: boolean) => void
}

// Asks what happens to a level's designations before the level is removed and the ones above it are renumbered.
export function RemoveLevelModal({ draft, level, onClose, onConfirm }: RemoveLevelModalProps) {
  const [choice, setChoice] = useState<'move' | 'remove'>('move')
  const target = draft.levels.find((l) => l.level === level && !l.reserved)
  const lowest = draft.levels.find((l) => l.level === 1)

  if (!target || level === null) return <Modal open={false} title="" onClose={onClose}>{null}</Modal>

  const employees = countEmployeesWith(target.designations)
  const ordinary = draft.levels.filter((l) => !l.reserved)
  const remaining = ordinary.length - 1
  const shifted = ordinary
    .filter((l) => l.level > level)
    .sort((a, b) => b.level - a.level)
    .map((l) => `Level ${l.level}${l.name ? `: ${l.name}` : ''} becomes Level ${l.level - 1} (name and designations kept)`)
  const consequences = [...shifted, `Branch Manager becomes Level ${remaining + 1}`, `Tenant Admin becomes Level ${remaining + 2}`]
  const empty = target.designations.length === 0

  return (
    <Modal
      open
      size="lg"
      title={`Remove Level ${target.level}${target.name ? `: ${target.name}` : ''}?`}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" className="font-semibold!" onClick={onClose}>
            Keep level
          </Button>
          <Button
            variant="destructive"
            className="font-semibold!"
            onClick={() => onConfirm(target.level, !empty && choice === 'move')}
          >
            Remove &amp; renumber
          </Button>
        </>
      }
    >
      <p className="text-sm leading-5 text-content-secondary">
        {empty
          ? 'No designations sit on this level. '
          : `${target.designations.length} ${target.designations.length === 1 ? 'designation' : 'designations'} (${employees} employees) sit on this level. Choose what happens to them. `}
        Nothing changes until you save the hierarchy.
      </p>

      {!empty && (
        <>
          <div className="flex flex-wrap gap-2">
            {target.designations.map((name) => (
              <DesignationTag key={name}>{name}</DesignationTag>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex cursor-pointer items-center gap-3 text-sm leading-5">
              <input
                type="radio"
                name="remove-level"
                className="size-4.5 accent-brand"
                checked={choice === 'move'}
                onChange={() => setChoice('move')}
              />
              Move these designations to Level 1{lowest?.name ? ` — ${lowest.name}` : ''}
            </label>
            <label className="flex cursor-pointer items-center gap-3 text-sm leading-5">
              <input
                type="radio"
                name="remove-level"
                className="size-4.5 accent-brand"
                checked={choice === 'remove'}
                onChange={() => setChoice('remove')}
              />
              Remove them from the hierarchy and flag {employees} employees for reassignment
            </label>
          </div>
        </>
      )}

      <p className="flex gap-2 rounded-lg bg-info-bg px-3 py-2.5 text-xs leading-4.5 text-info-fg">
        <Info size={14} className="mt-0.5 shrink-0" />
        {consequences.join(' · ')}.
      </p>
    </Modal>
  )
}

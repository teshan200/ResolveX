import { Check } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, PageHeader } from '../components/ui'
import { AssignDesignationsCard } from '../features/org/components/AssignDesignationsCard'
import { CheckAndSavePanel } from '../features/org/components/CheckAndSavePanel'
import { DefineLevelsCard } from '../features/org/components/DefineLevelsCard'
import { HierarchyTree } from '../features/org/components/HierarchyTree'
import { RemoveLevelModal } from '../features/org/components/RemoveLevelModal'
import type { Hierarchy } from '../features/org/types'
import { useBreadcrumb } from '../layout/breadcrumb'
import {
  addLevel,
  assignDesignation,
  getHierarchy,
  removeLevel,
  renameLevel,
  saveHierarchy,
  validateHierarchy,
} from '../services/orgService'

// Edit a copy of the hierarchy. Nothing is saved until "Save hierarchy", and an invalid draft can't be saved.
export function HierarchyConfigurePage() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState<Hierarchy | null>(null)
  const [removing, setRemoving] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  useBreadcrumb(['Hierarchy', 'Configure'])

  useEffect(() => {
    getHierarchy().then(setDraft)
  }, [])

  const validation = useMemo(() => (draft ? validateHierarchy(draft) : null), [draft])

  if (!draft || !validation) {
    return <p className="text-sm leading-5 text-content-secondary">Loading hierarchy…</p>
  }

  const backToHierarchy = () => navigate('/tenant/hierarchy')

  const save = async () => {
    setSaving(true)
    await saveHierarchy(draft)
    backToHierarchy()
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Configure hierarchy"
        description="Step 1: define and name your levels. Step 2: assign designations to them."
        actions={
          <>
            <Button variant="outline" className="font-semibold!" onClick={backToHierarchy}>
              Cancel
            </Button>
            <Button
              className="font-semibold!"
              disabled={!validation.valid}
              loading={saving}
              onClick={save}
            >
              <Check size={18} />
              {validation.valid
                ? 'Save hierarchy'
                : `Fix ${validation.issues} ${validation.issues === 1 ? 'issue' : 'issues'} to save`}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-6">
        <div className="flex flex-col gap-6">
          <DefineLevelsCard
            levels={draft.levels}
            onAdd={() => setDraft(addLevel(draft))}
            onRename={(level, name) => setDraft(renameLevel(draft, level, name))}
            onRemove={setRemoving}
          />
          <AssignDesignationsCard
            draft={draft}
            onAssign={(designation, level) => setDraft(assignDesignation(draft, designation, level))}
          />
        </div>

        <div className="flex flex-col gap-6">
          <CheckAndSavePanel checks={validation.checks} />
          <section className="overflow-hidden rounded-xl border border-line bg-surface">
            <header className="border-b border-line-subtle px-5 py-4">
              <h2 className="text-base leading-6 font-semibold">Draft preview</h2>
              <p className="text-xs leading-4 text-content-tertiary">Updates as you edit</p>
            </header>
            <div className="p-5">
              <HierarchyTree levels={draft.levels} compact />
            </div>
          </section>
        </div>
      </div>

      <RemoveLevelModal
        draft={draft}
        level={removing}
        onClose={() => setRemoving(null)}
        onConfirm={(level, moveToLowest) => {
          setDraft(removeLevel(draft, level, moveToLowest))
          setRemoving(null)
        }}
      />
    </div>
  )
}

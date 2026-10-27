import { useState } from 'react'
import { CheckCircleIcon } from '../../components/icons'
import { Button } from '../../components/ui'
import type { CaseDetail } from './types'

interface ResolutionCardProps {
  detail: CaseDetail
  /** Confirms the case is resolved; rejects when it could not be saved. */
  onConfirm: () => Promise<void>
}

export function ResolutionCard({ detail, onConfirm }: ResolutionCardProps) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const confirm = async () => {
    setPending(true)
    setError(null)
    try {
      await onConfirm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-line-subtle bg-surface p-4">
      <h2 className="text-base font-semibold text-content">Resolution</h2>

      {detail.status === 'Resolved' ? (
        <p className="flex items-start gap-2 text-[13px]/[18px] text-content-secondary">
          <CheckCircleIcon className="mt-px size-4 shrink-0 text-success-solid" />
          You confirmed this case is resolved. Thank you for letting us know.
        </p>
      ) : (
        <>
          <p className="text-[13px]/[18px] text-content-secondary">
            When the branch resolves your issue, the final resolution appears here and we send you
            one email. You can confirm it’s resolved.
          </p>
          {error && (
            <p role="alert" className="text-xs/4 text-danger-fg">
              {error}
            </p>
          )}
          <Button
            loading={pending}
            disabled={!detail.branchResolved}
            onClick={confirm}
            className="w-full font-semibold disabled:bg-muted disabled:text-content-disabled disabled:opacity-100"
          >
            {pending ? 'Confirming…' : 'Confirm resolved'}
          </Button>
        </>
      )}
    </section>
  )
}

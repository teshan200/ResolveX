import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '../components/icons'
import { CaseProgressCard } from '../features/tracking/CaseProgressCard'
import { CaseSummaryCard } from '../features/tracking/CaseSummaryCard'
import { ExpectedResolutionCard } from '../features/tracking/ExpectedResolutionCard'
import { ResolutionCard } from '../features/tracking/ResolutionCard'
import type { CaseDetail } from '../features/tracking/types'
import { confirmResolved, getCase } from '../services/trackingService'

type LoadState = { status: 'loading' } | { status: 'ready'; detail: CaseDetail } | { status: 'error' }

export function CaseDetailPage() {
  const { caseId = '' } = useParams()
  const [load, setLoad] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    getCase(caseId)
      .then((detail) => !cancelled && setLoad({ status: 'ready', detail }))
      .catch(() => !cancelled && setLoad({ status: 'error' }))
    return () => {
      cancelled = true
    }
  }, [caseId])

  // No case with this ID: go back to the lookup.
  if (load.status === 'error') {
    return <Navigate to="/track" replace state={{ caseId }} />
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <Link
        to="/track"
        state={{ caseId }}
        className="flex w-fit items-center gap-1.5 text-[13px]/[18px] font-semibold text-content-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
      >
        <ArrowLeftIcon className="size-4" />
        Back to case lookup
      </Link>

      {load.status === 'loading' ? (
        <div aria-busy className="h-60 animate-pulse rounded-xl bg-muted" />
      ) : (
        <>
          <CaseSummaryCard detail={load.detail} />
          <ExpectedResolutionCard expected={load.detail.expected} />
          <CaseProgressCard detail={load.detail} />
          <ResolutionCard
            detail={load.detail}
            onConfirm={async () => {
              const detail = await confirmResolved(caseId)
              setLoad({ status: 'ready', detail })
            }}
          />
        </>
      )}
    </div>
  )
}

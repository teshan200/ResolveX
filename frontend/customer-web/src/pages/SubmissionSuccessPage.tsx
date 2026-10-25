import { useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CheckIcon,
  CopyIcon,
  MailIcon,
  UserCheckIcon,
} from '../components/icons'
import { Button, FormCard } from '../components/ui'
import type { FeedbackReceipt } from '../services/feedbackService'

function Step({
  icon,
  done,
  title,
  detail,
}: {
  icon: ReactNode
  done?: boolean
  title: string
  detail: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-full [&>svg]:size-4 ${
          done ? 'bg-success-bg text-success-solid' : 'bg-muted text-content-secondary'
        }`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm/5 font-medium text-content">{title}</p>
        <p className="text-xs/4 text-content-tertiary">{detail}</p>
      </div>
    </div>
  )
}

export function SubmissionSuccessPage() {
  const { qrId = '' } = useParams()
  const receipt = useLocation().state as FeedbackReceipt | null
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  // Opened directly (not via a submission): there is nothing to confirm, so go back to the form.
  if (!receipt) return <Navigate to={`/feedback/${qrId}`} replace />

  const firstName = receipt.name?.split(' ')[0]

  const copyCaseId = async () => {
    try {
      await navigator.clipboard.writeText(receipt.caseId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked (for example on insecure origins); the ID stays visible to copy by hand.
    }
  }

  return (
    <div className="flex flex-col gap-5 px-4 pt-8 pb-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-[72px] items-center justify-center rounded-full bg-success-bg">
          <span className="flex size-[52px] items-center justify-center rounded-full bg-success-solid text-on-brand">
            <CheckIcon className="size-[26px]" />
          </span>
        </span>
        <h1 className="text-2xl/8 font-semibold tracking-tight text-content">
          {firstName ? `Thank you, ${firstName}!` : 'Thank you!'}
        </h1>
        <p className="max-w-80 text-sm/5 text-content-secondary">
          Your feedback reached the {receipt.branch} team. A manager will review it within 15 minutes.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-xs/4 font-medium text-content-tertiary">Your case ID</p>
          <p className="text-xl/7 font-semibold tracking-tight text-content">{receipt.caseId}</p>
        </div>
        <button
          type="button"
          aria-label={copied ? 'Case ID copied' : 'Copy case ID'}
          onClick={copyCaseId}
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md bg-brand-subtle text-content-brand hover:bg-brand-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
        >
          {copied ? <CheckIcon className="size-[18px]" /> : <CopyIcon className="size-[18px]" />}
        </button>
      </div>

      <FormCard title="What happens next">
        <Step
          done
          icon={<CheckCircleIcon />}
          title="Feedback received"
          detail={receipt.table ? `Just now · Table ${receipt.table}` : 'Just now'}
        />
        <Step
          icon={<UserCheckIcon />}
          title="Reviewed by the branch team"
          detail="Usually within 15 minutes"
        />
        <Step
          icon={<MailIcon />}
          title={receipt.email ? 'We’ll email you when it’s resolved' : 'Track progress with your case ID'}
          detail={receipt.email ?? 'No email given — keep your case ID safe'}
        />
      </FormCard>

      <div className="flex flex-col gap-2">
        <Button
          size="lg"
          className="w-full text-base"
          onClick={() => navigate('/track', { state: { caseId: receipt.caseId, email: receipt.email } })}
        >
          Track your case
          <ArrowRightIcon className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="w-full text-base text-content-secondary"
          onClick={() => navigate(`/feedback/${qrId}`)}
        >
          Done
        </Button>
      </div>
    </div>
  )
}

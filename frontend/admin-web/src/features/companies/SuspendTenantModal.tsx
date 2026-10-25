import { useState } from 'react'
import { Button, Checkbox, Input, Modal, Select } from '../../components/ui'
import type { SuspendRequest } from '../../types/company'

const REASONS = [
  'Non-payment after grace period',
  'Terms of service violation',
  'Requested by the tenant',
  'Security concern',
]

interface SuspendTenantModalProps {
  open: boolean
  companyName: string
  userCount: number
  onClose: () => void
  onConfirm: (request: SuspendRequest) => Promise<void>
}

export function SuspendTenantModal(props: SuspendTenantModalProps) {
  // Remount on every open so the form always starts empty.
  return props.open ? <SuspendForm {...props} /> : null
}

function SuspendForm({ companyName, userCount, onClose, onConfirm }: SuspendTenantModalProps) {
  const [reason, setReason] = useState(REASONS[0])
  const [notifyAdmins, setNotifyAdmins] = useState(true)
  const [confirmation, setConfirmation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showError, setShowError] = useState(false)

  const phrase = companyName.toUpperCase()
  const confirmed = confirmation.trim().toUpperCase() === phrase

  const handleSuspend = async () => {
    if (!confirmed) {
      setShowError(true)
      return
    }
    setSubmitting(true)
    await onConfirm({ reason, notifyAdmins })
    setSubmitting(false)
  }

  return (
    <Modal
      open
      title={`Suspend ${companyName}?`}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" className="font-semibold!" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="font-semibold!"
            loading={submitting}
            onClick={handleSuspend}
          >
            Suspend
          </Button>
        </>
      }
    >
      <p className="text-sm leading-5 text-content-secondary">
        {userCount.toLocaleString('en-US')} users lose access immediately and public QR forms show
        an “unavailable” page. Data is kept and SLA history is preserved. You can reactivate at any
        time.
      </p>
      <div className="flex flex-col gap-4">
        <Select
          label="Reason"
          options={REASONS}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
        <Checkbox
          label="Email tenant admins about the suspension"
          checked={notifyAdmins}
          onChange={(event) => setNotifyAdmins(event.target.checked)}
        />
        <Input
          label={`Type ${phrase} to confirm`}
          placeholder={phrase}
          autoFocus
          error={showError && !confirmed ? `Type ${phrase} exactly to suspend this tenant.` : undefined}
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
        />
      </div>
    </Modal>
  )
}

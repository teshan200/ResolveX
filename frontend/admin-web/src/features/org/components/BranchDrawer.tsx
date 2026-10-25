import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Info, Mail, MapPin, Smartphone } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button, Drawer, Input, Toggle } from '../../../components/ui'
import { branchSchema } from '../branchSchema'
import type { BranchFormValues } from '../branchSchema'
import type { Branch } from '../types'

interface BranchDrawerProps {
  open: boolean
  /** Set to edit an existing branch. Leave out to add a new one. */
  branch?: Branch
  onClose: () => void
  onSubmit: (values: BranchFormValues) => Promise<void>
}

const empty: BranchFormValues = { name: '', address: '', phone: '', email: '', active: true }

const iconClass = 'shrink-0 text-content-tertiary'

// "Add branch" panel. A branch is created without a manager: it shows as Unassigned until one is set in Employees.
export function BranchDrawer({ open, branch, onClose, onSubmit }: BranchDrawerProps) {
  const editing = Boolean(branch)
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormValues>({ resolver: zodResolver(branchSchema), defaultValues: empty })

  useEffect(() => {
    if (!open) return
    reset(
      branch
        ? {
            name: branch.name,
            address: branch.address,
            phone: branch.phone,
            email: branch.email,
            active: branch.status === 'Active',
          }
        : empty,
    )
  }, [open, branch, reset])

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
    onClose()
  })

  return (
    <Drawer
      open={open}
      title={editing ? 'Edit branch' : 'Add branch'}
      description={
        editing
          ? 'Update the outlet details.'
          : 'Create an outlet. You can assign its Branch Manager later.'
      }
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" className="font-semibold!" onClick={onClose}>
            Cancel
          </Button>
          <Button className="font-semibold!" loading={isSubmitting} onClick={submit}>
            <Check size={18} />
            {editing ? 'Save changes' : 'Create branch'}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <p className="text-xs leading-4 font-semibold tracking-[0.6px] text-content-tertiary uppercase">
          Branch details
        </p>
        <Input label="Branch name" error={errors.name?.message} {...register('name')} />
        <Input
          label="Address"
          leadingIcon={<MapPin size={18} className={iconClass} />}
          error={errors.address?.message}
          {...register('address')}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Phone"
            leadingIcon={<Smartphone size={18} className={iconClass} />}
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Email"
            type="email"
            leadingIcon={<Mail size={18} className={iconClass} />}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>
        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <Toggle
              checked={field.value}
              onChange={field.onChange}
              label="Active — branch can receive feedback"
            />
          )}
        />
        {!editing && (
          <div className="flex gap-3 rounded-lg border border-info-border bg-info-bg px-4 py-3">
            <Info size={18} className="mt-0.5 shrink-0 text-info-fg" />
            <div className="flex flex-col gap-0.5">
              <p className="text-sm leading-5 font-semibold text-info-fg">No Branch Manager yet</p>
              <p className="text-[13px] leading-4.5 text-content-secondary">
                The branch is created as Unassigned. Assign a Branch Manager later from Employees › Edit
                employee › Role.
              </p>
            </div>
          </div>
        )}
      </form>
    </Drawer>
  )
}

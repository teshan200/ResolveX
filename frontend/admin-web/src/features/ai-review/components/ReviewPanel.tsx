import { useState } from 'react'
import { ChevronDown, CircleCheck, Send, Sparkles, UserCheck, Users } from 'lucide-react'
import { Avatar, Button, Select } from '../../../components/ui'
import type { TicketPriority } from '../../../components/ui'
import { cn } from '../../../components/ui/cn'
import {
  AUTO_ROUTE_THRESHOLD,
  categories,
  designations,
  employeesByDesignation,
  reviewDraft,
  reviewReason,
} from '../mocks'
import type { AssignedSummary, ReviewItem } from '../types'

const priorities: TicketPriority[] = ['Critical', 'High', 'Medium', 'Normal']
const designationId = 'review-designation'

interface ReviewPanelProps {
  item: ReviewItem
  onAssigned: (summary: AssignedSummary) => void
}

/** Disabled select from the Figma "no eligible employee" state. */
function DisabledSelect({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[13px] leading-4.5 font-medium text-content-disabled">{label}</p>
      <div
        aria-disabled="true"
        className="flex h-10 items-center gap-2 rounded-md border border-line bg-muted px-3 text-sm leading-5 text-content-disabled"
      >
        <span className="min-w-0 flex-1 truncate">{value}</span>
        <ChevronDown size={18} aria-hidden />
      </div>
    </div>
  )
}

/** The "Review #1053" side panel. Mock suggestions only: nothing is sent to a server. */
export function ReviewPanel({ item, onAssigned }: ReviewPanelProps) {
  const [category, setCategory] = useState(reviewDraft.category)
  const [subCategory, setSubCategory] = useState(reviewDraft.subCategory)
  const [priority, setPriority] = useState<TicketPriority>(reviewDraft.priority)
  const [designation, setDesignation] = useState(reviewDraft.designation)
  const [employeeName, setEmployeeName] = useState(reviewDraft.employee)

  const employees = employeesByDesignation[designation] ?? []
  const employee = employees.find((e) => e.name === employeeName) ?? employees[0]
  const noneEligible = employees.length === 0

  const changeCategory = (next: string) => {
    setCategory(next)
    setSubCategory(categories[next][0])
  }

  const changeDesignation = (next: string) => {
    setDesignation(next)
    setEmployeeName(employeesByDesignation[next]?.[0]?.name ?? '')
  }

  /** "Keep AI result" goes back to what the AI suggested. */
  const keepAiResult = () => {
    setCategory(item.category)
    setSubCategory(item.subCategory ?? categories[item.category][0])
    setPriority(item.priority)
  }

  return (
    <section
      aria-labelledby="review-heading"
      className="w-full shrink-0 overflow-hidden rounded-xl border border-line bg-surface lg:w-[400px]"
    >
      <div className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
        <Sparkles size={18} className="shrink-0 text-content-brand" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 id="review-heading" className="text-base leading-6 font-semibold whitespace-nowrap">
            Review {item.id}
          </h2>
          <p className="text-xs leading-4 whitespace-nowrap text-content-tertiary">
            Confidence {item.confidence}% · below threshold
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-3 rounded-md bg-brand-subtle p-3">
          <Sparkles size={18} className="shrink-0 text-content-brand" aria-hidden />
          <div
            className="min-w-0 flex-1 overflow-hidden text-xs leading-4 whitespace-nowrap"
            title={`AI confidence. Sample value · below the ${AUTO_ROUTE_THRESHOLD}% auto-route threshold`}
          >
            <p className="font-semibold text-content-brand">AI confidence</p>
            <p className="text-content-tertiary">
              Sample value · below the {AUTO_ROUTE_THRESHOLD}% auto-route threshold
            </p>
          </div>
          <p className="shrink-0 text-2xl leading-8 font-semibold tracking-[-0.12px] text-danger-fg">
            {item.confidence}%
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-md bg-canvas p-3 text-content-secondary">
          <p className="text-xs leading-4 font-semibold">Why it’s uncertain</p>
          <p className="text-[13px] leading-4.5">{reviewReason}</p>
        </div>

        <Select
          label="Category"
          options={Object.keys(categories)}
          value={category}
          onChange={(e) => changeCategory(e.target.value)}
        />
        <Select
          label="Sub-category"
          options={categories[category]}
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <p id="review-priority" className="text-[13px] leading-4.5 font-medium">
            Priority
          </p>
          <div
            role="radiogroup"
            aria-labelledby="review-priority"
            className="flex gap-1 rounded-md bg-muted p-1"
          >
            {priorities.map((p) => {
              const active = p === priority
              return (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setPriority(p)}
                  className={cn(
                    'min-w-0 flex-1 cursor-pointer rounded-md px-4 py-2 text-[13px] leading-4.5 font-medium',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus',
                    active
                      ? 'bg-surface text-content shadow-[0_1px_3px_rgba(11,19,18,0.08),0_1px_2px_rgba(11,19,18,0.04)]'
                      : 'text-content-secondary',
                  )}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-line p-4">
          <div className="flex items-center gap-2">
            <UserCheck size={16} className="shrink-0 text-content-brand" aria-hidden />
            <h3 className="text-sm leading-5 font-semibold">Assign to an employee</h3>
          </div>
          <Select
            id={designationId}
            label="1 · Designation"
            options={designations}
            value={designation}
            onChange={(e) => changeDesignation(e.target.value)}
          />
          {noneEligible ? (
            <DisabledSelect label="2 · Employee at Colombo Branch" value="No eligible employees" />
          ) : (
            <Select
              label="2 · Employee at Colombo Branch"
              options={employees.map((e) => e.name)}
              value={employee.name}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
          )}

          {noneEligible ? (
            <div className="flex flex-col items-center gap-2 rounded-md bg-canvas p-4">
              <Users size={22} className="text-content-secondary" aria-hidden />
              <p className="text-[13px] leading-4.5 font-semibold">
                No active {designation} at Colombo Branch
              </p>
              <p className="text-center text-xs leading-4 text-content-secondary">
                Everyone with this designation is inactive or belongs to another branch. Choose
                another designation.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-content-secondary!"
                onClick={() => document.getElementById(designationId)?.focus()}
              >
                Choose another designation
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-md bg-brand-subtle p-3">
              <Avatar initials={employee.initials} size="sm" />
              <div className="min-w-0 flex-1 whitespace-nowrap">
                <p className="text-[13px] leading-4.5 font-semibold">{employee.name}</p>
                <p className="text-xs leading-4 text-content-secondary">
                  {designation} · Level {employee.level} · {employee.openTickets} open tickets
                </p>
              </div>
              <CircleCheck size={16} className="shrink-0 text-content-brand" aria-hidden />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="min-w-0 flex-1 font-semibold!" onClick={keepAiResult}>
            Keep AI result
          </Button>
          <Button
            className="min-w-0 flex-1 font-semibold!"
            disabled={noneEligible}
            onClick={() => onAssigned({ id: item.id, employee: employee.name, designation, priority })}
          >
            <Send size={18} aria-hidden />
            Save &amp; assign
          </Button>
        </div>
      </div>
    </section>
  )
}

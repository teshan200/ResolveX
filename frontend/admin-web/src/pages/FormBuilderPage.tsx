import { useState } from 'react'
import { ChevronDown, Copy, Eye, GitBranch, GripVertical, History, Plus, Send, Star, Trash2, X } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Input, Toggle } from '../components/ui'
import { cn } from '../components/ui/cn'
import { choiceTypes, dineInDraft, paletteTypes, questionTypes } from '../features/tenant-admin/builder'
import type { Question, QuestionType } from '../features/tenant-admin/builder'
import { useBreadcrumb } from '../layout/breadcrumb'

let nextId = 100
const newQuestion = (type: QuestionType): Question => ({
  id: `q${nextId++}`,
  type,
  text: questionTypes[type].text,
  required: false,
  aiHint: true,
  options: [...questionTypes[type].options],
})

const selectTrigger =
  'flex h-10 w-full items-center gap-2 overflow-hidden rounded-md border border-line bg-surface px-3 text-sm leading-5 text-content-tertiary'

function Tag({ type }: { type: QuestionType }) {
  const { label, icon: Icon } = questionTypes[type]
  return (
    <span className="flex h-5.5 shrink-0 items-center gap-1 rounded-xs bg-brand-subtle px-2 text-xs leading-4 font-medium whitespace-nowrap text-content-brand">
      <Icon size={12} aria-hidden />
      {label}
    </span>
  )
}

function AnswerPreview({ q }: { q: Question }) {
  switch (q.type) {
    case 'rating':
      return (
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((n) => (
            <span key={n} className="flex size-10 items-center justify-center">
              <Star size={32} aria-hidden className={n === 0 ? 'fill-warning-solid text-warning-solid' : 'text-content-tertiary'} />
            </span>
          ))}
        </div>
      )
    case 'text':
      return (
        <div className="flex flex-col gap-1.5">
          <div className="h-[120px] rounded-md border border-line bg-surface px-3 py-2 text-sm leading-5 text-content-tertiary">
            Please describe your experience in detail…
          </div>
          <p className="text-xs leading-4 text-content-tertiary">Visible to branch staff only</p>
        </div>
      )
    case 'choice':
      return (
        <div className="flex flex-col gap-2">
          {q.options.map((o, i) => (
            <div key={`${o}-${i}`} className="flex items-center gap-2 text-sm leading-5">
              <span className="size-[18px] shrink-0 rounded-full border-[1.5px] border-line-strong bg-surface" />
              {o}
            </div>
          ))}
        </div>
      )
    case 'dropdown':
      return (
        <div className={selectTrigger}>
          <span className="min-w-0 flex-1 truncate">Select an option</span>
          <ChevronDown size={18} className="shrink-0" aria-hidden />
        </div>
      )
    case 'tiles':
      return (
        <div className={selectTrigger}>
          <span className="min-w-0 flex-1 truncate">{q.options.join(' · ')}</span>
          <ChevronDown size={18} className="shrink-0" aria-hidden />
        </div>
      )
    case 'photo':
      return (
        <div className="flex h-20 items-center justify-center rounded-md border border-dashed border-line-strong text-[13px] leading-4.5 text-content-secondary">
          Photo upload
        </div>
      )
    case 'contact':
      return (
        <div className="flex flex-col gap-2">
          <div className={selectTrigger}>Name</div>
          <div className={selectTrigger}>Phone or email</div>
        </div>
      )
    default:
      return <div className="h-px w-full bg-line" />
  }
}

/**
 * Tenant admin feedback form builder (Figma node 42:4608). "New form" opens it with an empty canvas;
 * the "Guest feedback · Dine-in" draft opens with the questions from the design. Nothing is saved.
 */
function FormBuilder({ formId }: { formId?: string }) {
  const navigate = useNavigate()
  const isNew = formId === 'new'

  const [name, setName] = useState(isNew ? 'Untitled form' : 'Guest feedback · Dine-in')
  const [questions, setQuestions] = useState<Question[]>(isNew ? [] : dineInDraft)
  const [selectedId, setSelectedId] = useState<string | null>(isNew ? null : 'q3')
  const [view, setView] = useState<'Mobile' | 'Desktop'>('Mobile')
  const [dragFrom, setDragFrom] = useState<number | null>(null)
  const [dragType, setDragType] = useState<QuestionType | null>(null)

  useBreadcrumb(['Feedback forms', name || 'Untitled form'])

  const selected = questions.find((q) => q.id === selectedId) ?? null
  const version = isNew ? 'v1' : 'v5'

  const update = (id: string, patch: Partial<Question>) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)))

  const add = (type: QuestionType, at?: number) => {
    const q = newQuestion(type)
    setQuestions((qs) => (at === undefined ? [...qs, q] : [...qs.slice(0, at), q, ...qs.slice(at)]))
    setSelectedId(q.id)
  }

  const duplicate = (q: Question) => {
    const copy = { ...q, id: `q${nextId++}`, options: [...q.options] }
    setQuestions((qs) => {
      const i = qs.findIndex((x) => x.id === q.id)
      return [...qs.slice(0, i + 1), copy, ...qs.slice(i + 1)]
    })
    setSelectedId(copy.id)
  }

  const remove = (id: string) => {
    setQuestions((qs) => qs.filter((q) => q.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const drop = (to: number) => {
    if (dragFrom !== null) {
      setQuestions((qs) => {
        const list = [...qs]
        const [moved] = list.splice(dragFrom, 1)
        list.splice(to > dragFrom ? to - 1 : to, 0, moved)
        return list
      })
    } else if (dragType) {
      add(dragType, to)
    }
    setDragFrom(null)
    setDragType(null)
  }

  const setOption = (i: number, value: string) =>
    selected && update(selected.id, { options: selected.options.map((o, n) => (n === i ? value : o)) })

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <input
            aria-label="Form name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent text-2xl leading-8 font-semibold tracking-[-0.12px] outline-none"
          />
          <p className="text-sm leading-5 text-content-secondary">
            {isNew
              ? `Draft ${version} · autosaved just now`
              : 'Draft v5 · autosaved 2 min ago · v4 is live on 32 branches'}
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Button variant="ghost" className="font-semibold! text-content-secondary!">
            <History size={18} aria-hidden />
            Version history
          </Button>
          <Button variant="outline" className="font-semibold!">
            <Eye size={18} aria-hidden />
            Preview
          </Button>
          <Button className="font-semibold!" onClick={() => navigate('/tenant/feedback-forms')}>
            <Send size={18} aria-hidden />
            Publish {version}
          </Button>
        </div>
      </header>

      <div className="flex items-start gap-5">
        <aside aria-label="Add question" className="flex w-[232px] shrink-0 flex-col gap-2 rounded-xl border border-line bg-surface px-3 py-4">
          <p className="text-[11px] leading-4 font-semibold tracking-[0.66px] text-content-tertiary uppercase">Add question</p>
          {paletteTypes.map(({ type, label }) => {
            const Icon = questionTypes[type].icon
            return (
              <button
                key={type}
                type="button"
                draggable
                onDragStart={() => setDragType(type)}
                onDragEnd={() => setDragType(null)}
                onClick={() => add(type)}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md border border-line-subtle bg-surface px-3 py-2 text-left hover:bg-canvas"
              >
                <GripVertical size={14} className="shrink-0 text-content-tertiary" aria-hidden />
                <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-brand-subtle text-content-brand">
                  <Icon size={14} aria-hidden />
                </span>
                <span className="text-[13px] leading-4.5 font-medium whitespace-nowrap">{label}</span>
              </button>
            )
          })}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex h-[100px] items-center gap-3">
            <div className="min-w-0 flex-1" />
            <div role="group" aria-label="Preview size" className="flex gap-1 rounded-md bg-muted p-1">
              {(['Mobile', 'Desktop'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={cn(
                    'flex cursor-pointer items-center justify-center rounded-md px-4 py-2 text-[13px] leading-4.5 font-medium whitespace-nowrap',
                    view === v
                      ? 'bg-surface text-content shadow-[0_1px_1px_rgba(11,19,18,0.04),0_1px_1.5px_rgba(11,19,18,0.08)]'
                      : 'text-content-secondary',
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {questions.map((q, i) => (
            <div
              key={q.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => drop(i)}
              onClick={() => setSelectedId(q.id)}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-lg bg-surface p-4',
                q.id === selectedId ? 'border-[1.5px] border-line-brand' : 'border border-line',
              )}
            >
              <span
                draggable
                onDragStart={() => setDragFrom(i)}
                onDragEnd={() => setDragFrom(null)}
                aria-label="Drag to reorder"
                className="shrink-0 cursor-grab text-content-tertiary"
              >
                <GripVertical size={18} aria-hidden />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Tag type={q.type} />
                  {q.required && <span className="text-xs leading-4 font-semibold text-danger-fg">Required</span>}
                </div>
                <p className="text-base leading-6 font-medium">{q.text}</p>
                <AnswerPreview q={q} />
              </div>
              {q.id === selectedId && (
                <div className="flex shrink-0 flex-col gap-1">
                  {[
                    { icon: Copy, label: 'Duplicate question', onClick: () => duplicate(q) },
                    { icon: GitBranch, label: 'Add condition', onClick: undefined },
                    { icon: Trash2, label: 'Delete question', onClick: () => remove(q.id) },
                  ].map(({ icon: Icon, label, onClick }) => (
                    <button
                      key={label}
                      type="button"
                      aria-label={label}
                      title={label}
                      onClick={(e) => {
                        e.stopPropagation()
                        onClick?.()
                      }}
                      className="flex size-8 cursor-pointer items-center justify-center rounded-md text-content-tertiary hover:bg-muted"
                    >
                      <Icon size={16} aria-hidden />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => add('rating')}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => drop(questions.length)}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong p-4 text-[13px] leading-4.5 font-medium whitespace-nowrap text-content-secondary hover:bg-surface"
          >
            <Plus size={16} aria-hidden />
            Drag a question here or click to add
          </button>
        </div>

        <aside aria-label="Question settings" className="flex w-[300px] shrink-0 flex-col gap-4 rounded-xl border border-line bg-surface p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base leading-6 font-semibold whitespace-nowrap">Question settings</h2>
            {selected && <Tag type={selected.type} />}
          </div>
          {selected ? (
            <>
              <Input label="Question" value={selected.text} onChange={(e) => update(selected.id, { text: e.target.value })} />
              {choiceTypes.includes(selected.type) && (
                <div className="flex flex-col gap-2">
                  <p className="text-[13px] leading-4.5 font-medium">Options</p>
                  {selected.options.map((o, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-md border border-line p-2">
                      <GripVertical size={14} className="shrink-0 text-content-tertiary" aria-hidden />
                      <input
                        aria-label={`Option ${i + 1}`}
                        value={o}
                        onChange={(e) => setOption(i, e.target.value)}
                        className="min-w-0 flex-1 bg-transparent text-[13px] leading-4.5 outline-none"
                      />
                      <button
                        type="button"
                        aria-label={`Remove option ${i + 1}`}
                        onClick={() => update(selected.id, { options: selected.options.filter((_, n) => n !== i) })}
                        className="shrink-0 cursor-pointer text-content-tertiary hover:text-content"
                      >
                        <X size={14} aria-hidden />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => update(selected.id, { options: [...selected.options, `Option ${selected.options.length + 1}`] })}
                    className="w-fit cursor-pointer text-[13px] leading-4.5 font-semibold text-content-link"
                  >
                    + Add option
                  </button>
                </div>
              )}
              {selected.type !== 'section' && (
                <>
                  <Toggle checked={selected.required} onChange={(required) => update(selected.id, { required })} label="Required" />
                  <Toggle checked={selected.aiHint} onChange={(aiHint) => update(selected.id, { aiHint })} label="Feeds AI category hint" />
                </>
              )}
            </>
          ) : (
            <p className="text-[13px] leading-4.5 text-content-secondary">Select a question to edit its settings.</p>
          )}
        </aside>
      </div>
    </div>
  )
}

export function FormBuilderPage() {
  const { formId } = useParams()
  // Keyed so that moving between "new" and an existing draft starts from that form's own questions.
  return <FormBuilder key={formId} formId={formId} />
}

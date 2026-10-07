import * as React from "react"
import {
  CheckIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
} from "@radix-ui/react-icons"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { Popover as PopoverPrimitive, Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "cn"

const SMART_FILTER_THEME_CSS = `
  .smart-filter-theme {
    color-scheme: light;
    --canvas: oklch(0.975 0.002 85);
    --surface-1: oklch(1 0 0);
    --surface-2: oklch(0.965 0.002 85);
    --surface-3: oklch(0.925 0.003 85);
    --text-1: oklch(0.17 0.002 85);
    --text-2: oklch(0.42 0.003 85);
    --text-3: oklch(0.59 0.003 85);
    --edge: oklch(0.2 0 0 / 0.09);
    --edge-strong: oklch(0.2 0 0 / 0.15);
    --edge-active: oklch(0.2 0 0 / 0.28);
    --focus: oklch(0.3 0 0 / 0.5);
    --danger: oklch(0.55 0.19 27);
    --shadow-popover: 0 1px 2px rgb(16 16 16 / 0.08), 0 18px 50px -18px rgb(16 16 16 / 0.24);
    --shadow-token: 0 1px 1px rgb(16 16 16 / 0.035), inset 0 1px 0 rgb(255 255 255 / 0.82);
  }

  .dark .smart-filter-theme {
    color-scheme: dark;
    --canvas: oklch(0.105 0 0);
    --surface-1: oklch(0.132 0 0);
    --surface-2: oklch(0.164 0 0);
    --surface-3: oklch(0.205 0 0);
    --text-1: oklch(0.965 0 0);
    --text-2: oklch(0.735 0 0);
    --text-3: oklch(0.535 0 0);
    --edge: oklch(1 0 0 / 0.085);
    --edge-strong: oklch(1 0 0 / 0.145);
    --edge-active: oklch(1 0 0 / 0.25);
    --focus: oklch(0.84 0 0 / 0.62);
    --danger: oklch(0.72 0.16 24);
    --shadow-popover: 0 1px 2px rgb(0 0 0 / 0.22), 0 18px 44px -14px rgb(0 0 0 / 0.72);
    --shadow-token: inset 0 1px 0 rgb(255 255 255 / 0.025);
  }
`

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

function PopoverContent({ className, align = "center", sideOffset = 4, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn("smart-filter-theme z-50 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function TooltipContent({ className, sideOffset = 4, children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content sideOffset={sideOffset} className={cn("smart-filter-theme z-50 rounded-[6px] border border-[var(--edge-strong)] bg-[var(--text-1)] px-2 py-1 text-[10px] text-[var(--canvas)] shadow-sm", className)} {...props}>
        {children}
        <TooltipPrimitive.Arrow className="fill-[var(--text-1)]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

function Avatar({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("relative inline-flex shrink-0 overflow-hidden rounded-full", className)} {...props} />
}

function AvatarImage({ className, onError, ...props }: React.ComponentProps<"img">) {
  return <img className={cn("absolute inset-0 size-full object-cover", className)} onError={(event) => { event.currentTarget.style.display = "none"; onError?.(event) }} {...props} />
}

function AvatarFallback({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("grid size-full place-items-center bg-[var(--surface-3)]", className)} {...props} />
}

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return <input type={type} className={cn("w-full border px-3 outline-none disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
}

function Button({ className, variant: _variant, size: _size, ...props }: React.ComponentProps<"button"> & { variant?: string; size?: string }) {
  return <button className={cn("inline-flex items-center justify-center font-medium outline-none disabled:pointer-events-none disabled:opacity-50", className)} {...props} />
}

type FieldKey = "status" | "priority" | "assignee" | "label"
type Operator = "is-any" | "is-not"
type LogicMode = "and" | "or"

type FilterOption = {
  value: string
  label: string
  avatar?: string
}

export type SmartFilter = {
  id: string
  field: FieldKey
  operator: Operator
  values: string[]
}

type Issue = {
  id: string
  title: string
  status: string
  priority: string
  assignee: string
  labels: string[]
  updated: string
}

type SmartFilterBuilderProps = {
  filters: SmartFilter[]
  onFiltersChange: (filters: SmartFilter[]) => void
  logic: LogicMode
  onLogicChange: (logic: LogicMode) => void
  resultsCount: number
  totalCount: number
  className?: string
}

const AVATAR_STYLE = "notionists-neutral"

function avatar(seed: string) {
  return `https://api.dicebear.com/9.x/${AVATAR_STYLE}/svg?seed=${seed}`
}

const FIELD_OPTIONS: Record<FieldKey, FilterOption[]> = {
  status: [
    { value: "backlog", label: "Backlog" },
    { value: "todo", label: "Todo" },
    { value: "in-progress", label: "In progress" },
    { value: "in-review", label: "In review" },
    { value: "done", label: "Done" },
  ],
  priority: [
    { value: "urgent", label: "Urgent" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
    { value: "none", label: "No priority" },
  ],
  assignee: [
    { value: "khushi", label: "Khushi Diwan", avatar: avatar("Khushi") },
    { value: "shiawase", label: "Shiawase", avatar: avatar("Shiawase") },
    { value: "laziedev", label: "Laziedev", avatar: avatar("Laziedev") },
    { value: "kiki", label: "Kiki", avatar: avatar("Kiki") },
  ],
  label: [
    { value: "design", label: "Design" },
    { value: "frontend", label: "Frontend" },
    { value: "bug", label: "Bug" },
    { value: "performance", label: "Performance" },
    { value: "accessibility", label: "Accessibility" },
  ],
}

const FIELD_LABELS: Record<FieldKey, string> = {
  status: "Status",
  priority: "Priority",
  assignee: "Assignee",
  label: "Label",
}

const ISSUES: Issue[] = [
  { id: "UX-184", title: "Refine keyboard focus across filter tokens", status: "in-progress", priority: "high", assignee: "khushi", labels: ["design", "accessibility"], updated: "2m" },
  { id: "UX-179", title: "Preserve saved views in the URL", status: "in-review", priority: "high", assignee: "shiawase", labels: ["frontend"], updated: "18m" },
  { id: "UX-177", title: "Add async people search with stable loading rows", status: "in-progress", priority: "medium", assignee: "kiki", labels: ["frontend", "performance"], updated: "42m" },
  { id: "UX-171", title: "Announce result count changes to screen readers", status: "in-review", priority: "high", assignee: "khushi", labels: ["accessibility"], updated: "1h" },
  { id: "UX-169", title: "Prevent popover collision near viewport edge", status: "todo", priority: "medium", assignee: "laziedev", labels: ["bug", "frontend"], updated: "3h" },
  { id: "UX-163", title: "Design zero-result recovery state", status: "in-progress", priority: "high", assignee: "shiawase", labels: ["design"], updated: "5h" },
  { id: "UX-158", title: "Virtualize large option collections", status: "backlog", priority: "low", assignee: "kiki", labels: ["performance"], updated: "Yesterday" },
  { id: "UX-151", title: "Support duplicated fields inside OR groups", status: "done", priority: "high", assignee: "laziedev", labels: ["frontend"], updated: "Yesterday" },
  { id: "UX-148", title: "Add compact read-only saved view", status: "in-review", priority: "medium", assignee: "khushi", labels: ["design"], updated: "2d" },
  { id: "UX-144", title: "Improve empty option messaging", status: "todo", priority: "low", assignee: "shiawase", labels: ["design"], updated: "3d" },
  { id: "UX-139", title: "Move query serialization behind an adapter", status: "backlog", priority: "none", assignee: "kiki", labels: ["frontend"], updated: "4d" },
  { id: "UX-132", title: "Restore focus after removing a condition", status: "done", priority: "high", assignee: "khushi", labels: ["accessibility", "bug"], updated: "5d" },
]

const FIELD_ORDER: FieldKey[] = ["status", "priority", "assignee", "label"]

function StatusGlyph({ value, className }: { value?: string; className?: string }) {
  const progress = value === "done" ? 1 : value === "in-review" ? 0.82 : value === "in-progress" ? 0.58 : value === "todo" ? 0.22 : 0
  const angle = Math.min(progress, 0.999) * Math.PI * 2
  const px = 8 + 4.75 * Math.sin(angle)
  const py = 8 - 4.75 * Math.cos(angle)
  const large = progress > 0.5 ? 1 : 0

  return (
    <svg className={cn("size-3.5", className)} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="4.75" stroke="currentColor" strokeWidth="1.4" opacity="0.72" />
      {progress === 1 ? <circle cx="8" cy="8" r="4.75" fill="currentColor" /> : null}
      {progress > 0 && progress < 1 ? (
        <path d={`M8 8 L8 3.25 A4.75 4.75 0 ${large} 1 ${px.toFixed(2)} ${py.toFixed(2)} Z`} fill="currentColor" />
      ) : null}
    </svg>
  )
}

function PriorityGlyph({ value, className }: { value?: string; className?: string }) {
  if (value === "urgent") {
    return (
      <svg className={cn("size-3.5", className)} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 2.5v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="8" cy="12" r="1" fill="currentColor" />
      </svg>
    )
  }

  const bars = value === "high" ? 3 : value === "medium" ? 2 : value === "low" ? 1 : 0
  return (
    <svg className={cn("size-3.5", className)} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <rect key={index} x={2.5 + index * 4} y={10 - index * 3} width="2.5" height={3 + index * 3} rx="0.75" fill="currentColor" opacity={index < bars ? 0.95 : 0.22} />
      ))}
    </svg>
  )
}

function PersonGlyph({ className }: { className?: string }) {
  return (
    <svg className={cn("size-3.5", className)} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="5.25" r="2.25" stroke="currentColor" strokeWidth="1.35" />
      <path d="M3.75 13c.3-2.25 1.74-3.5 4.25-3.5s3.95 1.25 4.25 3.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  )
}

function LabelGlyph({ className }: { className?: string }) {
  return (
    <svg className={cn("size-3.5", className)} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.75 4.25v4.1l4.9 4.9 5.6-5.6-4.9-4.9h-4.1a1.5 1.5 0 0 0-1.5 1.5Z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
      <circle cx="5.5" cy="5.5" r="0.9" fill="currentColor" />
    </svg>
  )
}

function FieldGlyph({ field, value, className }: { field: FieldKey; value?: string; className?: string }) {
  if (field === "status") return <StatusGlyph value={value} className={className} />
  if (field === "priority") return <PriorityGlyph value={value} className={className} />
  if (field === "assignee") return <PersonGlyph className={className} />
  return <LabelGlyph className={className} />
}

function CompactAvatar({ option, size = "sm" }: { option: FilterOption; size?: "xs" | "sm" }) {
  return (
    <Avatar className={cn("border border-[var(--edge)] bg-[var(--surface-3)]", size === "xs" ? "size-4" : "size-5")}>
      <AvatarImage src={option.avatar} alt="" />
      <AvatarFallback className="text-[8px] font-medium">{option.label.slice(0, 1)}</AvatarFallback>
    </Avatar>
  )
}

function optionFor(field: FieldKey, value: string) {
  return FIELD_OPTIONS[field].find((option) => option.value === value)
}

function FilterValuePreview({ filter }: { filter: SmartFilter }) {
  const selected = filter.values.map((value) => optionFor(filter.field, value)).filter(Boolean) as FilterOption[]

  if (filter.field === "assignee") {
    return (
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="flex -space-x-1">
          {selected.slice(0, 3).map((option) => <CompactAvatar key={option.value} option={option} size="xs" />)}
        </span>
        <span className="truncate">{selected.map((option) => option.label.split(" ")[0]).join(", ")}</span>
      </span>
    )
  }

  const text = selected.map((option) => option.label).join(", ")
  return <span className="max-w-44 truncate font-medium text-[var(--text-1)]">{text || "Choose value"}</span>
}

function operatorLabel(operator: Operator) {
  return operator === "is-any" ? "is any of" : "is not"
}

function FilterEditor({ filter, onChange, onRemove, children }: { filter: SmartFilter; onChange: (filter: SmartFilter) => void; onRemove: () => void; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!loading) return
    const timer = window.setTimeout(() => setLoading(false), 380)
    return () => window.clearTimeout(timer)
  }, [loading])

  const options = FIELD_OPTIONS[filter.field].filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))

  function toggleValue(value: string) {
    const nextValues = filter.values.includes(value) ? filter.values.filter((current) => current !== value) : [...filter.values, value]
    onChange({ ...filter, values: nextValues })
  }

  return (
    <Popover open={open} onOpenChange={(next) => {
      setOpen(next)
      if (next && filter.field === "assignee") setLoading(true)
      if (!next) setQuery("")
    }}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" sideOffset={7} collisionPadding={12} className="w-[318px] overflow-hidden rounded-[10px] border-[var(--edge-strong)] bg-[var(--surface-2)] p-0 text-[var(--text-1)] shadow-[var(--shadow-popover)]">
        <div className="flex items-center justify-between border-b border-[var(--edge)] px-3 py-2.5">
          <div className="flex items-center gap-2 text-[13px] font-medium"><FieldGlyph field={filter.field} value={filter.values[0]} className="text-[var(--text-2)]" />Edit {FIELD_LABELS[filter.field].toLowerCase()}</div>
          <button type="button" onClick={onRemove} className="rounded-[5px] px-1.5 py-1 text-[11px] text-[var(--text-3)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--danger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]">Remove</button>
        </div>
        <div className="border-b border-[var(--edge)] p-2">
          <div className="grid grid-cols-2 gap-1 rounded-[7px] bg-[var(--canvas)] p-1">
            {(["is-any", "is-not"] as Operator[]).map((operator) => (
              <button key={operator} type="button" onClick={() => onChange({ ...filter, operator })} className={cn("rounded-[5px] px-2 py-1.5 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]", filter.operator === operator ? "bg-[var(--surface-3)] font-medium text-[var(--text-1)] shadow-[0_0_0_1px_var(--edge)]" : "text-[var(--text-3)] hover:text-[var(--text-2)]")}>{operatorLabel(operator)}</button>
            ))}
          </div>
        </div>
        <div className="p-2">
          <div className="relative mb-1.5">
            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[var(--text-3)]" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${FIELD_LABELS[filter.field].toLowerCase()}…`} className="h-8 rounded-[7px] border-[var(--edge)] bg-[var(--canvas)] pl-8 text-[12px] shadow-none placeholder:text-[var(--text-3)] focus-visible:border-[var(--edge-active)] focus-visible:ring-0" />
          </div>
          <div className="max-h-52 overflow-y-auto py-0.5">
            {loading ? (
              <div className="space-y-1" aria-label="Loading people">
                {[0, 1, 2].map((row) => <div key={row} className="flex h-8 items-center gap-2 rounded-[6px] px-2"><div className="size-5 animate-pulse rounded-full bg-[var(--surface-3)]" /><div className="h-2.5 animate-pulse rounded bg-[var(--surface-3)]" style={{ width: `${82 + row * 18}px` }} /></div>)}
              </div>
            ) : options.length ? options.map((option) => {
              const selected = filter.values.includes(option.value)
              return (
                <button key={option.value} type="button" onClick={() => toggleValue(option.value)} className="group flex h-8 w-full items-center gap-2 rounded-[6px] px-2 text-left text-[12px] text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus)]">
                  {option.avatar ? <CompactAvatar option={option} /> : <FieldGlyph field={filter.field} value={option.value} className="text-[var(--text-3)] group-hover:text-[var(--text-2)]" />}
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  <span className={cn("grid size-4 place-items-center rounded-[4px] border transition-colors", selected ? "border-[var(--text-1)] bg-[var(--text-1)] text-[var(--canvas)]" : "border-[var(--edge-strong)] text-transparent group-hover:border-[var(--edge-active)]")}><CheckIcon className="size-3" /></span>
                </button>
              )
            }) : <div className="grid h-20 place-items-center text-[12px] text-[var(--text-3)]">No matching values</div>}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--edge)] px-3 py-2 text-[10px] text-[var(--text-3)]"><span>{filter.values.length} selected</span><span className="font-mono">↑↓ navigate · ↵ select</span></div>
      </PopoverContent>
    </Popover>
  )
}

function AddFilterPopover({ onAdd, existingFields }: { onAdd: (field: FieldKey) => void; existingFields: Set<FieldKey> }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="group flex h-7 items-center gap-1.5 rounded-[7px] border border-dashed border-[var(--edge-strong)] px-2.5 text-[11px] font-medium text-[var(--text-3)] transition-colors hover:border-[var(--edge-active)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"><PlusIcon className="size-3.5 transition-transform duration-150 group-hover:rotate-90" />Filter</button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={7} collisionPadding={12} className="w-56 rounded-[10px] border-[var(--edge-strong)] bg-[var(--surface-2)] p-1.5 text-[var(--text-1)] shadow-[var(--shadow-popover)]">
        <div className="px-2 pb-1.5 pt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-3)]">Add condition</div>
        {FIELD_ORDER.map((field) => {
          const exists = existingFields.has(field)
          return (
            <button key={field} type="button" onClick={() => { onAdd(field); setOpen(false) }} className="group flex h-8 w-full items-center gap-2 rounded-[6px] px-2 text-left text-[12px] text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus)]">
              <FieldGlyph field={field} className="text-[var(--text-3)] group-hover:text-[var(--text-2)]" /><span className="flex-1">{FIELD_LABELS[field]}</span>{exists ? <span className="text-[10px] text-[var(--text-3)]">Add again</span> : <PlusIcon className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />}
            </button>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}

function FilterToken({ filter, onChange, onRemove }: { filter: SmartFilter; onChange: (filter: SmartFilter) => void; onRemove: () => void }) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: "spring", visualDuration: 0.18, bounce: 0 }} className="flex h-7 w-full max-w-full items-center overflow-hidden rounded-[7px] border border-[var(--edge-strong)] bg-[var(--surface-2)] shadow-[var(--shadow-token)] sm:w-auto">
      <FilterEditor filter={filter} onChange={onChange} onRemove={onRemove}><button type="button" className="flex h-full shrink-0 items-center gap-1.5 px-2 text-[11px] font-medium text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)] focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus)]"><FieldGlyph field={filter.field} value={filter.values[0]} /><span>{FIELD_LABELS[filter.field]}</span></button></FilterEditor>
      <div className="h-3.5 w-px bg-[var(--edge)]" />
      <FilterEditor filter={filter} onChange={onChange} onRemove={onRemove}><button type="button" className="h-full shrink-0 px-2 text-[11px] text-[var(--text-3)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-2)] focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus)]">{operatorLabel(filter.operator)}</button></FilterEditor>
      <div className="h-3.5 w-px bg-[var(--edge)]" />
      <FilterEditor filter={filter} onChange={onChange} onRemove={onRemove}><button type="button" className="flex h-full min-w-0 flex-1 items-center overflow-hidden px-2 text-[11px] transition-colors hover:bg-[var(--surface-3)] focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus)]"><FilterValuePreview filter={filter} /></button></FilterEditor>
      <Tooltip><TooltipTrigger asChild><button type="button" onClick={onRemove} aria-label={`Remove ${FIELD_LABELS[filter.field]} filter`} className="grid h-full w-6 shrink-0 place-items-center text-[var(--text-3)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)] focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus)]"><Cross2Icon className="size-3" /></button></TooltipTrigger><TooltipContent sideOffset={5}>Remove filter</TooltipContent></Tooltip>
    </motion.div>
  )
}

export function SmartFilterBuilder({ filters, onFiltersChange, logic, onLogicChange, resultsCount, totalCount, className }: SmartFilterBuilderProps) {
  const existingFields = React.useMemo(() => new Set(filters.map((filter) => filter.field)), [filters])
  const updateFilter = (id: string, next: SmartFilter) => onFiltersChange(filters.map((filter) => filter.id === id ? next : filter))
  const removeFilter = (id: string) => onFiltersChange(filters.filter((filter) => filter.id !== id))
  const addFilter = (field: FieldKey) => onFiltersChange([...filters, { id: crypto.randomUUID(), field, operator: "is-any", values: [FIELD_OPTIONS[field][0].value] }])

  return (
    <MotionConfig reducedMotion="user">
      <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", className)}>
        <div className="flex w-full min-w-0 flex-wrap items-center gap-1.5" role="toolbar" aria-label="Issue filters">
          {filters.length > 1 ? <button type="button" onClick={() => onLogicChange(logic === "and" ? "or" : "and")} className="h-7 rounded-[7px] border border-[var(--edge)] bg-[var(--surface-1)] px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-3)] transition-colors hover:border-[var(--edge-strong)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]" aria-label={`Matching ${logic === "and" ? "all" : "any"} filters. Click to change.`}>{logic}</button> : null}
          <AnimatePresence initial={false} mode="popLayout">{filters.map((filter) => <FilterToken key={filter.id} filter={filter} onChange={(next) => updateFilter(filter.id, next)} onRemove={() => removeFilter(filter.id)} />)}</AnimatePresence>
          <AddFilterPopover onAdd={addFilter} existingFields={existingFields} />
          {filters.length ? <button type="button" onClick={() => onFiltersChange([])} className="h-7 rounded-[6px] px-2 text-[11px] text-[var(--text-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]">Clear</button> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2 text-[11px] text-[var(--text-3)]" aria-live="polite"><MixerHorizontalIcon className="size-3.5" /><span><motion.span key={resultsCount} initial={{ opacity: 0, y: 2 }} animate={{ opacity: 1, y: 0 }} className="inline-block font-mono font-medium tabular-nums text-[var(--text-1)]">{resultsCount}</motion.span> of <span className="font-mono tabular-nums">{totalCount}</span> issues</span></div>
      </div>
    </MotionConfig>
  )
}

function matchesFilter(issue: Issue, filter: SmartFilter) {
  const issueValues = filter.field === "label" ? issue.labels : [issue[filter.field]]
  const hasMatch = issueValues.some((value) => filter.values.includes(value))
  return filter.operator === "is-not" ? !hasMatch : hasMatch
}

function IssueStatus({ value }: { value: string }) {
  return <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-2)]"><StatusGlyph value={value} className="text-[var(--text-3)]" />{optionFor("status", value)?.label}</span>
}

function IssuePriority({ value }: { value: string }) {
  return <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-2)]"><PriorityGlyph value={value} className="text-[var(--text-3)]" />{optionFor("priority", value)?.label}</span>
}

function IssueAssignee({ value }: { value: string }) {
  const option = optionFor("assignee", value)!
  return <span className="inline-flex items-center gap-2 text-[12px] text-[var(--text-2)]"><CompactAvatar option={option} />{option.label.split(" ")[0]}</span>
}

function MobileIssueCard({ issue }: { issue: Issue }) {
  return (
    <motion.button
      layout
      type="button"
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -3 }}
      transition={{ type: "spring", visualDuration: 0.2, bounce: 0 }}
      className="w-full px-4 py-3.5 text-left transition-colors hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus)] sm:px-6"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] tabular-nums text-[var(--text-3)]">{issue.id}</span>
        <span className="font-mono text-[10px] tabular-nums text-[var(--text-3)]">{issue.updated}</span>
      </div>
      <div className="mb-3 text-[13px] font-medium leading-5 text-[var(--text-1)]">{issue.title}</div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <IssueStatus value={issue.status} />
        <IssuePriority value={issue.priority} />
        <IssueAssignee value={issue.assignee} />
      </div>
    </motion.button>
  )
}

function PreviewCursor({ point, pressed }: { point: { x: number; y: number }; pressed: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      animate={{ x: point.x, y: point.y, scale: pressed ? 0.82 : 1 }}
      transition={{ type: "spring", stiffness: 190, damping: 24, mass: 0.72 }}
    >
      <motion.span animate={{ opacity: pressed ? 1 : 0, scale: pressed ? 1.7 : 0.5 }} className="absolute -left-2.5 -top-2.5 size-7 rounded-full border border-current opacity-0" />
      <svg width="22" height="26" viewBox="0 0 22 26" fill="none" className="drop-shadow-[0_2px_3px_rgb(0_0_0/0.35)]">
        <path d="M2 1.8v18.4l5-4 3.2 7.3 3.6-1.7-3.2-7.1h6.8L2 1.8Z" fill="var(--text-1)" stroke="var(--canvas)" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </motion.div>
  )
}

export function SmartFilterDemo({ autoPlay = false }: { autoPlay?: boolean }) {
  const [filters, setFilters] = React.useState<SmartFilter[]>([
    { id: "status", field: "status", operator: "is-any", values: ["in-progress", "in-review"] },
    { id: "priority", field: "priority", operator: "is-any", values: ["high"] },
  ])
  const [logic, setLogic] = React.useState<LogicMode>("and")
  const [search, setSearch] = React.useState("")
  const [theme, setTheme] = React.useState<"light" | "dark">(() => document.documentElement.classList.contains("dark") ? "dark" : "light")
  const [cursorPoint, setCursorPoint] = React.useState({ x: -40, y: -40 })
  const [cursorPressed, setCursorPressed] = React.useState(false)

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light"
    document.documentElement.classList.toggle("dark", nextTheme === "dark")
    localStorage.setItem("smart-filter-theme", nextTheme)
    setTheme(nextTheme)
  }

  React.useEffect(() => {
    if (!autoPlay) return
    let cancelled = false
    const timers = new Set<number>()

    function wait(milliseconds: number) {
      return new Promise<void>((resolve) => {
        const timer = window.setTimeout(() => { timers.delete(timer); resolve() }, milliseconds)
        timers.add(timer)
      })
    }

    function findButton(label: string) {
      return Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.getAttribute("aria-label") === label || button.textContent?.trim() === label)
    }

    async function pointAndClick(button: HTMLButtonElement | undefined) {
      if (!button || cancelled) return
      const rect = button.getBoundingClientRect()
      setCursorPoint({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
      await wait(650)
      if (cancelled) return
      setCursorPressed(true)
      button.click()
      await wait(170)
      setCursorPressed(false)
    }

    async function play() {
      await wait(1200)
      await pointAndClick(document.querySelector<HTMLButtonElement>('button[aria-label^="Matching"]') ?? undefined)
      await wait(750)
      await pointAndClick(findButton("In progress, In review"))
      await wait(700)
      await pointAndClick(findButton("Done"))
      await wait(700)
      await pointAndClick(findButton("In progress, In review, Done"))
      await wait(650)
      await pointAndClick(document.querySelector<HTMLButtonElement>('button[aria-label^="Switch to"]') ?? undefined)
      await wait(1000)
      if (!cancelled) setCursorPoint({ x: window.innerWidth - 48, y: window.innerHeight - 42 })
    }

    void play()
    return () => { cancelled = true; timers.forEach((timer) => window.clearTimeout(timer)) }
  }, [autoPlay])

  const filteredIssues = React.useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return ISSUES.filter((issue) => {
      if (normalizedSearch && !`${issue.id} ${issue.title}`.toLowerCase().includes(normalizedSearch)) return false
      if (!filters.length) return true
      return logic === "and" ? filters.every((filter) => matchesFilter(issue, filter)) : filters.some((filter) => matchesFilter(issue, filter))
    })
  }, [filters, logic, search])

  return (
    <TooltipPrimitive.Provider delayDuration={250}>
      <style>{SMART_FILTER_THEME_CSS}</style>
      {autoPlay ? <PreviewCursor point={cursorPoint} pressed={cursorPressed} /> : null}
      <div className={cn("smart-filter-theme min-h-svh bg-[var(--canvas)] px-3 py-3 text-[var(--text-1)] sm:px-6 sm:py-6", autoPlay && "flex items-center")}>
        <div className={cn("mx-auto overflow-hidden rounded-[14px] border border-[var(--edge)] bg-[var(--surface-1)] shadow-[0_24px_80px_-40px_rgb(16_16_16/0.18)]", autoPlay ? "max-w-[1400px]" : "max-w-[1120px]")}>
        <main>
          <div className="flex flex-col gap-4 border-b border-[var(--edge)] px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div><div className="mb-1 flex items-center gap-2"><h1 className="text-[20px] font-semibold leading-7 tracking-[-0.02em]">Issues</h1><span className="rounded-[5px] border border-[var(--edge)] bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-[var(--text-3)]">{ISSUES.length}</span></div><p className="text-[12px] text-[var(--text-3)]">Product and engineering · All active work</p></div>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none"><MagnifyingGlassIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[var(--text-3)]" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search issues…" className="h-8 rounded-[7px] border-[var(--edge)] bg-[var(--canvas)] pl-8 text-[12px] shadow-none placeholder:text-[var(--text-3)] focus-visible:border-[var(--edge-active)] focus-visible:ring-0" /><kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-[4px] border border-[var(--edge)] bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-3)]">/</kbd></div>
                <Tooltip><TooltipTrigger asChild><button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`} className="grid size-8 shrink-0 place-items-center rounded-[7px] border border-[var(--edge)] bg-[var(--canvas)] text-[var(--text-3)] transition-colors hover:border-[var(--edge-strong)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]">{theme === "light" ? <MoonIcon className="size-3.5" /> : <SunIcon className="size-3.5" />}</button></TooltipTrigger><TooltipContent sideOffset={6}>{theme === "light" ? "Dark theme" : "Light theme"}</TooltipContent></Tooltip>
              </div>
            </div>
            <SmartFilterBuilder filters={filters} onFiltersChange={setFilters} logic={logic} onLogicChange={setLogic} resultsCount={filteredIssues.length} totalCount={ISSUES.length} />
          </div>
          <div className="hidden lg:block"><div>
            <div className="grid grid-cols-[90px_minmax(280px,1fr)_130px_120px_130px_72px] border-b border-[var(--edge)] bg-[var(--canvas)] px-4 text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--text-3)] sm:px-6">{["ID", "Issue", "Status", "Priority", "Assignee", "Updated"].map((label) => <div key={label} className={cn("py-2.5", label === "Updated" && "text-right")}>{label}</div>)}</div>
            <MotionConfig reducedMotion="user"><div className="divide-y divide-[var(--edge)]"><AnimatePresence initial={false} mode="popLayout">{filteredIssues.map((issue) => <motion.button layout key={issue.id} type="button" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ type: "spring", visualDuration: 0.2, bounce: 0 }} className="grid w-full grid-cols-[90px_minmax(280px,1fr)_130px_120px_130px_72px] items-center px-4 text-left transition-colors hover:bg-[var(--surface-2)] focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus)] sm:px-6"><span className="py-3.5 font-mono text-[11px] tabular-nums text-[var(--text-3)]">{issue.id}</span><span className="truncate pr-6 text-[12px] font-medium text-[var(--text-1)]">{issue.title}</span><IssueStatus value={issue.status} /><IssuePriority value={issue.priority} /><IssueAssignee value={issue.assignee} /><span className="text-right font-mono text-[10px] tabular-nums text-[var(--text-3)]">{issue.updated}</span></motion.button>)}</AnimatePresence></div></MotionConfig>
          </div></div>
          <MotionConfig reducedMotion="user"><div className="divide-y divide-[var(--edge)] lg:hidden"><AnimatePresence initial={false} mode="popLayout">{filteredIssues.map((issue) => <MobileIssueCard key={issue.id} issue={issue} />)}</AnimatePresence></div></MotionConfig>
          {!filteredIssues.length ? <div className="grid min-h-72 place-items-center px-6 text-center"><div className="max-w-xs"><div className="mx-auto mb-3 grid size-9 place-items-center rounded-[9px] border border-[var(--edge)] bg-[var(--surface-2)]"><MixerHorizontalIcon className="size-4 text-[var(--text-3)]" /></div><h2 className="mb-1 text-[13px] font-medium">No issues match this view</h2><p className="mb-3 text-[11px] leading-5 text-[var(--text-3)]">Clear the search or loosen one of the active conditions.</p><Button variant="outline" size="sm" onClick={() => { setFilters([]); setSearch("") }} className="h-7 rounded-[7px] border-[var(--edge-strong)] bg-[var(--surface-2)] px-2.5 text-[11px] hover:bg-[var(--surface-3)]">Reset view</Button></div></div> : null}
        </main>
        </div>
      </div>
    </TooltipPrimitive.Provider>
  )
}

"use client"

import { useMemo, useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  Check,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from "@/lib/i18n/provider"
import { useDemoState } from "@/lib/demo-state"
import type {
  AgencyTier,
  CountryCode,
  HotelTier,
  ItineraryTheme,
  MarkupFormula,
  MarkupRule,
  RequestType,
  RuleScope,
} from "@/lib/types"
import { cn } from "@/lib/utils"

const ALL_COUNTRIES: CountryCode[] = ["JO", "MA", "EG", "AE", "SA", "OM"]
const ALL_THEMES: ItineraryTheme[] = ["family", "luxury", "first-time", "adventure", "cultural", "religious"]
const HOTEL_TIERS: HotelTier[] = ["3", "4", "5", "5+", "mixed"]
const AGENCY_TIERS: AgencyTier[] = ["standard", "gold", "vip"]
const REQUEST_TYPES: RequestType[] = ["MODIFY_EXISTING", "FROM_SCRATCH"]
const FORMULAS: MarkupFormula[] = [
  "percentage",
  "fixed_per_pax",
  "fixed_total",
  "tiered_percentage",
]

export function RuleEditor({
  scope,
  wholesalerId,
  rules,
}: {
  scope: RuleScope
  /** Required when scope = "wholesaler" */
  wholesalerId: string | null
  rules: MarkupRule[]
}) {
  const { t } = useTranslation()
  const {
    upsertMarkupRule,
    removeMarkupRule,
    reorderMarkupRules,
    toggleRuleEnabled,
    resetMarkupRules,
  } = useDemoState()
  const [editing, setEditing] = useState<MarkupRule | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const ordered = useMemo(
    () => [...rules].sort((a, b) => a.priority - b.priority),
    [rules],
  )

  const newRule = (): MarkupRule => {
    const now = new Date().toISOString()
    const nextPriority =
      ordered.length === 0
        ? 10
        : (ordered[ordered.length - 1].priority - (ordered[ordered.length - 1].priority % 10)) + 10
    return {
      id: `r-${Date.now().toString(36)}`,
      scope,
      wholesalerId: scope === "wholesaler" ? wholesalerId ?? undefined : undefined,
      priority: nextPriority,
      name: "",
      enabled: true,
      matchers: {},
      markup: { formula: "percentage", value: 10 },
      autoApply: false,
      autoForward: false,
      createdAt: now,
      updatedAt: now,
    }
  }

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir
    if (target < 0 || target >= ordered.length) return
    const ids = ordered.map((r) => r.id)
    ;[ids[idx], ids[target]] = [ids[target], ids[idx]]
    reorderMarkupRules(scope, wholesalerId, ids)
    toast.success(t("toast.rules.reordered"))
  }

  const onToggle = (rule: MarkupRule) => {
    toggleRuleEnabled(scope, wholesalerId, rule.id)
    toast.success(
      t("toast.rules.toggled", {
        label: rule.enabled ? t("toast.rules.disabled") : t("toast.rules.enabled"),
      }),
    )
  }

  const onDelete = (id: string) => {
    removeMarkupRule(scope, wholesalerId, id)
    setConfirmDelete(null)
    toast.success(t("toast.rules.deleted"))
  }

  const onSave = (rule: MarkupRule) => {
    upsertMarkupRule(scope, wholesalerId, rule)
    setEditing(null)
    toast.success(t("toast.rules.saved"))
  }

  const onReset = () => {
    resetMarkupRules(scope, wholesalerId)
    toast.success(t("toast.rules.reset"))
  }

  return (
    <section className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RefreshCw className="size-3.5" />
          {t("rules.action.reset")}
        </Button>
        <Button size="sm" onClick={() => setEditing(newRule())}>
          <Plus className="size-3.5" />
          {t("rules.action.add")}
        </Button>
      </div>

      {/* Rules list */}
      {ordered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-subtle bg-bg-raised py-16 text-center text-caption text-ink-tertiary">
          {t("rules.empty")}
        </div>
      ) : (
        <ul className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
          {/* header row */}
          <li className="grid grid-cols-[64px_1fr_1.4fr_120px_160px_120px] items-center gap-3 border-b border-border-subtle bg-bg-sunken/40 px-4 py-2 text-label text-ink-tertiary">
            <span>{t("rules.col.priority")}</span>
            <span>{t("rules.col.name")}</span>
            <span>{t("rules.col.matchers")}</span>
            <span>{t("rules.col.markup")}</span>
            <span>{t("rules.col.behavior")}</span>
            <span className="text-right">{t("rules.col.actions")}</span>
          </li>
          {ordered.map((rule, idx) => (
            <li
              key={rule.id}
              className={cn(
                "grid grid-cols-[64px_1fr_1.4fr_120px_160px_120px] items-center gap-3 px-4 py-3 transition-colors",
                idx < ordered.length - 1 && "border-b border-border-subtle",
                !rule.enabled && "opacity-60",
              )}
            >
              {/* Priority + up/down */}
              <div className="flex items-center gap-1">
                <span className="font-mono text-data text-accent">{rule.priority}</span>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    aria-label={t("rules.editor.toggle.up")}
                    className="grid size-4 place-items-center rounded text-ink-tertiary transition-colors hover:text-accent disabled:opacity-30"
                  >
                    <ArrowUp className="size-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, 1)}
                    disabled={idx === ordered.length - 1}
                    aria-label={t("rules.editor.toggle.down")}
                    className="grid size-4 place-items-center rounded text-ink-tertiary transition-colors hover:text-accent disabled:opacity-30"
                  >
                    <ArrowDown className="size-3" />
                  </button>
                </div>
              </div>

              {/* Name */}
              <div className="min-w-0">
                <p className="truncate text-caption text-ink-primary">{rule.name || "—"}</p>
                <p className="mt-0.5 font-mono text-[10px] text-ink-tertiary">{rule.id}</p>
              </div>

              {/* Matchers summary */}
              <MatcherSummary rule={rule} />

              {/* Markup formula summary */}
              <MarkupSummary rule={rule} />

              {/* Behavior badges */}
              <div className="flex flex-wrap gap-1">
                {!rule.enabled ? (
                  <Badge variant="neutral">{t("rules.behavior.disabled")}</Badge>
                ) : rule.autoForward || rule.autoApply ? (
                  <>
                    {rule.autoForward ? (
                      <Badge variant="success">{t("rules.behavior.auto_forward")}</Badge>
                    ) : null}
                    {rule.autoApply ? (
                      <Badge variant="success">{t("rules.behavior.auto_apply")}</Badge>
                    ) : null}
                  </>
                ) : (
                  <Badge variant="warning">{t("rules.behavior.manual")}</Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => onToggle(rule)}
                  className={cn(
                    "grid size-7 place-items-center rounded border transition-colors",
                    rule.enabled
                      ? "border-success/30 bg-success-soft text-success hover:border-success"
                      : "border-border-default bg-bg-sunken/40 text-ink-tertiary hover:border-border-strong",
                  )}
                  aria-label="toggle enabled"
                >
                  {rule.enabled ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(rule)}
                  className="grid size-7 place-items-center rounded border border-border-default text-ink-secondary transition-colors hover:border-accent hover:text-accent"
                  aria-label="edit"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(rule.id)}
                  className="grid size-7 place-items-center rounded border border-border-default text-ink-secondary transition-colors hover:border-danger hover:text-danger"
                  aria-label="delete"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          {editing ? (
            <RuleForm
              rule={editing}
              isNew={!rules.some((r) => r.id === editing.id)}
              onSave={onSave}
              onCancel={() => setEditing(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("rules.editor.delete")}</DialogTitle>
            <DialogDescription>{t("rules.editor.delete_confirm")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              {t("rules.editor.cancel")}
            </Button>
            <Button variant="destructive" onClick={() => confirmDelete && onDelete(confirmDelete)}>
              <Trash2 className="size-4" />
              {t("rules.editor.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

/* ── Subcomponents ─────────────────────────────────────── */

function MatcherSummary({ rule }: { rule: MarkupRule }) {
  const { t } = useTranslation()
  const m = rule.matchers
  const chips: Array<{ label: string; value: string }> = []
  if (m.countries?.length) chips.push({ label: t("rules.matcher.countries"), value: m.countries.join("/") })
  if (m.themes?.length) chips.push({ label: t("rules.matcher.themes"), value: m.themes.join("/") })
  if (m.hotelTier?.length) chips.push({ label: t("rules.matcher.hotel_tier"), value: m.hotelTier.join("/") })
  if (m.agencyTier?.length) chips.push({ label: t("rules.matcher.agency_tier"), value: m.agencyTier.join("/") })
  if (m.requestType?.length) chips.push({ label: t("rules.matcher.request_type"), value: m.requestType.join("/") })
  if (m.dmcIds?.length) chips.push({ label: t("rules.matcher.dmc_ids"), value: m.dmcIds.join("/") })
  if (m.minTotalNetUSD !== undefined) chips.push({ label: "≥", value: `$${m.minTotalNetUSD.toLocaleString()}` })
  if (m.maxTotalNetUSD !== undefined) chips.push({ label: "≤", value: `$${m.maxTotalNetUSD.toLocaleString()}` })
  if (m.minPaxNetUSD !== undefined) chips.push({ label: "pp≥", value: `$${m.minPaxNetUSD.toLocaleString()}` })
  if (m.maxPaxNetUSD !== undefined) chips.push({ label: "pp≤", value: `$${m.maxPaxNetUSD.toLocaleString()}` })

  if (chips.length === 0) {
    return (
      <span className="font-mono text-[11px] text-ink-tertiary italic">
        {t("rules.matcher.no_filters")}
      </span>
    )
  }
  return (
    <div className="flex flex-wrap gap-1">
      {chips.map((c, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 rounded border border-border-subtle bg-bg-sunken/40 px-1.5 py-0.5 font-mono text-[10px] text-ink-secondary"
        >
          <span className="text-ink-tertiary">{c.label}</span>
          <span className="text-ink-primary">{c.value}</span>
        </span>
      ))}
    </div>
  )
}

function MarkupSummary({ rule }: { rule: MarkupRule }) {
  const { formula, value, minMarkupUSD, maxMarkupUSD } = rule.markup
  const fmt =
    formula === "percentage"
      ? `${value}%`
      : formula === "fixed_per_pax"
      ? `$${value.toLocaleString()}/pax`
      : formula === "fixed_total"
      ? `$${value.toLocaleString()}`
      : `${value}% tiered`
  return (
    <div className="space-y-0.5 font-mono text-[11px]">
      <p className="text-data text-ink-primary">{fmt}</p>
      {minMarkupUSD !== undefined || maxMarkupUSD !== undefined ? (
        <p className="text-[10px] text-ink-tertiary">
          {minMarkupUSD !== undefined ? `≥$${minMarkupUSD.toLocaleString()}` : ""}
          {minMarkupUSD !== undefined && maxMarkupUSD !== undefined ? " · " : ""}
          {maxMarkupUSD !== undefined ? `≤$${maxMarkupUSD.toLocaleString()}` : ""}
        </p>
      ) : null}
    </div>
  )
}

/* ── Edit form ─────────────────────────────────────────── */

function RuleForm({
  rule,
  isNew,
  onSave,
  onCancel,
}: {
  rule: MarkupRule
  isNew: boolean
  onSave: (r: MarkupRule) => void
  onCancel: () => void
}) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState<MarkupRule>(rule)

  const setMatcher = <K extends keyof MarkupRule["matchers"]>(
    key: K,
    value: MarkupRule["matchers"][K],
  ) => setDraft((d) => ({ ...d, matchers: { ...d.matchers, [key]: value } }))

  const toggleMatcherValue = <T extends string>(
    list: T[] | undefined,
    value: T,
  ): T[] => {
    const set = new Set<T>(list ?? [])
    if (set.has(value)) set.delete(value)
    else set.add(value)
    return Array.from(set)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isNew ? t("rules.editor.new_title") : t("rules.editor.edit_title")}
        </DialogTitle>
      </DialogHeader>

      <div className="max-h-[70vh] space-y-6 overflow-y-auto pr-2">
        {/* Identity */}
        <FormSection title={t("rules.editor.section.identity")}>
          <Field label={t("rules.editor.field.name")} hint={t("rules.editor.field.name_hint")}>
            <Input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="e.g. Standard Jordan · low-volume"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("rules.editor.field.priority")} hint={t("rules.editor.field.priority_hint")}>
              <Input
                type="number"
                min={1}
                value={draft.priority}
                onChange={(e) => setDraft({ ...draft, priority: Number(e.target.value) || 0 })}
              />
            </Field>
            <Field label={t("rules.editor.field.enabled")}>
              <ToggleButton
                value={draft.enabled}
                onChange={(v) => setDraft({ ...draft, enabled: v })}
              />
            </Field>
          </div>
        </FormSection>

        {/* Matchers */}
        <FormSection title={t("rules.editor.section.matchers")}>
          <Field label={t("rules.matcher.countries")}>
            <ChipGroup
              options={ALL_COUNTRIES}
              selected={draft.matchers.countries ?? []}
              onToggle={(v) =>
                setMatcher("countries", toggleMatcherValue(draft.matchers.countries, v))
              }
            />
          </Field>
          <Field label={t("rules.matcher.themes")}>
            <ChipGroup
              options={ALL_THEMES}
              selected={draft.matchers.themes ?? []}
              onToggle={(v) =>
                setMatcher("themes", toggleMatcherValue(draft.matchers.themes, v))
              }
              labelFn={(th) => t(`itinerary.theme.${th}` as Parameters<typeof t>[0])}
            />
          </Field>
          <Field label={t("rules.matcher.hotel_tier")}>
            <ChipGroup
              options={HOTEL_TIERS}
              selected={draft.matchers.hotelTier ?? []}
              onToggle={(v) =>
                setMatcher("hotelTier", toggleMatcherValue(draft.matchers.hotelTier, v))
              }
              labelFn={(tier) => t(`rfq.hotel.${tier}` as Parameters<typeof t>[0])}
            />
          </Field>
          <Field label={t("rules.matcher.agency_tier")}>
            <ChipGroup
              options={AGENCY_TIERS}
              selected={draft.matchers.agencyTier ?? []}
              onToggle={(v) =>
                setMatcher("agencyTier", toggleMatcherValue(draft.matchers.agencyTier, v))
              }
            />
          </Field>
          <Field label={t("rules.matcher.request_type")}>
            <ChipGroup
              options={REQUEST_TYPES}
              selected={draft.matchers.requestType ?? []}
              onToggle={(v) =>
                setMatcher("requestType", toggleMatcherValue(draft.matchers.requestType, v))
              }
              labelFn={(rt) => t(`rfq.type.${rt}` as Parameters<typeof t>[0])}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label={t("rules.matcher.min_total_net")}>
              <Input
                type="number"
                value={draft.matchers.minTotalNetUSD ?? ""}
                onChange={(e) =>
                  setMatcher(
                    "minTotalNetUSD",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                placeholder="20000"
              />
            </Field>
            <Field label={t("rules.matcher.max_total_net")}>
              <Input
                type="number"
                value={draft.matchers.maxTotalNetUSD ?? ""}
                onChange={(e) =>
                  setMatcher(
                    "maxTotalNetUSD",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                placeholder="50000"
              />
            </Field>
          </div>
        </FormSection>

        {/* Markup */}
        <FormSection title={t("rules.editor.section.markup")}>
          <Field label={t("rules.editor.field.formula")}>
            <div className="flex flex-wrap gap-2">
              {FORMULAS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() =>
                    setDraft({ ...draft, markup: { ...draft.markup, formula: f } })
                  }
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-caption transition-colors",
                    draft.markup.formula === f
                      ? "border-accent-border bg-accent-soft text-accent"
                      : "border-border-subtle bg-bg-raised text-ink-secondary hover:border-border-default",
                  )}
                >
                  {t(`rules.editor.formula.${f}` as Parameters<typeof t>[0])}
                </button>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label={t("rules.editor.field.value")}>
              <Input
                type="number"
                value={draft.markup.value}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    markup: { ...draft.markup, value: Number(e.target.value) || 0 },
                  })
                }
              />
            </Field>
            <Field label={t("rules.editor.field.min_markup")}>
              <Input
                type="number"
                value={draft.markup.minMarkupUSD ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    markup: {
                      ...draft.markup,
                      minMarkupUSD: e.target.value ? Number(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="—"
              />
            </Field>
            <Field label={t("rules.editor.field.max_markup")}>
              <Input
                type="number"
                value={draft.markup.maxMarkupUSD ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    markup: {
                      ...draft.markup,
                      maxMarkupUSD: e.target.value ? Number(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="—"
              />
            </Field>
          </div>
        </FormSection>

        {/* Behavior */}
        <FormSection title={t("rules.editor.section.behavior")}>
          <CheckboxRow
            checked={draft.autoForward ?? false}
            onChange={(v) => setDraft({ ...draft, autoForward: v })}
            label={t("rules.editor.field.auto_forward")}
          />
          <CheckboxRow
            checked={draft.autoApply}
            onChange={(v) => setDraft({ ...draft, autoApply: v })}
            label={t("rules.editor.field.auto_apply")}
          />
        </FormSection>
      </div>

      <DialogFooter>
        <Button variant="ghost" onClick={onCancel}>
          {t("rules.editor.cancel")}
        </Button>
        <Button onClick={() => onSave(draft)} disabled={!draft.name.trim()}>
          <Check className="size-4" />
          {t("rules.editor.save")}
        </Button>
      </DialogFooter>
    </>
  )
}

/* ── Small form pieces ─────────────────────────────────── */

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 border-b border-border-subtle pb-5 last:border-b-0 last:pb-0">
      <h3 className="text-caption font-medium uppercase tracking-[0.1em] text-ink-tertiary">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-caption text-ink-secondary">{label}</span>
      {children}
      {hint ? <span className="text-[11px] text-ink-tertiary">{hint}</span> : null}
    </label>
  )
}

function ToggleButton({
  value,
  onChange,
}: {
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-md border px-3 transition-colors",
        value
          ? "border-success/30 bg-success-soft text-success"
          : "border-border-subtle bg-bg-raised text-ink-secondary",
      )}
    >
      <span
        className={cn(
          "grid size-4 place-items-center rounded-full border",
          value ? "border-success bg-success text-white" : "border-border-default",
        )}
      >
        {value ? <Check className="size-2.5" /> : null}
      </span>
      <span className="text-caption">{value ? "On" : "Off"}</span>
    </button>
  )
}

function CheckboxRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 rounded-md border border-border-subtle bg-bg-raised px-4 py-3 text-left transition-colors hover:border-border-default"
    >
      <span
        className={cn(
          "mt-0.5 grid size-4 shrink-0 place-items-center rounded border",
          checked
            ? "border-accent bg-accent text-white"
            : "border-border-default bg-bg-raised",
        )}
      >
        {checked ? <Check className="size-2.5" /> : null}
      </span>
      <span className="text-caption text-ink-primary">{label}</span>
    </button>
  )
}

function ChipGroup<T extends string>({
  options,
  selected,
  onToggle,
  labelFn,
}: {
  options: T[]
  selected: T[]
  onToggle: (v: T) => void
  labelFn?: (v: T) => string
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = selected.includes(o)
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={cn(
              "rounded-md border px-2.5 py-1 text-caption transition-colors",
              active
                ? "border-accent-border bg-accent-soft text-accent"
                : "border-border-subtle bg-bg-raised text-ink-secondary hover:border-border-default",
            )}
          >
            {labelFn ? labelFn(o) : o}
          </button>
        )
      })}
    </div>
  )
}

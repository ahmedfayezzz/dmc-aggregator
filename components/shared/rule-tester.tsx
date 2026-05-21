"use client"

import { useState } from "react"
import { Beaker, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/i18n/provider"
import { evaluateRules, type RuleContext, type RuleEvaluation } from "@/lib/rfq/evaluate-rules"
import type {
  AgencyTier,
  CountryCode,
  HotelTier,
  ItineraryTheme,
  MarkupRule,
  RequestType,
} from "@/lib/types"
import { cn } from "@/lib/utils"

const ALL_COUNTRIES: CountryCode[] = ["JO", "MA", "EG", "AE", "SA", "OM"]
const ALL_THEMES: ItineraryTheme[] = ["family", "luxury", "first-time", "adventure", "cultural", "religious"]
const HOTEL_TIERS: HotelTier[] = ["3", "4", "5", "5+", "mixed"]
const AGENCY_TIERS: AgencyTier[] = ["standard", "gold", "vip"]
const REQUEST_TYPES: RequestType[] = ["MODIFY_EXISTING", "FROM_SCRATCH"]

/**
 * RuleTester — paste a sample request payload, run evaluateRules() against
 * the current rule set, show which rule matched and what would happen.
 */
export function RuleTester({ rules }: { rules: MarkupRule[] }) {
  const { t, locale } = useTranslation()
  const [country, setCountry] = useState<CountryCode>("JO")
  const [theme, setTheme] = useState<ItineraryTheme>("cultural")
  const [hotelTier, setHotelTier] = useState<HotelTier>("4")
  const [agencyTier, setAgencyTier] = useState<AgencyTier>("standard")
  const [requestType, setRequestType] = useState<RequestType>("FROM_SCRATCH")
  const [totalNet, setTotalNet] = useState<string>("16800")
  const [paxCount, setPaxCount] = useState<string>("8")

  const [result, setResult] = useState<RuleEvaluation | null>(null)
  const [ran, setRan] = useState(false)

  const runTest = () => {
    const pax = Math.max(1, Number(paxCount) || 1)
    const totalNetUSD = Number(totalNet) || undefined
    const ctx: RuleContext = {
      requestType,
      countries: [country],
      themes: [theme],
      hotelTier,
      paxCount: pax,
      dmcNetTotalUSD: totalNetUSD,
      dmcNetPerPaxUSD: totalNetUSD ? Math.round(totalNetUSD / pax) : undefined,
      agencyTier,
    }
    const evaluation = evaluateRules(rules, ctx)
    setResult(evaluation)
    setRan(true)
  }

  return (
    <section className="space-y-5 rounded-lg border border-border-subtle bg-bg-raised p-6">
      <header className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">
          <Beaker className="size-4" />
        </span>
        <div className="flex-1">
          <h3 className="text-subheading text-ink-primary">{t("rules.test.title")}</h3>
          <p className="mt-1 text-caption text-ink-tertiary">{t("rules.test.subtitle")}</p>
        </div>
      </header>

      {/* Form */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label={t("rules.test.field.country")}>
          <Picker
            options={ALL_COUNTRIES}
            value={country}
            onChange={setCountry}
          />
        </Field>
        <Field label={t("rules.test.field.theme")}>
          <Picker
            options={ALL_THEMES}
            value={theme}
            onChange={setTheme}
            labelFn={(th) => t(`itinerary.theme.${th}` as Parameters<typeof t>[0])}
          />
        </Field>
        <Field label={t("rules.test.field.hotel")}>
          <Picker
            options={HOTEL_TIERS}
            value={hotelTier}
            onChange={setHotelTier}
            labelFn={(tier) => t(`rfq.hotel.${tier}` as Parameters<typeof t>[0])}
          />
        </Field>
        <Field label={t("rules.test.field.agency_tier")}>
          <Picker
            options={AGENCY_TIERS}
            value={agencyTier}
            onChange={setAgencyTier}
          />
        </Field>
        <Field label={t("rules.test.field.request_type")}>
          <Picker
            options={REQUEST_TYPES}
            value={requestType}
            onChange={setRequestType}
            labelFn={(rt) => t(`rfq.type.${rt}` as Parameters<typeof t>[0])}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("rules.test.field.total_net")}>
            <Input
              type="number"
              value={totalNet}
              onChange={(e) => setTotalNet(e.target.value)}
              placeholder="16800"
            />
          </Field>
          <Field label={t("rules.test.field.pax")}>
            <Input
              type="number"
              min={1}
              value={paxCount}
              onChange={(e) => setPaxCount(e.target.value)}
              placeholder="8"
            />
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={runTest}>
          <Beaker className="size-4" />
          {t("rules.test.run")}
        </Button>
      </div>

      {/* Result */}
      <div className="rounded-md border border-border-subtle bg-bg-sunken/40 p-5">
        {!ran ? (
          <p className="text-center text-caption text-ink-tertiary">
            {t("rules.test.placeholder.notest")}
          </p>
        ) : result?.matchedRule ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-label text-ink-tertiary">{t("rules.test.result.match")}</p>
                <p className="mt-1 text-subheading text-ink-primary">
                  {result.matchedRule.name}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-ink-tertiary">
                  {result.matchedRule.id} · priority {result.matchedRule.priority}
                </p>
              </div>
              <div className="text-right">
                <p className="text-label text-ink-tertiary">{t("rules.test.result.markup")}</p>
                <p className="mt-1 text-heading text-accent">
                  ${result.markupUSD.toLocaleString(locale === "zh-CN" ? "zh-CN" : "en-US")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-border-subtle pt-3">
              <ResultPill
                label={t("rules.test.result.auto_apply")}
                value={result.autoApply}
              />
              <ResultPill
                label={t("rules.test.result.auto_forward")}
                value={result.autoForward}
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-caption text-ink-secondary">
            {t("rules.test.result.no_match")}
          </p>
        )}
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-caption text-ink-secondary">{label}</span>
      {children}
    </label>
  )
}

function Picker<T extends string>({
  options,
  value,
  onChange,
  labelFn,
}: {
  options: T[]
  value: T
  onChange: (v: T) => void
  labelFn?: (v: T) => string
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = o === value
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
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

function ResultPill({ label, value }: { label: string; value: boolean }) {
  const { t } = useTranslation()
  return (
    <Badge variant={value ? "success" : "neutral"}>
      <span className="flex items-center gap-1.5">
        {value ? <Check className="size-3" /> : <X className="size-3" />}
        {label} · {value ? t("rules.test.result.yes") : t("rules.test.result.no")}
      </span>
    </Badge>
  )
}

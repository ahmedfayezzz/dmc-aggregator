"use client"

import { Suspense, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Minus, Plus, Send } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/shared/page-header"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"
import { findItinerary } from "@/lib/mock"
import type {
  BudgetBand,
  CountryCode,
  HotelTier,
  ItineraryTheme,
} from "@/lib/types"
import { cn } from "@/lib/utils"

const COUNTRY_LABEL: Record<CountryCode, { "zh-CN": string; en: string }> = {
  JO: { "zh-CN": "约旦", en: "Jordan" },
  MA: { "zh-CN": "摩洛哥", en: "Morocco" },
  EG: { "zh-CN": "埃及", en: "Egypt" },
  AE: { "zh-CN": "阿联酋", en: "UAE" },
  SA: { "zh-CN": "沙特", en: "Saudi Arabia" },
  OM: { "zh-CN": "阿曼", en: "Oman" },
}

const ALL_COUNTRIES: CountryCode[] = ["JO", "MA", "EG", "AE", "SA", "OM"]
const ALL_THEMES: ItineraryTheme[] = ["family", "luxury", "first-time", "adventure", "cultural", "religious"]
const HOTEL_TIERS: HotelTier[] = ["3", "4", "5", "5+", "mixed"]
const BUDGET_BANDS: BudgetBand[] = ["standard", "premium", "luxury", "unlimited"]

export default function AgencyRequestNewPage() {
  return (
    <Suspense fallback={null}>
      <NewRequestForm />
    </Suspense>
  )
}

function NewRequestForm() {
  const router = useRouter()
  const search = useSearchParams()
  const baseId = search.get("from") ?? undefined
  const { t, locale } = useTranslation()
  const { agencyId, submitCustomRequest } = useDemoState()

  const baseItinerary = useMemo(() => (baseId ? findItinerary(baseId) : undefined), [baseId])

  // Pre-fill from base itinerary if we came from /agency/browse/[id]
  const [destinations, setDestinations] = useState<Set<CountryCode>>(
    new Set(baseItinerary?.countries ?? ["JO"]),
  )
  const [cities, setCities] = useState(baseItinerary?.cities.join(", ") ?? "")
  const [travelFrom, setTravelFrom] = useState("2026-10-15")
  const [travelTo, setTravelTo] = useState("2026-10-25")
  const [duration, setDuration] = useState(baseItinerary?.duration.days ?? 8)
  const [adults, setAdults] = useState(4)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [themes, setThemes] = useState<Set<ItineraryTheme>>(
    new Set(baseItinerary?.themes ?? ["cultural"]),
  )
  const [hotelTier, setHotelTier] = useState<HotelTier>("4")
  const [budgetBand, setBudgetBand] = useState<BudgetBand>("standard")
  const [budgetPerPax, setBudgetPerPax] = useState<string>("")
  const [activitiesZh, setActivitiesZh] = useState("")
  const [activitiesEn, setActivitiesEn] = useState("")
  const [specialNeedsZh, setSpecialNeedsZh] = useState("")
  const [specialNeedsEn, setSpecialNeedsEn] = useState("")
  const [notesZh, setNotesZh] = useState("")
  const [notesEn, setNotesEn] = useState("")

  const toggleSet = <T,>(set: Set<T>, value: T) => {
    const next = new Set(set)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    return next
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (destinations.size === 0) {
      toast.error(t("agency.request.new.field.destinations"))
      return
    }
    const newId = submitCustomRequest({
      type: baseItinerary ? "MODIFY_EXISTING" : "FROM_SCRATCH",
      agencyId,
      wholesalerId: "wh-001", // Demo single-tenant
      baseItineraryId: baseItinerary?.id,
      payload: {
        destinations: Array.from(destinations),
        cities: cities.split(",").map((s) => s.trim()).filter(Boolean),
        travelWindow: { from: travelFrom, to: travelTo },
        durationDays: duration,
        pax: { adults, children, infants },
        themes: Array.from(themes),
        hotelTier,
        budgetBand,
        budgetPerPaxUSD: budgetPerPax ? Number(budgetPerPax) : undefined,
        activitiesRequested:
          activitiesZh || activitiesEn
            ? { "zh-CN": activitiesZh, en: activitiesEn }
            : undefined,
        specialNeeds:
          specialNeedsZh || specialNeedsEn
            ? { "zh-CN": specialNeedsZh, en: specialNeedsEn }
            : undefined,
        notes: notesZh || notesEn ? { "zh-CN": notesZh, en: notesEn } : undefined,
      },
    })
    toast.success(t("toast.crfq.submitted"))
    router.push(`/agency/requests/${newId}`)
  }

  return (
    <div className="pb-24">
      <div className="border-b border-border-subtle px-8 pt-8 pb-2">
        <Link
          href="/agency/requests"
          className="inline-flex items-center gap-2 text-caption text-ink-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          {t("agency.requests.title")}
        </Link>
      </div>

      <PageHeader
        eyebrow={t("nav.requests")}
        title={t("agency.request.new.title")}
        subtitle={
          baseItinerary
            ? t("agency.request.new.from_itinerary_note", {
                title: getLocalized(baseItinerary.title, locale),
              })
            : t("agency.request.new.subtitle")
        }
      />

      <form onSubmit={onSubmit} className="mx-auto max-w-4xl space-y-10 px-8 pt-10">
        {/* ── Basics ── */}
        <Section title={t("agency.request.new.section.basics")}>
          <Field label={t("agency.request.new.field.destinations")}>
            <div className="flex flex-wrap gap-2">
              {ALL_COUNTRIES.map((c) => {
                const active = destinations.has(c)
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setDestinations(toggleSet(destinations, c))}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-caption transition-colors",
                      active
                        ? "border-accent-border bg-accent-soft text-accent"
                        : "border-border-subtle bg-bg-raised text-ink-secondary hover:border-border-default",
                    )}
                  >
                    {locale === "zh-CN" ? COUNTRY_LABEL[c]["zh-CN"] : COUNTRY_LABEL[c].en}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field label={t("agency.request.new.field.cities")}>
            <Input
              value={cities}
              onChange={(e) => setCities(e.target.value)}
              placeholder="Petra, Wadi Rum, Dead Sea"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label={t("agency.request.new.field.travel_window")}>
              <div className="flex items-center gap-2">
                <Input type="date" value={travelFrom} onChange={(e) => setTravelFrom(e.target.value)} />
                <span className="text-ink-tertiary">→</span>
                <Input type="date" value={travelTo} onChange={(e) => setTravelTo(e.target.value)} />
              </div>
            </Field>
            <Field label={t("agency.request.new.field.duration")}>
              <CounterRow value={duration} onChange={setDuration} min={1} max={30} />
            </Field>
          </div>

          <Field label={t("agency.request.new.field.pax")}>
            <div className="grid grid-cols-3 gap-3">
              <PaxBox label={t("common.adults")} value={adults} onChange={setAdults} min={1} />
              <PaxBox label={t("common.children")} value={children} onChange={setChildren} min={0} />
              <PaxBox label={t("common.infants")} value={infants} onChange={setInfants} min={0} />
            </div>
          </Field>
        </Section>

        {/* ── Preferences & budget ── */}
        <Section title={t("agency.request.new.section.preferences")}>
          <Field label={t("agency.request.new.field.themes")}>
            <div className="flex flex-wrap gap-2">
              {ALL_THEMES.map((th) => {
                const active = themes.has(th)
                return (
                  <button
                    key={th}
                    type="button"
                    onClick={() => setThemes(toggleSet(themes, th))}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-caption transition-colors",
                      active
                        ? "border-accent-border bg-accent-soft text-accent"
                        : "border-border-subtle bg-bg-raised text-ink-secondary hover:border-border-default",
                    )}
                  >
                    {t(`itinerary.theme.${th}` as Parameters<typeof t>[0])}
                  </button>
                )
              })}
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t("agency.request.new.field.hotel_tier")}>
              <div className="flex gap-2">
                {HOTEL_TIERS.map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setHotelTier(tier)}
                    className={cn(
                      "flex-1 rounded-md border px-3 py-2 text-caption transition-colors",
                      hotelTier === tier
                        ? "border-accent-border bg-accent-soft text-accent"
                        : "border-border-subtle bg-bg-raised text-ink-secondary hover:border-border-default",
                    )}
                  >
                    {t(`rfq.hotel.${tier}` as Parameters<typeof t>[0])}
                  </button>
                ))}
              </div>
            </Field>

            <Field label={t("agency.request.new.field.budget_band")}>
              <div className="flex gap-2">
                {BUDGET_BANDS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudgetBand(b)}
                    className={cn(
                      "flex-1 rounded-md border px-3 py-2 text-caption transition-colors",
                      budgetBand === b
                        ? "border-accent-border bg-accent-soft text-accent"
                        : "border-border-subtle bg-bg-raised text-ink-secondary hover:border-border-default",
                    )}
                  >
                    {t(`rfq.budget.${b}` as Parameters<typeof t>[0])}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Field label={t("agency.request.new.field.budget_per_pax")}>
            <Input
              type="number"
              value={budgetPerPax}
              onChange={(e) => setBudgetPerPax(e.target.value)}
              placeholder="2500"
            />
          </Field>
        </Section>

        {/* ── Extras ── */}
        <Section title={t("agency.request.new.section.extras")}>
          <BilingualTextarea
            label={t("agency.request.new.field.activities")}
            valueZh={activitiesZh}
            valueEn={activitiesEn}
            onChangeZh={setActivitiesZh}
            onChangeEn={setActivitiesEn}
          />
          <BilingualTextarea
            label={t("agency.request.new.field.special_needs")}
            valueZh={specialNeedsZh}
            valueEn={specialNeedsEn}
            onChangeZh={setSpecialNeedsZh}
            onChangeEn={setSpecialNeedsEn}
          />
          <BilingualTextarea
            label={t("agency.request.new.field.notes")}
            valueZh={notesZh}
            valueEn={notesEn}
            onChangeZh={setNotesZh}
            onChangeEn={setNotesEn}
          />
        </Section>

        <div className="sticky bottom-0 -mx-8 flex items-center justify-end gap-3 border-t border-border-subtle bg-bg-base/95 px-8 py-4 backdrop-blur">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            {t("actions.cancel")}
          </Button>
          <Button type="submit" size="lg">
            <Send className="size-4" />
            {t("agency.request.new.submit")}
          </Button>
        </div>
      </form>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5">
      <h2 className="text-heading text-ink-primary">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-caption text-ink-tertiary">{label}</span>
      {children}
    </label>
  )
}

function CounterRow({
  value,
  onChange,
  min,
  max,
}: {
  value: number
  onChange: (n: number) => void
  min: number
  max: number
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-raised px-4 py-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="grid size-7 place-items-center rounded border border-border-default text-ink-secondary transition-colors hover:border-accent hover:text-accent disabled:opacity-30"
        disabled={value <= min}
      >
        <Minus className="size-3" />
      </button>
      <span className="text-data text-ink-primary">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="grid size-7 place-items-center rounded border border-border-default text-ink-secondary transition-colors hover:border-accent hover:text-accent"
      >
        <Plus className="size-3" />
      </button>
    </div>
  )
}

function PaxBox({
  label,
  value,
  onChange,
  min,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  min: number
}) {
  return (
    <div className="rounded-md border border-border-subtle bg-bg-raised p-3">
      <p className="text-caption text-ink-tertiary">{label}</p>
      <CounterRow value={value} onChange={onChange} min={min} max={99} />
    </div>
  )
}

function BilingualTextarea({
  label,
  valueZh,
  valueEn,
  onChangeZh,
  onChangeEn,
}: {
  label: string
  valueZh: string
  valueEn: string
  onChangeZh: (v: string) => void
  onChangeEn: (v: string) => void
}) {
  return (
    <Field label={label}>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <textarea
          value={valueZh}
          onChange={(e) => onChangeZh(e.target.value)}
          placeholder="中文"
          rows={3}
          className="rounded-md border border-border-subtle bg-bg-raised px-3 py-2 text-caption text-ink-primary placeholder:text-ink-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft"
        />
        <textarea
          value={valueEn}
          onChange={(e) => onChangeEn(e.target.value)}
          placeholder="English"
          rows={3}
          className="rounded-md border border-border-subtle bg-bg-raised px-3 py-2 text-caption text-ink-primary placeholder:text-ink-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft"
        />
      </div>
    </Field>
  )
}

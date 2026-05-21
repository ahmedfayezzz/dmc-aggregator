"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { ArrowLeft, Check, ChevronRight, Lightbulb, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/shared/page-header"
import { findItinerary } from "@/lib/mock"
import { formatCurrency } from "@/lib/formatters/currency"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"
import { cn } from "@/lib/utils"

type Upgrade = { id: string; label: { "zh-CN": string; en: string }; priceUSD: number }
type Excursion = Upgrade

const SAMPLE_UPGRADES: Upgrade[] = [
  { id: "u1", label: { "zh-CN": "升级帆船酒店一晚", en: "Burj Al Arab upgrade (1 night)" }, priceUSD: 580 },
  { id: "u2", label: { "zh-CN": "升级海景房", en: "Sea-view room upgrade" }, priceUSD: 80 },
  { id: "u3", label: { "zh-CN": "升级商务舱内陆", en: "Business class domestic" }, priceUSD: 340 },
]

const SAMPLE_EXCURSIONS: Excursion[] = [
  { id: "e1", label: { "zh-CN": "私人游艇半日", en: "Private yacht half-day" }, priceUSD: 240 },
  { id: "e2", label: { "zh-CN": "六星 SPA 体验", en: "Six-star spa" }, priceUSD: 180 },
  { id: "e3", label: { "zh-CN": "米其林晚宴", en: "Michelin dinner" }, priceUSD: 320 },
]

export default function AgencyCustomizePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const itinerary = findItinerary(id)
  const { t, locale } = useTranslation()
  const { setBookingDraft } = useDemoState()

  const [date, setDate] = useState("2026-07-20")
  const [adults, setAdults] = useState(4)
  const [children, setChildren] = useState(0)
  const [twinRooms, setTwinRooms] = useState(2)
  const [upgrades, setUpgrades] = useState<Set<string>>(new Set())
  const [excursions, setExcursions] = useState<Set<string>>(new Set())

  if (!itinerary) notFound()

  const basePerPax = itinerary.pricing.bands.find(
    (b) => adults >= b.minPax && adults <= b.maxPax,
  )?.perPaxUSD ?? itinerary.marginLayers.agencyRetailUSD

  const upgradeTotal = SAMPLE_UPGRADES
    .filter((u) => upgrades.has(u.id))
    .reduce((sum, u) => sum + u.priceUSD * adults, 0)
  const excursionTotal = SAMPLE_EXCURSIONS
    .filter((e) => excursions.has(e.id))
    .reduce((sum, e) => sum + e.priceUSD * adults, 0)
  const base = basePerPax * adults + Math.round(basePerPax * 0.7) * children
  const total = base + upgradeTotal + excursionTotal

  const toggle = (set: Set<string>, setSet: (s: Set<string>) => void, id: string) => {
    const next = new Set(set)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSet(next)
  }

  const proceed = () => {
    setBookingDraft({ itineraryId: itinerary.id, adults, children })
    router.push(`/agency/book/${itinerary.id}`)
  }

  return (
    <div className="pb-24">
      <div className="border-b border-border-subtle px-8 pt-8 pb-2">
        <Link
          href={`/agency/browse/${itinerary.id}`}
          className="inline-flex items-center gap-2 text-caption text-ink-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          {getLocalized(itinerary.title, locale)}
        </Link>
      </div>

      <PageHeader
        eyebrow={t("actions.customize")}
        title={t("agency.customize.title")}
        subtitle={getLocalized(itinerary.subtitle, locale)}
      />

      <div className="grid grid-cols-1 gap-8 px-8 pt-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <Section title={t("agency.customize.dates")}>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-caption text-ink-tertiary">{t("common.from")}</span>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <div className="flex flex-col gap-2">
                <span className="text-caption text-ink-tertiary">{t("itinerary.duration_days", { days: itinerary.duration.days, nights: itinerary.duration.nights })}</span>
                <div className="grid h-10 place-items-start rounded-md border border-border-subtle bg-bg-sunken/40 px-3 pt-2 text-data text-ink-secondary">
                  {itinerary.duration.days} {t("common.days")} · {itinerary.duration.nights} {t("common.nights")}
                </div>
              </div>
            </div>
          </Section>

          <Section title={t("agency.customize.pax")}>
            <div className="grid grid-cols-2 gap-4">
              <PaxRowBox label={t("common.adults")} value={adults} onChange={setAdults} min={1} />
              <PaxRowBox label={t("common.children")} value={children} onChange={setChildren} min={0} />
            </div>
          </Section>

          <Section title={t("agency.customize.rooms")}>
            <PaxRowBox label={t("booking.twin_room")} value={twinRooms} onChange={setTwinRooms} min={1} />
          </Section>

          <Section title={t("agency.customize.upgrades")}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {SAMPLE_UPGRADES.map((u) => (
                <OptionCard
                  key={u.id}
                  label={getLocalized(u.label, locale)}
                  price={formatCurrency(u.priceUSD, "USD", locale)}
                  active={upgrades.has(u.id)}
                  onClick={() => toggle(upgrades, setUpgrades, u.id)}
                />
              ))}
            </div>
          </Section>

          <Section title={t("agency.customize.excursions")}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {SAMPLE_EXCURSIONS.map((e) => (
                <OptionCard
                  key={e.id}
                  label={getLocalized(e.label, locale)}
                  price={formatCurrency(e.priceUSD, "USD", locale)}
                  active={excursions.has(e.id)}
                  onClick={() => toggle(excursions, setExcursions, e.id)}
                />
              ))}
            </div>
          </Section>

          {/* Deeper customization escalation → custom RFQ pipeline */}
          <Link
            href={`/agency/request/new?from=${itinerary.id}`}
            className="group/escalate flex items-start gap-4 rounded-lg border border-dashed border-accent-border bg-accent-soft/30 p-5 transition-colors hover:border-accent hover:bg-accent-soft"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">
              <Lightbulb className="size-5" />
            </span>
            <div className="flex-1">
              <h4 className="text-subheading text-ink-primary">
                {t("agency.browse.beyond_catalog")}
              </h4>
              <p className="mt-1 text-caption text-ink-secondary">
                {t("agency.browse.beyond_catalog_sub")}
              </p>
            </div>
            <ChevronRight className="size-4 text-accent transition-transform group-hover/escalate:translate-x-1" />
          </Link>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-[80px] lg:self-start">
          <section className="overflow-hidden rounded-lg border border-accent-border bg-bg-raised">
            <header className="bg-accent-soft px-5 py-4">
              <p className="text-label text-accent">{t("agency.customize.price_breakdown")}</p>
            </header>
            <div className="space-y-2 px-5 py-4 text-caption">
              <Row label={`${t("common.adults")} × ${adults}`} value={formatCurrency(basePerPax * adults, "USD", locale)} />
              {children > 0 ? (
                <Row label={`${t("common.children")} × ${children}`} value={formatCurrency(Math.round(basePerPax * 0.7) * children, "USD", locale)} />
              ) : null}
              {upgradeTotal > 0 ? (
                <Row label={t("agency.customize.upgrades")} value={formatCurrency(upgradeTotal, "USD", locale)} />
              ) : null}
              {excursionTotal > 0 ? (
                <Row label={t("agency.customize.excursions")} value={formatCurrency(excursionTotal, "USD", locale)} />
              ) : null}
            </div>
            <div className="border-t border-border-subtle px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-body text-ink-secondary">{t("booking.total")}</span>
                <span className="text-display-md text-accent">
                  {formatCurrency(total, "USD", locale)}
                </span>
              </div>
              <p className="mt-1 text-caption text-ink-tertiary">{t("pricing.per_pax")} ≈ {formatCurrency(total / Math.max(adults + children, 1), "USD", locale)}</p>
            </div>
            <footer className="border-t border-border-subtle bg-bg-sunken/40 p-5">
              <Button size="lg" className="w-full" onClick={proceed}>
                {t("actions.proceed_to_book")}
                <ChevronRight className="size-4" />
              </Button>
            </footer>
          </section>
        </aside>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-heading text-ink-primary">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function PaxRowBox({
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
    <div className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-raised px-4 py-3">
      <span className="text-caption text-ink-secondary">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="grid size-7 place-items-center rounded border border-border-default text-ink-secondary transition-colors hover:border-accent hover:text-accent disabled:opacity-30"
          disabled={value <= min}
        >
          <Minus className="size-3" />
        </button>
        <span className="w-8 text-center text-data text-ink-primary">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="grid size-7 place-items-center rounded border border-border-default text-ink-secondary transition-colors hover:border-accent hover:text-accent"
        >
          <Plus className="size-3" />
        </button>
      </div>
    </div>
  )
}

function OptionCard({
  label,
  price,
  active,
  onClick,
}: {
  label: string
  price: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col gap-2 rounded-lg border bg-bg-raised p-4 text-left transition-colors",
        active
          ? "border-accent-border bg-accent-soft"
          : "border-border-subtle hover:border-border-default",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-body text-ink-primary">{label}</span>
        {active ? <Check className="size-4 text-accent" /> : null}
      </div>
      <span className="text-data text-ink-secondary">+ {price}</span>
    </button>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-ink-tertiary">{label}</span>
      <span className="text-data text-ink-primary">{value}</span>
    </div>
  )
}

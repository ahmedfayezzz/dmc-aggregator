"use client"

import { use, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Bookmark,
  Check,
  ChevronRight,
  Minus,
  Plus,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DepartureStatusBadge } from "@/components/shared/status-badge"
import { findItinerary, findDMC } from "@/lib/mock"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"
import { formatDuration } from "@/lib/formatters/duration"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"
import { cn } from "@/lib/utils"

type Tab = "highlights" | "days" | "inclusions" | "policy"

export default function AgencyItineraryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const itinerary = findItinerary(id)
  const { t, locale } = useTranslation()
  const { setBookingDraft } = useDemoState()

  const [activeImage, setActiveImage] = useState(0)
  const [tab, setTab] = useState<Tab>("highlights")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [selectedDepartureId, setSelectedDepartureId] = useState<string | null>(null)

  if (!itinerary) notFound()
  const dmc = findDMC(itinerary.dmcId)

  const pricePerPax = useMemo(() => {
    const pax = adults + Math.round(children / 2)
    const band = itinerary.pricing.bands.find(
      (b) => pax >= b.minPax && pax <= b.maxPax,
    )
    return band?.perPaxUSD ?? itinerary.marginLayers.agencyRetailUSD
  }, [adults, children, itinerary])

  const total = pricePerPax * adults + Math.round(pricePerPax * 0.7) * children

  const handleBook = () => {
    setBookingDraft({
      itineraryId: itinerary.id,
      departureId: selectedDepartureId,
      adults,
      children,
      infants: 0,
    })
    router.push(`/agency/book/${itinerary.id}`)
  }

  const handleQuote = () => {
    setBookingDraft({
      itineraryId: itinerary.id,
      departureId: selectedDepartureId,
      adults,
      children,
      infants: 0,
    })
    router.push(`/agency/quote/${itinerary.id}`)
  }

  const galleryImages = [itinerary.heroImage, ...itinerary.gallery].slice(0, 6)

  return (
    <div className="pb-24">
      <div className="px-8 pt-6 pb-2">
        <Link
          href="/agency/browse"
          className="inline-flex items-center gap-2 text-caption text-ink-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          {t("actions.back_to_browse")}
        </Link>
      </div>

      {/* Hero */}
      <section className="px-8 pt-2">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-bg-sunken">
            <Image
              src={galleryImages[activeImage]}
              alt={getLocalized(itinerary.title, locale)}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-opacity duration-300"
            />
            <div className="absolute left-5 top-5 flex flex-wrap gap-2">
              {itinerary.themes.slice(0, 2).map((th) => (
                <Badge key={th} variant="accent">
                  {t(`itinerary.theme.${th}` as Parameters<typeof t>[0])}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-2 lg:grid-rows-3">
            {galleryImages.slice(0, 6).map((src, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(idx)}
                className={cn(
                  "relative aspect-[16/10] overflow-hidden rounded-md border bg-bg-sunken transition-all",
                  idx === activeImage ? "border-accent" : "border-border-subtle hover:border-border-default",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Title + meta */}
      <section className="px-8 pt-8 pb-6 border-b border-border-subtle">
        <div className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-3xl">
            <span className="text-label text-ink-tertiary">
              {itinerary.cities.join(" · ")} · {dmc?.name}
            </span>
            <h1 className="text-display-lg text-ink-primary">
              {getLocalized(itinerary.title, locale)}
            </h1>
            <p className="text-subheading text-ink-secondary">
              {getLocalized(itinerary.subtitle, locale)}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">
                {formatDuration(itinerary.duration.days, itinerary.duration.nights, locale)}
              </Badge>
              <Badge variant="neutral">
                {t(
                  itinerary.departureType === "FIXED"
                    ? "catalog.departure_type.fixed"
                    : itinerary.departureType === "ON_DEMAND"
                      ? "catalog.departure_type.on_demand"
                      : "catalog.departure_type.rfq_only",
                )}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 px-8 pt-8 lg:grid-cols-[1fr_360px]">
        {/* Main content with tabs */}
        <div className="space-y-6">
          <nav className="flex items-center gap-6 border-b border-border-subtle">
            {(
              [
                ["highlights", "itinerary.section.highlights"],
                ["days", "itinerary.section.day_by_day"],
                ["inclusions", "itinerary.section.inclusions"],
                ["policy", "itinerary.section.cancellation"],
              ] as const
            ).map(([k, lk]) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={cn(
                  "relative pb-3 text-body transition-colors",
                  tab === k ? "text-ink-primary" : "text-ink-tertiary hover:text-ink-secondary",
                )}
              >
                {t(lk)}
                {tab === k ? (
                  <span className="absolute -bottom-px left-0 h-[2px] w-full bg-accent" aria-hidden />
                ) : null}
              </button>
            ))}
          </nav>

          {tab === "highlights" ? (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {getLocalized(itinerary.highlights, locale).map((h, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-lg border border-border-subtle bg-bg-raised p-4"
                >
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span className="text-body text-ink-secondary">{h}</span>
                </li>
              ))}
            </ul>
          ) : tab === "days" ? (
            <ol className="space-y-6">
              {itinerary.days.map((d) => (
                <li key={d.day} className="rounded-lg border border-border-subtle bg-bg-raised p-6">
                  <div className="flex items-baseline justify-between">
                    <p className="text-label text-accent">
                      {t("itinerary.day_label", { day: d.day })}
                    </p>
                  </div>
                  <h3 className="mt-2 text-subheading text-ink-primary">
                    {getLocalized(d.title, locale)}
                  </h3>
                  <p className="mt-3 text-caption text-ink-secondary leading-relaxed">
                    {getLocalized(d.description, locale)}
                  </p>
                  {d.activities.length > 0 ? (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {d.activities.map((a, idx) => (
                        <li key={idx}>
                          <Badge variant="neutral">{getLocalized(a.name, locale)}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : tab === "inclusions" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-border-subtle bg-bg-raised p-6">
                <h3 className="text-subheading text-ink-primary">
                  {t("itinerary.section.inclusions")}
                </h3>
                <ul className="mt-4 space-y-2">
                  {getLocalized(itinerary.inclusions, locale).map((i, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-caption text-ink-secondary">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border-subtle bg-bg-raised p-6">
                <h3 className="text-subheading text-ink-primary">
                  {t("itinerary.section.exclusions")}
                </h3>
                <ul className="mt-4 space-y-2">
                  {getLocalized(itinerary.exclusions, locale).map((i, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-caption text-ink-tertiary">
                      <span className="mt-0.5 inline-flex size-3.5 shrink-0 items-center justify-center rounded-full bg-border-subtle text-[8px] text-ink-secondary">−</span>
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-border-subtle bg-bg-raised p-6">
              <h3 className="text-subheading text-ink-primary">
                {getLocalized(itinerary.cancellationPolicy.name, locale)}
              </h3>
              <ul className="mt-4 divide-y divide-border-subtle">
                {itinerary.cancellationPolicy.tiers.map((tier, idx) => (
                  <li key={idx} className="flex items-center justify-between py-3">
                    <span className="text-caption text-ink-secondary">
                      {tier.daysBefore === 0
                        ? t("status.travelled")
                        : `≥ ${tier.daysBefore} ${t("common.days")}`}
                    </span>
                    <span className="text-data text-ink-primary">{tier.penaltyPercent}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sticky booking panel */}
        <aside className="space-y-4 lg:sticky lg:top-[80px] lg:self-start">
          <section className="overflow-hidden rounded-lg border border-accent-border bg-bg-raised">
            <header className="bg-accent-soft px-5 py-4">
              <p className="text-label text-accent">{t("agency.detail.from")}</p>
              <p className="mt-1 text-display-md text-ink-primary">
                {formatCurrency(pricePerPax, "USD", locale)}
              </p>
              <p className="mt-0.5 text-caption text-ink-tertiary">
                {t("agency.detail.per_pax")} · {adults}
                {children > 0 ? `+${children}` : ""} {t("common.adults").toLowerCase()}
              </p>
            </header>

            <div className="space-y-5 p-5">
              {itinerary.departureType === "FIXED" ? (
                <div className="space-y-2">
                  <p className="text-label text-ink-tertiary">{t("itinerary.departures.available")}</p>
                  <div className="max-h-[180px] space-y-1 overflow-y-auto rounded-md border border-border-subtle">
                    {itinerary.departures.map((d) => {
                      const isFull = d.status === "FULL" || d.status === "CLOSED"
                      const active = selectedDepartureId === d.id
                      return (
                        <button
                          key={d.id}
                          type="button"
                          disabled={isFull}
                          onClick={() => setSelectedDepartureId(d.id)}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-caption transition-colors",
                            active && "bg-accent-soft",
                            isFull && "opacity-50",
                            !isFull && !active && "hover:bg-bg-sunken/30",
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {active ? (
                              <Check className="size-3 text-accent" />
                            ) : (
                              <span className="size-3" />
                            )}
                            <span className="text-data text-ink-primary">
                              {formatDate(d.date, locale, "long")}
                            </span>
                          </span>
                          <DepartureStatusBadge status={d.status} />
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-label text-ink-tertiary">{t("agency.customize.dates")}</p>
                  <div className="rounded-md border border-border-strong px-3 py-2 text-caption text-ink-tertiary">
                    {t("actions.customize")} →
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-label text-ink-tertiary">{t("agency.customize.pax")}</p>
                <PaxRow label={t("common.adults")} value={adults} onChange={setAdults} min={1} />
                <PaxRow label={t("common.children")} value={children} onChange={setChildren} min={0} />
              </div>

              <div className="border-t border-border-subtle pt-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-body text-ink-secondary">{t("booking.total")}</span>
                  <span className="text-display-md text-accent">
                    {formatCurrency(total, "USD", locale)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button size="lg" onClick={handleBook}>
                  {t("agency.detail.book_cta")}
                  <ChevronRight className="size-4" />
                </Button>
                <Button variant="secondary" size="lg" onClick={handleQuote}>
                  <Bookmark className="size-4" />
                  {t("agency.detail.quote_cta")}
                </Button>
              </div>

              {itinerary.departureType === "ON_DEMAND" ? (
                <Link
                  href={`/agency/customize/${itinerary.id}`}
                  className="block rounded-md border border-accent-border bg-accent-soft px-3 py-2 text-center text-caption text-accent transition-colors hover:bg-bg-raised"
                >
                  {t("actions.customize")} →
                </Link>
              ) : null}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

function PaxRow({
  label,
  value,
  onChange,
  min = 0,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  min?: number
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border-subtle px-3 py-2">
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
        <span className="w-6 text-center text-data text-ink-primary">{value}</span>
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

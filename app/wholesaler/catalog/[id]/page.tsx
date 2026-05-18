"use client"

import { use, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Edit3,
  Save,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { DepartureStatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { findItinerary, findDMC, agencies } from "@/lib/mock"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"
import { formatDuration } from "@/lib/formatters/duration"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"
import { cn } from "@/lib/utils"

export default function WholesalerCatalogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const itinerary = findItinerary(id)
  const { t, locale } = useTranslation()
  const { wholesalerMarkups, setWholesalerMarkup: persistMarkup } = useDemoState()
  const [wholesalerMarkup, setWholesalerMarkup] = useState(
    wholesalerMarkups[id] ?? itinerary?.marginLayers.wholesalerSuggestedMarkupUSD ?? 0,
  )

  if (!itinerary) notFound()

  const handleSaveMarkup = () => {
    persistMarkup(itinerary.id, wholesalerMarkup)
    toast.success(t("toast.markup.saved"))
  }

  const dmc = findDMC(itinerary.dmcId)
  const wholesalerSell = itinerary.marginLayers.wholesalerSellUSD
  const agencyRetail = wholesalerSell + wholesalerMarkup

  return (
    <div className="pb-24">
      <div className="border-b border-border-subtle px-8 pt-8 pb-2">
        <Link
          href="/wholesaler/catalog"
          className="inline-flex items-center gap-2 text-caption text-ink-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          {t("nav.catalog")}
        </Link>
      </div>

      <PageHeader
        eyebrow={`${itinerary.cities.join(" · ")} · ${dmc?.name ?? ""}`}
        title={getLocalized(itinerary.title, locale)}
        subtitle={getLocalized(itinerary.subtitle, locale)}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="neutral">{formatDuration(itinerary.duration.days, itinerary.duration.nights, locale)}</Badge>
            <Badge variant={
              itinerary.departureType === "FIXED"
                ? "info"
                : itinerary.departureType === "ON_DEMAND"
                  ? "warning"
                  : "accent"
            }>
              {t(
                itinerary.departureType === "FIXED"
                  ? "catalog.departure_type.fixed"
                  : itinerary.departureType === "ON_DEMAND"
                    ? "catalog.departure_type.on_demand"
                    : "catalog.departure_type.rfq_only",
              )}
            </Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-8 px-8 pt-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-10 lg:col-span-2">
          {/* Hero */}
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg border border-border-subtle bg-bg-sunken">
            <Image
              src={itinerary.heroImage}
              alt={getLocalized(itinerary.title, locale)}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 66vw, 100vw"
            />
          </div>

          {/* Highlights */}
          <Section title={t("itinerary.section.highlights")}>
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {getLocalized(itinerary.highlights, locale).map((h, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span className="text-body text-ink-secondary">{h}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Day by day */}
          <Section title={t("itinerary.section.day_by_day")}>
            <ol className="space-y-6">
              {itinerary.days.map((d) => (
                <li key={d.day} className="border-l-2 border-accent-border pl-5">
                  <p className="text-label text-accent">
                    {t("itinerary.day_label", { day: d.day })}
                  </p>
                  <h3 className="mt-1 text-subheading text-ink-primary">
                    {getLocalized(d.title, locale)}
                  </h3>
                  <p className="mt-2 text-caption text-ink-secondary leading-relaxed">
                    {getLocalized(d.description, locale)}
                  </p>
                  {d.activities.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
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
          </Section>

          {/* Inclusions / Exclusions */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Section title={t("itinerary.section.inclusions")}>
              <ul className="space-y-2">
                {getLocalized(itinerary.inclusions, locale).map((i, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-caption text-ink-secondary">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </Section>
            <Section title={t("itinerary.section.exclusions")}>
              <ul className="space-y-2">
                {getLocalized(itinerary.exclusions, locale).map((i, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-caption text-ink-tertiary">
                    <span className="mt-0.5 inline-flex size-3.5 shrink-0 items-center justify-center rounded-full bg-border-subtle text-[8px] text-ink-secondary">−</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          {/* Departures (FIXED) or Pricing matrix (ON_DEMAND) */}
          {itinerary.departureType === "FIXED" ? (
            <Section title={t("itinerary.departures.available")}>
              <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("field.date")}</TableHead>
                      <TableHead>{t("itinerary.departures.filled", { booked: "—", capacity: "—" }).split("/")[0].replace(/[—\s]/g, "") || t("field.pax")}</TableHead>
                      <TableHead className="text-right">{t("metric.fill_rate")}</TableHead>
                      <TableHead>{t("field.status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itinerary.departures.map((d) => {
                      const fill = (d.booked / d.capacity) * 100
                      return (
                        <TableRow key={d.id}>
                          <TableCell className="text-data text-ink-primary">
                            {formatDate(d.date, locale, "long")}
                          </TableCell>
                          <TableCell className="text-data text-ink-secondary">
                            {d.booked} / {d.capacity}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="ml-auto flex items-center justify-end gap-2">
                              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-bg-sunken">
                                <div
                                  className="h-full bg-accent transition-all"
                                  style={{ width: `${Math.min(fill, 100)}%` }}
                                />
                              </div>
                              <span className="text-data text-ink-tertiary w-12 text-right">
                                {fill.toFixed(0)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DepartureStatusBadge status={d.status} />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </Section>
          ) : (
            <Section title={t("wholesaler.catalog.detail.season_matrix")}>
              <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("pricing.season.low")}</TableHead>
                      <TableHead>{t("field.pax")}</TableHead>
                      <TableHead className="text-right">{t("pricing.per_pax")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itinerary.pricing.seasons.flatMap((s) =>
                      itinerary.pricing.bands.map((b) => (
                        <TableRow key={`${s.name}-${b.paxRange}`}>
                          <TableCell>
                            <Badge variant={s.multiplier > 1.2 ? "warning" : "info"}>
                              {t(
                                s.name === "low"
                                  ? "pricing.season.low"
                                  : s.name === "peak"
                                    ? "pricing.season.peak"
                                    : s.name === "shoulder"
                                      ? "pricing.season.shoulder"
                                      : s.name === "school-holiday"
                                        ? "pricing.season.school_holiday"
                                        : "pricing.season.year_round",
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-data text-ink-secondary">
                            {b.paxRange}
                          </TableCell>
                          <TableCell className="text-right text-data text-ink-primary">
                            {formatCurrency(
                              Math.round(b.perPaxUSD * s.multiplier),
                              "USD",
                              locale,
                            )}
                          </TableCell>
                        </TableRow>
                      )),
                    )}
                  </TableBody>
                </Table>
              </div>
            </Section>
          )}

          {/* Cancellation policy */}
          <Section title={t("itinerary.section.cancellation")}>
            <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("common.from")}</TableHead>
                    <TableHead className="text-right">{t("field.amount")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itinerary.cancellationPolicy.tiers.map((tier, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-data text-ink-secondary">
                        {tier.daysBefore === 0
                          ? t("status.travelled")
                          : `≥ ${tier.daysBefore} ${t("common.days")}`}
                      </TableCell>
                      <TableCell className="text-right text-data text-ink-primary">
                        {tier.penaltyPercent}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Section>
        </div>

        {/* Right sidebar — margin + publish */}
        <aside className="space-y-6 lg:col-span-1">
          <MarginBreakdownCard
            dmcNet={itinerary.marginLayers.dmcNetPerPaxUSD}
            ourMarkup={itinerary.marginLayers.ourMarkupUSD}
            wholesalerSell={wholesalerSell}
            wholesalerMarkup={wholesalerMarkup}
            setWholesalerMarkup={setWholesalerMarkup}
            agencyRetail={agencyRetail}
            onSave={handleSaveMarkup}
            saved={wholesalerMarkups[itinerary.id] === wholesalerMarkup}
          />

          <PublishControl
            itineraryId={itinerary.id}
            initialPublishedTo={itinerary.publishedToAgencies}
          />
        </aside>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-heading text-ink-primary">{title}</h2>
      {children}
    </section>
  )
}

function MarginBreakdownCard({
  dmcNet,
  ourMarkup,
  wholesalerSell,
  wholesalerMarkup,
  setWholesalerMarkup,
  agencyRetail,
  onSave,
  saved,
}: {
  dmcNet: number
  ourMarkup: number
  wholesalerSell: number
  wholesalerMarkup: number
  setWholesalerMarkup: (n: number) => void
  agencyRetail: number
  onSave: () => void
  saved: boolean
}) {
  const { t, locale } = useTranslation()
  const [editing, setEditing] = useState(false)

  return (
    <section className="sticky top-[80px] overflow-hidden rounded-lg border border-accent-border bg-bg-raised">
      <header className="bg-accent-soft px-5 py-4">
        <p className="text-label text-accent">
          {t("wholesaler.catalog.detail.margin_title")}
        </p>
        <p className="mt-1 text-caption text-ink-secondary">
          {t("wholesaler.catalog.detail.margin_subtitle")}
        </p>
      </header>

      <div className="space-y-1 px-5 py-4">
        {/* DMC net */}
        <MarginRow
          label={t("itinerary.margin.dmc_net")}
          value={formatCurrency(dmcNet, "USD", locale)}
        />
        <MarginConnector amount={ourMarkup} label={t("itinerary.margin.our_markup")} />
        {/* Platform sell */}
        <MarginRow
          label={t("wholesaler.catalog.subtitle").split(" ")[0]}
          fallbackLabel="Platform → Wholesaler"
          value={formatCurrency(wholesalerSell, "USD", locale)}
          subtle
        />
        <MarginConnector
          amount={wholesalerMarkup}
          label={t("itinerary.margin.your_markup")}
          editable
          editing={editing}
          onToggleEdit={() => setEditing((e) => !e)}
          onChange={setWholesalerMarkup}
        />
        {/* Agency retail — emphasized */}
        <div className="mt-3 rounded-md border border-accent-border bg-accent-soft px-3 py-3">
          <p className="text-label text-accent">{t("itinerary.margin.agency_retail")}</p>
          <p className="mt-1 text-display-md text-ink-primary">
            {formatCurrency(agencyRetail, "USD", locale)}
          </p>
          <p className="mt-1 text-caption text-ink-tertiary">{t("pricing.per_pax")}</p>
        </div>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-border-subtle bg-bg-sunken/40 px-5 py-3">
        <p className="text-caption text-ink-tertiary">{t("margin.layer_intro")}</p>
        <Button size="xs" onClick={onSave} disabled={saved}>
          <Save className="size-3" />
          {saved ? t("common.saved") : t("actions.save")}
        </Button>
      </footer>
    </section>
  )
}

function MarginRow({
  label,
  fallbackLabel,
  value,
  subtle,
}: {
  label: string
  fallbackLabel?: string
  value: string
  subtle?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between py-1.5">
      <span className={cn("text-caption", subtle ? "text-ink-tertiary" : "text-ink-secondary")}>
        {label !== "Catalog" ? label : (fallbackLabel ?? "")}
      </span>
      <span className={cn("text-data", subtle ? "text-ink-secondary" : "text-ink-primary")}>
        {value}
      </span>
    </div>
  )
}

function MarginConnector({
  amount,
  label,
  editable,
  editing,
  onToggleEdit,
  onChange,
}: {
  amount: number
  label: string
  editable?: boolean
  editing?: boolean
  onToggleEdit?: () => void
  onChange?: (n: number) => void
}) {
  const { locale } = useTranslation()
  return (
    <div className="relative my-1 flex items-center gap-3 pl-2">
      <span className="block h-[2px] w-3 bg-border-default" aria-hidden />
      <ArrowRight className="size-3 text-ink-tertiary" />
      <div className="flex flex-1 items-center justify-between rounded-md border border-border-subtle bg-bg-sunken/40 px-3 py-1.5">
        <span className="text-caption text-ink-tertiary">{label}</span>
        {editable && editing ? (
          <input
            type="number"
            value={amount}
            onChange={(e) => onChange?.(Number(e.target.value))}
            className="w-24 rounded-md border border-accent-border bg-bg-raised px-2 py-0.5 text-right text-data text-ink-primary outline-none"
            autoFocus
          />
        ) : (
          <span className="flex items-center gap-2">
            <span className="text-data text-ink-primary">
              + {formatCurrency(amount, "USD", locale)}
            </span>
            {editable ? (
              <button
                type="button"
                onClick={onToggleEdit}
                className="text-accent transition-colors hover:text-accent-hover"
                aria-label="Edit"
              >
                <Edit3 className="size-3.5" />
              </button>
            ) : null}
          </span>
        )}
      </div>
    </div>
  )
}

function PublishControl({
  itineraryId,
  initialPublishedTo,
}: {
  itineraryId: string
  initialPublishedTo: string[]
}) {
  const { t, locale } = useTranslation()
  const { publishedToAgencies, setPublishedToAgencies } = useDemoState()
  const persisted = publishedToAgencies[itineraryId] ?? initialPublishedTo
  const [selected, setSelected] = useState<Set<string>>(new Set(persisted))
  const dirty =
    selected.size !== persisted.length ||
    persisted.some((id) => !selected.has(id))

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const save = () => {
    const ids = Array.from(selected)
    setPublishedToAgencies(itineraryId, ids)
    toast.success(t("toast.publish.updated", { count: ids.length }))
  }

  const cancel = () => {
    setSelected(new Set(persisted))
  }

  return (
    <section className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
      <header className="border-b border-border-subtle px-5 py-4">
        <p className="text-subheading text-ink-primary">
          {t("wholesaler.catalog.detail.publish_title")}
        </p>
        <p className="mt-1 text-caption text-ink-tertiary">
          {t("wholesaler.catalog.detail.publish_subtitle")} · {selected.size}/{agencies.length}
        </p>
      </header>
      <ul className="max-h-[320px] divide-y divide-border-subtle overflow-y-auto">
        {agencies.map((a) => {
          const checked = selected.has(a.id)
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => toggle(a.id)}
                className="flex w-full items-center justify-between gap-3 px-5 py-2.5 text-left transition-colors hover:bg-bg-sunken/30"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="truncate text-caption text-ink-primary">
                    {getLocalized(a.name, locale)}
                  </span>
                  <span className="text-[11px] text-ink-tertiary">{a.licenseNumber}</span>
                </div>
                <span
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded border transition-all",
                    checked
                      ? "border-accent bg-accent text-bg-base"
                      : "border-border-default bg-bg-raised",
                  )}
                >
                  {checked ? <Check className="size-3" /> : null}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <footer className="flex items-center justify-end gap-2 border-t border-border-subtle px-5 py-3">
        <Button variant="ghost" size="sm" onClick={cancel} disabled={!dirty}>
          {t("actions.cancel")}
        </Button>
        <Button size="sm" onClick={save} disabled={!dirty}>
          {t("actions.save")}
        </Button>
      </footer>
    </section>
  )
}

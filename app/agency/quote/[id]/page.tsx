"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Check, ChevronRight, Download, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { findItinerary } from "@/lib/mock"
import { wholesaler } from "@/lib/mock/wholesalers"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"
import { formatDuration } from "@/lib/formatters/duration"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"
import { SLATimer } from "@/components/shared/sla-timer"

export default function AgencyQuotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const itinerary = findItinerary(id)
  const { t, locale } = useTranslation()
  const { bookingDraft } = useDemoState()

  if (!itinerary) notFound()

  const adults = bookingDraft.adults || 4
  const children = bookingDraft.children || 0
  const pricePerPax = itinerary.marginLayers.agencyRetailUSD
  const total = pricePerPax * adults + Math.round(pricePerPax * 0.7) * children
  const validUntil = new Date(Date.now() + 7 * 24 * 3600_000)

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

      <div className="mx-auto max-w-3xl px-8 pt-10">
        <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
          {/* Branded header */}
          <header
            className="px-8 py-6"
            style={{ background: "var(--brand-primary)" }}
          >
            <div className="flex items-center justify-between text-bg-base">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-[3px] bg-bg-base/10 text-body">
                  {getLocalized(wholesaler.displayName, locale).slice(0, 1)}
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-caption text-bg-base/70">
                    {getLocalized(wholesaler.legalName, locale)}
                  </span>
                  <span className="text-body text-bg-base">
                    {getLocalized(wholesaler.displayName, locale)}
                  </span>
                </span>
              </div>
              <span className="text-label text-bg-base/70">
                {t("agency.quote.title")}
              </span>
            </div>
          </header>

          {/* Hero image */}
          <div className="relative aspect-[21/9] bg-bg-sunken">
            <Image
              src={itinerary.heroImage}
              alt={getLocalized(itinerary.title, locale)}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 768px, 100vw"
            />
          </div>

          {/* Title + meta */}
          <div className="space-y-3 px-8 pt-8">
            <p className="text-label text-ink-tertiary">
              {itinerary.cities.join(" · ")} · {formatDuration(itinerary.duration.days, itinerary.duration.nights, locale)}
            </p>
            <h1 className="text-display-lg text-ink-primary">
              {getLocalized(itinerary.title, locale)}
            </h1>
            <p className="text-body text-ink-secondary">
              {getLocalized(itinerary.subtitle, locale)}
            </p>
          </div>

          {/* Highlights */}
          <section className="px-8 pt-8">
            <h2 className="text-heading text-ink-primary">
              {t("itinerary.section.highlights")}
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {getLocalized(itinerary.highlights, locale).map((h, idx) => (
                <li key={idx} className="flex items-start gap-2 text-caption text-ink-secondary">
                  <Sparkles className="mt-0.5 size-3.5 shrink-0 text-accent" />
                  {h}
                </li>
              ))}
            </ul>
          </section>

          {/* Inclusions short */}
          <section className="px-8 pt-8">
            <h2 className="text-heading text-ink-primary">
              {t("itinerary.section.inclusions")}
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
              {getLocalized(itinerary.inclusions, locale).slice(0, 6).map((i, idx) => (
                <li key={idx} className="flex items-start gap-2 text-caption text-ink-secondary">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                  {i}
                </li>
              ))}
            </ul>
          </section>

          {/* Price block */}
          <section className="mt-8 mx-8 mb-8 rounded-lg border border-accent-border bg-accent-soft p-6">
            <div className="flex items-baseline justify-between">
              <p className="text-label text-accent">{t("booking.total")}</p>
              <SLATimer expiresAt={validUntil.toISOString()} />
            </div>
            <p className="mt-2 text-display-xl text-ink-primary">
              {formatCurrency(total, "USD", locale)}
            </p>
            <p className="mt-1 text-caption text-ink-tertiary">
              {t("agency.quote.valid_until", { date: formatDate(validUntil, locale, "long") })}
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-caption">
              <Stat label={t("common.adults")} value={adults.toString()} />
              <Stat label={t("common.children")} value={children.toString()} />
              <Stat label={t("agency.detail.per_pax")} value={formatCurrency(pricePerPax, "USD", locale)} />
            </div>
          </section>

          <footer className="flex items-center justify-end gap-3 border-t border-border-subtle px-8 py-5 bg-bg-sunken/40">
            <Button
              variant="secondary"
              onClick={() => toast.success(t("toast.voucher.downloaded"))}
            >
              <Download className="size-4" />
              {t("actions.download_pdf")}
            </Button>
            <Button asChild>
              <Link href={`/agency/book/${itinerary.id}`}>
                {t("actions.convert_to_booking")}
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </footer>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-label text-ink-tertiary">{label}</span>
      <span className="text-data text-ink-primary">{value}</span>
    </div>
  )
}

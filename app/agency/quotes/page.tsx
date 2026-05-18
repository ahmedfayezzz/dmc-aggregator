"use client"

import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { itineraries } from "@/lib/mock/itineraries"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"

export default function AgencyQuotesPage() {
  const { t, locale } = useTranslation()

  // Sample quotes — for demo only, derived from itineraries
  const quotes = itineraries.slice(0, 4).map((it, idx) => ({
    id: `q-${idx + 1}`,
    itinerary: it,
    pax: 4 - (idx % 2),
    createdAt: new Date(Date.now() - (idx + 1) * 24 * 3600_000).toISOString(),
    expiresAt: new Date(Date.now() + (7 - idx) * 24 * 3600_000).toISOString(),
    totalUSD: it.marginLayers.agencyRetailUSD * (4 - (idx % 2)),
  }))

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={t("nav.quotes")}
        title={t("nav.quotes")}
        subtitle={t("agency.browse.results", { count: quotes.length })}
      />

      <div className="px-8 pt-8">
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {quotes.map((q) => (
            <li key={q.id}>
              <Link
                href={`/agency/quote/${q.itinerary.id}`}
                className="block rounded-lg border border-border-subtle bg-bg-raised p-5 transition-colors hover:border-accent-border"
              >
                <p className="text-label text-ink-tertiary">
                  {q.itinerary.cities.join(" · ")}
                </p>
                <h3 className="mt-2 text-subheading text-ink-primary">
                  {getLocalized(q.itinerary.title, locale)}
                </h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-caption text-ink-tertiary">
                    {q.pax} pax · {formatDate(q.createdAt, locale, "short")}
                  </span>
                  <Badge variant="warning">
                    {t("agency.quote.valid_until", { date: formatDate(q.expiresAt, locale, "short") })}
                  </Badge>
                </div>
                <div className="mt-4 flex items-baseline justify-between border-t border-border-subtle pt-3">
                  <span className="text-caption text-ink-tertiary">{t("booking.total")}</span>
                  <span className="text-heading text-accent">
                    {formatCurrency(q.totalUSD, "USD", locale)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

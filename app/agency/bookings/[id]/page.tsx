"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, FileText, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { BookingStatusBadge } from "@/components/shared/status-badge"
import { findBooking, findItinerary } from "@/lib/mock"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"

export default function AgencyBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const booking = findBooking(id)
  const { t, locale } = useTranslation()

  if (!booking) notFound()
  const it = findItinerary(booking.itineraryId)
  if (!it) notFound()

  return (
    <div className="pb-24">
      <div className="border-b border-border-subtle px-8 pt-8 pb-2">
        <Link
          href="/agency/bookings"
          className="inline-flex items-center gap-2 text-caption text-ink-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          {t("nav.my_bookings")}
        </Link>
      </div>

      <PageHeader
        eyebrow={booking.reference}
        title={getLocalized(it.title, locale)}
        subtitle={getLocalized(it.subtitle, locale)}
        actions={
          <div className="flex items-center gap-2">
            <BookingStatusBadge state={booking.state} />
            {booking.voucherUrl ? (
              <Button asChild>
                <Link href={`/agency/voucher/${it.id}`}>
                  <FileText className="size-4" />
                  {t("agency.voucher.title")}
                </Link>
              </Button>
            ) : null}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 px-8 pt-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border border-border-subtle bg-bg-raised p-6">
            <h2 className="text-subheading text-ink-primary">
              {t("itinerary.section.highlights")}
            </h2>
            <ul className="mt-4 space-y-2">
              {getLocalized(it.highlights, locale).map((h, idx) => (
                <li key={idx} className="flex items-start gap-2 text-caption text-ink-secondary">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
                  {h}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border border-border-subtle bg-bg-raised p-6 space-y-4">
            <Row icon={Calendar} label={t("field.created_at")} value={formatDate(booking.createdAt, locale, "long")} />
            <Row icon={Users} label={t("field.pax")} value={`${booking.pax.adults} ${t("common.adults")}${booking.pax.children > 0 ? ` + ${booking.pax.children} ${t("common.children")}` : ""}`} />
            <div className="border-t border-border-subtle pt-4">
              <p className="text-label text-ink-tertiary">{t("booking.total")}</p>
              <p className="mt-2 text-display-md text-accent">
                {formatCurrency(booking.totalAmountCNY, "CNY", locale)}
              </p>
              <p className="mt-1 text-caption text-ink-tertiary">
                ≈ {formatCurrency(booking.totalAmountUSD, "USD", locale)}
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 text-ink-tertiary" />
      <div className="flex flex-col gap-0.5">
        <span className="text-label text-ink-tertiary">{label}</span>
        <span className="text-body text-ink-primary">{value}</span>
      </div>
    </div>
  )
}

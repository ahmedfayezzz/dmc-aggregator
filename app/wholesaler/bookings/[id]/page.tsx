"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Check, CircleDashed, FileText } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { BookingStatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { findBooking, findAgency, findItinerary } from "@/lib/mock"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import type { BookingState } from "@/lib/types"
import { cn } from "@/lib/utils"

const TIMELINE_ORDER: BookingState[] = [
  "DRAFT",
  "BOOKING_PENDING",
  "CONFIRMED_PENDING_GUARANTEE",
  "CONFIRMED",
  "TRAVELLED",
  "SETTLED",
]

const TIMELINE_KEY: Record<string, Parameters<ReturnType<typeof useTranslation>["t"]>[0]> = {
  DRAFT: "booking.timeline.created",
  BOOKING_PENDING: "booking.timeline.submitted",
  CONFIRMED_PENDING_GUARANTEE: "booking.timeline.confirmed",
  CONFIRMED: "booking.timeline.captured",
  TRAVELLED: "booking.timeline.travelled",
  SETTLED: "booking.timeline.settled",
}

export default function WholesalerBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const booking = findBooking(id)
  const { t, locale } = useTranslation()

  if (!booking) notFound()

  const ag = findAgency(booking.agencyId)
  const it = findItinerary(booking.itineraryId)
  if (!ag || !it) notFound()

  const reachedIndex = (() => {
    switch (booking.state) {
      case "DRAFT":
      case "QUOTE":
        return 0
      case "BOOKING_REQUESTED":
      case "BOOKING_PENDING":
        return 1
      case "CONFIRMED_PENDING_GUARANTEE":
      case "CONFIRMED_AMENDMENT_PENDING":
        return 2
      case "CONFIRMED":
        return 3
      case "TRAVELLED":
        return 4
      case "SETTLED":
        return 5
      case "CANCELLED":
        return -1
      default:
        return 0
    }
  })()

  const auditLog = [
    {
      ts: booking.createdAt,
      msg: { "zh-CN": `预订创建 · ${getLocalized(ag.name, "zh-CN")}`, en: `Booking created · ${getLocalized(ag.name, "en")}` },
    },
    booking.confirmedAt
      ? {
          ts: booking.confirmedAt,
          msg: { "zh-CN": "DMC 确认预订", en: "DMC confirmed booking" },
        }
      : null,
    booking.cancelledAt
      ? {
          ts: booking.cancelledAt,
          msg: { "zh-CN": "预订取消", en: "Booking cancelled" },
        }
      : null,
  ].filter(Boolean) as Array<{ ts: string; msg: { "zh-CN": string; en: string } }>

  return (
    <div className="pb-24">
      <div className="border-b border-border-subtle px-8 pt-8 pb-2">
        <Link
          href="/wholesaler/bookings"
          className="inline-flex items-center gap-2 text-caption text-ink-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          {t("nav.bookings")}
        </Link>
      </div>

      <PageHeader
        eyebrow={booking.reference}
        title={getLocalized(it.title, locale)}
        subtitle={`${getLocalized(ag.name, locale)} · ${formatDate(booking.createdAt, locale, "long")}`}
        actions={
          <div className="flex items-center gap-2">
            <BookingStatusBadge state={booking.state} />
            {booking.voucherUrl ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  toast.success(t("toast.voucher.downloaded"))
                }
              >
                <FileText className="size-4" />
                {t("actions.download_pdf")}
              </Button>
            ) : null}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-8 px-8 pt-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Timeline */}
          <section className="rounded-lg border border-border-subtle bg-bg-raised p-6">
            <h2 className="text-subheading text-ink-primary">
              {t("wholesaler.bookings.timeline_title")}
            </h2>
            <ol className="mt-6 flex items-start justify-between">
              {TIMELINE_ORDER.map((state, idx) => {
                const reached = booking.state === "CANCELLED" ? false : idx <= reachedIndex
                const current = idx === reachedIndex && booking.state !== "CANCELLED"
                return (
                  <li
                    key={state}
                    className="relative flex flex-1 flex-col items-center"
                  >
                    <div
                      className={cn(
                        "z-10 grid size-8 place-items-center rounded-full border-2 transition-colors",
                        reached
                          ? "border-accent bg-accent text-bg-base"
                          : "border-border-default bg-bg-raised text-ink-tertiary",
                        current && "ring-4 ring-accent-soft",
                      )}
                    >
                      {reached ? (
                        <Check className="size-4" />
                      ) : (
                        <CircleDashed className="size-4" />
                      )}
                    </div>
                    {idx < TIMELINE_ORDER.length - 1 ? (
                      <span
                        className={cn(
                          "absolute left-1/2 top-4 h-[2px] w-full",
                          idx < reachedIndex
                            ? "bg-accent"
                            : "bg-border-subtle",
                        )}
                        aria-hidden
                      />
                    ) : null}
                    <span className="mt-3 max-w-[100px] text-center text-caption text-ink-secondary">
                      {t(TIMELINE_KEY[state])}
                    </span>
                  </li>
                )
              })}
            </ol>

            {booking.state === "CANCELLED" ? (
              <p className="mt-6 rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-caption text-danger">
                {t("status.cancelled")} · {booking.cancelledAt ? formatDate(booking.cancelledAt, locale, "long") : ""}
              </p>
            ) : null}
          </section>

          {/* Pax summary */}
          <section className="rounded-lg border border-border-subtle bg-bg-raised p-6">
            <h2 className="text-subheading text-ink-primary">{t("field.pax")}</h2>
            <div className="mt-4 grid grid-cols-3 gap-6 text-center">
              <div className="rounded-md border border-border-subtle p-4">
                <p className="text-label text-ink-tertiary">{t("common.adults")}</p>
                <p className="mt-2 text-display-md text-ink-primary">{booking.pax.adults}</p>
              </div>
              <div className="rounded-md border border-border-subtle p-4">
                <p className="text-label text-ink-tertiary">{t("common.children")}</p>
                <p className="mt-2 text-display-md text-ink-primary">{booking.pax.children}</p>
              </div>
              <div className="rounded-md border border-border-subtle p-4">
                <p className="text-label text-ink-tertiary">{t("common.infants")}</p>
                <p className="mt-2 text-display-md text-ink-primary">{booking.pax.infants}</p>
              </div>
            </div>
          </section>

          {/* Audit log */}
          <section className="rounded-lg border border-border-subtle bg-bg-raised p-6">
            <h2 className="text-subheading text-ink-primary">{t("wholesaler.bookings.audit_title")}</h2>
            <ul className="mt-4 space-y-3">
              {auditLog.map((a, idx) => (
                <li key={idx} className="flex items-start justify-between gap-4 text-caption">
                  <span className="text-ink-primary">{getLocalized(a.msg, locale)}</span>
                  <span className="text-ink-tertiary">{formatDate(a.ts, locale, "short")}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right column: financials */}
        <aside className="space-y-4">
          <section className="rounded-lg border border-border-subtle bg-bg-raised p-6">
            <p className="text-label text-ink-tertiary">{t("field.amount")}</p>
            <p className="mt-2 text-display-md text-ink-primary">
              {formatCurrency(booking.totalAmountCNY, "CNY", locale)}
            </p>
            <p className="mt-1 text-caption text-ink-tertiary">
              ≈ {formatCurrency(booking.totalAmountUSD, "USD", locale)}
            </p>
            <div className="mt-6 space-y-2 border-t border-border-subtle pt-4">
              <Row label={t("field.agency")} value={getLocalized(ag.name, locale)} />
              <Row label={t("field.itinerary")} value={getLocalized(it.title, locale)} />
              <Row label={t("field.created_at")} value={formatDate(booking.createdAt, locale, "long")} />
            </div>
          </section>

          {booking.voucherUrl ? (
            <Link
              href={booking.voucherUrl}
              className="flex items-center justify-between rounded-lg border border-border-subtle bg-bg-raised px-5 py-4 transition-colors hover:border-accent-border"
            >
              <div>
                <p className="text-caption text-ink-tertiary">{t("agency.voucher.title")}</p>
                <p className="text-body text-ink-primary">
                  {t("actions.preview")}
                </p>
              </div>
              <FileText className="size-4 text-accent" />
            </Link>
          ) : null}
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-caption">
      <span className="text-ink-tertiary">{label}</span>
      <span className="text-right text-ink-primary">{value}</span>
    </div>
  )
}

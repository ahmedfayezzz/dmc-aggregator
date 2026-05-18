"use client"

import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import {
  BookingStatusBadge,
  DepartureStatusBadge,
} from "@/components/shared/status-badge"
import { agencies } from "@/lib/mock/agencies"
import { bookings } from "@/lib/mock/bookings"
import { rfqs } from "@/lib/mock/rfqs"
import { upcomingDepartures } from "@/lib/mock/departures"
import { findAgency, findItinerary } from "@/lib/mock"
import { wholesaler } from "@/lib/mock/wholesalers"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"

export default function WholesalerDashboardPage() {
  const { t, locale } = useTranslation()

  const activeAgencies = agencies.filter((a) => a.status === "active").length
  const pendingRFQs = rfqs.filter((r) => r.state === "RFQ_SUBMITTED").length
  const activeBookings = bookings.filter(
    (b) =>
      b.state !== "CANCELLED" &&
      b.state !== "SETTLED" &&
      b.state !== "TRAVELLED",
  ).length

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const nextDepartures = upcomingDepartures().slice(0, 5)

  const activity = [
    { agencyId: "ag-001", action: "activity.new_booking", refId: "TX-A8K3M2", time: "2h" },
    { agencyId: "ag-009", action: "activity.rfq_submitted", refId: "RFQ-002", time: "3h" },
    { agencyId: "ag-003", action: "activity.new_booking", refId: "TX-C7Q4R5", time: "5h" },
    { agencyId: "ag-002", action: "activity.amendment_requested", refId: "TX-T1V7W8", time: "1d" },
    { agencyId: "ag-005", action: "activity.wallet_topup", refId: "200,000 CNY", time: "1d" },
    { agencyId: "ag-006", action: "activity.kyc_review", refId: "L-SAX-CJ00092", time: "2d" },
  ]

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={t("wholesaler.dashboard.welcome")}
        title={t("wholesaler.dashboard.title")}
        subtitle={t("wholesaler.dashboard.subtitle")}
      />

      <div className="space-y-10 px-8 pt-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label={t("dashboard.kpi.gmv_this_month")}
            value={formatCurrency(wholesaler.monthlyGMV_USD, "USD", locale)}
            subtitle={t("dashboard.vs_last_month")}
            delta={{ value: 12.4, direction: "up" }}
          />
          <StatCard
            label={t("dashboard.kpi.active_bookings")}
            value={activeBookings.toString()}
            subtitle={`${recentBookings.length} ${t("dashboard.recent_bookings").toLowerCase()}`}
            delta={{ value: 8.7, direction: "up" }}
          />
          <StatCard
            label={t("dashboard.kpi.pending_rfqs")}
            value={pendingRFQs.toString()}
            subtitle={t("wholesaler.rfqs.queue_label")}
            delta={{ value: 3, direction: "down" }}
          />
          <StatCard
            label={t("dashboard.kpi.active_agencies")}
            value={activeAgencies.toString()}
            subtitle={`/ ${agencies.length}`}
            delta={{ value: 4.2, direction: "up" }}
          />
        </div>

        {/* Two-column: bookings + departures */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel
            title={t("dashboard.recent_bookings")}
            href="/wholesaler/bookings"
          >
            <ul className="divide-y divide-border-subtle">
              {recentBookings.map((b) => {
                const ag = findAgency(b.agencyId)
                const it = findItinerary(b.itineraryId)
                if (!ag || !it) return null
                return (
                  <li key={b.id}>
                    <Link
                      href={`/wholesaler/bookings/${b.id}`}
                      className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-bg-sunken/30"
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-data text-ink-secondary">{b.reference}</span>
                        <span className="truncate text-body text-ink-primary">
                          {getLocalized(it.title, locale)}
                        </span>
                        <span className="truncate text-caption text-ink-tertiary">
                          {getLocalized(ag.name, locale)} · {b.pax.adults}
                          {b.pax.children > 0 ? `+${b.pax.children}` : ""} pax
                        </span>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <span className="text-data text-ink-primary">
                          {formatCurrency(b.totalAmountUSD, "USD", locale)}
                        </span>
                        <BookingStatusBadge state={b.state} />
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </Panel>

          <Panel
            title={t("dashboard.upcoming_departures")}
            href="/wholesaler/catalog"
          >
            <ul className="divide-y divide-border-subtle">
              {nextDepartures.map((d) => {
                const it = findItinerary(d.itineraryId)
                if (!it) return null
                const fill = (d.booked / d.capacity) * 100
                return (
                  <li
                    key={d.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-data text-ink-secondary">
                        {formatDate(d.date, locale)}
                      </span>
                      <span className="truncate text-body text-ink-primary">
                        {getLocalized(it.title, locale)}
                      </span>
                      <span className="text-caption text-ink-tertiary">
                        {d.booked}/{d.capacity} · {fill.toFixed(0)}% {t("metric.fill_rate").toLowerCase()}
                      </span>
                    </div>
                    <DepartureStatusBadge status={d.status} />
                  </li>
                )
              })}
            </ul>
          </Panel>
        </div>

        {/* Activity feed */}
        <Panel title={t("dashboard.recent_activity")}>
          <ul className="divide-y divide-border-subtle">
            {activity.map((a, idx) => {
              const ag = findAgency(a.agencyId)
              return (
                <li
                  key={idx}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-4 text-ink-tertiary" />
                    <div className="flex flex-col gap-1">
                      <span className="text-body text-ink-primary">
                        {ag ? getLocalized(ag.name, locale) : "—"}
                      </span>
                      <span className="text-caption text-ink-tertiary">
                        <ActivityMessage actionKey={a.action} refId={a.refId} />
                      </span>
                    </div>
                  </div>
                  <span className="text-data text-ink-tertiary">{a.time}</span>
                </li>
              )
            })}
          </ul>
        </Panel>
      </div>
    </div>
  )
}

function Panel({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-lg border border-border-subtle bg-bg-raised">
      <header className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <h2 className="text-subheading text-ink-primary">{title}</h2>
        {href ? (
          <Link
            href={href}
            className="flex items-center gap-1 text-caption text-ink-secondary transition-colors hover:text-accent"
          >
            <ArrowRight className="size-3.5" />
          </Link>
        ) : null}
      </header>
      {children}
    </section>
  )
}

function ActivityMessage({ actionKey, refId }: { actionKey: string; refId: string }) {
  const map: Record<string, { "zh-CN": string; en: string }> = {
    "activity.new_booking": { "zh-CN": "创建预订", en: "New booking" },
    "activity.rfq_submitted": { "zh-CN": "提交询价", en: "Submitted RFQ" },
    "activity.amendment_requested": { "zh-CN": "申请修改", en: "Requested amendment" },
    "activity.wallet_topup": { "zh-CN": "钱包充值", en: "Wallet top-up" },
    "activity.kyc_review": { "zh-CN": "资质审核", en: "KYC review" },
  }
  const { locale } = useLocaleNoCtx()
  const msg = map[actionKey]?.[locale] ?? actionKey
  return (
    <>
      {msg} · <span className="text-ink-secondary">{refId}</span>
    </>
  )
}

// Tiny local hook to grab locale without importing useTranslation again per call
function useLocaleNoCtx() {
  const { locale } = useTranslation()
  return { locale }
}

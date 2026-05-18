"use client"

import Link from "next/link"
import { Check, X } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { BookingStatusBadge, DepartureStatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { itineraries } from "@/lib/mock/itineraries"
import { bookings } from "@/lib/mock/bookings"
import { upcomingDepartures } from "@/lib/mock/departures"
import { findItinerary } from "@/lib/mock"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"
import { dmcs } from "@/lib/mock/dmcs"
import { formatDate } from "@/lib/formatters/date"
import type { BookingState } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function DMCDashboardPage() {
  const { t, locale } = useTranslation()
  const { dmcId, bookingActions, confirmBooking, declineBooking } = useDemoState()
  const dmc = dmcs.find((d) => d.id === dmcId) ?? dmcs[0]

  const effectiveState = (id: string, original: BookingState): BookingState => {
    const action = bookingActions[id]
    if (action === "confirmed") return "CONFIRMED"
    if (action === "declined") return "CANCELLED"
    return original
  }

  const dmcItineraries = itineraries.filter((i) => i.dmcId === dmc.id)
  const dmcBookings = bookings.filter((b) => {
    const it = findItinerary(b.itineraryId)
    return it?.dmcId === dmc.id
  })

  const pending = dmcBookings.filter(
    (b) => effectiveState(b.id, b.state) === "BOOKING_PENDING",
  )
  const confirmed = dmcBookings.filter((b) =>
    ["CONFIRMED", "CONFIRMED_PENDING_GUARANTEE", "TRAVELLED", "SETTLED"].includes(
      effectiveState(b.id, b.state),
    ),
  )
  const upcoming = upcomingDepartures()
    .filter((d) => dmcItineraries.some((i) => i.id === d.itineraryId))
    .slice(0, 5)

  const fillStats = dmcItineraries.map((it) => {
    const totalCap = it.departures.reduce((s, d) => s + d.capacity, 0)
    const totalBooked = it.departures.reduce((s, d) => s + d.booked, 0)
    return {
      it,
      fillRate: totalCap > 0 ? (totalBooked / totalCap) * 100 : 0,
      booked: totalBooked,
      capacity: totalCap,
    }
  })

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={dmc.name}
        title={t("dmc.dashboard.title")}
        subtitle={t("dmc.dashboard.subtitle")}
      />

      <div className="space-y-10 px-8 pt-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label={t("metric.bookings_count")}
            value={dmcBookings.length.toString()}
            subtitle={t("booking.filter.this_month")}
            delta={{ value: 9.2, direction: "up" }}
          />
          <StatCard
            label={t("metric.confirmed_bookings")}
            value={confirmed.length.toString()}
            subtitle={t("status.confirmed")}
          />
          <StatCard
            label={t("metric.pending_confirmations")}
            value={pending.length.toString()}
            subtitle={t("dmc.bookings.pending_label")}
          />
          <StatCard
            label={t("metric.upcoming_departures")}
            value={upcoming.length.toString()}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Inbound pending bookings */}
          <Panel
            title={t("dmc.bookings.title")}
            href="/dmc/bookings"
            badge={pending.length > 0 ? <Badge variant="warning">{pending.length}</Badge> : null}
          >
            {pending.length === 0 ? (
              <p className="px-5 py-10 text-center text-ink-tertiary">
                {t("empty.bookings.title")}
              </p>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {pending.slice(0, 5).map((b) => {
                  const it = findItinerary(b.itineraryId)!
                  const action = bookingActions[b.id]
                  return (
                    <li
                      key={b.id}
                      className={cn(
                        "flex items-center justify-between gap-4 px-5 py-4 transition-colors",
                        action === "confirmed" && "bg-success-soft/40",
                        action === "declined" && "bg-danger-soft/40",
                      )}
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-data text-ink-secondary">
                          {b.reference}
                        </span>
                        <span className="truncate text-body text-ink-primary">
                          {getLocalized(it.title, locale)}
                        </span>
                        <span className="text-caption text-ink-tertiary">
                          {b.pax.adults} pax · {formatDate(b.createdAt, locale, "short")}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <BookingStatusBadge state={effectiveState(b.id, b.state)} />
                        <div className="flex items-center gap-1">
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => declineBooking(b.id)}
                          >
                            <X className="size-3" />
                            {t("dmc.bookings.action.decline")}
                          </Button>
                          <Button size="xs" onClick={() => confirmBooking(b.id)}>
                            <Check className="size-3" />
                            {t("dmc.bookings.action.confirm")}
                          </Button>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>

          {/* Upcoming departures */}
          <Panel title={t("dashboard.upcoming_departures")} href="/dmc/schedules">
            <ul className="divide-y divide-border-subtle">
              {upcoming.map((d) => {
                const it = findItinerary(d.itineraryId)!
                const fill = (d.booked / d.capacity) * 100
                return (
                  <li
                    key={d.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-data text-ink-secondary">
                        {formatDate(d.date, locale, "short")}
                      </span>
                      <span className="truncate text-body text-ink-primary">
                        {getLocalized(it.title, locale)}
                      </span>
                      <span className="text-caption text-ink-tertiary">
                        {fill.toFixed(0)}% {t("metric.fill_rate").toLowerCase()}
                      </span>
                    </div>
                    <DepartureStatusBadge status={d.status} />
                  </li>
                )
              })}
            </ul>
          </Panel>
        </div>

        {/* Fill rate per active itinerary */}
        <section className="rounded-lg border border-border-subtle bg-bg-raised">
          <header className="border-b border-border-subtle px-5 py-4">
            <h2 className="text-subheading text-ink-primary">
              {t("metric.fill_rate")} · {t("nav.itineraries")}
            </h2>
          </header>
          <ul className="divide-y divide-border-subtle">
            {fillStats.map((fs) => (
              <li
                key={fs.it.id}
                className="grid grid-cols-12 items-center gap-4 px-5 py-4"
              >
                <Link
                  href={`/dmc/itineraries/${fs.it.id}`}
                  className="col-span-5 text-body text-ink-primary transition-colors hover:text-accent"
                >
                  {getLocalized(fs.it.title, locale)}
                </Link>
                <span className="col-span-2 text-data text-ink-secondary text-right">
                  {fs.booked}/{fs.capacity}
                </span>
                <div className="col-span-4 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-sunken">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${Math.min(fs.fillRate, 100)}%` }}
                    />
                  </div>
                  <span className="text-data text-ink-tertiary w-10 text-right">
                    {fs.fillRate.toFixed(0)}%
                  </span>
                </div>
                <DepartureStatusBadge status={fs.fillRate > 70 ? "GUARANTEED" : "OPEN"} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function Panel({
  title,
  href,
  badge,
  children,
}: {
  title: string
  href?: string
  badge?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-lg border border-border-subtle bg-bg-raised">
      <header className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-subheading text-ink-primary">{title}</h2>
          {badge}
        </div>
        {href ? (
          <Link href={href} className="text-caption text-ink-secondary hover:text-accent">
            →
          </Link>
        ) : null}
      </header>
      {children}
    </section>
  )
}

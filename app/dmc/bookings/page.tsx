"use client"

import { useMemo, useState } from "react"
import { Check, X } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { BookingStatusBadge } from "@/components/shared/status-badge"
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
import { bookings } from "@/lib/mock/bookings"
import { findAgency, findItinerary } from "@/lib/mock"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"
import { dmcs } from "@/lib/mock/dmcs"
import type { BookingState } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function DMCBookingsPage() {
  const { t, locale } = useTranslation()
  const { dmcId, bookingActions, confirmBooking, declineBooking } = useDemoState()
  const dmc = dmcs.find((d) => d.id === dmcId) ?? dmcs[0]
  const [filter, setFilter] = useState<"pending" | "all">("pending")

  const effectiveState = (id: string, original: BookingState): BookingState => {
    const action = bookingActions[id]
    if (action === "confirmed") return "CONFIRMED"
    if (action === "declined") return "CANCELLED"
    return original
  }

  const dmcBookings = useMemo(
    () =>
      bookings.filter((b) => {
        const it = findItinerary(b.itineraryId)
        return it?.dmcId === dmc.id
      }),
    [dmc.id],
  )

  const isPending = (id: string, original: BookingState) => {
    const s = effectiveState(id, original)
    return s === "BOOKING_PENDING" || s === "CONFIRMED_AMENDMENT_PENDING"
  }

  const filtered = useMemo(
    () =>
      filter === "pending"
        ? dmcBookings.filter((b) => isPending(b.id, b.state))
        : dmcBookings.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dmcBookings, filter, bookingActions],
  )

  const pendingCount = dmcBookings.filter((b) => isPending(b.id, b.state)).length

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={dmc.name}
        title={t("dmc.bookings.title")}
        subtitle={t("dmc.bookings.subtitle")}
      />

      <div className="px-8 pt-8 space-y-4">
        <div className="flex items-center gap-2">
          {(["pending", "all"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md border px-4 py-2 text-caption transition-colors",
                filter === f
                  ? "border-accent-border bg-accent-soft text-accent"
                  : "border-border-subtle bg-bg-raised text-ink-secondary hover:text-ink-primary",
              )}
            >
              {f === "pending" ? t("dmc.bookings.pending_label") : t("common.all")}
              {f === "pending" && pendingCount > 0 ? (
                <span className="ml-2 inline-block">
                  <Badge variant="warning">{pendingCount}</Badge>
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("field.reference")}</TableHead>
                <TableHead>{t("field.itinerary")}</TableHead>
                <TableHead>{t("field.agency")}</TableHead>
                <TableHead>{t("field.created_at")}</TableHead>
                <TableHead className="text-right">{t("field.pax")}</TableHead>
                <TableHead className="text-right">{t("field.amount")}</TableHead>
                <TableHead>{t("field.status")}</TableHead>
                <TableHead className="text-right">{t("field.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => {
                const ag = findAgency(b.agencyId)
                const it = findItinerary(b.itineraryId)
                const action = bookingActions[b.id]
                const displayState = effectiveState(b.id, b.state)
                const needsAction = isPending(b.id, b.state)
                return (
                  <TableRow
                    key={b.id}
                    className={cn(
                      "transition-colors",
                      action === "confirmed" && "bg-success-soft/40",
                      action === "declined" && "bg-danger-soft/40",
                    )}
                  >
                    <TableCell className="text-data text-ink-primary">{b.reference}</TableCell>
                    <TableCell className="text-body text-ink-primary">
                      {it ? getLocalized(it.title, locale) : "—"}
                    </TableCell>
                    <TableCell className="text-body text-ink-secondary">
                      {ag ? getLocalized(ag.name, locale) : "—"}
                    </TableCell>
                    <TableCell className="text-data text-ink-tertiary">
                      {formatDate(b.createdAt, locale, "short")}
                    </TableCell>
                    <TableCell className="text-right text-data text-ink-secondary">
                      {b.pax.adults}
                      {b.pax.children > 0 ? `+${b.pax.children}` : ""}
                    </TableCell>
                    <TableCell className="text-right text-data text-ink-primary">
                      {formatCurrency(b.totalAmountUSD, "USD", locale)}
                    </TableCell>
                    <TableCell>
                      <BookingStatusBadge state={displayState} />
                    </TableCell>
                    <TableCell className="text-right">
                      {needsAction ? (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="xs"
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
                      ) : (
                        <span className="text-caption text-ink-tertiary">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

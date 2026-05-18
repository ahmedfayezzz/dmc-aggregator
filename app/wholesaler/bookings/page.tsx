"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { BookingStatusBadge } from "@/components/shared/status-badge"
import { Input } from "@/components/ui/input"
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
import type { BookingState } from "@/lib/types"
import { cn } from "@/lib/utils"

const STATE_FILTERS: Array<{
  value: "all" | "active" | "confirmed" | "cancelled"
  labelKey: Parameters<ReturnType<typeof useTranslation>["t"]>[0]
  match: (s: BookingState) => boolean
}> = [
  { value: "all", labelKey: "booking.filter.all", match: () => true },
  {
    value: "active",
    labelKey: "booking.filter.active",
    match: (s) =>
      s !== "CANCELLED" && s !== "SETTLED" && s !== "TRAVELLED",
  },
  {
    value: "confirmed",
    labelKey: "booking.filter.confirmed",
    match: (s) =>
      s === "CONFIRMED" ||
      s === "CONFIRMED_PENDING_GUARANTEE" ||
      s === "CONFIRMED_AMENDMENT_PENDING",
  },
  {
    value: "cancelled",
    labelKey: "booking.filter.cancelled",
    match: (s) => s === "CANCELLED",
  },
]

export default function WholesalerBookingsPage() {
  const { t, locale } = useTranslation()
  const [filter, setFilter] = useState<"all" | "active" | "confirmed" | "cancelled">("all")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const match = STATE_FILTERS.find((f) => f.value === filter)!.match
    const q = search.trim().toLowerCase()
    return bookings
      .filter((b) => match(b.state))
      .filter((b) => {
        if (!q) return true
        const ag = findAgency(b.agencyId)
        const it = findItinerary(b.itineraryId)
        const txt = [
          b.reference,
          ag ? getLocalized(ag.name, locale) : "",
          ag ? getLocalized(ag.name, "en") : "",
          it ? getLocalized(it.title, locale) : "",
          it ? getLocalized(it.title, "en") : "",
        ]
          .join(" ")
          .toLowerCase()
        return txt.includes(q)
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
  }, [filter, search, locale])

  const newThisMonth = bookings.filter(
    (b) => new Date(b.createdAt).getMonth() === new Date().getMonth(),
  ).length

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={t("nav.bookings")}
        title={t("wholesaler.bookings.title")}
        subtitle={t("wholesaler.bookings.subtitle", { count: newThisMonth })}
      />

      <div className="px-8 pt-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-tertiary" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("booking.search_placeholder")}
              className="h-9 pl-9"
            />
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border-subtle bg-bg-raised p-1">
            {STATE_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-[3px] px-3 py-1.5 text-caption transition-colors",
                  filter === f.value
                    ? "bg-accent-soft text-accent"
                    : "text-ink-secondary hover:text-ink-primary",
                )}
              >
                {t(f.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("field.reference")}</TableHead>
                <TableHead>{t("field.agency")}</TableHead>
                <TableHead>{t("field.itinerary")}</TableHead>
                <TableHead>{t("field.created_at")}</TableHead>
                <TableHead className="text-right">{t("field.pax")}</TableHead>
                <TableHead className="text-right">{t("field.amount")}</TableHead>
                <TableHead>{t("field.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => {
                const ag = findAgency(b.agencyId)
                const it = findItinerary(b.itineraryId)
                return (
                  <TableRow key={b.id}>
                    <TableCell>
                      <Link
                        href={`/wholesaler/bookings/${b.id}`}
                        className="text-data text-ink-primary hover:text-accent"
                      >
                        {b.reference}
                      </Link>
                    </TableCell>
                    <TableCell className="text-body text-ink-secondary">
                      {ag ? getLocalized(ag.name, locale) : "—"}
                    </TableCell>
                    <TableCell className="text-body text-ink-primary">
                      {it ? getLocalized(it.title, locale) : "—"}
                    </TableCell>
                    <TableCell className="text-data text-ink-tertiary">
                      {formatDate(b.createdAt, locale, "short")}
                    </TableCell>
                    <TableCell className="text-right text-data text-ink-secondary">
                      {b.pax.adults}
                      {b.pax.children > 0 ? `+${b.pax.children}` : ""}
                    </TableCell>
                    <TableCell className="text-right text-data text-ink-primary">
                      {formatCurrency(b.totalAmountCNY, "CNY", locale)}
                    </TableCell>
                    <TableCell>
                      <BookingStatusBadge state={b.state} />
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center text-ink-tertiary">
                    {t("booking.empty")}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

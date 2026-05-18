"use client"

import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { BookingStatusBadge } from "@/components/shared/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getBookingsForAgency } from "@/lib/mock/bookings"
import { findItinerary } from "@/lib/mock"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"

export default function AgencyBookingsPage() {
  const { t, locale } = useTranslation()
  const { agencyId } = useDemoState()
  const bookings = getBookingsForAgency(agencyId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={t("nav.my_bookings")}
        title={t("agency.bookings.title")}
        subtitle={t("agency.browse.results", { count: bookings.length })}
      />

      <div className="px-8 pt-8">
        {bookings.length === 0 ? (
          <div className="rounded-lg border border-border-subtle bg-bg-raised py-20 text-center">
            <p className="text-subheading text-ink-primary">{t("empty.bookings.title")}</p>
            <p className="mt-2 text-caption text-ink-tertiary">
              {t("empty.bookings.description")}
            </p>
            <Link
              href="/agency/browse"
              className="mt-6 inline-block text-caption text-accent transition-colors hover:text-accent-hover"
            >
              {t("actions.browse")} →
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("field.reference")}</TableHead>
                  <TableHead>{t("field.itinerary")}</TableHead>
                  <TableHead>{t("field.created_at")}</TableHead>
                  <TableHead className="text-right">{t("field.pax")}</TableHead>
                  <TableHead className="text-right">{t("field.amount")}</TableHead>
                  <TableHead>{t("field.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => {
                  const it = findItinerary(b.itineraryId)
                  return (
                    <TableRow key={b.id}>
                      <TableCell>
                        <Link
                          href={`/agency/bookings/${b.id}`}
                          className="text-data text-ink-primary hover:text-accent"
                        >
                          {b.reference}
                        </Link>
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
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

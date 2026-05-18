"use client"

import { Download } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
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
import { findItinerary } from "@/lib/mock"
import { formatCurrency } from "@/lib/formatters/currency"
import { useTranslation } from "@/lib/i18n/provider"
import { useDemoState } from "@/lib/demo-state"
import { dmcs } from "@/lib/mock/dmcs"

const MONTHS = ["2026-05", "2026-04", "2026-03", "2026-02", "2026-01", "2025-12", "2025-11"]

export default function DMCStatementsPage() {
  const { t, locale } = useTranslation()
  const { dmcId } = useDemoState()
  const dmc = dmcs.find((d) => d.id === dmcId) ?? dmcs[0]

  const monthly = MONTHS.map((m) => {
    const monthBookings = bookings.filter((b) => {
      const it = findItinerary(b.itineraryId)
      if (!it || it.dmcId !== dmc.id) return false
      return b.createdAt.startsWith(m)
    })
    const gross = monthBookings.reduce((s, b) => s + it_dmc_net(b, dmc.id), 0)
    return { month: m, count: monthBookings.length, gross }
  })

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={dmc.name}
        title={t("dmc.statements.title")}
        subtitle={t("dmc.statements.subtitle")}
      />

      <div className="px-8 pt-8">
        <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("field.month")}</TableHead>
                <TableHead className="text-right">{t("metric.bookings_count")}</TableHead>
                <TableHead className="text-right">{t("itinerary.margin.dmc_net")}</TableHead>
                <TableHead>{t("field.status")}</TableHead>
                <TableHead className="text-right">{t("field.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthly.map((m, idx) => (
                <TableRow key={m.month}>
                  <TableCell className="text-data text-ink-primary">{m.month}</TableCell>
                  <TableCell className="text-right text-data text-ink-secondary">{m.count}</TableCell>
                  <TableCell className="text-right text-data text-ink-primary">
                    {formatCurrency(m.gross, "USD", locale)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={idx === 0 ? "warning" : idx < 3 ? "info" : "success"}>
                      {idx === 0 ? t("status.draft") : idx < 3 ? t("status.confirmed") : t("status.settled")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        toast.success(t("toast.statement.downloaded", { month: m.month }))
                      }
                    >
                      <Download className="size-3" />
                      {t("actions.download_pdf")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

function it_dmc_net(b: ReturnType<typeof bookings.slice>[number], dmcId: string): number {
  const it = findItinerary(b.itineraryId)
  if (!it || it.dmcId !== dmcId) return 0
  const pax = b.pax.adults + Math.round(b.pax.children / 2)
  return it.marginLayers.dmcNetPerPaxUSD * pax
}

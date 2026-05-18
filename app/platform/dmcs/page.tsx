"use client"

import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { dmcs } from "@/lib/mock/dmcs"
import { itineraries } from "@/lib/mock/itineraries"
import { useTranslation } from "@/lib/i18n/provider"

export default function PlatformDMCsPage() {
  const { t } = useTranslation()

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={t("platform.portal_label")}
        title={t("platform.dmcs.title")}
        subtitle={`${dmcs.length} DMCs across MEA`}
      />

      <div className="px-8 pt-8">
        <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("field.name")}</TableHead>
                <TableHead>{t("field.location")}</TableHead>
                <TableHead>{t("field.trust")}</TableHead>
                <TableHead className="text-right">{t("metric.itinerary_count")}</TableHead>
                <TableHead>{t("field.settlement")}</TableHead>
                <TableHead className="text-right">{t("field.terms")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dmcs.map((d) => {
                const dmcItineraries = itineraries.filter((i) => i.dmcId === d.id)
                return (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-body text-ink-primary">{d.name}</span>
                        <span className="text-caption text-ink-tertiary">{d.contact}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-body text-ink-secondary">
                      {d.city}, {d.country}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          d.trustTier === "TRUSTED"
                            ? "accent"
                            : d.trustTier === "VERIFIED"
                              ? "info"
                              : "neutral"
                        }
                      >
                        {t(`trust.${d.trustTier}` as Parameters<typeof t>[0])}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-data text-ink-primary">
                      {dmcItineraries.length}
                    </TableCell>
                    <TableCell className="font-mono text-caption text-ink-secondary">
                      {d.settlementCurrency}
                    </TableCell>
                    <TableCell className="text-right text-data text-ink-secondary">
                      {d.paymentTermsDays}d
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

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
import { itineraries } from "@/lib/mock/itineraries"
import { findDMC } from "@/lib/mock"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { formatCurrency } from "@/lib/formatters/currency"

export default function PlatformSupplyPage() {
  const { t, locale } = useTranslation()

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={t("platform.portal_label")}
        title={t("platform.supply.title")}
        subtitle={t("platform.supply.subtitle")}
      />

      <div className="px-8 pt-8">
        <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("field.name")}</TableHead>
                <TableHead>{t("wholesaler.catalog.dmc_source")}</TableHead>
                <TableHead>{t("itinerary.departure_type_label")}</TableHead>
                <TableHead className="text-right">{t("itinerary.margin.dmc_net")}</TableHead>
                <TableHead className="text-right">{t("field.markup")}</TableHead>
                <TableHead className="text-right">Published to</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itineraries.map((it) => {
                const dmc = findDMC(it.dmcId)
                return (
                  <TableRow key={it.id}>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-body text-ink-primary">
                          {getLocalized(it.title, locale)}
                        </span>
                        <span className="text-caption text-ink-tertiary">
                          {it.cities.join(" · ")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-body text-ink-secondary">
                      {dmc?.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          it.departureType === "FIXED"
                            ? "info"
                            : it.departureType === "ON_DEMAND"
                              ? "warning"
                              : "accent"
                        }
                      >
                        {t(
                          it.departureType === "FIXED"
                            ? "catalog.departure_type.fixed"
                            : it.departureType === "ON_DEMAND"
                              ? "catalog.departure_type.on_demand"
                              : "catalog.departure_type.rfq_only",
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-data text-ink-primary">
                      {formatCurrency(it.marginLayers.dmcNetPerPaxUSD, "USD", locale)}
                    </TableCell>
                    <TableCell className="text-right text-data text-accent">
                      + {formatCurrency(it.marginLayers.ourMarkupUSD, "USD", locale)}
                    </TableCell>
                    <TableCell className="text-right text-data text-ink-secondary">
                      {it.publishedToAgencies.length} agencies
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

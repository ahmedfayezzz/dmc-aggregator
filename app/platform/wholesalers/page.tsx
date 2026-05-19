"use client"

import Link from "next/link"
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
import { wholesalers } from "@/lib/mock/wholesalers"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"

export default function PlatformWholesalersPage() {
  const { t, locale } = useTranslation()

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={t("platform.portal_label")}
        title={t("platform.wholesalers.title")}
        subtitle={`${wholesalers.length} active tenants`}
      />

      <div className="px-8 pt-8">
        <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("field.name")}</TableHead>
                <TableHead>{t("field.subdomain")}</TableHead>
                <TableHead className="text-right">{t("nav.agencies")}</TableHead>
                <TableHead className="text-right">{t("metric.gmv")}</TableHead>
                <TableHead>{t("field.wallet_mode")}</TableHead>
                <TableHead>{t("field.created_at")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wholesalers.map((w) => (
                <TableRow key={w.id}>
                  <TableCell>
                    <Link href="/wholesaler/dashboard" className="flex flex-col gap-0.5">
                      <span className="text-body text-ink-primary">
                        {getLocalized(w.displayName, locale)}
                      </span>
                      <span className="text-caption text-ink-tertiary">
                        {getLocalized(w.legalName, locale)}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-caption text-ink-secondary">
                    {w.subdomain}
                  </TableCell>
                  <TableCell className="text-right text-data text-ink-primary">
                    {w.agencyCount}
                  </TableCell>
                  <TableCell className="text-right text-data text-ink-primary">
                    {formatCurrency(w.monthlyGMV_USD, "USD", locale)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={w.walletWithPlatform.mode === "CREDIT" ? "accent" : "info"}>
                      {w.walletWithPlatform.mode}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-data text-ink-tertiary">
                    {formatDate(w.contractStart, locale, "short")}
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

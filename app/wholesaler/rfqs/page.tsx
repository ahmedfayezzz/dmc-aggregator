"use client"

import Link from "next/link"
import { useMemo } from "react"
import { ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SLATimer } from "@/components/shared/sla-timer"
import { Badge } from "@/components/ui/badge"
import { rfqs } from "@/lib/mock/rfqs"
import { findAgency, findItinerary } from "@/lib/mock"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"
import type { RFQState } from "@/lib/types"

export default function WholesalerRFQsPage() {
  const { t, locale } = useTranslation()
  const { rfqActions } = useDemoState()

  const effectiveState = (rfqId: string, original: RFQState): RFQState => {
    const a = rfqActions[rfqId]
    if (a?.kind === "quoted") return "RFQ_QUOTED"
    if (a?.kind === "declined") return "RFQ_DECLINED"
    return original
  }

  const effectiveQuoted = (rfqId: string, original?: number): number | undefined => {
    const a = rfqActions[rfqId]
    if (a?.kind === "quoted") return a.amountUSD
    return original
  }

  const sorted = useMemo(
    () =>
      [...rfqs].sort(
        (a, b) =>
          new Date(a.slaExpiresAt).getTime() - new Date(b.slaExpiresAt).getTime(),
      ),
    [],
  )

  const pendingCount = rfqs.filter(
    (r) => effectiveState(r.id, r.state) === "RFQ_SUBMITTED",
  ).length

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={t("nav.rfqs")}
        title={t("wholesaler.rfqs.title")}
        subtitle={t("wholesaler.rfqs.subtitle", {
          count: pendingCount,
          avg: "4.2h",
        })}
      />

      <div className="px-8 pt-8">
        <ul className="space-y-3">
          {sorted.map((r) => {
            const ag = findAgency(r.agencyId)
            const it = findItinerary(r.itineraryId)
            if (!ag || !it) return null
            return (
              <li key={r.id}>
                <Link
                  href={`/wholesaler/rfqs/${r.id}`}
                  className="group flex items-center gap-6 rounded-lg border border-border-subtle bg-bg-raised px-6 py-5 transition-colors hover:border-border-default"
                >
                  <div className="flex w-32 shrink-0 flex-col gap-1">
                    <span className="text-label text-ink-tertiary">
                      {t("field.created_at")}
                    </span>
                    <span className="text-data text-ink-secondary">
                      {formatDate(r.submittedAt, locale, "short")}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <span className="text-caption text-ink-tertiary truncate">
                      {getLocalized(ag.name, locale)} · {getLocalized(ag.contactName, locale)}
                    </span>
                    <span className="truncate text-body text-ink-primary">
                      {getLocalized(it.title, locale)}
                    </span>
                    <span className="line-clamp-1 text-caption text-ink-secondary">
                      {getLocalized(r.customization, locale)}
                    </span>
                  </div>

                  <div className="flex w-48 shrink-0 flex-col gap-1">
                    <span className="text-label text-ink-tertiary">
                      {t("rfq.sla.responding_in", { time: "" }).split("{")[0].trim() || "SLA"}
                    </span>
                    <SLATimer expiresAt={r.slaExpiresAt} />
                  </div>

                  <div className="flex w-40 shrink-0 flex-col items-end gap-1">
                    {(() => {
                      const state = effectiveState(r.id, r.state)
                      const quoted = effectiveQuoted(r.id, r.quotedAmountUSD)
                      return (
                        <>
                          {state === "RFQ_QUOTED" && quoted ? (
                            <span className="text-data text-ink-primary">
                              {formatCurrency(quoted, "USD", locale)}
                            </span>
                          ) : (
                            <span className="text-data text-ink-tertiary">—</span>
                          )}
                          <Badge
                            variant={
                              state === "RFQ_SUBMITTED"
                                ? "info"
                                : state === "RFQ_QUOTED"
                                  ? "warning"
                                  : "danger"
                            }
                          >
                            {t(
                              state === "RFQ_SUBMITTED"
                                ? "status.rfq_submitted"
                                : state === "RFQ_QUOTED"
                                  ? "status.rfq_quoted"
                                  : "status.rfq_declined",
                            )}
                          </Badge>
                        </>
                      )
                    })()}
                  </div>

                  <ArrowRight className="size-4 shrink-0 text-ink-quaternary transition-colors group-hover:text-accent" />
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

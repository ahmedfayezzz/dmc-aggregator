"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Inbox } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { RequestStatusBadge } from "@/components/shared/status-badge"
import { wholesalers } from "@/lib/mock/wholesalers"
import { findAgency, findDMC } from "@/lib/mock"
import { useDemoState } from "@/lib/demo-state"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"
import type { RequestState } from "@/lib/types"
import { cn } from "@/lib/utils"

type TabKey = "queue" | "in_flight" | "history"

const TAB_STATES: Record<TabKey, RequestState[]> = {
  queue: ["AWAITING_PLATFORM_REVIEW", "PLATFORM_APPLYING_MARKUP"],
  in_flight: [
    "AWAITING_DMC_QUOTE",
    "WHOLESALER_APPLYING_MARKUP",
    "QUOTED_TO_AGENCY",
    "AWAITING_AGENCY_CLARIFICATION",
    "AWAITING_WHOLESALER_REVIEW",
  ],
  history: ["ACCEPTED", "DECLINED", "EXPIRED"],
}

const TAB_LABELS: Record<TabKey, string> = {
  queue: "wholesaler.rfqs.tab.queue",
  in_flight: "wholesaler.rfqs.tab.in_flight",
  history: "wholesaler.rfqs.tab.history",
}

export default function PlatformRequestsPage() {
  const { t, locale } = useTranslation()
  const { customRequests } = useDemoState()
  const [tab, setTab] = useState<TabKey>("queue")

  const queueCount = customRequests.filter((r) => TAB_STATES.queue.includes(r.state)).length
  const visible = useMemo(
    () => customRequests.filter((r) => TAB_STATES[tab].includes(r.state)),
    [customRequests, tab],
  )

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={t("platform.portal_label")}
        title={t("platform.rfqs.title")}
        subtitle={t("platform.rfqs.subtitle", { count: queueCount, avg: "3.8h" })}
      />

      <div className="px-8 pt-8">
        <div className="mb-6 flex items-center gap-1 border-b border-border-subtle">
          {(Object.keys(TAB_STATES) as TabKey[]).map((k) => {
            const count = customRequests.filter((r) => TAB_STATES[k].includes(r.state)).length
            return (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-2 text-caption transition-colors",
                  tab === k
                    ? "border-accent text-accent"
                    : "border-transparent text-ink-secondary hover:text-ink-primary",
                )}
              >
                {t(TAB_LABELS[k] as Parameters<typeof t>[0])}
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[10px]",
                  tab === k ? "bg-accent-soft text-accent" : "bg-bg-sunken/50 text-ink-tertiary",
                )}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {visible.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border-subtle bg-bg-raised py-16 text-center">
            <Inbox className="mx-auto size-7 text-ink-tertiary" />
            <p className="mt-3 text-caption text-ink-tertiary">{t("agency.requests.empty")}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {visible.map((r) => {
              const ag = findAgency(r.agencyId)
              const wh = wholesalers.find((w) => w.id === r.wholesalerId)
              const dmc = r.routing.assignedDmcId ? findDMC(r.routing.assignedDmcId) : undefined
              const totalPax =
                r.payload.pax.adults + r.payload.pax.children + r.payload.pax.infants
              return (
                <li key={r.id}>
                  <Link
                    href={`/platform/rfqs/${r.id}`}
                    className="group/row flex items-center gap-4 rounded-lg border border-border-subtle bg-bg-raised px-5 py-4 transition-colors hover:border-accent-border"
                  >
                    <div className="w-56 shrink-0 space-y-1.5">
                      <p className="text-label text-ink-tertiary">{r.id}</p>
                      <RequestStatusBadge state={r.state} />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate text-caption text-ink-tertiary">
                        {wh ? getLocalized(wh.displayName, locale) : "—"}
                        {" → "}
                        {ag ? getLocalized(ag.name, locale) : "—"}
                      </p>
                      <p className="truncate text-body text-ink-primary">
                        {r.payload.destinations.join(" / ")} ·{" "}
                        {r.payload.cities?.slice(0, 3).join(", ")}
                      </p>
                      <p className="text-caption text-ink-tertiary">
                        {formatDate(r.payload.travelWindow.from, locale, "short")} →{" "}
                        {formatDate(r.payload.travelWindow.to, locale, "short")} · {totalPax} pax ·{" "}
                        {dmc ? dmc.name : t("platform.rfqs.no_dmc_assigned")}
                      </p>
                    </div>
                    <div className="w-40 shrink-0 text-right">
                      {r.pricing.dmcNetTotalUSD !== undefined ? (
                        <>
                          <p className="text-label text-ink-tertiary">
                            {t("agency.request.detail.dmc_net")}
                          </p>
                          <p className="text-data text-ink-primary">
                            {formatCurrency(r.pricing.dmcNetTotalUSD, "USD", locale)}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-label text-ink-tertiary">
                            {t("rfq.timeline.holder_now")}
                          </p>
                          <p className="text-data text-ink-secondary">
                            {t(`rfq.actor.${r.routing.currentHolder}` as Parameters<typeof t>[0])}
                          </p>
                        </>
                      )}
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-ink-tertiary transition-colors group-hover/row:text-accent" />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

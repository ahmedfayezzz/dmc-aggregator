"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight, Inbox, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { RequestStatusBadge } from "@/components/shared/status-badge"
import { useTranslation } from "@/lib/i18n/provider"
import { useDemoState } from "@/lib/demo-state"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"
import type { RequestState } from "@/lib/types"
import { cn } from "@/lib/utils"

type TabKey = "in_progress" | "quoted" | "closed"

const TAB_STATES: Record<TabKey, RequestState[]> = {
  in_progress: [
    "AWAITING_WHOLESALER_REVIEW",
    "AWAITING_PLATFORM_REVIEW",
    "AWAITING_DMC_QUOTE",
    "PLATFORM_APPLYING_MARKUP",
    "WHOLESALER_APPLYING_MARKUP",
    "AWAITING_AGENCY_CLARIFICATION",
    "DRAFT",
  ],
  quoted: ["QUOTED_TO_AGENCY"],
  closed: ["ACCEPTED", "DECLINED", "EXPIRED"],
}

export default function AgencyRequestsPage() {
  const { t, locale } = useTranslation()
  const { customRequests, agencyId } = useDemoState()
  const [tab, setTab] = useState<TabKey>("in_progress")

  const mine = useMemo(
    () => customRequests.filter((r) => r.agencyId === agencyId),
    [customRequests, agencyId],
  )
  const visible = useMemo(
    () => mine.filter((r) => TAB_STATES[tab].includes(r.state)),
    [mine, tab],
  )

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={t("nav.requests")}
        title={t("agency.requests.title")}
        subtitle={t("agency.requests.subtitle", { count: mine.length })}
        actions={
          <Button asChild>
            <Link href="/agency/request/new">
              <Plus className="size-4" />
              {t("agency.requests.new_cta")}
            </Link>
          </Button>
        }
      />

      <div className="px-8 pt-8">
        {/* Tabs */}
        <div className="mb-6 flex items-center gap-1 border-b border-border-subtle">
          {(Object.keys(TAB_STATES) as TabKey[]).map((k) => {
            const count = mine.filter((r) => TAB_STATES[k].includes(r.state)).length
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
                {t(`agency.requests.tab.${k}` as Parameters<typeof t>[0])}
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
          <div className="rounded-lg border border-dashed border-border-subtle bg-bg-raised py-20 text-center">
            <Inbox className="mx-auto size-8 text-ink-tertiary" />
            <p className="mt-3 text-caption text-ink-tertiary">{t("agency.requests.empty")}</p>
            <Button asChild className="mt-4">
              <Link href="/agency/request/new">
                <Plus className="size-4" />
                {t("agency.requests.new_cta")}
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {visible.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/agency/requests/${r.id}`}
                  className="group/row flex items-stretch gap-4 rounded-lg border border-border-subtle bg-bg-raised p-5 transition-colors hover:border-accent-border"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <RequestStatusBadge state={r.state} />
                      <span className="text-caption text-ink-tertiary">{r.id}</span>
                      <span className="text-caption text-ink-tertiary">·</span>
                      <span className="text-caption text-ink-secondary">
                        {t(`rfq.type.${r.type}` as Parameters<typeof t>[0])}
                      </span>
                    </div>
                    <h3 className="text-subheading text-ink-primary">
                      {r.payload.destinations.join(" / ")} ·{" "}
                      {r.payload.cities?.slice(0, 3).join(", ")}
                    </h3>
                    <p className="text-caption text-ink-tertiary">
                      {formatDate(r.payload.travelWindow.from, locale, "short")} →{" "}
                      {formatDate(r.payload.travelWindow.to, locale, "short")}
                      {" · "}
                      {r.payload.durationDays} {t("common.days")}
                      {" · "}
                      {r.payload.pax.adults + r.payload.pax.children + r.payload.pax.infants}{" "}
                      pax
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-2 text-right">
                    {r.pricing.agencyRetailUSD !== undefined ? (
                      <div>
                        <p className="text-caption text-ink-tertiary">
                          {t("agency.request.detail.your_total")}
                        </p>
                        <p className="text-heading text-accent">
                          {formatCurrency(r.pricing.agencyRetailUSD, "USD", locale)}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-caption text-ink-tertiary">
                          {t("rfq.timeline.holder_now")}
                        </p>
                        <p className="text-data text-ink-secondary">
                          {t(`rfq.actor.${r.routing.currentHolder}` as Parameters<typeof t>[0])}
                        </p>
                      </div>
                    )}
                    <ChevronRight className="size-4 text-ink-tertiary transition-transform group-hover/row:translate-x-1" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}


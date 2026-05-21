"use client"

import {
  ArrowDown,
  ArrowUp,
  Building2,
  Check,
  ChevronRight,
  Cog,
  Plane,
  Store,
  Users,
  XCircle,
} from "lucide-react"
import type {
  CustomRequest,
  RequestActor,
  RequestEvent,
  RequestState,
} from "@/lib/types"
import { useTranslation } from "@/lib/i18n/provider"
import { formatCurrency } from "@/lib/formatters/currency"
import { cn } from "@/lib/utils"

/**
 * Renders the 4-stage pipeline (agency → wholesaler → platform → DMC) with
 * the current holder highlighted, plus a chronological audit log of every
 * forward/quote/markup/decline event.
 */
export function PipelineTimeline({ request }: { request: CustomRequest }) {
  const { t, locale } = useTranslation()

  const stages: Array<{ actor: RequestActor; labelKey: Parameters<typeof t>[0] }> = [
    { actor: "agency", labelKey: "rfq.actor.agency" },
    { actor: "wholesaler", labelKey: "rfq.actor.wholesaler" },
    { actor: "platform", labelKey: "rfq.actor.platform" },
    { actor: "dmc", labelKey: "rfq.actor.dmc" },
  ]

  const ActorIcon: Record<RequestActor, typeof Users> = {
    agency: Users,
    wholesaler: Store,
    platform: Building2,
    dmc: Plane,
    system: Cog,
  }

  const currentStageIdx = stages.findIndex(
    (s) => s.actor === request.routing.currentHolder,
  )

  // Visual: stages BEFORE the current holder are considered "passed";
  // on the return leg (direction=backward), we mark the DMC as passed.
  const passedStage = (idx: number) => {
    if (request.state === "ACCEPTED") return true
    if (request.state === "DECLINED") return idx < currentStageIdx
    if (request.routing.direction === "forward") return idx < currentStageIdx
    // backward: anything to the right of current holder is "passed back through"
    return idx > currentStageIdx
  }

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h3 className="text-subheading text-ink-primary">{t("rfq.timeline.title")}</h3>
        <span className="flex items-center gap-2 text-caption text-ink-tertiary">
          {request.routing.direction === "forward" ? (
            <>
              <ArrowDown className="size-3.5 text-accent" />
              {t("rfq.timeline.direction.forward")}
            </>
          ) : (
            <>
              <ArrowUp className="size-3.5 text-success" />
              {t("rfq.timeline.direction.backward")}
            </>
          )}
        </span>
      </header>

      {/* Stages */}
      <div className="grid grid-cols-4 gap-2 rounded-lg border border-border-subtle bg-bg-raised p-4">
        {stages.map((s, idx) => {
          const Icon = ActorIcon[s.actor]
          const isCurrent = idx === currentStageIdx && request.state !== "ACCEPTED" && request.state !== "DECLINED"
          const isPassed = passedStage(idx)
          return (
            <div key={s.actor} className="relative flex flex-col items-center gap-2 text-center">
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-full border-2 transition-colors",
                  isCurrent && "border-accent bg-accent-soft text-accent shadow-[0_0_0_4px_var(--color-accent-soft)]",
                  !isCurrent && isPassed && "border-success/40 bg-success-soft text-success",
                  !isCurrent && !isPassed && "border-border-subtle bg-bg-base text-ink-tertiary",
                )}
              >
                {!isCurrent && isPassed ? (
                  <Check className="size-4" />
                ) : (
                  <Icon className="size-4" />
                )}
              </span>
              <span className={cn(
                "text-caption",
                isCurrent ? "text-accent" : "text-ink-secondary",
              )}>
                {t(s.labelKey)}
              </span>
              {isCurrent ? (
                <span className="text-[10px] uppercase tracking-[0.12em] text-accent">
                  {t("rfq.timeline.holder_now")}
                </span>
              ) : null}
            </div>
          )
        })}
      </div>

      {/* Audit log */}
      <div className="space-y-2">
        <h4 className="text-label text-ink-tertiary">{t("rfq.audit.title")}</h4>
        <ol className="space-y-3 border-l border-border-subtle pl-4">
          {request.events.map((ev, idx) => (
            <EventRow key={idx} event={ev} />
          ))}
        </ol>
      </div>
    </section>
  )

  function EventRow({ event }: { event: RequestEvent }) {
    const Icon = ActorIcon[event.actor]
    const isDecline = event.action === "declined"
    const isAccept = event.action === "accepted"
    const dotClass = isDecline
      ? "border-danger bg-danger-soft text-danger"
      : isAccept
      ? "border-success bg-success-soft text-success"
      : event.actor === "system"
      ? "border-accent-border bg-accent-soft text-accent"
      : "border-border-default bg-bg-raised text-ink-secondary"

    const ts = new Date(event.ts)
    const timeLabel = locale === "zh-CN"
      ? `${ts.getMonth() + 1}月${ts.getDate()}日 ${ts.getHours().toString().padStart(2, "0")}:${ts.getMinutes().toString().padStart(2, "0")}`
      : ts.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })

    return (
      <li className="relative">
        <span className={cn(
          "absolute -left-[22px] top-0 grid size-4 place-items-center rounded-full border",
          dotClass,
        )}>
          {isDecline ? (
            <XCircle className="size-2.5" />
          ) : isAccept ? (
            <Check className="size-2.5" />
          ) : (
            <Icon className="size-2.5" />
          )}
        </span>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-caption text-ink-primary">
            {t(`rfq.actor.${event.actor}` as Parameters<typeof t>[0])}
            {event.actorName ? ` · ${event.actorName}` : ""}
          </span>
          <ChevronRight className="size-3 text-ink-tertiary" />
          <span className="text-caption text-ink-secondary">
            {t(`rfq.action.${event.action}` as Parameters<typeof t>[0])}
          </span>
          {event.amountUSD !== undefined ? (
            <span className="text-data text-accent">
              {formatCurrency(event.amountUSD, "USD", locale)}
            </span>
          ) : null}
          <span className="ml-auto text-caption text-ink-tertiary">{timeLabel}</span>
        </div>
        {event.note ? (
          <p className="mt-1 text-caption text-ink-tertiary">{event.note}</p>
        ) : null}
      </li>
    )
  }
}

/**
 * Renders just the pricing breakdown — useful in detail pages.
 * `viewerScope` controls which margin layers are visible (agencies see only retail).
 */
export function PricingBreakdown({
  request,
  viewerScope,
}: {
  request: CustomRequest
  viewerScope: "agency" | "wholesaler" | "platform" | "dmc"
}) {
  const { t, locale } = useTranslation()
  const p = request.pricing

  const rows: Array<{ key: string; label: string; value: number | undefined; emphasis?: boolean }> = []

  if (viewerScope === "dmc") {
    rows.push({
      key: "dmc_net",
      label: t("agency.request.detail.dmc_net"),
      value: p.dmcNetTotalUSD,
      emphasis: true,
    })
  } else if (viewerScope === "platform") {
    rows.push({ key: "dmc_net", label: t("agency.request.detail.dmc_net"), value: p.dmcNetTotalUSD })
    rows.push({ key: "platform_markup", label: t("agency.request.detail.platform_markup"), value: p.platformMarkupUSD })
  } else if (viewerScope === "wholesaler") {
    rows.push({ key: "dmc_net", label: t("agency.request.detail.dmc_net"), value: p.dmcNetTotalUSD })
    rows.push({ key: "platform_markup", label: t("agency.request.detail.platform_markup"), value: p.platformMarkupUSD })
    rows.push({ key: "wholesaler_markup", label: t("agency.request.detail.wholesaler_markup"), value: p.wholesalerMarkupUSD })
  }

  // Always include the final retail (visible to all parties once computed)
  if (viewerScope === "agency") {
    rows.push({
      key: "your_total",
      label: t("agency.request.detail.your_total"),
      value: p.agencyRetailUSD,
      emphasis: true,
    })
  } else if (p.agencyRetailUSD !== undefined) {
    rows.push({
      key: "agency_retail",
      label: t("agency.request.detail.agency_retail"),
      value: p.agencyRetailUSD,
      emphasis: true,
    })
  }

  return (
    <section className="space-y-3">
      <h4 className="text-label text-ink-tertiary">{t("agency.request.detail.pricing")}</h4>
      <div className="rounded-lg border border-border-subtle bg-bg-raised">
        {rows.map((r, idx) => (
          <div
            key={r.key}
            className={cn(
              "flex items-baseline justify-between px-4 py-3",
              idx < rows.length - 1 && "border-b border-border-subtle",
              r.emphasis && "bg-accent-soft/30",
            )}
          >
            <span className={cn("text-caption", r.emphasis ? "text-ink-primary" : "text-ink-secondary")}>
              {r.label}
            </span>
            <span className={cn(
              r.emphasis ? "text-heading text-accent" : "text-data text-ink-primary",
            )}>
              {r.value !== undefined ? formatCurrency(r.value, "USD", locale) : "—"}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function stateBadgeVariant(state: RequestState) {
  switch (state) {
    case "ACCEPTED":
      return "success" as const
    case "DECLINED":
    case "EXPIRED":
      return "danger" as const
    case "QUOTED_TO_AGENCY":
      return "success" as const
    case "PLATFORM_APPLYING_MARKUP":
    case "WHOLESALER_APPLYING_MARKUP":
      return "accent" as const
    case "AWAITING_DMC_QUOTE":
    case "AWAITING_AGENCY_CLARIFICATION":
      return "warning" as const
    default:
      return "info" as const
  }
}

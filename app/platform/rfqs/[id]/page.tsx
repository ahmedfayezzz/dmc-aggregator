"use client"

import { use, useMemo, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Send, Tag, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/shared/page-header"
import { RequestStatusBadge } from "@/components/shared/status-badge"
import {
  PipelineTimeline,
  PricingBreakdown,
} from "@/components/shared/pipeline-timeline"
import { useTranslation } from "@/lib/i18n/provider"
import { useDemoState } from "@/lib/demo-state"
import { getLocalized } from "@/lib/i18n/get-localized"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"
import { dmcs } from "@/lib/mock/dmcs"
import { findAgency, findDMC } from "@/lib/mock"
import { wholesalers } from "@/lib/mock/wholesalers"
import { platformMarkupRules } from "@/lib/mock/markup-rules"
import { evaluateRules, contextFromRequest } from "@/lib/rfq/evaluate-rules"
import { cn } from "@/lib/utils"

export default function PlatformRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { t, locale } = useTranslation()
  const {
    customRequests,
    forwardCustomRequest,
    applyCustomRequestMarkup,
    declineCustomRequest,
  } = useDemoState()
  const request = customRequests.find((r) => r.id === id)
  const [pickedDmcId, setPickedDmcId] = useState<string>("")
  const [forwardNote, setForwardNote] = useState("")
  const [markupInput, setMarkupInput] = useState("")
  const [showDecline, setShowDecline] = useState(false)
  const [declineReason, setDeclineReason] = useState("")

  if (!request) notFound()

  const agency = findAgency(request.agencyId)
  const wholesaler = wholesalers.find((w) => w.id === request.wholesalerId)
  const assignedDmc = request.routing.assignedDmcId
    ? findDMC(request.routing.assignedDmcId)
    : undefined
  const totalPax = request.payload.pax.adults + request.payload.pax.children + request.payload.pax.infants

  // Filter DMCs to those covering at least one requested destination country
  const candidateDmcs = useMemo(
    () => dmcs.filter((d) => request.payload.destinations.includes(d.country)),
    [request.payload.destinations],
  )

  const ruleEval = useMemo(
    () =>
      evaluateRules(
        platformMarkupRules,
        contextFromRequest(request, { agencyTier: "standard" }),
      ),
    [request],
  )

  const isForwardStage = request.state === "AWAITING_PLATFORM_REVIEW"
  const isMarkupStage = request.state === "PLATFORM_APPLYING_MARKUP"
  const actorName = "Safasoft Ops"

  const handleForward = () => {
    if (!pickedDmcId) {
      toast.error(t("platform.rfqs.no_dmc_assigned"))
      return
    }
    // Set the assignedDmcId by mutating routing first via forward — extend demo-state to allow this
    // Simpler: we forward, then the assignment is captured in the event note for the demo.
    forwardCustomRequest(
      request.id,
      "platform",
      actorName,
      `${t("platform.rfqs.assigned_dmc")}: ${dmcs.find((d) => d.id === pickedDmcId)?.name ?? pickedDmcId}${forwardNote ? ` · ${forwardNote}` : ""}`,
    )
    // Update assignment by setting it directly on the state (workaround: re-set with mutate)
    useDemoState.setState((s) => ({
      customRequests: s.customRequests.map((r) =>
        r.id === request.id
          ? { ...r, routing: { ...r.routing, assignedDmcId: pickedDmcId } }
          : r,
      ),
    }))
    toast.success(t("toast.crfq.forwarded"))
  }

  const handleApplyMarkup = () => {
    const amount = Number(markupInput)
    if (!amount || amount <= 0) {
      toast.error(t("common.required"))
      return
    }
    applyCustomRequestMarkup(
      request.id,
      "platform",
      amount,
      actorName,
      ruleEval.matchedRule?.id,
    )
    toast.success(t("toast.crfq.markup_applied"))
  }

  const handleApplySuggested = () => {
    if (!ruleEval.matchedRule) return
    applyCustomRequestMarkup(
      request.id,
      "platform",
      ruleEval.markupUSD,
      actorName,
      ruleEval.matchedRule.id,
      `Rule · ${ruleEval.matchedRule.name}`,
    )
    toast.success(t("toast.crfq.markup_applied"))
  }

  const handleDecline = () => {
    if (!declineReason.trim()) return
    declineCustomRequest(request.id, "platform", actorName, declineReason)
    toast.success(t("toast.crfq.declined"))
    setShowDecline(false)
  }

  return (
    <div className="pb-24">
      <div className="border-b border-border-subtle px-8 pt-8 pb-2">
        <Link
          href="/platform/rfqs"
          className="inline-flex items-center gap-2 text-caption text-ink-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          {t("platform.rfqs.title")}
        </Link>
      </div>

      <PageHeader
        eyebrow={`${request.id} · ${t(`rfq.type.${request.type}` as Parameters<typeof t>[0])}`}
        title={`${request.payload.destinations.join(" / ")} · ${request.payload.cities?.slice(0, 3).join(", ") ?? ""}`}
        subtitle={`${wholesaler ? getLocalized(wholesaler.displayName, locale) : "—"} → ${agency ? getLocalized(agency.name, locale) : "—"} · ${formatDate(request.payload.travelWindow.from, locale, "short")} → ${formatDate(request.payload.travelWindow.to, locale, "short")} · ${totalPax} pax`}
        actions={<RequestStatusBadge state={request.state} />}
      />

      <div className="grid grid-cols-1 gap-8 px-8 pt-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Forward stage */}
          {isForwardStage ? (
            <section className="rounded-lg border border-accent-border bg-accent-soft/50 p-6">
              <h3 className="text-subheading text-ink-primary">
                {t("platform.rfqs.forward.title")}
              </h3>
              <p className="mt-1 text-caption text-ink-secondary">
                {t("platform.rfqs.forward.subtitle")}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {candidateDmcs.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setPickedDmcId(d.id)}
                    className={cn(
                      "flex items-start justify-between gap-3 rounded-md border bg-bg-raised px-4 py-3 text-left transition-colors",
                      pickedDmcId === d.id
                        ? "border-accent-border bg-accent-soft"
                        : "border-border-subtle hover:border-border-default",
                    )}
                  >
                    <div>
                      <p className="text-body text-ink-primary">{d.name}</p>
                      <p className="text-caption text-ink-tertiary">
                        {d.country} · {d.city} · {d.trustTier}
                      </p>
                    </div>
                    {pickedDmcId === d.id ? (
                      <span className="text-caption text-accent">✓</span>
                    ) : null}
                  </button>
                ))}
              </div>

              <textarea
                value={forwardNote}
                onChange={(e) => setForwardNote(e.target.value)}
                rows={2}
                placeholder={t("wholesaler.rfqs.forward.note")}
                className="mt-4 w-full rounded-md border border-border-subtle bg-bg-raised px-3 py-2 text-caption text-ink-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft/60"
              />

              <div className="mt-4 flex gap-2">
                <Button variant="ghost" onClick={() => setShowDecline(true)}>
                  <X className="size-4" />
                  {t("wholesaler.rfqs.action.decline")}
                </Button>
                <Button onClick={handleForward} size="lg" disabled={!pickedDmcId}>
                  <Send className="size-4" />
                  {t("platform.rfqs.action.forward_to_dmc")}
                </Button>
              </div>
            </section>
          ) : null}

          {/* Markup stage */}
          {isMarkupStage ? (
            <section className="rounded-lg border border-accent-border bg-accent-soft/50 p-6">
              <h3 className="text-subheading text-ink-primary">
                {t("platform.rfqs.markup.title")}
              </h3>
              <p className="mt-1 text-caption text-ink-secondary">
                {t("platform.rfqs.markup.subtitle")}
              </p>

              <div className="mt-4 rounded-md border border-border-subtle bg-bg-raised p-4">
                <p className="text-label text-ink-tertiary">
                  {t("agency.request.detail.dmc_net")}
                </p>
                <p className="mt-1 text-heading text-ink-primary">
                  {formatCurrency(request.pricing.dmcNetTotalUSD ?? 0, "USD", locale)}
                </p>
              </div>

              <div className="mt-4 flex items-end gap-3">
                <label className="flex flex-1 flex-col gap-2">
                  <span className="text-caption text-ink-tertiary">
                    {t("platform.rfqs.markup.your_markup_usd")}
                  </span>
                  <Input
                    type="number"
                    value={markupInput}
                    onChange={(e) => setMarkupInput(e.target.value)}
                    placeholder={ruleEval.matchedRule ? String(ruleEval.markupUSD) : "0"}
                  />
                </label>
                {ruleEval.matchedRule ? (
                  <Button variant="secondary" onClick={handleApplySuggested}>
                    <Tag className="size-4" />
                    {t("wholesaler.rfqs.markup_suggested", {
                      rule: ruleEval.matchedRule.name,
                    })}
                    {": "}
                    {formatCurrency(ruleEval.markupUSD, "USD", locale)}
                  </Button>
                ) : null}
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="ghost" onClick={() => setShowDecline(true)}>
                  <X className="size-4" />
                  {t("wholesaler.rfqs.action.decline")}
                </Button>
                <Button onClick={handleApplyMarkup} size="lg" disabled={!markupInput}>
                  <Send className="size-4" />
                  {t("platform.rfqs.action.apply_markup")}
                </Button>
              </div>
            </section>
          ) : null}

          {showDecline ? (
            <section className="rounded-lg border border-danger/40 bg-danger-soft/30 p-6">
              <h4 className="text-subheading text-ink-primary">
                {t("wholesaler.rfqs.action.decline")}
              </h4>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                rows={3}
                placeholder={t("dmc.rfqs.field.decline_reason")}
                className="mt-3 w-full rounded-md border border-border-subtle bg-bg-raised px-3 py-2 text-caption text-ink-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft/60"
              />
              <div className="mt-3 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowDecline(false)}>
                  {t("actions.cancel")}
                </Button>
                <Button variant="destructive" onClick={handleDecline} disabled={!declineReason.trim()}>
                  {t("wholesaler.rfqs.action.decline")}
                </Button>
              </div>
            </section>
          ) : null}

          {/* Original payload */}
          <section className="space-y-4">
            <h3 className="text-subheading text-ink-primary">
              {t("agency.request.detail.original")}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailRow
                label={t("agency.request.new.field.destinations")}
                value={request.payload.destinations.join(", ")}
              />
              <DetailRow
                label={t("agency.request.new.field.cities")}
                value={request.payload.cities?.join(", ") ?? "—"}
              />
              <DetailRow
                label={t("agency.request.new.field.themes")}
                value={request.payload.themes
                  .map((th) => t(`itinerary.theme.${th}` as Parameters<typeof t>[0]))
                  .join(" · ")}
              />
              <DetailRow
                label={t("agency.request.new.field.hotel_tier")}
                value={t(`rfq.hotel.${request.payload.hotelTier}` as Parameters<typeof t>[0])}
              />
              {assignedDmc ? (
                <DetailRow
                  label={t("platform.rfqs.assigned_dmc")}
                  value={`${assignedDmc.name} · ${assignedDmc.city}`}
                />
              ) : null}
            </div>

            {request.payload.activitiesRequested ? (
              <NoteBlock
                title={t("agency.request.new.field.activities")}
                value={getLocalized(request.payload.activitiesRequested, locale)}
              />
            ) : null}
            {request.payload.notes ? (
              <NoteBlock
                title={t("agency.request.new.field.notes")}
                value={getLocalized(request.payload.notes, locale)}
              />
            ) : null}
          </section>

          <PipelineTimeline request={request} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-[80px] lg:self-start">
          {request.pricing.dmcNetTotalUSD !== undefined ? (
            <PricingBreakdown request={request} viewerScope="platform" />
          ) : (
            <section className="rounded-lg border border-border-subtle bg-bg-raised p-5">
              <h4 className="text-label text-ink-tertiary">{t("rfq.timeline.holder_now")}</h4>
              <p className="mt-2 text-subheading text-ink-primary">
                {t(`rfq.actor.${request.routing.currentHolder}` as Parameters<typeof t>[0])}
              </p>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border-subtle bg-bg-raised px-4 py-3">
      <p className="text-caption text-ink-tertiary">{label}</p>
      <p className="mt-1 text-data text-ink-primary">{value}</p>
    </div>
  )
}

function NoteBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md border border-border-subtle bg-bg-raised px-4 py-3">
      <p className="text-caption text-ink-tertiary">{title}</p>
      <p className="mt-1 whitespace-pre-line text-caption text-ink-secondary">{value}</p>
    </div>
  )
}

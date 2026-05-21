"use client"

import { use, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Check, Clock, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { RequestStatusBadge } from "@/components/shared/status-badge"
import {
  PipelineTimeline,
  PricingBreakdown,
} from "@/components/shared/pipeline-timeline"
import { useTranslation } from "@/lib/i18n/provider"
import { useDemoState } from "@/lib/demo-state"
import { getLocalized } from "@/lib/i18n/get-localized"
import { formatDate } from "@/lib/formatters/date"
import { findAgency, findItinerary } from "@/lib/mock"

export default function AgencyRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { t, locale } = useTranslation()
  const {
    customRequests,
    acceptCustomRequest,
    declineCustomRequest,
    agencyId,
  } = useDemoState()
  const request = customRequests.find((r) => r.id === id)
  const [showDecline, setShowDecline] = useState(false)
  const [declineReason, setDeclineReason] = useState("")

  if (!request) notFound()

  const agency = findAgency(agencyId)
  const baseItinerary = request.baseItineraryId ? findItinerary(request.baseItineraryId) : undefined
  const totalPax = request.payload.pax.adults + request.payload.pax.children + request.payload.pax.infants
  const canRespond = request.state === "QUOTED_TO_AGENCY"

  const accept = () => {
    acceptCustomRequest(request.id, getLocalized(agency?.contactName ?? { "zh-CN": "", en: "" }, locale))
    toast.success(t("toast.crfq.accepted"))
  }

  const decline = () => {
    if (!declineReason.trim()) return
    declineCustomRequest(
      request.id,
      "agency",
      getLocalized(agency?.contactName ?? { "zh-CN": "", en: "" }, locale),
      declineReason,
    )
    toast.success(t("toast.crfq.declined"))
    setShowDecline(false)
  }

  return (
    <div className="pb-24">
      <div className="border-b border-border-subtle px-8 pt-8 pb-2">
        <Link
          href="/agency/requests"
          className="inline-flex items-center gap-2 text-caption text-ink-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          {t("agency.requests.title")}
        </Link>
      </div>

      <PageHeader
        eyebrow={`${request.id} · ${t(`rfq.type.${request.type}` as Parameters<typeof t>[0])}`}
        title={`${request.payload.destinations.join(" / ")} · ${request.payload.cities?.slice(0, 3).join(", ") ?? ""}`}
        subtitle={`${formatDate(request.payload.travelWindow.from, locale, "short")} → ${formatDate(request.payload.travelWindow.to, locale, "short")} · ${request.payload.durationDays} ${t("common.days")} · ${totalPax} pax`}
        actions={<RequestStatusBadge state={request.state} />}
      />

      <div className="grid grid-cols-1 gap-8 px-8 pt-8 lg:grid-cols-[1fr_360px]">
        {/* ── Main column ── */}
        <div className="space-y-8">
          {/* Quoted CTA banner */}
          {canRespond ? (
            <section className="rounded-lg border border-accent-border bg-accent-soft p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-subheading text-ink-primary">
                    {t("agency.request.detail.your_total")}
                  </h3>
                  {request.expiresAt ? (
                    <p className="mt-2 flex items-center gap-1.5 text-caption text-ink-secondary">
                      <Clock className="size-3.5" />
                      {t("agency.request.detail.expires_in", {
                        date: formatDate(request.expiresAt, locale, "short"),
                      })}
                    </p>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  {showDecline ? null : (
                    <>
                      <Button variant="ghost" onClick={() => setShowDecline(true)}>
                        <X className="size-4" />
                        {t("agency.request.detail.decline")}
                      </Button>
                      <Button onClick={accept} size="lg">
                        <Check className="size-4" />
                        {t("agency.request.detail.accept")}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {showDecline ? (
                <div className="mt-4 space-y-3 border-t border-accent-border/40 pt-4">
                  <textarea
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    rows={3}
                    placeholder={t("dmc.rfqs.field.decline_reason")}
                    className="w-full rounded-md border border-border-subtle bg-bg-raised px-3 py-2 text-caption text-ink-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft/60"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setShowDecline(false)}>
                      {t("actions.cancel")}
                    </Button>
                    <Button variant="destructive" onClick={decline} disabled={!declineReason.trim()}>
                      <X className="size-4" />
                      {t("agency.request.detail.decline")}
                    </Button>
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          {/* Original request payload */}
          <section className="space-y-4">
            <h3 className="text-subheading text-ink-primary">
              {t("agency.request.detail.original")}
            </h3>

            {baseItinerary ? (
              <div className="rounded-md border border-border-subtle bg-bg-raised px-4 py-3">
                <p className="text-caption text-ink-tertiary">
                  {t("agency.request.new.from_itinerary_note", {
                    title: getLocalized(baseItinerary.title, locale),
                  })}
                </p>
              </div>
            ) : null}

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
              <DetailRow
                label={t("agency.request.new.field.budget_band")}
                value={
                  request.payload.budgetBand
                    ? t(`rfq.budget.${request.payload.budgetBand}` as Parameters<typeof t>[0])
                    : "—"
                }
              />
              {request.payload.budgetPerPaxUSD !== undefined ? (
                <DetailRow
                  label={t("agency.request.new.field.budget_per_pax")}
                  value={`$${request.payload.budgetPerPaxUSD.toLocaleString()}`}
                />
              ) : null}
            </div>

            {request.payload.activitiesRequested ? (
              <NoteBlock
                title={t("agency.request.new.field.activities")}
                value={getLocalized(request.payload.activitiesRequested, locale)}
              />
            ) : null}
            {request.payload.specialNeeds ? (
              <NoteBlock
                title={t("agency.request.new.field.special_needs")}
                value={getLocalized(request.payload.specialNeeds, locale)}
              />
            ) : null}
            {request.payload.notes ? (
              <NoteBlock
                title={t("agency.request.new.field.notes")}
                value={getLocalized(request.payload.notes, locale)}
              />
            ) : null}
          </section>

          {/* Pipeline timeline */}
          <PipelineTimeline request={request} />
        </div>

        {/* ── Right rail ── */}
        <aside className="space-y-6 lg:sticky lg:top-[80px] lg:self-start">
          {request.pricing.agencyRetailUSD !== undefined ? (
            <PricingBreakdown request={request} viewerScope="agency" />
          ) : (
            <section className="rounded-lg border border-border-subtle bg-bg-raised p-5">
              <h4 className="text-label text-ink-tertiary">{t("rfq.timeline.holder_now")}</h4>
              <p className="mt-2 text-subheading text-ink-primary">
                {t(`rfq.actor.${request.routing.currentHolder}` as Parameters<typeof t>[0])}
              </p>
              <p className="mt-3 text-caption text-ink-secondary">
                {request.routing.direction === "forward"
                  ? t("rfq.timeline.direction.forward")
                  : t("rfq.timeline.direction.backward")}
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

"use client"

import { use, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Send, X } from "lucide-react"
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

export default function DMCRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { t, locale } = useTranslation()
  const {
    customRequests,
    quoteCustomRequest,
    declineCustomRequest,
    dmcId,
  } = useDemoState()
  const request = customRequests.find((r) => r.id === id)
  const [netTotal, setNetTotal] = useState("")
  const [note, setNote] = useState("")
  const [showDecline, setShowDecline] = useState(false)
  const [declineReason, setDeclineReason] = useState("")

  if (!request) notFound()

  const dmc = dmcs.find((d) => d.id === dmcId) ?? dmcs[0]
  const totalPax = request.payload.pax.adults + request.payload.pax.children + request.payload.pax.infants
  const canQuote = request.state === "AWAITING_DMC_QUOTE"

  const handleQuote = () => {
    const amount = Number(netTotal)
    if (!amount || amount <= 0) {
      toast.error(t("common.required"))
      return
    }
    quoteCustomRequest(request.id, amount, dmc.name, note || undefined)
    toast.success(t("toast.crfq.quoted"))
  }

  const handleDecline = () => {
    if (!declineReason.trim()) return
    declineCustomRequest(request.id, "dmc", dmc.name, declineReason)
    toast.success(t("toast.crfq.declined"))
    setShowDecline(false)
  }

  const perPaxPreview = Number(netTotal) > 0 ? Math.round(Number(netTotal) / totalPax) : 0

  return (
    <div className="pb-24">
      <div className="border-b border-border-subtle px-8 pt-8 pb-2">
        <Link
          href="/dmc/rfqs"
          className="inline-flex items-center gap-2 text-caption text-ink-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          {t("dmc.rfqs.title")}
        </Link>
      </div>

      <PageHeader
        eyebrow={`${request.id} · ${t(`rfq.type.${request.type}` as Parameters<typeof t>[0])}`}
        title={`${request.payload.destinations.join(" / ")} · ${request.payload.cities?.slice(0, 3).join(", ") ?? ""}`}
        subtitle={`${formatDate(request.payload.travelWindow.from, locale, "short")} → ${formatDate(request.payload.travelWindow.to, locale, "short")} · ${request.payload.durationDays} ${t("common.days")} · ${totalPax} pax`}
        actions={<RequestStatusBadge state={request.state} />}
      />

      <div className="grid grid-cols-1 gap-8 px-8 pt-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Quote form */}
          {canQuote ? (
            <section className="rounded-lg border border-accent-border bg-accent-soft/50 p-6">
              <h3 className="text-subheading text-ink-primary">
                {t("dmc.rfqs.action.submit_quote")}
              </h3>
              <p className="mt-1 text-caption text-ink-secondary">
                {t("dmc.rfqs.subtitle", { count: 1 })}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-caption text-ink-tertiary">
                    {t("dmc.rfqs.field.net_total")}
                  </span>
                  <Input
                    type="number"
                    value={netTotal}
                    onChange={(e) => setNetTotal(e.target.value)}
                    placeholder="0"
                  />
                </label>
                <div className="flex flex-col gap-2">
                  <span className="text-caption text-ink-tertiary">
                    {t("pricing.per_pax")}
                  </span>
                  <div className="grid h-10 place-items-start rounded-md border border-border-subtle bg-bg-sunken/40 px-3 pt-2 text-data text-ink-secondary">
                    {perPaxPreview > 0 ? formatCurrency(perPaxPreview, "USD", locale) : "—"}
                  </div>
                </div>
              </div>

              <label className="mt-4 flex flex-col gap-2">
                <span className="text-caption text-ink-tertiary">
                  {t("dmc.rfqs.field.note")}
                </span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="rounded-md border border-border-subtle bg-bg-raised px-3 py-2 text-caption text-ink-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft/60"
                />
              </label>

              <div className="mt-4 flex gap-2">
                <Button variant="ghost" onClick={() => setShowDecline(true)}>
                  <X className="size-4" />
                  {t("dmc.rfqs.action.decline")}
                </Button>
                <Button onClick={handleQuote} size="lg" disabled={!netTotal}>
                  <Send className="size-4" />
                  {t("dmc.rfqs.action.submit_quote")}
                </Button>
              </div>
            </section>
          ) : null}

          {showDecline ? (
            <section className="rounded-lg border border-danger/40 bg-danger-soft/30 p-6">
              <h4 className="text-subheading text-ink-primary">
                {t("dmc.rfqs.action.decline")}
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
                  {t("dmc.rfqs.action.decline")}
                </Button>
              </div>
            </section>
          ) : null}

          {/* Original brief */}
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

          <PipelineTimeline request={request} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-[80px] lg:self-start">
          {request.pricing.dmcNetTotalUSD !== undefined ? (
            <PricingBreakdown request={request} viewerScope="dmc" />
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

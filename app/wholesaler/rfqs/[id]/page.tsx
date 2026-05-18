"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { ArrowLeft, Send, X } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { SLATimer } from "@/components/shared/sla-timer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { rfqs } from "@/lib/mock/rfqs"
import { findAgency, findItinerary } from "@/lib/mock"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"

export default function WholesalerRFQDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const rfq = rfqs.find((r) => r.id === id)
  const { t, locale } = useTranslation()
  const { rfqActions, quoteRFQ, declineRFQ } = useDemoState()
  const [quote, setQuote] = useState(rfq?.quotedAmountUSD?.toString() ?? "")
  const [notes, setNotes] = useState("")

  if (!rfq) notFound()

  const ag = findAgency(rfq.agencyId)
  const it = findItinerary(rfq.itineraryId)
  if (!ag || !it) notFound()

  const localAction = rfqActions[rfq.id]
  const effectiveState =
    localAction?.kind === "quoted"
      ? "RFQ_QUOTED"
      : localAction?.kind === "declined"
        ? "RFQ_DECLINED"
        : rfq.state
  const isResolved = !!localAction || rfq.state !== "RFQ_SUBMITTED"

  const handleSend = () => {
    const amount = Number(quote)
    if (!amount || amount <= 0) {
      toast.error(t("common.required"))
      return
    }
    quoteRFQ(rfq.id, amount)
    toast.success(
      t("toast.rfq.quoted", { amount: formatCurrency(amount, "USD", locale) }),
    )
    setTimeout(() => router.push("/wholesaler/rfqs"), 800)
  }

  const handleDecline = () => {
    declineRFQ(rfq.id)
    toast.success(t("toast.rfq.declined"))
    setTimeout(() => router.push("/wholesaler/rfqs"), 800)
  }

  return (
    <div className="pb-24">
      <div className="border-b border-border-subtle px-8 pt-8 pb-2">
        <Link
          href="/wholesaler/rfqs"
          className="inline-flex items-center gap-2 text-caption text-ink-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          {t("nav.rfqs")}
        </Link>
      </div>

      <PageHeader
        eyebrow={`${getLocalized(ag.name, locale)} · ${getLocalized(ag.contactName, locale)}`}
        title={getLocalized(it.title, locale)}
        subtitle={formatDate(rfq.submittedAt, locale, "long")}
        actions={
          <div className="flex items-center gap-2">
            <SLATimer expiresAt={rfq.slaExpiresAt} />
            <Badge variant={
              effectiveState === "RFQ_SUBMITTED"
                ? "info"
                : effectiveState === "RFQ_QUOTED"
                  ? "warning"
                  : "danger"
            }>
              {t(
                effectiveState === "RFQ_SUBMITTED"
                  ? "status.rfq_submitted"
                  : effectiveState === "RFQ_QUOTED"
                    ? "status.rfq_quoted"
                    : "status.rfq_declined",
              )}
            </Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-8 px-8 pt-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-lg border border-border-subtle bg-bg-raised p-6">
            <h2 className="text-subheading text-ink-primary">
              {t("rfq.customization_summary")}
            </h2>
            <p className="mt-3 text-body text-ink-secondary leading-relaxed">
              {getLocalized(rfq.customization, locale)}
            </p>
            <p className="mt-4 rounded-md border border-border-subtle bg-bg-sunken/40 px-4 py-3 text-caption text-ink-tertiary">
              {getLocalized(rfq.notes, locale)}
            </p>
          </section>

          <section className="rounded-lg border border-border-subtle bg-bg-raised p-6">
            <h2 className="text-subheading text-ink-primary">
              {t("itinerary.section.highlights")}
            </h2>
            <ul className="mt-3 space-y-2">
              {getLocalized(it.highlights, locale).slice(0, 4).map((h, idx) => (
                <li key={idx} className="flex items-start gap-2 text-caption text-ink-secondary">
                  <span className="mt-1 size-1 shrink-0 rounded-full bg-accent" />
                  {h}
                </li>
              ))}
            </ul>
            <Link
              href={`/wholesaler/catalog/${it.id}`}
              className="mt-4 inline-flex items-center gap-2 text-caption text-accent hover:text-accent-hover"
            >
              {t("actions.view_details")}
            </Link>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border border-accent-border bg-bg-raised">
            <header className="bg-accent-soft px-5 py-4">
              <p className="text-label text-accent">{t("rfq.action.quote")}</p>
              <p className="mt-1 text-caption text-ink-secondary">
                {t("itinerary.margin.dmc_net")} {formatCurrency(it.marginLayers.dmcNetPerPaxUSD, "USD", locale)} · {t("pricing.per_pax")}
              </p>
            </header>
            <div className="space-y-4 p-5">
              <label className="flex flex-col gap-2">
                <span className="text-caption text-ink-secondary">{t("field.amount")} (USD)</span>
                <Input
                  type="number"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="0"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-caption text-ink-secondary">
                  {t("rfq.customization_summary")} ({t("common.optional")})
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="rounded-lg border border-border-strong bg-transparent px-3 py-2 text-body text-ink-primary outline-none placeholder:text-ink-tertiary focus:border-accent"
                  placeholder="..."
                />
              </label>

              <div className="flex flex-col gap-2">
                <Button onClick={handleSend} disabled={isResolved}>
                  <Send className="size-4" />
                  {t("actions.send_quote")}
                </Button>
                <Button variant="secondary" onClick={handleDecline} disabled={isResolved}>
                  <X className="size-4" />
                  {t("rfq.action.decline")}
                </Button>
                {isResolved ? (
                  <p className="text-caption text-ink-tertiary text-center">
                    {effectiveState === "RFQ_QUOTED"
                      ? t("status.rfq_quoted")
                      : t("status.rfq_declined")}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

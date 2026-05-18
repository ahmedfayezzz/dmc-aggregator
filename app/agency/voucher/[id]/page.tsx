"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Download, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { findItinerary, findDMC } from "@/lib/mock"
import { wholesaler } from "@/lib/mock/wholesalers"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"

export default function AgencyVoucherPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const itinerary = findItinerary(id)
  const { t, locale } = useTranslation()
  const { bookingDraft } = useDemoState()

  if (!itinerary) notFound()

  const dmc = findDMC(itinerary.dmcId)
  const adults = bookingDraft.adults || 4
  const children = bookingDraft.children || 0
  const bookingRef = "TX-" + Math.random().toString(36).slice(2, 8).toUpperCase()
  const travelDate = new Date(Date.now() + 30 * 24 * 3600_000)
  const totalUSD = itinerary.marginLayers.agencyRetailUSD * adults

  return (
    <div className="pb-24 bg-bg-base min-h-screen">
      <div className="border-b border-border-subtle px-8 pt-8 pb-2">
        <Link
          href="/agency/bookings"
          className="inline-flex items-center gap-2 text-caption text-ink-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          {t("nav.my_bookings")}
        </Link>
      </div>

      <div className="mx-auto max-w-3xl px-8 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-label text-ink-tertiary">{t("agency.voucher.title")}</p>
            <h1 className="mt-1 text-display-md text-ink-primary">
              {t("agency.voucher.subtitle")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => toast.success(t("toast.voucher.downloaded"))}
            >
              <Download className="size-4" />
              {t("actions.download_pdf")}
            </Button>
            <Button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard
                    .writeText(window.location.href)
                    .catch(() => {})
                }
                toast.success(t("toast.voucher.shared"))
              }}
            >
              <MessageCircle className="size-4" />
              {t("actions.share_to_wechat")}
            </Button>
          </div>
        </div>

        {/* Voucher document — always white background regardless of theme */}
        <article className="overflow-hidden rounded-lg bg-white text-zinc-900 shadow-2xl ring-1 ring-zinc-200">
          {/* Co-branded header */}
          <header
            className="flex items-center justify-between px-8 py-6"
            style={{ background: "var(--brand-primary)" }}
          >
            <div className="flex items-center gap-3 text-white">
              <span className="grid size-8 place-items-center rounded-[3px] bg-white/15 text-body">
                {getLocalized(wholesaler.displayName, locale).slice(0, 1)}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-caption opacity-80">
                  {t("agency.voucher.title")}
                </span>
                <span className="text-body">{getLocalized(wholesaler.displayName, locale)}</span>
              </span>
            </div>
            <div className="text-right text-white">
              <p className="text-[10px] uppercase tracking-[0.16em] opacity-75">{t("agency.voucher.booking_ref")}</p>
              <p className="font-mono text-body tracking-wider">{bookingRef}</p>
            </div>
          </header>

          {/* Hero image */}
          <div className="relative aspect-[21/9] bg-zinc-200">
            <Image
              src={itinerary.heroImage}
              alt={getLocalized(itinerary.title, locale)}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 768px, 100vw"
            />
          </div>

          {/* Title block */}
          <section className="px-8 pt-8">
            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
              {itinerary.cities.join(" · ")} · {itinerary.countries.join("/")}
            </p>
            <h2 className="mt-2 font-serif text-3xl text-zinc-900">
              {getLocalized(itinerary.title, locale)}
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              {getLocalized(itinerary.subtitle, locale)}
            </p>
          </section>

          {/* Trip summary table */}
          <section className="grid grid-cols-2 gap-y-4 gap-x-8 border-y border-zinc-200 mx-8 mt-8 py-6">
            <Stat label={t("field.departure_date")} value={formatDate(travelDate, locale, "long")} mono />
            <Stat label={t("itinerary.duration_days", { days: itinerary.duration.days, nights: itinerary.duration.nights })} value={`${itinerary.duration.days}D ${itinerary.duration.nights}N`} mono />
            <Stat label={t("field.pax")} value={`${adults} ${t("common.adults")}${children > 0 ? ` + ${children} ${t("common.children")}` : ""}`} />
            <Stat label={t("field.amount")} value={formatCurrency(totalUSD, "USD", locale)} mono />
          </section>

          {/* Day-by-day */}
          <section className="px-8 pt-8">
            <h3 className="font-serif text-xl text-zinc-900">
              {t("itinerary.section.day_by_day")}
            </h3>
            <ol className="mt-4 space-y-3">
              {itinerary.days.map((d) => (
                <li key={d.day} className="flex gap-4 border-b border-zinc-200 pb-3 last:border-b-0">
                  <span className="w-12 shrink-0 font-mono text-sm text-zinc-500">D{d.day}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900">
                      {getLocalized(d.title, locale)}
                    </p>
                    <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                      {getLocalized(d.description, locale)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Supplier contact */}
          <section className="m-8 rounded-md border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
              {t("agency.voucher.supplier_contact")}
            </p>
            <p className="mt-2 text-sm text-zinc-900">{dmc?.name}</p>
            <p className="mt-0.5 text-xs text-zinc-600">{dmc?.city}, {dmc?.country}</p>
            <p className="mt-0.5 font-mono text-xs text-zinc-700">{dmc?.contact}</p>
          </section>

          <footer className="border-t border-zinc-200 px-8 py-4 text-center text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            {getLocalized(wholesaler.legalName, locale)} · {bookingRef}
          </footer>
        </article>
      </div>
    </div>
  )
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className={mono ? "mt-1 font-mono text-sm text-zinc-900" : "mt-1 text-sm text-zinc-900"}>
        {value}
      </p>
    </div>
  )
}

"use client"

import Image from "next/image"
import Link from "next/link"
import type { Itinerary } from "@/lib/types"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDuration } from "@/lib/formatters/duration"

type Mode = "wholesaler" | "agency"

export function ItineraryCard({
  itinerary,
  href,
  mode = "agency",
}: {
  itinerary: Itinerary
  href: string
  mode?: Mode
}) {
  const { t, locale } = useTranslation()
  const price =
    mode === "wholesaler"
      ? itinerary.marginLayers.wholesalerSellUSD
      : itinerary.marginLayers.agencyRetailUSD

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-bg-raised transition-colors hover:border-border-default"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-sunken">
        <Image
          src={itinerary.heroImage}
          alt={getLocalized(itinerary.title, locale)}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-col gap-3 p-5">
        <span className="text-label text-ink-tertiary">
          {itinerary.cities.join(" · ")} · {itinerary.countries.join("/")}
        </span>

        <div className="flex flex-col gap-1">
          <h3 className="text-subheading text-ink-primary leading-tight">
            {getLocalized(itinerary.title, locale)}
          </h3>
          {locale === "zh-CN" ? (
            <p className="text-caption text-ink-tertiary">
              {getLocalized(itinerary.subtitle, "en")}
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-border-subtle pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-label text-ink-tertiary">{t("catalog.from_price")}</span>
            <span className="text-heading text-accent">
              {formatCurrency(price, "USD", locale)}
            </span>
          </div>
          <span className="text-caption text-ink-tertiary">
            {formatDuration(itinerary.duration.days, itinerary.duration.nights, locale)}
          </span>
        </div>
      </div>
    </Link>
  )
}

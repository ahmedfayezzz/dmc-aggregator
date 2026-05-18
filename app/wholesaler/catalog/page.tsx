"use client"

import { useMemo, useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { ItineraryCard } from "@/components/shared/itinerary-card"
import { Badge } from "@/components/ui/badge"
import { itineraries } from "@/lib/mock/itineraries"
import { useTranslation } from "@/lib/i18n/provider"
import type { DepartureType, ItineraryTheme } from "@/lib/types"
import { cn } from "@/lib/utils"

const departureFilters: Array<{ value: DepartureType | "ALL"; labelKey: Parameters<ReturnType<typeof useTranslation>["t"]>[0] }> = [
  { value: "ALL", labelKey: "common.all" },
  { value: "FIXED", labelKey: "catalog.departure_type.fixed" },
  { value: "ON_DEMAND", labelKey: "catalog.departure_type.on_demand" },
  { value: "RFQ_ONLY", labelKey: "catalog.departure_type.rfq_only" },
]

const themes: Array<{ value: ItineraryTheme; labelKey: Parameters<ReturnType<typeof useTranslation>["t"]>[0] }> = [
  { value: "family", labelKey: "itinerary.theme.family" },
  { value: "luxury", labelKey: "itinerary.theme.luxury" },
  { value: "first-time", labelKey: "itinerary.theme.first-time" },
  { value: "adventure", labelKey: "itinerary.theme.adventure" },
  { value: "cultural", labelKey: "itinerary.theme.cultural" },
]

export default function WholesalerCatalogPage() {
  const { t } = useTranslation()
  const [type, setType] = useState<DepartureType | "ALL">("ALL")
  const [activeThemes, setActiveThemes] = useState<Set<ItineraryTheme>>(new Set())

  const filtered = useMemo(() => {
    return itineraries.filter((i) => {
      if (type !== "ALL" && i.departureType !== type) return false
      if (activeThemes.size > 0 && !i.themes.some((th) => activeThemes.has(th))) {
        return false
      }
      return true
    })
  }, [type, activeThemes])

  const toggleTheme = (th: ItineraryTheme) => {
    setActiveThemes((prev) => {
      const next = new Set(prev)
      if (next.has(th)) next.delete(th)
      else next.add(th)
      return next
    })
  }

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={t("nav.catalog")}
        title={t("wholesaler.catalog.title")}
        subtitle={t("wholesaler.catalog.subtitle", { count: itineraries.length })}
      />

      <div className="px-8 pt-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-md border border-border-subtle bg-bg-raised p-1">
            {departureFilters.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setType(d.value)}
                className={cn(
                  "rounded-[3px] px-3 py-1.5 text-caption transition-colors",
                  type === d.value
                    ? "bg-accent-soft text-accent"
                    : "text-ink-secondary hover:text-ink-primary",
                )}
              >
                {t(d.labelKey)}
              </button>
            ))}
          </div>

          <span className="text-label text-ink-tertiary">{t("catalog.filters.theme")}</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {themes.map((th) => {
              const active = activeThemes.has(th.value)
              return (
                <button
                  key={th.value}
                  type="button"
                  onClick={() => toggleTheme(th.value)}
                  className={cn(
                    "rounded-[3px] border px-3 py-1 text-caption transition-colors",
                    active
                      ? "border-accent-border bg-accent-soft text-accent"
                      : "border-border-subtle bg-bg-raised text-ink-secondary hover:text-ink-primary",
                  )}
                >
                  {t(th.labelKey)}
                </button>
              )
            })}
          </div>
        </div>

        <p className="mb-4 text-caption text-ink-tertiary">
          {t("agency.browse.results", { count: filtered.length })}
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it) => (
            <div key={it.id} className="relative">
              <ItineraryCard
                itinerary={it}
                href={`/wholesaler/catalog/${it.id}`}
                mode="wholesaler"
              />
              {it.publishedToAgencies.length > 0 ? (
                <span className="absolute right-4 top-4">
                  <Badge variant="success">
                    {t("wholesaler.catalog.published_label")} · {it.publishedToAgencies.length}
                  </Badge>
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

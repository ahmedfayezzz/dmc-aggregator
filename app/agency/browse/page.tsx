"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Filter, Lightbulb, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { ItineraryCard } from "@/components/shared/itinerary-card"
import { itineraries } from "@/lib/mock/itineraries"
import { useTranslation } from "@/lib/i18n/provider"
import type { CountryCode, DepartureType, ItineraryTheme } from "@/lib/types"
import { cn } from "@/lib/utils"

const COUNTRY_LABEL: Record<CountryCode, { "zh-CN": string; en: string }> = {
  JO: { "zh-CN": "约旦", en: "Jordan" },
  MA: { "zh-CN": "摩洛哥", en: "Morocco" },
  EG: { "zh-CN": "埃及", en: "Egypt" },
  AE: { "zh-CN": "阿联酋", en: "UAE" },
  SA: { "zh-CN": "沙特", en: "Saudi Arabia" },
  OM: { "zh-CN": "阿曼", en: "Oman" },
}

const THEMES: ItineraryTheme[] = ["family", "luxury", "first-time", "adventure", "cultural"]

export default function AgencyBrowsePage() {
  const { t, locale } = useTranslation()
  const [country, setCountry] = useState<CountryCode | "ALL">("ALL")
  const [type, setType] = useState<DepartureType | "ALL">("ALL")
  const [themes, setThemes] = useState<Set<ItineraryTheme>>(new Set())
  const [duration, setDuration] = useState<"ALL" | "short" | "mid" | "long">("ALL")

  const filtered = useMemo(() => {
    return itineraries.filter((i) => {
      if (country !== "ALL" && !i.countries.includes(country)) return false
      if (type !== "ALL" && i.departureType !== type) return false
      if (themes.size > 0 && !i.themes.some((th) => themes.has(th))) return false
      if (duration === "short" && i.duration.days > 5) return false
      if (duration === "mid" && (i.duration.days < 6 || i.duration.days > 8)) return false
      if (duration === "long" && i.duration.days < 9) return false
      return true
    })
  }, [country, type, themes, duration])

  const featured = itineraries.slice(0, 3)

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={t("nav.browse")}
        title={t("agency.browse.title")}
        subtitle={t("agency.browse.subtitle")}
      />

      <div className="grid grid-cols-1 gap-8 px-8 pt-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar filters */}
        <aside className="space-y-6">
          <FilterSection title={t("catalog.filters.destination")}>
            <div className="flex flex-col gap-1">
              <FilterButton
                active={country === "ALL"}
                onClick={() => setCountry("ALL")}
                label={t("common.all")}
              />
              {(Object.keys(COUNTRY_LABEL) as CountryCode[]).map((c) => (
                <FilterButton
                  key={c}
                  active={country === c}
                  onClick={() => setCountry(c)}
                  label={locale === "zh-CN" ? COUNTRY_LABEL[c]["zh-CN"] : COUNTRY_LABEL[c].en}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title={t("catalog.filters.departure_type")}>
            <div className="flex flex-col gap-1">
              <FilterButton active={type === "ALL"} onClick={() => setType("ALL")} label={t("common.all")} />
              <FilterButton active={type === "FIXED"} onClick={() => setType("FIXED")} label={t("catalog.departure_type.fixed")} />
              <FilterButton active={type === "ON_DEMAND"} onClick={() => setType("ON_DEMAND")} label={t("catalog.departure_type.on_demand")} />
              <FilterButton active={type === "RFQ_ONLY"} onClick={() => setType("RFQ_ONLY")} label={t("catalog.departure_type.rfq_only")} />
            </div>
          </FilterSection>

          <FilterSection title={t("catalog.filters.duration")}>
            <div className="flex flex-col gap-1">
              <FilterButton active={duration === "ALL"} onClick={() => setDuration("ALL")} label={t("common.all")} />
              <FilterButton active={duration === "short"} onClick={() => setDuration("short")} label={`≤ 5 ${t("common.days")}`} />
              <FilterButton active={duration === "mid"} onClick={() => setDuration("mid")} label={`6–8 ${t("common.days")}`} />
              <FilterButton active={duration === "long"} onClick={() => setDuration("long")} label={`≥ 9 ${t("common.days")}`} />
            </div>
          </FilterSection>

          <FilterSection title={t("catalog.filters.theme")}>
            <div className="flex flex-wrap gap-1.5">
              {THEMES.map((th) => {
                const active = themes.has(th)
                return (
                  <button
                    key={th}
                    type="button"
                    onClick={() =>
                      setThemes((prev) => {
                        const next = new Set(prev)
                        if (next.has(th)) next.delete(th)
                        else next.add(th)
                        return next
                      })
                    }
                    className={cn(
                      "rounded-[3px] border px-2 py-1 text-caption transition-colors",
                      active
                        ? "border-accent-border bg-accent-soft text-accent"
                        : "border-border-subtle bg-bg-raised text-ink-secondary hover:text-ink-primary",
                    )}
                  >
                    {t(`itinerary.theme.${th}` as Parameters<typeof t>[0])}
                  </button>
                )
              })}
            </div>
          </FilterSection>
        </aside>

        {/* Results */}
        <div className="space-y-10">
          {/* Featured strip */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              <h2 className="text-label text-accent">{t("agency.browse.featured")}</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((it) => (
                <ItineraryCard
                  key={it.id}
                  itinerary={it}
                  href={`/agency/browse/${it.id}`}
                  mode="agency"
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-heading text-ink-primary">{t("agency.browse.title")}</h2>
              <span className="flex items-center gap-2 text-caption text-ink-tertiary">
                <Filter className="size-3.5" />
                {t("agency.browse.results", { count: filtered.length })}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((it) => (
                <ItineraryCard
                  key={it.id}
                  itinerary={it}
                  href={`/agency/browse/${it.id}`}
                  mode="agency"
                />
              ))}
            </div>
            {filtered.length === 0 ? (
              <p className="rounded-lg border border-border-subtle bg-bg-raised py-16 text-center text-ink-tertiary">
                {t("empty.bookings.title")}
              </p>
            ) : null}
          </section>

          {/* Beyond the catalog CTA */}
          <Link
            href="/agency/request/new"
            className="group/cta flex items-center justify-between gap-6 rounded-lg border border-dashed border-accent-border bg-accent-soft/30 px-6 py-5 transition-colors hover:border-accent hover:bg-accent-soft"
          >
            <div className="flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">
                <Lightbulb className="size-5" />
              </span>
              <div>
                <h3 className="text-subheading text-ink-primary">
                  {t("agency.browse.beyond_catalog")}
                </h3>
                <p className="mt-1 text-caption text-ink-secondary">
                  {t("agency.browse.beyond_catalog_sub")}
                </p>
              </div>
            </div>
            <ArrowRight className="size-5 text-accent transition-transform group-hover/cta:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-label text-ink-tertiary">{title}</h3>
      {children}
    </div>
  )
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-md px-3 py-1.5 text-left text-caption transition-colors",
        active
          ? "bg-accent-soft text-accent"
          : "text-ink-secondary hover:bg-bg-sunken/30 hover:text-ink-primary",
      )}
    >
      <span>{label}</span>
      {active ? <span className="size-1.5 rounded-full bg-accent" aria-hidden /> : null}
    </button>
  )
}

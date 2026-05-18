"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, RotateCcw, Save } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { itineraries } from "@/lib/mock/itineraries"
import { formatCurrency } from "@/lib/formatters/currency"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"
import { dmcs } from "@/lib/mock/dmcs"
import { cn } from "@/lib/utils"

export default function DMCPricingPage() {
  const { t, locale } = useTranslation()
  const { dmcId, pricingEdits, setPricingEdit } = useDemoState()
  const dmc = dmcs.find((d) => d.id === dmcId) ?? dmcs[0]
  const list = itineraries.filter((i) => i.dmcId === dmc.id)

  const seasonKey = (n: string): Parameters<typeof t>[0] => {
    if (n === "low") return "pricing.season.low"
    if (n === "peak") return "pricing.season.peak"
    if (n === "shoulder") return "pricing.season.shoulder"
    if (n === "school-holiday") return "pricing.season.school_holiday"
    return "pricing.season.year_round"
  }

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={dmc.name}
        title={t("nav.pricing")}
        subtitle={t("dmc.pricing.explanation_title")}
      />

      <div className="space-y-6 px-8 pt-8">
        {/* Model explanation banner */}
        <section className="rounded-lg border border-accent-border bg-accent-soft px-6 py-5">
          <div className="flex items-start gap-3">
            <BookOpen className="mt-0.5 size-4 shrink-0 text-accent" />
            <div className="space-y-2">
              <h2 className="text-subheading text-ink-primary">
                {t("dmc.pricing.explanation_title")}
              </h2>
              <p className="max-w-3xl text-caption text-ink-secondary leading-relaxed">
                {t("dmc.pricing.explanation_body")}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-caption">
                <Badge variant="neutral">{t("dmc.pricing.bands_label")}</Badge>
                <ArrowRight className="size-3 text-ink-tertiary" />
                <Badge variant="neutral">{t("dmc.pricing.seasons_label")}</Badge>
                <ArrowRight className="size-3 text-ink-tertiary" />
                <Badge variant="accent">{t("itinerary.margin.dmc_net")}</Badge>
                <ArrowRight className="size-3 text-ink-tertiary" />
                <span className="text-ink-tertiary">→ {t("nav.catalog")}</span>
              </div>
            </div>
          </div>
        </section>

        {list.map((it) => {
          const edit = pricingEdits[it.id]
          const hasEdits =
            !!edit &&
            (Object.keys(edit.perPaxOverrides).length > 0 ||
              Object.keys(edit.seasonMultiplierOverrides).length > 0)

          const getPerPax = (bandIdx: number, seasonIdx: number) => {
            const k = `${bandIdx}-${seasonIdx}`
            const override = edit?.perPaxOverrides[k]
            if (typeof override === "number") return override
            const band = it.pricing.bands[bandIdx]
            const season = it.pricing.seasons[seasonIdx]
            const multiplier = edit?.seasonMultiplierOverrides[seasonIdx] ?? season.multiplier
            return Math.round(band.perPaxUSD * multiplier)
          }

          return (
            <section
              key={it.id}
              className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised"
            >
              <header className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
                <div>
                  <Link
                    href={`/dmc/itineraries/${it.id}`}
                    className="text-subheading text-ink-primary transition-colors hover:text-accent"
                  >
                    {getLocalized(it.title, locale)}
                  </Link>
                  <p className="mt-0.5 flex items-center gap-2 text-caption text-ink-tertiary">
                    <span className="font-mono">{it.pricing.sourceCurrency}</span>
                    <span>·</span>
                    <span>{it.pricing.bands.length} bands × {it.pricing.seasons.length} seasons</span>
                    <span>·</span>
                    <span>
                      {t("dmc.pricing.single_supplement")} {formatCurrency(it.pricing.singleSupplementUSD, "USD", locale)}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {hasEdits ? (
                    <Badge variant="warning">{t("dmc.pricing.has_edits")}</Badge>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!hasEdits}
                    onClick={() => {
                      setPricingEdit(it.id, { perPaxOverrides: {}, seasonMultiplierOverrides: {} })
                      // Workaround: setPricingEdit merges, so we need to clear by setting all to undefined; instead replace via direct state
                      const { pricingEdits: cur } = useDemoState.getState()
                      const next = { ...cur }
                      delete next[it.id]
                      useDemoState.setState({ pricingEdits: next })
                      toast.success(t("toast.pricing.reset"))
                    }}
                  >
                    <RotateCcw className="size-3.5" />
                    {t("dmc.pricing.reset_overrides")}
                  </Button>
                  <Button
                    size="sm"
                    disabled={!hasEdits}
                    onClick={() => toast.success(t("toast.pricing.saved"))}
                  >
                    <Save className="size-3.5" />
                    {t("actions.save")}
                  </Button>
                </div>
              </header>

              {/* Season multiplier editor */}
              <div className="border-b border-border-subtle px-5 py-4">
                <p className="text-label text-ink-tertiary">
                  {t("dmc.pricing.seasons_label")}
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {it.pricing.seasons.map((s, sIdx) => {
                    const m =
                      edit?.seasonMultiplierOverrides[sIdx] ?? s.multiplier
                    return (
                      <div
                        key={sIdx}
                        className={cn(
                          "rounded-md border bg-bg-sunken/30 px-3 py-2.5",
                          edit?.seasonMultiplierOverrides[sIdx] !== undefined &&
                            "border-accent-border bg-accent-soft",
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant={s.multiplier > 1.2 ? "warning" : s.multiplier > 1 ? "info" : "neutral"}>
                            {t(seasonKey(s.name))}
                          </Badge>
                          <span className="text-[10px] font-mono text-ink-tertiary">
                            ×{m.toFixed(2)}
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-[11px] text-ink-tertiary">
                          {s.dateRange}
                        </p>
                        <input
                          type="number"
                          step="0.05"
                          value={m}
                          onChange={(e) =>
                            setPricingEdit(it.id, {
                              seasonMultiplierOverrides: {
                                [sIdx]: Number(e.target.value),
                              },
                            })
                          }
                          className="mt-2 h-7 w-full rounded border border-border-default bg-bg-raised px-2 text-data text-ink-primary outline-none focus:border-accent"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Bands × seasons matrix */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("dmc.pricing.bands_label")}</TableHead>
                    {it.pricing.seasons.map((s, idx) => (
                      <TableHead key={idx} className="text-right">
                        {t(seasonKey(s.name))}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {it.pricing.bands.map((b, bIdx) => (
                    <TableRow key={bIdx}>
                      <TableCell>
                        <p className="text-body text-ink-primary">{b.paxRange}</p>
                        <p className="text-caption text-ink-tertiary">
                          {b.minPax}–{b.maxPax === 99 ? "∞" : b.maxPax} {t("common.adults")}
                        </p>
                      </TableCell>
                      {it.pricing.seasons.map((_s, sIdx) => {
                        const k = `${bIdx}-${sIdx}`
                        const overridden = edit?.perPaxOverrides[k] !== undefined
                        const value = getPerPax(bIdx, sIdx)
                        return (
                          <TableCell key={sIdx} className="text-right">
                            <div className="flex justify-end">
                              <input
                                type="number"
                                value={value}
                                onChange={(e) =>
                                  setPricingEdit(it.id, {
                                    perPaxOverrides: {
                                      [k]: Number(e.target.value),
                                    },
                                  })
                                }
                                className={cn(
                                  "h-8 w-28 rounded border bg-transparent px-2 text-right text-data outline-none focus:border-accent",
                                  overridden
                                    ? "border-accent-border bg-accent-soft text-accent"
                                    : "border-border-subtle text-ink-primary",
                                )}
                              />
                            </div>
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
          )
        })}
      </div>
    </div>
  )
}

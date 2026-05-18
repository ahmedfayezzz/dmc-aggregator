"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { PageHeader } from "@/components/shared/page-header"
import { bookings } from "@/lib/mock/bookings"
import { rfqs } from "@/lib/mock/rfqs"
import { agencies } from "@/lib/mock/agencies"
import { itineraries } from "@/lib/mock/itineraries"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { formatCurrency } from "@/lib/formatters/currency"

const COLORS = ["#D4A65A", "#5E8FA8", "#7AAA8B", "#C25A3D", "#B58A3F"]

export default function WholesalerReportsPage() {
  const { t, locale } = useTranslation()

  const gmvByMonth = useMemo(() => {
    const map = new Map<string, number>()
    bookings.forEach((b) => {
      const d = new Date(b.createdAt)
      const k = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`
      map.set(k, (map.get(k) ?? 0) + b.totalAmountUSD)
    })
    return Array.from(map.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([month, gmv]) => ({ month, gmv }))
  }, [])

  const topAgencies = useMemo(() => {
    return [...agencies]
      .sort((a, b) => b.gmvCNY - a.gmvCNY)
      .slice(0, 5)
      .map((a) => ({
        name: getLocalized(a.name, locale).slice(0, 8),
        gmvUSD: Math.round(a.gmvCNY / 7.2),
        bookings: a.totalBookings,
      }))
  }, [locale])

  const topItineraries = useMemo(() => {
    const counts = new Map<string, number>()
    bookings.forEach((b) =>
      counts.set(b.itineraryId, (counts.get(b.itineraryId) ?? 0) + 1),
    )
    return [...counts.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => {
        const it = itineraries.find((i) => i.id === id)
        return {
          name: it ? getLocalized(it.title, locale).slice(0, 12) : id,
          bookings: count,
        }
      })
  }, [locale])

  const funnel = useMemo(() => {
    const total = rfqs.length + bookings.length
    const quoted = rfqs.filter((r) => r.state === "RFQ_QUOTED").length
    const bookedStates: Array<string> = ["BOOKING_PENDING", "CONFIRMED_PENDING_GUARANTEE", "CONFIRMED", "CONFIRMED_AMENDMENT_PENDING", "TRAVELLED", "SETTLED"]
    const booked = bookings.filter((b) => bookedStates.includes(b.state)).length
    const confirmedStates: Array<string> = ["CONFIRMED", "CONFIRMED_PENDING_GUARANTEE", "CONFIRMED_AMENDMENT_PENDING", "TRAVELLED", "SETTLED"]
    const confirmed = bookings.filter((b) => confirmedStates.includes(b.state)).length
    const travelled = bookings.filter((b) => b.state === "TRAVELLED" || b.state === "SETTLED").length
    return [
      { stage: t("charts.funnel.quote"), value: total },
      { stage: t("charts.funnel.quote"), value: quoted + booked },
      { stage: t("charts.funnel.book"), value: booked },
      { stage: t("charts.funnel.confirmed"), value: confirmed },
      { stage: t("charts.funnel.travelled"), value: travelled },
    ].filter((d, i, arr) => arr.findIndex((x) => x.stage === d.stage) === i)
  }, [t])

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={t("nav.reports")}
        title={t("wholesaler.reports.title")}
        subtitle={t("wholesaler.reports.subtitle")}
      />

      <div className="grid grid-cols-1 gap-6 px-8 pt-8 lg:grid-cols-2">
        <ChartCard title={t("reports.gmv_by_month")} subtitle={t("charts.gmv_axis_label")}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={gmvByMonth} margin={{ left: 12, right: 24, top: 12, bottom: 12 }}>
              <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--ink-tertiary)", fontSize: 11 }} stroke="var(--border-default)" />
              <YAxis tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} tick={{ fill: "var(--ink-tertiary)", fontSize: 11 }} stroke="var(--border-default)" />
              <Tooltip
                contentStyle={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)", borderRadius: 4, fontSize: 12 }}
                formatter={(v) => formatCurrency(Number(v), "USD", locale)}
              />
              <Line
                type="monotone"
                dataKey="gmv"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--accent)" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t("reports.top_agencies")} subtitle={t("charts.gmv_axis_label")}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topAgencies} margin={{ left: 12, right: 24, top: 12, bottom: 12 }}>
              <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "var(--ink-tertiary)", fontSize: 10 }} stroke="var(--border-default)" />
              <YAxis tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} tick={{ fill: "var(--ink-tertiary)", fontSize: 11 }} stroke="var(--border-default)" />
              <Tooltip
                contentStyle={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)", borderRadius: 4, fontSize: 12 }}
                formatter={(v) => formatCurrency(Number(v), "USD", locale)}
              />
              <Bar dataKey="gmvUSD" radius={[2, 2, 0, 0]}>
                {topAgencies.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t("reports.top_itineraries")} subtitle={t("charts.bookings_axis_label")}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topItineraries} layout="vertical" margin={{ left: 60, right: 24, top: 12, bottom: 12 }}>
              <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: "var(--ink-tertiary)", fontSize: 11 }} stroke="var(--border-default)" />
              <YAxis dataKey="name" type="category" tick={{ fill: "var(--ink-tertiary)", fontSize: 11 }} stroke="var(--border-default)" width={120} />
              <Tooltip contentStyle={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)", borderRadius: 4, fontSize: 12 }} />
              <Bar dataKey="bookings" radius={[0, 2, 2, 0]} fill="var(--info)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t("reports.conversion_funnel")}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={funnel} margin={{ left: 12, right: 24, top: 12, bottom: 12 }}>
              <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="stage" tick={{ fill: "var(--ink-tertiary)", fontSize: 11 }} stroke="var(--border-default)" />
              <YAxis tick={{ fill: "var(--ink-tertiary)", fontSize: 11 }} stroke="var(--border-default)" />
              <Tooltip contentStyle={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)", borderRadius: 4, fontSize: 12 }} />
              <Bar dataKey="value" radius={[2, 2, 0, 0]} fill="var(--accent)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-lg border border-border-subtle bg-bg-raised">
      <header className="border-b border-border-subtle px-5 py-4">
        <h3 className="text-subheading text-ink-primary">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-caption text-ink-tertiary">{subtitle}</p> : null}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

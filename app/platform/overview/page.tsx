"use client"

import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { wholesalers } from "@/lib/mock/wholesalers"
import { dmcs } from "@/lib/mock/dmcs"
import { agencies } from "@/lib/mock/agencies"
import { itineraries } from "@/lib/mock/itineraries"
import { bookings } from "@/lib/mock/bookings"
import { useTranslation } from "@/lib/i18n/provider"
import { formatCurrency } from "@/lib/formatters/currency"

export default function PlatformOverviewPage() {
  const { t, locale } = useTranslation()

  const totalGMV = wholesalers.reduce((s, w) => s + w.monthlyGMV_USD, 0)
  const trustedDMCs = dmcs.filter((d) => d.trustTier === "TRUSTED").length
  const totalAgencies = agencies.length
  const activeBookings = bookings.filter(
    (b) =>
      b.state !== "CANCELLED" &&
      b.state !== "SETTLED" &&
      b.state !== "TRAVELLED",
  ).length

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Safasoft"
        title={t("platform.overview.title")}
        subtitle={t("platform.overview.subtitle")}
      />

      <div className="space-y-10 px-8 pt-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label={t("metric.gmv")}
            value={formatCurrency(totalGMV, "USD", locale)}
            subtitle={t("booking.filter.this_month")}
            delta={{ value: 14.2, direction: "up" }}
          />
          <StatCard
            label={t("metric.wholesaler_count")}
            value={wholesalers.length.toString()}
            subtitle={`+ ${totalAgencies} ${t("nav.agencies").toLowerCase()}`}
            delta={{ value: 5, direction: "up" }}
          />
          <StatCard
            label={t("metric.dmc_count")}
            value={dmcs.length.toString()}
            subtitle={`${trustedDMCs} ${t("trust.TRUSTED").toLowerCase()}`}
          />
          <StatCard
            label={t("metric.itinerary_count")}
            value={itineraries.length.toString()}
            subtitle={`${activeBookings} active bookings`}
            delta={{ value: 6.8, direction: "up" }}
          />
        </div>

        <section className="rounded-lg border border-border-subtle bg-bg-raised">
          <header className="border-b border-border-subtle px-5 py-4">
            <h2 className="text-subheading text-ink-primary">
              {t("platform.overview.subtitle")}
            </h2>
          </header>
          <div className="grid grid-cols-1 gap-px bg-border-subtle md:grid-cols-3">
            <div className="bg-bg-raised px-5 py-5">
              <p className="text-label text-ink-tertiary">{t("nav.wholesalers")}</p>
              <p className="mt-2 text-display-md text-ink-primary">{wholesalers.length}</p>
              <p className="mt-1 text-caption text-ink-tertiary">Active tenants</p>
            </div>
            <div className="bg-bg-raised px-5 py-5">
              <p className="text-label text-ink-tertiary">{t("nav.dmcs")}</p>
              <p className="mt-2 text-display-md text-ink-primary">{dmcs.length}</p>
              <p className="mt-1 text-caption text-ink-tertiary">
                Across {Array.from(new Set(dmcs.map((d) => d.country))).join(" · ")}
              </p>
            </div>
            <div className="bg-bg-raised px-5 py-5">
              <p className="text-label text-ink-tertiary">{t("nav.bookings")}</p>
              <p className="mt-2 text-display-md text-ink-primary">{bookings.length}</p>
              <p className="mt-1 text-caption text-ink-tertiary">All-time</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

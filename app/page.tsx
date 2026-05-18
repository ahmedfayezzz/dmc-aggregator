"use client"

import { ArrowRight, Building2, Compass, ShieldCheck, Store } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LocaleSwitcher } from "@/components/shared/locale-switcher"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { useTranslation } from "@/lib/i18n/provider"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"

const personaEntries = [
  {
    key: "wholesaler" as const,
    icon: Building2,
    labelKey: "demo.enter_wholesaler",
    href: "/wholesaler/dashboard",
  },
  {
    key: "agency" as const,
    icon: Store,
    labelKey: "demo.enter_agency",
    href: "/agency/browse",
  },
  {
    key: "dmc" as const,
    icon: Compass,
    labelKey: "demo.enter_dmc",
    href: "/dmc/dashboard",
  },
  {
    key: "platform" as const,
    icon: ShieldCheck,
    labelKey: "demo.enter_platform",
    href: "/platform/overview",
  },
] as const

const sampleDate = new Date("2026-06-04")

export default function Home() {
  const { t, locale } = useTranslation()

  return (
    <main className="min-h-screen bg-bg-base text-ink-primary">
      <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-border-subtle bg-bg-raised/80 px-8 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="size-7 rounded-[3px] bg-accent" aria-hidden />
          <span className="text-label text-ink-secondary">{t("demo.title")}</span>
        </div>
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <section className="mx-auto flex max-w-5xl flex-col gap-12 px-8 pt-24 pb-16">
        <div className="flex flex-col gap-4">
          <span className="text-label text-accent">
            {t("demo.foundation_ready")}
          </span>
          <h1 className="text-display-xl text-ink-primary">
            {t("demo.font_test.display")}
          </h1>
          <p className="max-w-xl text-subheading text-ink-secondary">
            {t("demo.font_test.body")}
          </p>
          <p className="text-data text-ink-tertiary">
            {t("demo.font_test.data")} ·{" "}
            {formatCurrency(1_840_000, "CNY", locale)} ·{" "}
            {formatDate(sampleDate, locale)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <span className="text-label text-ink-tertiary">
                {t("demo.try_locale")}
              </span>
              <CardTitle className="text-heading">
                {t("locale.switcher.label")}
              </CardTitle>
              <CardDescription className="text-caption text-ink-secondary">
                {t("demo.foundation_subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">{t("status.confirmed")}</Badge>
                <Badge variant="warning">{t("status.booking_pending")}</Badge>
                <Badge variant="danger">{t("status.cancelled")}</Badge>
                <Badge variant="info">{t("status.rfq_submitted")}</Badge>
                <Badge variant="accent">
                  {t("status.confirmed_pending_guarantee")}
                </Badge>
                <Badge variant="neutral">{t("status.draft")}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <span className="text-label text-ink-tertiary">
                {t("demo.try_dark_mode")}
              </span>
              <CardTitle className="text-heading">
                {t("dashboard.kpi.gmv_this_month")}
              </CardTitle>
              <CardDescription className="text-caption text-ink-secondary">
                {t("dashboard.vs_last_month")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-display-md text-ink-primary">
                {formatCurrency(1_840_000, "CNY", locale)}
              </p>
              <p className="mt-1 text-caption text-success">↗ +12.4%</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-label text-ink-tertiary">
            {t("nav.dashboard")} · {t("nav.catalog")} · {t("nav.bookings")} ·{" "}
            {t("nav.rfqs")} · {t("nav.wallet")}
          </span>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {personaEntries.map((entry) => {
              const Icon = entry.icon
              return (
                <a
                  key={entry.key}
                  href={entry.href}
                  className="group flex items-center justify-between rounded-lg border border-border-subtle bg-bg-raised px-4 py-4 transition-colors hover:border-accent-border hover:bg-bg-sunken/30"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-4 text-ink-tertiary group-hover:text-accent" />
                    <span className="text-body text-ink-primary">
                      {t(entry.labelKey)}
                    </span>
                  </span>
                  <ArrowRight className="size-4 text-ink-quaternary transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                </a>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Button>{t("actions.book_now")}</Button>
          <Button variant="secondary">{t("actions.customize")}</Button>
          <Button variant="ghost">{t("actions.view_details")}</Button>
        </div>
      </section>
    </main>
  )
}

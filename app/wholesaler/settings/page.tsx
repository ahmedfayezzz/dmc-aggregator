"use client"

import { Save } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { wholesaler } from "@/lib/mock/wholesalers"

export default function WholesalerSettingsPage() {
  const { t, locale } = useTranslation()

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={t("nav.settings")}
        title={t("wholesaler.settings.title")}
        subtitle={getLocalized(wholesaler.legalName, locale)}
        actions={
          <Button size="sm" onClick={() => toast.success(t("toast.settings.saved"))}>
            <Save className="size-3.5" />
            {t("actions.save")}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 px-8 pt-8 lg:grid-cols-2">
        <SettingsCard title={t("wholesaler.settings.brand_section")}>
          <div className="flex items-center gap-6">
            <div
              className="grid size-20 place-items-center rounded-lg text-display-md font-light text-bg-base"
              style={{ background: "var(--brand-primary)" }}
              aria-hidden
            >
              {getLocalized(wholesaler.displayName, locale).slice(0, 1)}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-subheading text-ink-primary">
                {getLocalized(wholesaler.displayName, locale)}
              </p>
              <p className="text-caption text-ink-tertiary">
                {wholesaler.subdomain}.travelleap.com
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="size-4 rounded-sm border border-border-default" style={{ background: wholesaler.brand.primary }} />
                <span className="text-data text-ink-secondary">{wholesaler.brand.primary}</span>
                <span className="ml-3 size-4 rounded-sm border border-border-default" style={{ background: wholesaler.brand.accent }} />
                <span className="text-data text-ink-secondary">{wholesaler.brand.accent}</span>
              </div>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title={t("wholesaler.settings.markup_section")}>
          <div className="grid grid-cols-2 gap-4">
            <Field label={`${t("pricing.season.low")} %`} value="15" />
            <Field label={`${t("pricing.season.shoulder")} %`} value="20" />
            <Field label={`${t("pricing.season.peak")} %`} value="25" />
            <Field label={`${t("itinerary.theme.luxury")} %`} value="18" />
          </div>
        </SettingsCard>

        <SettingsCard title={t("wholesaler.settings.policy_section")}>
          <ul className="space-y-2 text-caption">
            <li className="flex justify-between text-ink-secondary">
              <span>≥ 60 {t("common.days")}</span>
              <span className="text-ink-primary">0%</span>
            </li>
            <li className="flex justify-between text-ink-secondary">
              <span>30–59 {t("common.days")}</span>
              <span className="text-ink-primary">25%</span>
            </li>
            <li className="flex justify-between text-ink-secondary">
              <span>15–29 {t("common.days")}</span>
              <span className="text-ink-primary">50%</span>
            </li>
            <li className="flex justify-between text-ink-secondary">
              <span>7–14 {t("common.days")}</span>
              <span className="text-ink-primary">75%</span>
            </li>
            <li className="flex justify-between text-ink-secondary">
              <span>0–6 {t("common.days")}</span>
              <span className="text-ink-primary">100%</span>
            </li>
          </ul>
        </SettingsCard>

        <SettingsCard title={t("wholesaler.settings.locale_section")}>
          <div className="flex items-center gap-2">
            <Button variant={locale === "zh-CN" ? "default" : "secondary"} size="sm">
              中文
            </Button>
            <Button variant={locale === "en" ? "default" : "secondary"} size="sm">
              English
            </Button>
          </div>
          <p className="mt-3 text-caption text-ink-tertiary">
            {t("common.optional")}
          </p>
        </SettingsCard>
      </div>
    </div>
  )
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border-subtle bg-bg-raised">
      <header className="border-b border-border-subtle px-5 py-4">
        <h2 className="text-subheading text-ink-primary">{title}</h2>
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-caption text-ink-tertiary">{label}</span>
      <Input defaultValue={value} className="h-9" />
    </label>
  )
}

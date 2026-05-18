"use client"

import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/i18n/provider"
import { useDemoState } from "@/lib/demo-state"
import { dmcs } from "@/lib/mock/dmcs"

export default function DMCSettingsPage() {
  const { t } = useTranslation()
  const { dmcId } = useDemoState()
  const dmc = dmcs.find((d) => d.id === dmcId) ?? dmcs[0]

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={dmc.name}
        title={t("dmc.settings.title")}
        subtitle={`${dmc.city}, ${dmc.country}`}
      />

      <div className="grid grid-cols-1 gap-6 px-8 pt-8 md:grid-cols-2">
        <section className="rounded-lg border border-border-subtle bg-bg-raised p-6 space-y-3">
          <h3 className="text-subheading text-ink-primary">{t("field.name")}</h3>
          <p className="text-body text-ink-primary">{dmc.name}</p>
          <p className="text-caption text-ink-tertiary">
            {dmc.city}, {dmc.country}
          </p>
          <p className="font-mono text-caption text-ink-secondary">{dmc.contact}</p>
        </section>

        <section className="rounded-lg border border-border-subtle bg-bg-raised p-6 space-y-3">
          <h3 className="text-subheading text-ink-primary">Trust Tier</h3>
          <Badge variant={dmc.trustTier === "TRUSTED" ? "accent" : dmc.trustTier === "VERIFIED" ? "info" : "neutral"}>
            {t(`trust.${dmc.trustTier}` as Parameters<typeof t>[0])}
          </Badge>
          <p className="text-caption text-ink-tertiary">
            Settlement: {dmc.settlementCurrency} · {dmc.paymentTermsDays} days
          </p>
        </section>
      </div>
    </div>
  )
}

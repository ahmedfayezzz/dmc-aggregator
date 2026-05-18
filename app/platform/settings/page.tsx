"use client"

import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/i18n/provider"

export default function PlatformSettingsPage() {
  const { t } = useTranslation()

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Travel Leap"
        title={t("platform.settings.title")}
        subtitle={t("common.coming_soon")}
      />

      <div className="grid grid-cols-1 gap-6 px-8 pt-8 md:grid-cols-2">
        <section className="rounded-lg border border-border-subtle bg-bg-raised p-6 space-y-3">
          <h3 className="text-subheading text-ink-primary">{t("platform.portal_label")}</h3>
          <p className="text-caption text-ink-tertiary">travelleap.com</p>
          <Badge variant="success">{t("common.production")}</Badge>
        </section>
      </div>
    </div>
  )
}

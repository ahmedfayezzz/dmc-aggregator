"use client"

import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"
import { agencies } from "@/lib/mock/agencies"
import { wholesaler } from "@/lib/mock/wholesalers"

export default function AgencySettingsPage() {
  const { t, locale } = useTranslation()
  const { agencyId } = useDemoState()
  const agency = agencies.find((a) => a.id === agencyId) ?? agencies[0]

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={agency.licenseNumber}
        title={t("nav.settings")}
        subtitle={getLocalized(agency.name, locale)}
      />

      <div className="grid grid-cols-1 gap-6 px-8 pt-8 md:grid-cols-2">
        <section className="rounded-lg border border-border-subtle bg-bg-raised p-6 space-y-3">
          <h3 className="text-subheading text-ink-primary">{t("field.contact")}</h3>
          <div>
            <p className="text-body text-ink-primary">
              {getLocalized(agency.contactName, locale)}
            </p>
            <p className="text-caption text-ink-tertiary">
              {getLocalized(agency.contactRole, locale)}
            </p>
          </div>
          <p className="text-caption text-ink-secondary">
            {getLocalized(agency.location, locale)}
          </p>
        </section>

        <section className="rounded-lg border border-border-subtle bg-bg-raised p-6 space-y-3">
          <h3 className="text-subheading text-ink-primary">{t("brand.ubtrip.full")}</h3>
          <p className="text-caption text-ink-tertiary">
            {t("wholesaler.portal_label")} · {getLocalized(wholesaler.legalName, locale)}
          </p>
          <Badge variant="success">{t("wholesaler.agencies.contract_signed")}</Badge>
        </section>
      </div>
    </div>
  )
}

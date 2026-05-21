"use client"

import Link from "next/link"
import { ArrowRight, SlidersHorizontal } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/i18n/provider"
import { useDemoState } from "@/lib/demo-state"

export default function PlatformSettingsPage() {
  const { t } = useTranslation()
  const { platformRules } = useDemoState()

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Safasoft DMC"
        title={t("platform.settings.title")}
      />

      <div className="grid grid-cols-1 gap-6 px-8 pt-8 md:grid-cols-2">
        {/* Rules card — primary action */}
        <Link
          href="/platform/settings/rules"
          className="group/rules flex flex-col rounded-lg border border-accent-border bg-accent-soft/30 transition-colors hover:border-accent hover:bg-accent-soft"
        >
          <header className="flex items-center gap-3 border-b border-accent-border/60 px-5 py-4">
            <span className="grid size-8 place-items-center rounded-md bg-accent text-white">
              <SlidersHorizontal className="size-4" />
            </span>
            <h2 className="flex-1 text-subheading text-ink-primary">
              {t("rules.page.title.platform")}
            </h2>
            <ArrowRight className="size-4 text-accent transition-transform group-hover/rules:translate-x-1" />
          </header>
          <div className="p-5 text-caption text-ink-secondary">
            <p>{t("rules.page.subtitle.platform", { count: platformRules.length })}</p>
            <p className="mt-3 text-ink-tertiary">
              Open the rule editor to view, reorder, enable/disable, or test rules.
            </p>
          </div>
        </Link>

        <section className="rounded-lg border border-border-subtle bg-bg-raised p-6 space-y-3">
          <h3 className="text-subheading text-ink-primary">{t("platform.portal_label")}</h3>
          <p className="text-caption text-ink-tertiary">safasoft.com</p>
          <Badge variant="success">{t("common.production")}</Badge>
        </section>
      </div>
    </div>
  )
}

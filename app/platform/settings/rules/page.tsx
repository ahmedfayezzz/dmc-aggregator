"use client"

import Link from "next/link"
import { ArrowLeft, ShieldAlert } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { RuleEditor } from "@/components/shared/rule-editor"
import { RuleTester } from "@/components/shared/rule-tester"
import { useDemoState } from "@/lib/demo-state"
import { useTranslation } from "@/lib/i18n/provider"

export default function PlatformRulesPage() {
  const { t } = useTranslation()
  const { platformRules } = useDemoState()

  return (
    <div className="pb-24">
      <div className="border-b border-border-subtle px-8 pt-8 pb-2">
        <Link
          href="/platform/settings"
          className="inline-flex items-center gap-2 text-caption text-ink-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          {t("nav.settings")}
        </Link>
      </div>

      <PageHeader
        eyebrow={t("nav.rules")}
        title={t("rules.page.title.platform")}
        subtitle={t("rules.page.subtitle.platform", { count: platformRules.length })}
      />

      <div className="grid grid-cols-1 gap-8 px-8 pt-8 lg:grid-cols-[1fr_360px]">
        <RuleEditor scope="platform" wholesalerId={null} rules={platformRules} />

        <aside className="space-y-6 lg:sticky lg:top-[80px] lg:self-start">
          <RuleTester rules={platformRules} />

          <section className="rounded-lg border border-warning/30 bg-warning-soft/40 p-5">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" />
              <div className="text-caption text-ink-secondary">
                <p className="font-medium text-ink-primary">First match wins</p>
                <p className="mt-1">
                  Rules apply network-wide across all wholesalers and suppliers. Each wholesaler also has their
                  own rule set that stacks on top of DMC&apos;s. Reorder rules with the up/down arrows.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

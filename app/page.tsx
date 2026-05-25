"use client"

import Link from "next/link"
import { ArrowRight, Building2, Compass, ShieldCheck, Store } from "lucide-react"
import { LocaleSwitcher } from "@/components/shared/locale-switcher"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { useTranslation } from "@/lib/i18n/provider"

// Ordered to mirror the request flow:
//   agency → wholesaler → DMC (platform) → supplier (dmc)
const personaEntries = [
  {
    key: "agency" as const,
    icon: Store,
    labelKey: "demo.enter_agency",
    subtitleKey: "landing.persona.agency.subtitle",
    href: "/agency/browse",
  },
  {
    key: "wholesaler" as const,
    icon: Building2,
    labelKey: "demo.enter_wholesaler",
    subtitleKey: "landing.persona.wholesaler.subtitle",
    href: "/wholesaler/dashboard",
  },
  {
    key: "platform" as const,
    icon: ShieldCheck,
    labelKey: "demo.enter_platform",
    subtitleKey: "landing.persona.platform.subtitle",
    href: "/platform/overview",
  },
  {
    key: "dmc" as const,
    icon: Compass,
    labelKey: "demo.enter_dmc",
    subtitleKey: "landing.persona.dmc.subtitle",
    href: "/dmc/dashboard",
  },
] as const

export default function Home() {
  const { t } = useTranslation()

  return (
    <main className="flex min-h-screen flex-col bg-bg-base text-ink-primary">
      {/* Minimal header — brand + locale/theme controls */}
      <header className="flex h-[60px] items-center justify-between border-b border-border-subtle bg-bg-raised/80 px-8 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="size-7 rounded-[3px] bg-accent" aria-hidden />
          <span className="text-label text-ink-secondary">{t("demo.title")}</span>
        </div>
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* Persona grid centered vertically + horizontally */}
      <section className="flex flex-1 items-center justify-center px-8 py-16">
        <div className="w-full max-w-3xl">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {personaEntries.map((entry) => {
              const Icon = entry.icon
              return (
                <li key={entry.key}>
                  <Link
                    href={entry.href}
                    className="group/persona flex h-full flex-col gap-4 rounded-lg border border-border-subtle bg-bg-raised p-6 transition-colors hover:border-accent-border hover:bg-accent-soft/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid size-10 place-items-center rounded-md bg-accent-soft text-accent transition-colors group-hover/persona:bg-accent group-hover/persona:text-bg-base">
                        <Icon className="size-5" />
                      </span>
                      <ArrowRight className="size-4 text-ink-tertiary transition-all group-hover/persona:translate-x-1 group-hover/persona:text-accent" />
                    </div>
                    <div className="space-y-1.5">
                      <h2 className="text-subheading text-ink-primary">
                        {t(entry.labelKey)}
                      </h2>
                      <p className="text-caption text-ink-secondary">
                        {t(entry.subtitleKey)}
                      </p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </main>
  )
}

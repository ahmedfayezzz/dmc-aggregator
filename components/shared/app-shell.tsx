"use client"

import type { ComponentType, ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { LocaleSwitcher } from "./locale-switcher"
import { ThemeToggle } from "./theme-toggle"
import { useTranslation } from "@/lib/i18n/provider"
import { cn } from "@/lib/utils"

export type NavItem = {
  href: string
  labelKey: Parameters<ReturnType<typeof useTranslation>["t"]>[0]
  icon: ComponentType<{ className?: string }>
}

export type NavSection = {
  items: NavItem[]
  footer?: boolean
}

export function AppShell({
  tenant,
  portalLabelKey,
  brandText,
  brandHref,
  navSections,
  showSearch = true,
  children,
}: {
  tenant?: string
  portalLabelKey: Parameters<ReturnType<typeof useTranslation>["t"]>[0]
  brandText: string
  brandHref: string
  navSections: NavSection[]
  showSearch?: boolean
  children: ReactNode
}) {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen w-full bg-bg-base" data-tenant={tenant}>
      <aside className="sticky top-0 z-20 hidden h-screen w-[240px] shrink-0 border-r border-border-subtle bg-bg-base lg:flex lg:flex-col">
        <Link
          href={brandHref}
          className="flex h-[60px] items-center gap-3 border-b border-border-subtle px-6"
        >
          <span
            className="grid size-7 place-items-center rounded-[3px] text-[10px] font-medium text-bg-base"
            style={{ background: "var(--brand-primary)" }}
            aria-hidden
          >
            {brandText.slice(0, 1)}
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-body text-ink-primary">{brandText}</span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-ink-tertiary">
              {t(portalLabelKey)}
            </span>
          </span>
        </Link>

        <nav className="flex flex-1 flex-col justify-between overflow-y-auto py-4">
          {navSections.map((section, idx) => (
            <SidebarSection
              key={idx}
              section={section}
              className={section.footer ? "mt-auto border-t border-border-subtle pt-4" : ""}
            />
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between gap-6 border-b border-border-subtle bg-bg-raised/80 px-8 backdrop-blur">
          {showSearch ? (
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-tertiary" />
              <Input
                placeholder={t("actions.search")}
                className="h-9 border-border-subtle bg-bg-sunken/40 pl-9 placeholder:text-ink-tertiary"
              />
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <div className="flex items-center gap-1">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

function SidebarSection({
  section,
  className,
}: {
  section: NavSection
  className?: string
}) {
  const pathname = usePathname()
  const { t } = useTranslation()

  return (
    <ul className={cn("flex flex-col gap-0.5 px-3", className)}>
      {section.items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/")
        const Icon = item.icon
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "group/nav relative flex h-10 items-center gap-3 rounded-md px-3 text-body transition-colors",
                active
                  ? "bg-accent-soft text-ink-primary"
                  : "text-ink-secondary hover:bg-bg-sunken/30 hover:text-ink-primary",
              )}
            >
              {active ? (
                <span
                  className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-sm bg-accent"
                  aria-hidden
                />
              ) : null}
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  active ? "text-accent" : "text-ink-tertiary group-hover/nav:text-ink-secondary",
                )}
              />
              <span>{t(item.labelKey)}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

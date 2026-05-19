"use client"

import { Building2, Check, ChevronsUpDown, Compass, ShieldCheck, Store } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { wholesaler } from "@/lib/mock/wholesalers"
import { agencies } from "@/lib/mock/agencies"
import { dmcs } from "@/lib/mock/dmcs"
import { useDemoState, personaHome, type Persona } from "@/lib/demo-state"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { cn } from "@/lib/utils"

const personaMeta: Record<Persona, { icon: typeof Building2; labelKey: "demo.enter_wholesaler" | "demo.enter_agency" | "demo.enter_dmc" | "demo.enter_platform" }> = {
  wholesaler: { icon: Building2, labelKey: "demo.enter_wholesaler" },
  agency:     { icon: Store,     labelKey: "demo.enter_agency" },
  dmc:        { icon: Compass,   labelKey: "demo.enter_dmc" },
  platform:   { icon: ShieldCheck, labelKey: "demo.enter_platform" },
}

/**
 * PersonaSwitcher
 * - `variant="sidebar"` (default): renders as a sidebar-footer item (full-width, no shadow/positioning)
 * - `variant="floating"`: renders as fixed bottom-right (used on screens without an AppShell, e.g. /)
 */
export function PersonaSwitcher({
  variant = "sidebar",
  className,
}: {
  variant?: "sidebar" | "floating"
  className?: string
}) {
  const router = useRouter()
  const { t, locale } = useTranslation()
  const { persona, setPersona, agencyId, dmcId } = useDemoState()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const switchTo = (p: Persona) => {
    setPersona(p)
    router.push(personaHome[p])
  }

  const currentAgency = agencies.find((a) => a.id === agencyId) ?? agencies[0]
  const currentDMC = dmcs.find((d) => d.id === dmcId) ?? dmcs[0]

  const entityFor: Record<Persona, string> = {
    wholesaler: `张经理 · ${getLocalized(wholesaler.displayName, locale)}`,
    agency:     `${getLocalized(currentAgency.contactName, locale)} · ${getLocalized(currentAgency.name, locale)}`,
    dmc:        currentDMC.name,
    platform:   "Safasoft",
  }

  const Icon = personaMeta[persona].icon

  const triggerClass =
    variant === "floating"
      ? "group flex items-center gap-3 rounded-lg border border-border-default bg-bg-raised/90 px-4 py-3 shadow-lg backdrop-blur transition-all hover:border-accent-border"
      : "group flex w-full items-center gap-3 rounded-md border border-border-subtle bg-bg-sunken/40 px-3 py-2.5 text-left transition-colors hover:border-border-default hover:bg-bg-sunken/70"

  const wrapperClass =
    variant === "floating"
      ? cn("fixed bottom-6 right-6 z-50", className)
      : cn("w-full", className)

  return (
    <div className={wrapperClass}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={triggerClass}
            aria-label={t("nav.settings")}
          >
            <Icon className="size-4 shrink-0 text-accent" />
            <div className="flex min-w-0 flex-1 flex-col items-start text-left">
              <span className="text-[10px] uppercase tracking-[0.16em] text-ink-tertiary">
                {t(personaMeta[persona].labelKey)}
              </span>
              <span className="truncate text-caption text-ink-primary max-w-full">
                {entityFor[persona]}
              </span>
            </div>
            <ChevronsUpDown className="size-3.5 shrink-0 text-ink-tertiary" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={variant === "sidebar" ? "start" : "end"}
          side={variant === "sidebar" ? "right" : "top"}
          className="min-w-[260px]"
        >
          {(Object.keys(personaMeta) as Persona[]).map((p) => {
            const M = personaMeta[p].icon
            const active = p === persona
            return (
              <DropdownMenuItem
                key={p}
                onClick={() => switchTo(p)}
                className={cn("flex items-start gap-3 py-3", active && "bg-bg-sunken/40")}
              >
                <M className={cn("mt-0.5 size-4", active ? "text-accent" : "text-ink-tertiary")} />
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-body text-ink-primary">{t(personaMeta[p].labelKey)}</span>
                  <span className="text-caption text-ink-tertiary">
                    {p === "wholesaler" && `张经理 · ${getLocalized(wholesaler.displayName, locale)}`}
                    {p === "agency"     && `${getLocalized(currentAgency.contactName, locale)} · ${getLocalized(currentAgency.name, locale)}`}
                    {p === "dmc"        && currentDMC.name}
                    {p === "platform"   && "Safasoft"}
                  </span>
                </div>
                {active ? <Check className="size-4 text-accent" /> : null}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

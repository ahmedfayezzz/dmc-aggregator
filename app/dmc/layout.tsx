"use client"

import { useEffect } from "react"
import {
  CalendarRange,
  ClipboardList,
  Compass,
  Inbox,
  LayoutDashboard,
  Map,
  Receipt,
  Settings,
  Tag,
} from "lucide-react"
import { AppShell, type NavSection } from "@/components/shared/app-shell"
import { useTranslation } from "@/lib/i18n/provider"
import { useDemoState } from "@/lib/demo-state"
import { dmcs } from "@/lib/mock/dmcs"
import { PORTAL_DEFAULTS, LOCALE_STORAGE_KEY } from "@/lib/i18n/config"

export default function DMCLayout({ children }: { children: React.ReactNode }) {
  const { setLocale } = useTranslation()
  const { dmcId } = useDemoState()
  const dmc = dmcs.find((d) => d.id === dmcId) ?? dmcs[0]

  useEffect(() => {
    if (!window.localStorage.getItem(LOCALE_STORAGE_KEY)) {
      setLocale(PORTAL_DEFAULTS.dmc)
    }
  }, [setLocale])

  const sections: NavSection[] = [
    {
      items: [
        { href: "/dmc/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
        { href: "/dmc/itineraries", labelKey: "nav.itineraries", icon: Map },
        { href: "/dmc/schedules", labelKey: "nav.schedules", icon: CalendarRange },
        { href: "/dmc/pricing", labelKey: "nav.pricing", icon: Tag },
        { href: "/dmc/allotments", labelKey: "nav.allotments", icon: ClipboardList },
        { href: "/dmc/bookings", labelKey: "nav.bookings", icon: Compass },
        { href: "/dmc/rfqs", labelKey: "nav.requests", icon: Inbox },
        { href: "/dmc/statements", labelKey: "nav.statements", icon: Receipt },
      ],
    },
    {
      footer: true,
      items: [
        { href: "/dmc/settings", labelKey: "nav.settings", icon: Settings },
      ],
    },
  ]

  return (
    <AppShell
      portalLabelKey="dmc.portal_label"
      brandText={dmc.name}
      brandHref="/dmc/dashboard"
      navSections={sections}
    >
      {children}
    </AppShell>
  )
}

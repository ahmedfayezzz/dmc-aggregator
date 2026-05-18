"use client"

import { useEffect } from "react"
import {
  Building2,
  Compass,
  LayoutDashboard,
  PackageSearch,
  Settings,
} from "lucide-react"
import { AppShell, type NavSection } from "@/components/shared/app-shell"
import { useTranslation } from "@/lib/i18n/provider"
import { PORTAL_DEFAULTS, LOCALE_STORAGE_KEY } from "@/lib/i18n/config"

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const { setLocale } = useTranslation()

  useEffect(() => {
    if (!window.localStorage.getItem(LOCALE_STORAGE_KEY)) {
      setLocale(PORTAL_DEFAULTS.platform)
    }
  }, [setLocale])

  const sections: NavSection[] = [
    {
      items: [
        { href: "/platform/overview", labelKey: "nav.overview", icon: LayoutDashboard },
        { href: "/platform/wholesalers", labelKey: "nav.wholesalers", icon: Building2 },
        { href: "/platform/dmcs", labelKey: "nav.dmcs", icon: Compass },
        { href: "/platform/supply", labelKey: "nav.supply", icon: PackageSearch },
      ],
    },
    {
      footer: true,
      items: [{ href: "/platform/settings", labelKey: "nav.settings", icon: Settings }],
    },
  ]

  return (
    <AppShell
      portalLabelKey="platform.portal_label"
      brandText="Travel Leap"
      brandHref="/platform/overview"
      navSections={sections}
    >
      {children}
    </AppShell>
  )
}

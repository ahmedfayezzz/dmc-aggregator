"use client"

import {
  BarChart3,
  Building2,
  CalendarRange,
  Inbox,
  LayoutDashboard,
  Mailbox,
  PackageSearch,
  Settings,
  SlidersHorizontal,
} from "lucide-react"
import { AppShell, type NavSection } from "@/components/shared/app-shell"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { wholesaler } from "@/lib/mock/wholesalers"

export default function WholesalerLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useTranslation()

  const sections: NavSection[] = [
    {
      items: [
        { href: "/wholesaler/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
        { href: "/wholesaler/agencies", labelKey: "nav.agencies", icon: Building2 },
        { href: "/wholesaler/catalog", labelKey: "nav.catalog", icon: PackageSearch },
        { href: "/wholesaler/bookings", labelKey: "nav.bookings", icon: CalendarRange },
        { href: "/wholesaler/rfqs", labelKey: "nav.rfqs", icon: Mailbox },
        { href: "/wholesaler/requests", labelKey: "nav.requests", icon: Inbox },
        { href: "/wholesaler/reports", labelKey: "nav.reports", icon: BarChart3 },
      ],
    },
    {
      footer: true,
      items: [
        { href: "/wholesaler/settings/rules", labelKey: "nav.rules", icon: SlidersHorizontal },
        { href: "/wholesaler/settings", labelKey: "nav.settings", icon: Settings },
      ],
    },
  ]

  return (
    <AppShell
      tenant="ubtrip"
      portalLabelKey="wholesaler.portal_label"
      brandText={getLocalized(wholesaler.displayName, locale)}
      brandHref="/wholesaler/dashboard"
      navSections={sections}
    >
      {children}
    </AppShell>
  )
}

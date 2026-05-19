"use client"

import {
  Bookmark,
  Compass,
  Settings,
  ShoppingBag,
  Wallet,
} from "lucide-react"
import { AppShell, type NavSection } from "@/components/shared/app-shell"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { wholesaler } from "@/lib/mock/wholesalers"

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useTranslation()

  const sections: NavSection[] = [
    {
      items: [
        { href: "/agency/browse", labelKey: "nav.browse", icon: Compass },
        { href: "/agency/bookings", labelKey: "nav.my_bookings", icon: ShoppingBag },
        { href: "/agency/quotes", labelKey: "nav.quotes", icon: Bookmark },
        { href: "/agency/wallet", labelKey: "nav.wallet", icon: Wallet },
      ],
    },
    {
      footer: true,
      items: [{ href: "/agency/settings", labelKey: "nav.settings", icon: Settings }],
    },
  ]

  return (
    <AppShell
      tenant="ubtrip"
      portalLabelKey="agency.portal_label"
      brandText={getLocalized(wholesaler.displayName, locale)}
      brandHref="/agency/browse"
      navSections={sections}
      showSearch={false}
    >
      {children}
    </AppShell>
  )
}

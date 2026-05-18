"use client"

import { Check, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n/config"
import { useTranslation } from "@/lib/i18n/provider"
import { cn } from "@/lib/utils"

export function LocaleSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("gap-2", className)}>
          <Globe className="size-4" />
          <span className="text-data">{LOCALE_LABELS[locale].native}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLocale(l)}
            className="flex items-center justify-between gap-3"
          >
            <span>{LOCALE_LABELS[l].native}</span>
            {locale === l ? <Check className="size-4 text-accent" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

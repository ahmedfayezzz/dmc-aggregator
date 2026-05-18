import type { CurrencyCode } from "@/lib/types"
import type { Locale } from "@/lib/i18n/config"

const intlLocale: Record<Locale, string> = {
  "zh-CN": "zh-CN",
  en: "en-US",
}

export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  locale: Locale,
  options?: { compact?: boolean },
): string {
  return new Intl.NumberFormat(intlLocale[locale], {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: options?.compact ? "compact" : "standard",
  }).format(amount)
}

import type { Locale } from "@/lib/i18n/config"

export function formatDuration(
  days: number,
  nights: number,
  locale: Locale,
): string {
  return locale === "zh-CN" ? `${days}天${nights}晚` : `${days}D${nights}N`
}

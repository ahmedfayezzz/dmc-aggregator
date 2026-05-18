import type { Locale } from "@/lib/i18n/config"

type DateFormat = "long" | "short" | "iso"

const ZH_WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"]

export function formatDate(
  date: Date | string,
  locale: Locale,
  format: DateFormat = "long",
): string {
  const d = typeof date === "string" ? new Date(date) : date

  if (format === "iso") return d.toISOString().split("T")[0]

  if (locale === "zh-CN") {
    const y = d.getFullYear()
    const m = d.getMonth() + 1
    const day = d.getDate()
    const weekday = ZH_WEEKDAYS[d.getDay()]
    return format === "long"
      ? `${y}年${m}月${day}日 周${weekday}`
      : `${m}月${day}日`
  }

  return d.toLocaleDateString(
    "en-US",
    format === "long"
      ? { year: "numeric", month: "short", day: "numeric", weekday: "short" }
      : { month: "short", day: "numeric" },
  )
}

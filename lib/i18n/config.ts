export const LOCALES = ["zh-CN", "en"] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "zh-CN"

export const LOCALE_LABELS: Record<Locale, { native: string; en: string }> = {
  "zh-CN": { native: "中文", en: "Chinese" },
  en: { native: "English", en: "English" },
}

export const PORTAL_DEFAULTS = {
  wholesaler: "zh-CN",
  agency: "zh-CN",
  dmc: "en",
  platform: "en",
} as const satisfies Record<string, Locale>

export const LOCALE_STORAGE_KEY = "dmc-aggregator:locale"

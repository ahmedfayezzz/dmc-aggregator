import type { Locale } from "./config"

export type Localized<T = string> = {
  "zh-CN": T
  en: T
}

export function getLocalized<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value.en
}

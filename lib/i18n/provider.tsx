"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, type Locale } from "./config"
import { zhCN, type TranslationKey } from "./zh-CN"
import { en } from "./en"

const dictionaries = { "zh-CN": zhCN, en } as const

type TranslateFn = (
  key: TranslationKey,
  params?: Record<string, string | number>,
) => string

type I18nContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: TranslateFn
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale?: Locale
  children: ReactNode
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE)

  // On mount, hydrate from localStorage if user has a stored preference
  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
    if (stored && stored in dictionaries) {
      setLocaleState(stored)
    }
  }, [])

  // Mirror locale to <html lang> and localStorage on change
  useEffect(() => {
    document.documentElement.lang = locale
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }, [locale])

  const t: TranslateFn = (key, params) => {
    let str: string = dictionaries[locale][key] ?? key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(`{${k}}`, String(v))
      }
    }
    return str
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale: setLocaleState, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error("useTranslation must be used within a LocaleProvider")
  }
  return ctx
}

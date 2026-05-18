"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/provider"
import { cn } from "@/lib/utils"

const THEME_STORAGE_KEY = "dmc-aggregator:theme"

type Theme = "dark" | "light"

export function ThemeToggle({ className }: { className?: string }) {
  const { t } = useTranslation()
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    if (stored === "light" || stored === "dark") {
      setTheme(stored)
      document.documentElement.classList.toggle("dark", stored === "dark")
    }
  }, [])

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark"
    setTheme(next)
    document.documentElement.classList.toggle("dark", next === "dark")
    window.localStorage.setItem(THEME_STORAGE_KEY, next)
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      aria-label={t("actions.toggle_theme")}
      className={cn(className)}
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}

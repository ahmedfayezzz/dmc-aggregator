"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "@/lib/i18n/provider"
import { cn } from "@/lib/utils"

function formatRemaining(ms: number): { text: string; tone: "ink" | "warning" | "danger" | "expired" } {
  if (ms <= 0) return { text: "00:00:00", tone: "expired" }
  const total = Math.floor(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => n.toString().padStart(2, "0")
  const hh = h.toString().padStart(2, "0")
  let tone: "ink" | "warning" | "danger" = "ink"
  if (ms < 4 * 3600_000) tone = "danger"
  else if (ms < 12 * 3600_000) tone = "warning"
  return { text: `${hh}:${pad(m)}:${pad(s)}`, tone }
}

export function SLATimer({
  expiresAt,
  className,
}: {
  expiresAt: string
  className?: string
}) {
  const { t } = useTranslation()
  // Render a stable placeholder during SSR + first client paint to avoid hydration mismatch.
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  if (now === null) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 text-data text-ink-tertiary",
          className,
        )}
      >
        <span className="size-1.5 rounded-full bg-current" aria-hidden />
        --:--:--
      </span>
    )
  }

  const ms = new Date(expiresAt).getTime() - now
  const { text, tone } = formatRemaining(ms)

  if (tone === "expired") {
    return (
      <span className={cn("inline-flex items-center gap-2 text-data", className)}>
        <span className="text-danger">{t("rfq.sla.overdue")}</span>
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-data",
        tone === "danger" && "text-danger",
        tone === "warning" && "text-warning",
        tone === "ink" && "text-ink-secondary",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {text}
    </span>
  )
}

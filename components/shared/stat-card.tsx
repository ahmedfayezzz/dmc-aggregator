"use client"

import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Direction = "up" | "down" | "flat"

export function StatCard({
  label,
  value,
  subtitle,
  delta,
  className,
}: {
  label: string
  value: string
  subtitle?: string
  delta?: { value: number; direction: Direction; suffix?: string }
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border-subtle bg-bg-raised p-6",
        className,
      )}
    >
      <p className="text-label text-ink-tertiary">{label}</p>
      <p className="text-display-md text-ink-primary">{value}</p>
      {subtitle ? <p className="text-caption text-ink-tertiary">{subtitle}</p> : null}
      {delta ? (
        <p
          className={cn(
            "flex items-center gap-1 text-caption",
            delta.direction === "up" && "text-success",
            delta.direction === "down" && "text-danger",
            delta.direction === "flat" && "text-ink-tertiary",
          )}
        >
          {delta.direction === "up" ? (
            <ArrowUpRight className="size-3.5" />
          ) : delta.direction === "down" ? (
            <ArrowDownRight className="size-3.5" />
          ) : null}
          {delta.direction === "up" ? "+" : delta.direction === "down" ? "−" : ""}
          {Math.abs(delta.value)}%{delta.suffix ? ` ${delta.suffix}` : ""}
        </p>
      ) : null}
    </div>
  )
}

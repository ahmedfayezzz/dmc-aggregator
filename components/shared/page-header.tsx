import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}) {
  return (
    <header
      className={cn(
        "border-b border-border-subtle px-8 pt-10 pb-6",
        className,
      )}
    >
      <div className="flex items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          {eyebrow ? (
            <span className="text-label text-ink-tertiary">{eyebrow}</span>
          ) : null}
          <h1 className="text-display-md text-ink-primary">{title}</h1>
          {subtitle ? (
            <p className="text-body text-ink-secondary">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-[3px] border px-2 py-0 text-[13px] leading-none font-medium whitespace-nowrap transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "border-accent-border bg-accent-soft text-accent",
        success:
          "border-success/30 bg-success-soft text-success",
        warning:
          "border-warning/30 bg-warning-soft text-warning",
        danger:
          "border-danger/30 bg-danger-soft text-danger",
        info:
          "border-info/30 bg-info-soft text-info",
        accent:
          "border-accent-border bg-accent-soft text-accent",
        neutral:
          "border-border-default bg-bg-sunken text-ink-secondary",
        outline:
          "border-border-default bg-transparent text-ink-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

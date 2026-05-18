"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { Check, ChevronRight, ChevronLeft, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { findItinerary } from "@/lib/mock"
import { agencies } from "@/lib/mock/agencies"
import { formatCurrency } from "@/lib/formatters/currency"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"
import { cn } from "@/lib/utils"

type Step = "review" | "pax" | "confirm" | "success"

export default function AgencyBookPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const itinerary = findItinerary(id)
  const { t, locale } = useTranslation()
  const {
    bookingDraft,
    agencyId,
    resetBookingDraft,
    agencyWalletDeltas,
    deductAgencyWallet,
  } = useDemoState()
  const [step, setStep] = useState<Step>("review")
  const [animateBalance, setAnimateBalance] = useState(false)

  if (!itinerary) notFound()

  const agency = agencies.find((a) => a.id === agencyId) ?? agencies[0]
  const currentBalance = agency.walletBalanceCNY + (agencyWalletDeltas[agency.id] ?? 0)
  const adults = bookingDraft.adults || 2
  const children = bookingDraft.children || 0
  const pricePerPax = itinerary.marginLayers.agencyRetailUSD
  const totalUSD = pricePerPax * adults + Math.round(pricePerPax * 0.7) * children
  const totalCNY = Math.round(totalUSD * 7.2)
  const newBalance = currentBalance - totalCNY

  const confirm = () => {
    setAnimateBalance(true)
    deductAgencyWallet(agency.id, totalCNY)
    setTimeout(() => {
      setStep("success")
    }, 600)
  }

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={getLocalized(itinerary.title, locale)}
        title={
          step === "review"
            ? t("agency.book.review_title")
            : step === "pax"
              ? t("agency.book.pax_title")
              : step === "confirm"
                ? t("agency.book.confirm_title")
                : t("booking.success.title")
        }
      />

      <div className="mx-auto max-w-3xl px-8 pt-8">
        {/* Steps strip */}
        {step !== "success" ? (
          <div className="mb-8 flex items-center justify-between">
            {(["review", "pax", "confirm"] as const).map((s, idx) => {
              const labels: Record<Step, Parameters<ReturnType<typeof useTranslation>["t"]>[0]> = {
                review: "booking.step.review",
                pax: "booking.step.pax",
                confirm: "booking.step.confirm",
                success: "booking.success.title",
              }
              const order: Step[] = ["review", "pax", "confirm"]
              const stepIdx = order.indexOf(step)
              const reached = idx <= stepIdx
              return (
                <div key={s} className="flex flex-1 items-center gap-3">
                  <span
                    className={cn(
                      "grid size-7 place-items-center rounded-full border-2 text-caption",
                      reached
                        ? "border-accent bg-accent text-bg-base"
                        : "border-border-default bg-bg-raised text-ink-tertiary",
                    )}
                  >
                    {reached ? <Check className="size-3.5" /> : idx + 1}
                  </span>
                  <span
                    className={cn(
                      "text-caption",
                      reached ? "text-ink-primary" : "text-ink-tertiary",
                    )}
                  >
                    {t(labels[s])}
                  </span>
                  {idx < 2 ? (
                    <span
                      className={cn(
                        "h-[2px] flex-1",
                        idx < stepIdx ? "bg-accent" : "bg-border-subtle",
                      )}
                    />
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : null}

        {/* Step content */}
        <div className="rounded-lg border border-border-subtle bg-bg-raised p-6">
          {step === "review" ? (
            <div className="space-y-5">
              <h2 className="text-heading text-ink-primary">
                {getLocalized(itinerary.title, locale)}
              </h2>
              <p className="text-caption text-ink-secondary">
                {getLocalized(itinerary.subtitle, locale)}
              </p>
              <div className="grid grid-cols-2 gap-4 border-t border-border-subtle pt-4 text-caption">
                <Row label={t("common.adults")} value={adults.toString()} />
                <Row label={t("common.children")} value={children.toString()} />
                <Row label={t("itinerary.duration_days", { days: itinerary.duration.days, nights: itinerary.duration.nights })} value="" hideLabel />
                <Row label={t("field.amount")} value={formatCurrency(totalUSD, "USD", locale)} />
              </div>
            </div>
          ) : step === "pax" ? (
            <div className="space-y-4">
              <p className="text-body text-ink-secondary">
                {t("booking.success.subtitle")}
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <PaxStat label={t("common.adults")} value={adults} />
                <PaxStat label={t("common.children")} value={children} />
                <PaxStat label={t("common.infants")} value={0} />
              </div>
            </div>
          ) : step === "confirm" ? (
            <div className="space-y-5">
              <div className="rounded-md border border-border-subtle bg-bg-sunken/40 p-5">
                <p className="text-caption text-ink-tertiary">{t("agency.book.wallet_deduct")}</p>
                <p className="mt-2 text-display-md text-danger">
                  − {formatCurrency(totalCNY, "CNY", locale)}
                </p>
              </div>
              <div className="flex items-center justify-between text-caption">
                <span className="text-ink-tertiary">{t("wallet.balance.available")}</span>
                <span
                  className={cn(
                    "text-data text-ink-primary transition-all",
                    animateBalance && "animate-pulse text-danger",
                  )}
                >
                  {formatCurrency(animateBalance ? newBalance : currentBalance, "CNY", locale)}
                </span>
              </div>
              <p className="text-caption text-ink-secondary">
                {t("booking.confirm_message", { amount: formatCurrency(totalCNY, "CNY", locale) })}
              </p>
            </div>
          ) : (
            <div className="space-y-6 py-6 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-success-soft">
                <Check className="size-7 text-success" />
              </div>
              <div>
                <h2 className="text-display-md text-ink-primary">{t("booking.success.title")}</h2>
                <p className="mt-2 text-body text-ink-secondary">
                  {t("booking.success.subtitle")}
                </p>
              </div>
              <Button asChild>
                <Link href={`/agency/voucher/${itinerary.id}`}>
                  {t("agency.voucher.title")}
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {step !== "success" ? (
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                if (step === "review") router.back()
                else if (step === "pax") setStep("review")
                else if (step === "confirm") setStep("pax")
              }}
            >
              <ChevronLeft className="size-4" />
              {t("actions.back")}
            </Button>

            {step === "confirm" ? (
              <Button onClick={confirm}>
                <CreditCard className="size-4" />
                {t("actions.confirm")}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (step === "review") setStep("pax")
                  else if (step === "pax") setStep("confirm")
                }}
              >
                {t("actions.continue")}
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="mt-6 flex justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                resetBookingDraft()
                router.push("/agency/bookings")
              }}
            >
              {t("nav.my_bookings")}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  hideLabel,
}: {
  label: string
  value: string
  hideLabel?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-ink-tertiary">{hideLabel ? "" : label}</span>
      <span className="text-data text-ink-primary">{value || label}</span>
    </div>
  )
}

function PaxStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border-subtle p-4">
      <p className="text-label text-ink-tertiary">{label}</p>
      <p className="mt-2 text-display-md text-ink-primary">{value}</p>
    </div>
  )
}

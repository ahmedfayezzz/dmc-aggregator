"use client"

import { use, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Building2, CheckCircle2, FileSignature } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import {
  AgencyStatusBadge,
  BookingStatusBadge,
} from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { findAgency, findItinerary } from "@/lib/mock"
import { getBookingsForAgency } from "@/lib/mock/bookings"
import { getTransactionsForAgency } from "@/lib/mock/wallet"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"
import { cn } from "@/lib/utils"

type Tab = "overview" | "bookings" | "wallet" | "settings"

export default function WholesalerAgencyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const agency = findAgency(id)
  const { t, locale } = useTranslation()
  const { agencyWalletModeOverrides } = useDemoState()
  const [tab, setTab] = useState<Tab>("overview")

  if (!agency) notFound()

  const effectiveWalletMode =
    agencyWalletModeOverrides[agency.id] ?? agency.walletMode

  const agencyBookings = getBookingsForAgency(agency.id)
  const transactions = getTransactionsForAgency(agency.id)

  return (
    <div className="pb-24">
      <div className="border-b border-border-subtle px-8 pt-8 pb-2">
        <Link
          href="/wholesaler/agencies"
          className="inline-flex items-center gap-2 text-caption text-ink-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          {t("nav.agencies")}
        </Link>
      </div>

      <PageHeader
        eyebrow={agency.licenseNumber}
        title={getLocalized(agency.name, locale)}
        subtitle={`${getLocalized(agency.location, locale)} · ${getLocalized(agency.contactName, locale)}, ${getLocalized(agency.contactRole, locale)}`}
        actions={
          <div className="flex items-center gap-2">
            <AgencyStatusBadge status={agency.status} />
            <Button variant="secondary" size="sm">
              {t("actions.contact")}
            </Button>
          </div>
        }
      />

      <div className="px-8 pt-8 space-y-8">
        {/* Trust + wallet config strip */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            label={t("wholesaler.agencies.metric.lifetime_gmv")}
            value={formatCurrency(agency.gmvCNY, "CNY", locale)}
            subtitle={t("dashboard.vs_last_month")}
            delta={{ value: 11.8, direction: "up" }}
          />
          <StatCard
            label={t("wholesaler.agencies.metric.total_bookings")}
            value={agency.totalBookings.toString()}
            subtitle={t("status.active")}
          />
          <StatCard
            label={effectiveWalletMode === "CREDIT" ? t("wallet.credit_limit") : t("wallet.balance.available")}
            value={
              effectiveWalletMode === "CREDIT"
                ? formatCurrency(agency.creditLimit + agency.walletBalanceCNY, "CNY", locale)
                : formatCurrency(agency.walletBalanceCNY, "CNY", locale)
            }
            subtitle={
              effectiveWalletMode === "CREDIT"
                ? `${t("wallet.mode.credit")} · ${formatCurrency(agency.creditLimit, "CNY", locale)}`
                : t("wallet.mode.debit")
            }
          />
        </div>

        {/* Trust attestations */}
        <div className="flex flex-wrap gap-3">
          <TrustChip
            icon={CheckCircle2}
            label={t("wholesaler.agencies.kyc_complete")}
          />
          <TrustChip
            icon={FileSignature}
            label={t("wholesaler.agencies.contract_signed")}
          />
          <TrustChip
            icon={Building2}
            label={`${formatDate(agency.joinedAt, locale, "long")}`}
          />
        </div>

        {/* Tabs */}
        <Tabs value={tab} onChange={setTab} />

        {tab === "overview" ? (
          <OverviewTab agencyBookings={agencyBookings} />
        ) : tab === "bookings" ? (
          <BookingsTab bookings={agencyBookings} />
        ) : tab === "wallet" ? (
          <WalletTab transactions={transactions} mode={effectiveWalletMode} />
        ) : (
          <SettingsTab
            walletMode={effectiveWalletMode}
            creditLimit={agency.creditLimit}
            agencyId={agency.id}
          />
        )}
      </div>
    </div>
  )
}

function Tabs({
  value,
  onChange,
}: {
  value: Tab
  onChange: (v: Tab) => void
}) {
  const { t } = useTranslation()
  const items: Array<{ k: Tab; labelKey: Parameters<ReturnType<typeof useTranslation>["t"]>[0] }> = [
    { k: "overview", labelKey: "wholesaler.agencies.tab.overview" },
    { k: "bookings", labelKey: "wholesaler.agencies.tab.bookings" },
    { k: "wallet", labelKey: "wholesaler.agencies.tab.wallet" },
    { k: "settings", labelKey: "wholesaler.agencies.tab.settings" },
  ]
  return (
    <div className="flex items-center gap-6 border-b border-border-subtle">
      {items.map((i) => (
        <button
          key={i.k}
          type="button"
          onClick={() => onChange(i.k)}
          className={cn(
            "relative pb-3 text-body transition-colors",
            value === i.k ? "text-ink-primary" : "text-ink-tertiary hover:text-ink-secondary",
          )}
        >
          {t(i.labelKey)}
          {value === i.k ? (
            <span className="absolute -bottom-px left-0 h-[2px] w-full bg-accent" aria-hidden />
          ) : null}
        </button>
      ))}
    </div>
  )
}

function TrustChip({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-[3px] border border-border-subtle bg-bg-raised px-3 py-1.5 text-caption text-ink-secondary">
      <Icon className="size-3.5 text-success" />
      {label}
    </span>
  )
}

function OverviewTab({ agencyBookings }: { agencyBookings: ReturnType<typeof getBookingsForAgency> }) {
  const { t, locale } = useTranslation()
  const recent = agencyBookings.slice(0, 4)
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section className="rounded-lg border border-border-subtle bg-bg-raised lg:col-span-2">
        <header className="border-b border-border-subtle px-5 py-4">
          <h2 className="text-subheading text-ink-primary">{t("dashboard.recent_bookings")}</h2>
        </header>
        {recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-ink-tertiary">{t("empty.bookings.title")}</p>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {recent.map((b) => {
              const it = findItinerary(b.itineraryId)
              if (!it) return null
              return (
                <li
                  key={b.id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-data text-ink-secondary">{b.reference}</span>
                    <span className="text-body text-ink-primary">
                      {getLocalized(it.title, locale)}
                    </span>
                    <span className="text-caption text-ink-tertiary">
                      {formatDate(b.createdAt, locale, "short")}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-data text-ink-primary">
                      {formatCurrency(b.totalAmountCNY, "CNY", locale)}
                    </span>
                    <BookingStatusBadge state={b.state} />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-border-subtle bg-bg-raised">
        <header className="border-b border-border-subtle px-5 py-4">
          <h2 className="text-subheading text-ink-primary">{t("dashboard.recent_activity")}</h2>
        </header>
        <ul className="divide-y divide-border-subtle">
          {[
            { msg: { "zh-CN": "新预订 TX-A8K3M2", en: "New booking TX-A8K3M2" }, t: "2h" },
            { msg: { "zh-CN": "钱包充值 ¥150,000", en: "Top-up ¥150,000" }, t: "1d" },
            { msg: { "zh-CN": "提交询价", en: "Submitted RFQ" }, t: "3d" },
            { msg: { "zh-CN": "更新联系人", en: "Updated contact" }, t: "1w" },
          ].map((a, idx) => (
            <li key={idx} className="flex items-center justify-between gap-4 px-5 py-3">
              <span className="text-caption text-ink-primary">{getLocalized(a.msg, locale)}</span>
              <span className="text-caption text-ink-tertiary">{a.t}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function BookingsTab({ bookings }: { bookings: ReturnType<typeof getBookingsForAgency> }) {
  const { t, locale } = useTranslation()
  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-border-subtle bg-bg-raised py-16 text-center">
        <p className="text-ink-tertiary">{t("empty.bookings.title")}</p>
      </div>
    )
  }
  return (
    <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("field.reference")}</TableHead>
            <TableHead>{t("field.itinerary")}</TableHead>
            <TableHead>{t("field.created_at")}</TableHead>
            <TableHead className="text-right">{t("field.amount")}</TableHead>
            <TableHead>{t("field.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((b) => {
            const it = findItinerary(b.itineraryId)
            return (
              <TableRow key={b.id}>
                <TableCell className="text-data text-ink-primary">{b.reference}</TableCell>
                <TableCell className="text-body text-ink-primary">
                  {it ? getLocalized(it.title, locale) : "—"}
                </TableCell>
                <TableCell className="text-data text-ink-secondary">
                  {formatDate(b.createdAt, locale, "short")}
                </TableCell>
                <TableCell className="text-right text-data text-ink-primary">
                  {formatCurrency(b.totalAmountCNY, "CNY", locale)}
                </TableCell>
                <TableCell>
                  <BookingStatusBadge state={b.state} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function WalletTab({
  transactions,
  mode,
}: {
  transactions: ReturnType<typeof getTransactionsForAgency>
  mode: "DEBIT" | "CREDIT"
}) {
  const { t, locale } = useTranslation()
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border-subtle bg-bg-raised p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-label text-ink-tertiary">{t("field.wallet_mode")}</p>
            <p className="mt-2 text-display-md text-ink-primary">
              {mode === "DEBIT" ? t("wallet.mode.debit") : t("wallet.mode.credit")}
            </p>
          </div>
          <Badge variant={mode === "DEBIT" ? "info" : "accent"}>
            {mode === "DEBIT" ? t("wallet.mode.debit") : t("wallet.mode.credit")}
          </Badge>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
        <header className="border-b border-border-subtle px-5 py-4">
          <h3 className="text-subheading text-ink-primary">{t("wallet.ledger.title")}</h3>
        </header>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("field.date")}</TableHead>
              <TableHead>{t("field.name")}</TableHead>
              <TableHead className="text-right">{t("field.amount")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.slice(0, 20).map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="text-data text-ink-tertiary">
                  {formatDate(tx.createdAt, locale, "short")}
                </TableCell>
                <TableCell className="text-body text-ink-primary">
                  {getLocalized(tx.description, locale)}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right text-data",
                    tx.amountCNY > 0 ? "text-success" : tx.amountCNY < 0 ? "text-danger" : "text-ink-tertiary",
                  )}
                >
                  {tx.amountCNY > 0 ? "+" : ""}
                  {formatCurrency(tx.amountCNY, "CNY", locale)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function SettingsTab({
  walletMode,
  creditLimit,
  agencyId,
}: {
  walletMode: "DEBIT" | "CREDIT"
  creditLimit: number
  agencyId: string
}) {
  const { t, locale } = useTranslation()
  const { setAgencyWalletMode } = useDemoState()

  const switchMode = (mode: "DEBIT" | "CREDIT") => {
    if (mode === walletMode) return
    setAgencyWalletMode(agencyId, mode)
    toast.success(
      t("toast.wallet.mode_changed", {
        mode: mode === "DEBIT" ? t("wallet.mode.debit") : t("wallet.mode.credit"),
      }),
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="rounded-lg border border-border-subtle bg-bg-raised p-6">
        <h3 className="text-subheading text-ink-primary">{t("field.wallet_mode")}</h3>
        <p className="mt-2 text-caption text-ink-tertiary">
          {t("wholesaler.agencies.tab.settings")}
        </p>
        <div className="mt-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => switchMode("DEBIT")}
            className={cn(
              "rounded-md border px-4 py-2 text-caption transition-colors",
              walletMode === "DEBIT"
                ? "border-accent-border bg-accent-soft text-accent"
                : "border-border-default bg-bg-raised text-ink-secondary hover:text-ink-primary",
            )}
          >
            {t("wallet.mode.debit")}
          </button>
          <button
            type="button"
            onClick={() => switchMode("CREDIT")}
            className={cn(
              "rounded-md border px-4 py-2 text-caption transition-colors",
              walletMode === "CREDIT"
                ? "border-accent-border bg-accent-soft text-accent"
                : "border-border-default bg-bg-raised text-ink-secondary hover:text-ink-primary",
            )}
          >
            {t("wallet.mode.credit")}
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-border-subtle bg-bg-raised p-6">
        <h3 className="text-subheading text-ink-primary">{t("wallet.credit_limit")}</h3>
        <p className="mt-2 text-caption text-ink-tertiary">{t("common.optional")}</p>
        <p className="mt-6 text-display-md text-ink-primary">
          {formatCurrency(creditLimit, "CNY", locale)}
        </p>
      </section>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { agencies } from "@/lib/mock/agencies"
import { getTransactionsForAgency } from "@/lib/mock/wallet"
import { formatCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"
import { cn } from "@/lib/utils"

export default function AgencyWalletPage() {
  const { t, locale } = useTranslation()
  const { agencyId, agencyWalletDeltas, topUpAgencyWallet } = useDemoState()
  const agency = agencies.find((a) => a.id === agencyId) ?? agencies[0]
  const transactions = getTransactionsForAgency(agency.id)
  const [topUpOpen, setTopUpOpen] = useState(false)
  const [amount, setAmount] = useState(50_000)

  const currentBalance = agency.walletBalanceCNY + (agencyWalletDeltas[agency.id] ?? 0)

  const handleTopUp = () => {
    if (amount <= 0) return
    topUpAgencyWallet(agency.id, amount)
    toast.success(
      t("toast.wallet.topped_up", {
        amount: formatCurrency(amount, "CNY", locale),
      }),
    )
    setTopUpOpen(false)
    setAmount(50_000)
  }

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={t("nav.wallet")}
        title={t("agency.wallet.title")}
        subtitle={getLocalized(agency.name, locale)}
        actions={
          <Button onClick={() => setTopUpOpen(true)}>
            <Plus className="size-4" />
            {t("actions.top_up")}
          </Button>
        }
      />

      <div className="space-y-6 px-8 pt-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            label={
              agency.walletMode === "CREDIT"
                ? t("wallet.credit_limit")
                : t("wallet.balance.available")
            }
            value={formatCurrency(
              agency.walletMode === "CREDIT"
                ? agency.creditLimit + currentBalance
                : currentBalance,
              "CNY",
              locale,
            )}
            subtitle={
              agency.walletMode === "CREDIT"
                ? t("wallet.mode.credit")
                : t("wallet.mode.debit")
            }
          />
          <StatCard
            label={t("field.wallet_mode")}
            value={
              agency.walletMode === "CREDIT"
                ? t("wallet.mode.credit")
                : t("wallet.mode.debit")
            }
          />
          <StatCard
            label={t("wholesaler.agencies.metric.total_bookings")}
            value={agency.totalBookings.toString()}
          />
        </div>

        <section className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
          <header className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
            <h3 className="text-subheading text-ink-primary">{t("wallet.ledger.title")}</h3>
            <Badge variant="neutral">{transactions.length}</Badge>
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
              {transactions.slice(0, 30).map((tx) => (
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
        </section>
      </div>

      <Dialog open={topUpOpen} onOpenChange={setTopUpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("actions.top_up")}</DialogTitle>
            <DialogDescription>
              {t("wallet.balance.available")}:{" "}
              {formatCurrency(currentBalance, "CNY", locale)}
            </DialogDescription>
          </DialogHeader>
          <label className="flex flex-col gap-2 py-2">
            <span className="text-caption text-ink-tertiary">{t("field.amount")} (CNY)</span>
            <Input
              type="number"
              min={1000}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {[10_000, 50_000, 100_000, 500_000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={cn(
                    "rounded-[3px] border px-2 py-1 text-caption transition-colors",
                    amount === preset
                      ? "border-accent-border bg-accent-soft text-accent"
                      : "border-border-subtle bg-bg-raised text-ink-secondary hover:text-ink-primary",
                  )}
                >
                  +{formatCurrency(preset, "CNY", locale)}
                </button>
              ))}
            </div>
          </label>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTopUpOpen(false)}>
              {t("actions.cancel")}
            </Button>
            <Button onClick={handleTopUp} disabled={amount <= 0}>
              {t("actions.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

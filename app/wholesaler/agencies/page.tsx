"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Plus, Send } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { AgencyStatusBadge } from "@/components/shared/status-badge"
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
import { formatCurrency } from "@/lib/formatters/currency"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"

type StatusFilter = "all" | "active" | "pending_kyc" | "suspended"
type ModeFilter = "all" | "DEBIT" | "CREDIT"

export default function WholesalerAgenciesPage() {
  const { t, locale } = useTranslation()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all")
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")

  const handleInvite = () => {
    if (!inviteEmail) return
    toast.success(t("toast.agency.invited", { email: inviteEmail }))
    setInviteEmail("")
    setInviteOpen(false)
  }

  const filtered = useMemo(
    () =>
      agencies.filter((a) => {
        if (statusFilter !== "all" && a.status !== statusFilter) return false
        if (modeFilter !== "all" && a.walletMode !== modeFilter) return false
        return true
      }),
    [statusFilter, modeFilter],
  )

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={t("nav.agencies")}
        title={t("wholesaler.agencies.title")}
        subtitle={t("wholesaler.agencies.subtitle", { count: agencies.length })}
        actions={
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <Plus className="size-4" />
            {t("wholesaler.agencies.invite")}
          </Button>
        }
      />

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("wholesaler.agencies.invite")}</DialogTitle>
            <DialogDescription>
              {t("empty.agencies.description")}
            </DialogDescription>
          </DialogHeader>
          <label className="flex flex-col gap-2 py-2">
            <span className="text-caption text-ink-tertiary">{t("field.contact")}</span>
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="agency@example.com"
            />
          </label>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>
              {t("actions.cancel")}
            </Button>
            <Button onClick={handleInvite} disabled={!inviteEmail}>
              <Send className="size-4" />
              {t("actions.invite")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="px-8 pt-8">
        <div className="mb-4 flex items-center gap-3">
          <FilterChips
            label={t("field.status")}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", labelKey: "common.all" },
              { value: "active", labelKey: "status.active" },
              { value: "pending_kyc", labelKey: "status.pending_kyc" },
              { value: "suspended", labelKey: "status.suspended" },
            ]}
          />
          <FilterChips
            label={t("field.wallet_mode")}
            value={modeFilter}
            onChange={setModeFilter}
            options={[
              { value: "all", labelKey: "common.all" },
              { value: "DEBIT", labelKey: "wallet.mode.debit" },
              { value: "CREDIT", labelKey: "wallet.mode.credit" },
            ]}
          />
        </div>

        <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("field.name")}</TableHead>
                <TableHead>{t("field.location")}</TableHead>
                <TableHead>{t("field.wallet_mode")}</TableHead>
                <TableHead className="text-right">{t("field.balance")}</TableHead>
                <TableHead className="text-right">{t("field.bookings")}</TableHead>
                <TableHead className="text-right">{t("field.gmv")}</TableHead>
                <TableHead>{t("field.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ag) => (
                <TableRow key={ag.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/wholesaler/agencies/${ag.id}`}
                      className="flex flex-col gap-0.5"
                    >
                      <span className="text-body font-medium text-ink-primary">
                        {getLocalized(ag.name, locale)}
                      </span>
                      <span className="text-caption text-ink-tertiary">
                        {ag.licenseNumber}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-ink-secondary">
                    {getLocalized(ag.location, locale)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={ag.walletMode === "DEBIT" ? "info" : "accent"}>
                      {ag.walletMode === "DEBIT"
                        ? t("wallet.mode.debit")
                        : t("wallet.mode.credit")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-data text-ink-primary">
                    {ag.walletMode === "CREDIT"
                      ? formatCurrency(ag.creditLimit + ag.walletBalanceCNY, "CNY", locale)
                      : formatCurrency(ag.walletBalanceCNY, "CNY", locale)}
                  </TableCell>
                  <TableCell className="text-right text-data text-ink-secondary">
                    {ag.totalBookings}
                  </TableCell>
                  <TableCell className="text-right text-data text-ink-primary">
                    {formatCurrency(ag.gmvCNY, "CNY", locale)}
                  </TableCell>
                  <TableCell>
                    <AgencyStatusBadge status={ag.status} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center text-ink-tertiary">
                    {t("empty.agencies.title")}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

function FilterChips<V extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: V
  onChange: (v: V) => void
  options: Array<{ value: V; labelKey: Parameters<ReturnType<typeof useTranslation>["t"]>[0] }>
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <span className="text-label text-ink-tertiary">{label}</span>
      <div className="flex items-center gap-1 rounded-md border border-border-subtle bg-bg-raised p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={
              value === o.value
                ? "rounded-[3px] bg-accent-soft px-3 py-1 text-caption text-accent"
                : "rounded-[3px] px-3 py-1 text-caption text-ink-secondary hover:text-ink-primary"
            }
          >
            {t(o.labelKey)}
          </button>
        ))}
      </div>
    </div>
  )
}

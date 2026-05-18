"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, Plus, Save, X } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { DepartureStatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { itineraries } from "@/lib/mock/itineraries"
import { formatDate } from "@/lib/formatters/date"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState, type AllotmentEdit, type DepartureDraft } from "@/lib/demo-state"
import { dmcs } from "@/lib/mock/dmcs"
import type { Itinerary } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function DMCAllotmentsPage() {
  const { t } = useTranslation()
  const { dmcId, allotmentEdits, setAllotmentEdit, clearAllotmentEdit, addedDepartures } = useDemoState()
  const dmc = dmcs.find((d) => d.id === dmcId) ?? dmcs[0]
  const list = itineraries.filter((i) => i.dmcId === dmc.id)

  const fixed = list.filter((i) => i.departureType === "FIXED")
  const flexible = list.filter((i) => i.departureType !== "FIXED")

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={dmc.name}
        title={t("dmc.allotments.title")}
        subtitle={t("dmc.allotments.explanation_title")}
      />

      <div className="space-y-8 px-8 pt-8">
        {/* Model explanation */}
        <section className="rounded-lg border border-accent-border bg-accent-soft px-6 py-5">
          <div className="flex items-start gap-3">
            <BookOpen className="mt-0.5 size-4 shrink-0 text-accent" />
            <div className="space-y-3">
              <h2 className="text-subheading text-ink-primary">
                {t("dmc.allotments.explanation_title")}
              </h2>
              <p className="max-w-3xl text-caption text-ink-secondary leading-relaxed">
                {t("dmc.allotments.explanation_body")}
              </p>
              <div className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
                <div className="rounded-md border border-border-subtle bg-bg-raised/60 p-3">
                  <Badge variant="info">{t("catalog.departure_type.fixed")}</Badge>
                  <p className="mt-2 text-caption text-ink-secondary">
                    {t("dmc.allotments.fixed_label")} · {t("dmc.allotments.capacity")} / {t("dmc.allotments.booked")} / {t("dmc.allotments.available")}
                  </p>
                </div>
                <div className="rounded-md border border-border-subtle bg-bg-raised/60 p-3">
                  <Badge variant="warning">{t("catalog.departure_type.on_demand")}</Badge>
                  <p className="mt-2 text-caption text-ink-secondary">
                    {t("dmc.allotments.on_demand_label")} · {t("dmc.allotments.weekly_capacity")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FIXED — per-departure capacity */}
        <div className="space-y-3">
          <h2 className="text-heading text-ink-primary">
            {t("dmc.allotments.fixed_label")}
          </h2>
          {fixed.map((it) => (
            <FixedAllotmentEditor
              key={it.id}
              itinerary={it}
              edit={allotmentEdits[it.id]}
              setEdit={(patch) => setAllotmentEdit(it.id, patch)}
              clearEdit={() => clearAllotmentEdit(it.id)}
              extraDepartures={addedDepartures.filter((d) => d.itineraryId === it.id)}
            />
          ))}
        </div>

        {/* ON_DEMAND — weekly capacity + blackouts */}
        <div className="space-y-3">
          <h2 className="text-heading text-ink-primary">
            {t("dmc.allotments.on_demand_label")}
          </h2>
          {flexible.map((it) => (
            <OnDemandAllotmentEditor
              key={it.id}
              itinerary={it}
              edit={allotmentEdits[it.id]}
              setEdit={(patch) => setAllotmentEdit(it.id, patch)}
              clearEdit={() => clearAllotmentEdit(it.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FixedAllotmentEditor({
  itinerary,
  edit,
  setEdit,
  clearEdit,
  extraDepartures,
}: {
  itinerary: Itinerary
  edit: AllotmentEdit | undefined
  setEdit: (patch: Partial<Omit<AllotmentEdit, "itineraryId">>) => void
  clearEdit: () => void
  extraDepartures: DepartureDraft[]
}) {
  const { t, locale } = useTranslation()
  const hasEdits =
    !!edit && Object.keys(edit.capacityOverrides).length > 0

  const allDepartures = [
    ...itinerary.departures,
    ...extraDepartures.map((d, idx) => ({
      id: `${itinerary.id}-extra-${idx}`,
      itineraryId: itinerary.id,
      date: d.date,
      capacity: d.capacity,
      booked: 0,
      status: "OPEN" as const,
    })),
  ]

  return (
    <section className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
      <header className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <div>
          <Link
            href={`/dmc/itineraries/${itinerary.id}`}
            className="text-subheading text-ink-primary transition-colors hover:text-accent"
          >
            {getLocalized(itinerary.title, locale)}
          </Link>
          <p className="mt-0.5 text-caption text-ink-tertiary">
            {allDepartures.length} {t("nav.schedules").toLowerCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasEdits ? <Badge variant="warning">{t("dmc.pricing.has_edits")}</Badge> : null}
          <Button
            variant="ghost"
            size="sm"
            disabled={!hasEdits}
            onClick={() => clearEdit()}
          >
            {t("dmc.pricing.reset_overrides")}
          </Button>
          <Button
            size="sm"
            disabled={!hasEdits}
            onClick={() => toast.success(t("toast.allotment.saved"))}
          >
            <Save className="size-3.5" />
            {t("dmc.allotments.save_changes")}
          </Button>
        </div>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("field.date")}</TableHead>
            <TableHead className="text-right">{t("dmc.allotments.capacity")}</TableHead>
            <TableHead className="text-right">{t("dmc.allotments.booked")}</TableHead>
            <TableHead className="text-right">{t("dmc.allotments.available")}</TableHead>
            <TableHead>{t("field.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allDepartures.map((d) => {
            const override = edit?.capacityOverrides[d.id]
            const capacity = override ?? d.capacity
            const available = capacity - d.booked
            return (
              <TableRow key={d.id}>
                <TableCell className="text-data text-ink-primary">
                  {formatDate(d.date, locale, "long")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <input
                      type="number"
                      min={d.booked}
                      value={capacity}
                      onChange={(e) =>
                        setEdit({
                          capacityOverrides: {
                            [d.id]: Number(e.target.value),
                          },
                        })
                      }
                      className={cn(
                        "h-8 w-20 rounded border bg-transparent px-2 text-right text-data outline-none focus:border-accent",
                        override !== undefined
                          ? "border-accent-border bg-accent-soft text-accent"
                          : "border-border-subtle text-ink-primary",
                      )}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right text-data text-ink-secondary">
                  {d.booked}
                </TableCell>
                <TableCell className={cn(
                  "text-right text-data",
                  available <= 0 ? "text-danger" : available < 5 ? "text-warning" : "text-success",
                )}>
                  {available}
                </TableCell>
                <TableCell>
                  <DepartureStatusBadge status={d.status} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </section>
  )
}

function OnDemandAllotmentEditor({
  itinerary,
  edit,
  setEdit,
  clearEdit,
}: {
  itinerary: Itinerary
  edit: AllotmentEdit | undefined
  setEdit: (patch: Partial<Omit<AllotmentEdit, "itineraryId">>) => void
  clearEdit: () => void
}) {
  const { t, locale } = useTranslation()
  const [newBlackout, setNewBlackout] = useState("")
  const weeklyCapacity = edit?.weeklyCapacity ?? 8
  const blackouts = edit?.blackoutDates ?? []
  const hasEdits = !!edit && (edit.weeklyCapacity !== undefined || (edit.blackoutDates && edit.blackoutDates.length > 0))

  const addBlackout = () => {
    if (!newBlackout) return
    if (blackouts.includes(newBlackout)) return
    setEdit({ blackoutDates: [...blackouts, newBlackout] })
    setNewBlackout("")
  }

  const removeBlackout = (date: string) => {
    setEdit({ blackoutDates: blackouts.filter((d) => d !== date) })
  }

  return (
    <section className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
      <header className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <div>
          <Link
            href={`/dmc/itineraries/${itinerary.id}`}
            className="text-subheading text-ink-primary transition-colors hover:text-accent"
          >
            {getLocalized(itinerary.title, locale)}
          </Link>
          <p className="mt-0.5 text-caption text-ink-tertiary">
            {t(
              itinerary.departureType === "ON_DEMAND"
                ? "catalog.departure_type.on_demand"
                : "catalog.departure_type.rfq_only",
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasEdits ? <Badge variant="warning">{t("dmc.pricing.has_edits")}</Badge> : null}
          <Button
            variant="ghost"
            size="sm"
            disabled={!hasEdits}
            onClick={clearEdit}
          >
            {t("dmc.pricing.reset_overrides")}
          </Button>
          <Button
            size="sm"
            disabled={!hasEdits}
            onClick={() => toast.success(t("toast.allotment.saved"))}
          >
            <Save className="size-3.5" />
            {t("dmc.allotments.save_changes")}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2">
        {/* Weekly capacity */}
        <div className="space-y-3">
          <p className="text-label text-ink-tertiary">{t("dmc.allotments.weekly_capacity")}</p>
          <div className="flex items-baseline gap-3">
            <input
              type="number"
              min={0}
              max={50}
              value={weeklyCapacity}
              onChange={(e) =>
                setEdit({ weeklyCapacity: Number(e.target.value) })
              }
              className={cn(
                "h-12 w-24 rounded-md border bg-transparent px-3 text-display-md outline-none focus:border-accent",
                edit?.weeklyCapacity !== undefined
                  ? "border-accent-border bg-accent-soft text-accent"
                  : "border-border-subtle text-ink-primary",
              )}
            />
            <span className="text-caption text-ink-tertiary">
              {t("agency.browse.results", { count: weeklyCapacity })} / 7 {t("common.days")}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-bg-sunken">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${Math.min((weeklyCapacity / 20) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Blackout dates */}
        <div className="space-y-3">
          <p className="text-label text-ink-tertiary">{t("dmc.allotments.add_blackout")}</p>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={newBlackout}
              onChange={(e) => setNewBlackout(e.target.value)}
              className="h-9"
            />
            <Button size="sm" onClick={addBlackout} disabled={!newBlackout}>
              <Plus className="size-3.5" />
            </Button>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {blackouts.length === 0 ? (
              <li className="text-caption text-ink-tertiary">{t("dmc.allotments.no_blackouts")}</li>
            ) : (
              blackouts.map((d) => (
                <li key={d}>
                  <button
                    type="button"
                    onClick={() => removeBlackout(d)}
                    className="inline-flex items-center gap-1.5 rounded-[3px] border border-danger/30 bg-danger-soft px-2.5 py-1 text-caption text-danger transition-colors hover:bg-danger/20"
                  >
                    {formatDate(d, locale, "short")}
                    <X className="size-3" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}

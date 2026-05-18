"use client"

import { useState } from "react"
import { Edit3, Plus } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { DepartureStatusBadge } from "@/components/shared/status-badge"
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
import { itineraries } from "@/lib/mock/itineraries"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"
import { dmcs } from "@/lib/mock/dmcs"
import type { Itinerary } from "@/lib/types"
import { formatDate } from "@/lib/formatters/date"

export default function DMCSchedulesPage() {
  const { t, locale } = useTranslation()
  const { dmcId, addedDepartures, addDeparture } = useDemoState()
  const dmc = dmcs.find((d) => d.id === dmcId) ?? dmcs[0]
  const list = itineraries.filter((i) => i.dmcId === dmc.id && i.departureType === "FIXED")

  const [openDialog, setOpenDialog] = useState<{ itinerary: Itinerary } | null>(null)

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={dmc.name}
        title={t("dmc.schedules.title")}
        subtitle={t("dmc.schedules.subtitle")}
      />

      <div className="space-y-8 px-8 pt-8">
        {list.map((it) => {
          const extras = addedDepartures.filter((d) => d.itineraryId === it.id)
          return (
            <section
              key={it.id}
              className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised"
            >
              <header className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
                <div>
                  <h2 className="text-subheading text-ink-primary">
                    {getLocalized(it.title, locale)}
                  </h2>
                  <p className="mt-0.5 text-caption text-ink-tertiary">
                    {it.duration.days}D / {it.duration.nights}N · {it.departures.length + extras.length} departures
                  </p>
                </div>
                <Button size="sm" onClick={() => setOpenDialog({ itinerary: it })}>
                  <Plus className="size-3.5" />
                  {t("actions.create")}
                </Button>
              </header>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("field.date")}</TableHead>
                    <TableHead className="text-right">{t("field.pax")}</TableHead>
                    <TableHead className="text-right">{t("metric.fill_rate")}</TableHead>
                    <TableHead>{t("field.status")}</TableHead>
                    <TableHead className="text-right">{t("field.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {it.departures.map((d) => {
                    const fill = (d.booked / d.capacity) * 100
                    return (
                      <TableRow key={d.id}>
                        <TableCell className="text-data text-ink-primary">
                          {formatDate(d.date, locale, "long")}
                        </TableCell>
                        <TableCell className="text-right text-data text-ink-secondary">
                          {d.booked} / {d.capacity}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="ml-auto flex items-center justify-end gap-2">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-bg-sunken">
                              <div
                                className="h-full bg-accent"
                                style={{ width: `${Math.min(fill, 100)}%` }}
                              />
                            </div>
                            <span className="text-data text-ink-tertiary w-10 text-right">
                              {fill.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DepartureStatusBadge status={d.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() =>
                              toast.success(
                                t("toast.schedule.edited", {
                                  date: formatDate(d.date, locale, "short"),
                                }),
                              )
                            }
                          >
                            <Edit3 className="size-3" />
                            {t("actions.edit")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {extras.map((d, idx) => (
                    <TableRow key={`extra-${idx}`} className="bg-success-soft/30">
                      <TableCell className="text-data text-ink-primary">
                        {formatDate(d.date, locale, "long")}
                      </TableCell>
                      <TableCell className="text-right text-data text-ink-secondary">
                        0 / {d.capacity}
                      </TableCell>
                      <TableCell className="text-right text-data text-ink-tertiary">0%</TableCell>
                      <TableCell>
                        <Badge variant="info">{t("departure.status.open")}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="success">{t("common.unsaved").replace(/未保存|Unsaved/, "")}New</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
          )
        })}
      </div>

      <Dialog open={!!openDialog} onOpenChange={(open) => !open && setOpenDialog(null)}>
        {openDialog ? (
          <AddDepartureDialog
            itinerary={openDialog.itinerary}
            onCreated={(d) => {
              addDeparture(d)
              toast.success(t("toast.schedule.created", { date: formatDate(d.date, locale, "short") }))
              setOpenDialog(null)
            }}
            onCancel={() => setOpenDialog(null)}
          />
        ) : null}
      </Dialog>
    </div>
  )
}

function AddDepartureDialog({
  itinerary,
  onCreated,
  onCancel,
}: {
  itinerary: Itinerary
  onCreated: (d: { itineraryId: string; date: string; capacity: number }) => void
  onCancel: () => void
}) {
  const { t, locale } = useTranslation()
  const [date, setDate] = useState("")
  const [capacity, setCapacity] = useState(20)

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{t("dmc.schedule.add_dialog_title")}</DialogTitle>
        <DialogDescription>
          {t("dmc.schedule.add_dialog_subtitle", { title: getLocalized(itinerary.title, locale) })}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <label className="flex flex-col gap-2">
          <span className="text-caption text-ink-tertiary">{t("dmc.schedule.field.date")}</span>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-caption text-ink-tertiary">{t("dmc.schedule.field.capacity")}</span>
          <Input
            type="number"
            min={1}
            max={100}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </label>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={onCancel}>
          {t("actions.cancel")}
        </Button>
        <Button
          disabled={!date || capacity <= 0}
          onClick={() => onCreated({ itineraryId: itinerary.id, date, capacity })}
        >
          {t("actions.create")}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

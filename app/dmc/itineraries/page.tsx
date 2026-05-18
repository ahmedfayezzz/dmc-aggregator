"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
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
import { itineraries } from "@/lib/mock/itineraries"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { useDemoState } from "@/lib/demo-state"
import { dmcs } from "@/lib/mock/dmcs"
import { formatDate } from "@/lib/formatters/date"

export default function DMCItinerariesPage() {
  const { t, locale } = useTranslation()
  const { dmcId, publishedItineraries, draftItineraries } = useDemoState()
  const dmc = dmcs.find((d) => d.id === dmcId) ?? dmcs[0]
  const mockForDmc = itineraries.filter((i) => i.dmcId === dmc.id)
  const draftsForDmc = draftItineraries.filter((d) => d.dmcId === dmc.id)

  const isPublished = (id: string) => publishedItineraries[id] ?? true

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow={dmc.name}
        title={t("dmc.itineraries.title")}
        subtitle={t("dmc.itineraries.subtitle")}
        actions={
          <Button size="sm" asChild>
            <Link href="/dmc/itineraries/new">
              <Plus className="size-4" />
              {t("actions.create")}
            </Link>
          </Button>
        }
      />

      <div className="px-8 pt-8">
        <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-raised">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("field.name")}</TableHead>
                <TableHead>{t("itinerary.departure_type_label")}</TableHead>
                <TableHead className="text-right">{t("itinerary.duration_days", { days: 0, nights: 0 }).replace(/0/g, "").replace(/天晚|DN/, "").trim() || t("itinerary.duration_days", { days: 5, nights: 4 })}</TableHead>
                <TableHead>zh-CN</TableHead>
                <TableHead>en</TableHead>
                <TableHead>{t("field.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Drafts first, freshest at top */}
              {[...draftsForDmc]
                .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
                .map((draft) => (
                  <TableRow key={draft.id} className="bg-warning-soft/30">
                    <TableCell>
                      <Link
                        href={`/dmc/itineraries/${draft.id}`}
                        className="flex flex-col gap-0.5"
                      >
                        <span className="text-body text-ink-primary">
                          {getLocalized(draft.title, locale)}
                        </span>
                        <span className="text-caption text-ink-tertiary">
                          {draft.cities.join(" · ")} · {formatDate(draft.createdAt, locale, "short")}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          draft.departureType === "FIXED"
                            ? "info"
                            : draft.departureType === "ON_DEMAND"
                              ? "warning"
                              : "accent"
                        }
                      >
                        {t(
                          draft.departureType === "FIXED"
                            ? "catalog.departure_type.fixed"
                            : draft.departureType === "ON_DEMAND"
                              ? "catalog.departure_type.on_demand"
                              : "catalog.departure_type.rfq_only",
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-data text-ink-secondary">
                      {draft.duration.days}D / {draft.duration.nights}N
                    </TableCell>
                    <TableCell>
                      <Badge variant="warning">{t("translation.pending_review")}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="warning">{t("translation.pending_review")}</Badge>
                    </TableCell>
                    <TableCell>
                      {isPublished(draft.id) ? (
                        <Badge variant="success">{t("dmc.itineraries.status.published")}</Badge>
                      ) : (
                        <Badge variant="warning">{t("draft.badge")}</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

              {mockForDmc.map((it) => (
                <TableRow key={it.id}>
                  <TableCell>
                    <Link
                      href={`/dmc/itineraries/${it.id}`}
                      className="flex flex-col gap-0.5"
                    >
                      <span className="text-body text-ink-primary">
                        {getLocalized(it.title, locale)}
                      </span>
                      <span className="text-caption text-ink-tertiary">
                        {it.cities.join(" · ")}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        it.departureType === "FIXED"
                          ? "info"
                          : it.departureType === "ON_DEMAND"
                            ? "warning"
                            : "accent"
                      }
                    >
                      {t(
                        it.departureType === "FIXED"
                          ? "catalog.departure_type.fixed"
                          : it.departureType === "ON_DEMAND"
                            ? "catalog.departure_type.on_demand"
                            : "catalog.departure_type.rfq_only",
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-data text-ink-secondary">
                    {it.duration.days}D / {it.duration.nights}N
                  </TableCell>
                  <TableCell>
                    <Badge variant={it.translations["zh-CN"].reviewed ? "success" : "warning"}>
                      {it.translations["zh-CN"].reviewed
                        ? t("translation.reviewed")
                        : t("translation.pending_review")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={it.translations.en.reviewed ? "success" : "warning"}>
                      {it.translations.en.reviewed
                        ? t("translation.reviewed")
                        : t("translation.pending_review")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isPublished(it.id) ? (
                      <Badge variant="success">
                        {t("dmc.itineraries.status.published")}
                      </Badge>
                    ) : (
                      <Badge variant="neutral">
                        {t("dmc.itineraries.status.draft")}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

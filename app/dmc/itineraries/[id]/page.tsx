"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AlertCircle, ArrowLeft, Check, ExternalLink, FileText, Globe, Plus, Save, Trash2, UndoDot } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/shared/page-header"
import { findItinerary } from "@/lib/mock"
import { useTranslation } from "@/lib/i18n/provider"
import { getLocalized } from "@/lib/i18n/get-localized"
import { formatDuration } from "@/lib/formatters/duration"
import { formatCurrency } from "@/lib/formatters/currency"
import { useDemoState, type DraftDay, type DraftItinerary } from "@/lib/demo-state"

export default function DMCItineraryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const mockItinerary = findItinerary(id)
  const { t, locale } = useTranslation()
  const { publishedItineraries, togglePublished, draftItineraries } = useDemoState()
  const draftItinerary = draftItineraries.find((d) => d.id === id)

  const isDraftSource = !mockItinerary && !!draftItinerary
  const itinerary = mockItinerary ?? null
  const draft = draftItinerary ?? null

  if (!mockItinerary && !draftItinerary) notFound()

  const titleObj = itinerary?.title ?? draft!.title
  const subtitleObj = itinerary?.subtitle ?? draft!.subtitle
  const cities = itinerary?.cities ?? draft!.cities
  const heroImage = itinerary?.heroImage ?? draft!.heroImage
  const duration = itinerary?.duration ?? draft!.duration
  const departureType = itinerary?.departureType ?? draft!.departureType
  const themes = itinerary?.themes ?? draft!.themes

  // Mock itineraries default published=true; new drafts default to false
  const defaultPublished = !isDraftSource
  const isPublished = publishedItineraries[id] ?? defaultPublished

  const transReady = itinerary
    ? itinerary.translations["zh-CN"].reviewed && itinerary.translations.en.reviewed
    : false

  const handlePreview = () => {
    toast.success(t("toast.itinerary.preview_opened"))
    window.open(`/agency/browse/${id}`, "_blank", "noopener")
  }

  const handlePublishToggle = () => {
    togglePublished(id)
    const willBePublished = !isPublished
    toast.success(
      t(
        willBePublished
          ? "toast.itinerary.published"
          : "toast.itinerary.unpublished",
      ),
    )
  }

  return (
    <div className="pb-24">
      <div className="border-b border-border-subtle px-8 pt-8 pb-2">
        <Link
          href="/dmc/itineraries"
          className="inline-flex items-center gap-2 text-caption text-ink-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          {t("nav.itineraries")}
        </Link>
      </div>

      <PageHeader
        eyebrow={cities.join(" · ")}
        title={getLocalized(titleObj, locale)}
        subtitle={getLocalized(subtitleObj, locale)}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={isPublished ? "success" : "neutral"}>
              {isPublished
                ? t("dmc.itineraries.status.published")
                : t("dmc.itineraries.status.draft")}
            </Badge>
            <Button variant="secondary" onClick={handlePreview}>
              <ExternalLink className="size-4" />
              {t("actions.preview")}
            </Button>
            <Button onClick={handlePublishToggle}>
              {isPublished ? (
                <>
                  <UndoDot className="size-4" />
                  {t("actions.unpublish")}
                </>
              ) : (
                <>
                  <Globe className="size-4" />
                  {t("actions.publish")}
                </>
              )}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-8 px-8 pt-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Publish state explainer */}
          <div
            className={`flex items-start gap-3 rounded-lg border px-5 py-4 ${
              isPublished
                ? "border-success/30 bg-success-soft"
                : "border-border-default bg-bg-sunken/40"
            }`}
          >
            <AlertCircle
              className={`mt-0.5 size-4 shrink-0 ${
                isPublished ? "text-success" : "text-ink-tertiary"
              }`}
            />
            <p className="text-caption text-ink-secondary leading-relaxed">
              {isPublished
                ? t("dmc.itinerary.published_explainer")
                : t("dmc.itinerary.draft_explainer")}
            </p>
          </div>

          {!transReady ? (
            <div className="flex items-center gap-3 rounded-lg border border-warning/30 bg-warning-soft px-5 py-4">
              <AlertCircle className="size-4 text-warning" />
              <p className="text-caption text-ink-secondary">
                {t("translation.pending_review")}: en
              </p>
            </div>
          ) : null}

          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border-subtle">
            <Image src={heroImage} alt="" fill className="object-cover" sizes="800px" />
          </div>

          {/* Trip-basics summary — visible for both mock and draft */}
          <section className="grid grid-cols-2 gap-3 rounded-lg border border-border-subtle bg-bg-raised p-6 md:grid-cols-4">
            <div>
              <p className="text-label text-ink-tertiary">{t("dmc.new.field.departure_type")}</p>
              <p className="mt-1 text-body text-ink-primary">
                {t(
                  departureType === "FIXED"
                    ? "catalog.departure_type.fixed"
                    : departureType === "ON_DEMAND"
                      ? "catalog.departure_type.on_demand"
                      : "catalog.departure_type.rfq_only",
                )}
              </p>
            </div>
            <div>
              <p className="text-label text-ink-tertiary">{t("itinerary.section.day_by_day")}</p>
              <p className="mt-1 text-body text-ink-primary">
                {formatDuration(duration.days, duration.nights, locale)}
              </p>
            </div>
            <div>
              <p className="text-label text-ink-tertiary">{t("catalog.filters.destination")}</p>
              <p className="mt-1 text-body text-ink-primary">{cities.join(" · ")}</p>
            </div>
            <div>
              <p className="text-label text-ink-tertiary">{t("catalog.filters.theme")}</p>
              <p className="mt-1 flex flex-wrap gap-1">
                {themes.map((th) => (
                  <Badge key={th} variant="neutral">
                    {t(`itinerary.theme.${th}` as Parameters<typeof t>[0])}
                  </Badge>
                ))}
              </p>
            </div>
          </section>

          {/* Draft "complete me" workflow */}
          {isDraftSource ? (
            <section className="rounded-lg border border-warning/30 bg-warning-soft/40 p-6">
              <h2 className="text-subheading text-ink-primary">
                {t("dmc.new.section.next_steps")}
              </h2>
              <p className="mt-1 text-caption text-ink-tertiary">
                {t("dmc.new.section.next_steps_hint")}
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                <DraftNextLink
                  href="/dmc/pricing"
                  icon={FileText}
                  step={1}
                  title={t("dmc.new.next.pricing")}
                  hint={t("dmc.new.next.pricing_hint")}
                />
                {departureType === "FIXED" ? (
                  <DraftNextLink
                    href="/dmc/schedules"
                    icon={FileText}
                    step={2}
                    title={t("dmc.new.next.schedules")}
                    hint={t("dmc.new.next.schedules_hint")}
                  />
                ) : null}
                <DraftNextLink
                  href="#draft-days-editor"
                  icon={FileText}
                  step={departureType === "FIXED" ? 3 : 2}
                  title={t("dmc.new.next.days")}
                  hint={t("dmc.new.next.days_hint")}
                />
                <DraftNextLink
                  href="#draft-incl-editor"
                  icon={FileText}
                  step={departureType === "FIXED" ? 4 : 3}
                  title={t("dmc.new.next.inclusions")}
                  hint={t("dmc.new.next.inclusions_hint")}
                />
              </ul>
            </section>
          ) : null}

          {/* Draft day-by-day editor */}
          {isDraftSource && draft ? (
            <DraftDaysEditor draft={draft} />
          ) : null}

          {/* Draft inclusions/exclusions editor */}
          {isDraftSource && draft ? (
            <DraftInclusionsEditor draft={draft} />
          ) : null}

          {/* Day-by-day — only when mock has it */}
          {itinerary ? (
            <section className="rounded-lg border border-border-subtle bg-bg-raised p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="text-subheading text-ink-primary">
                  {t("itinerary.section.day_by_day")}
                </h2>
                <Badge variant="neutral">{itinerary.days.length} days</Badge>
              </div>
              <ol className="mt-4 space-y-4">
                {itinerary.days.map((d) => (
                  <li key={d.day} className="border-l-2 border-border-default pl-4">
                    <p className="text-label text-ink-tertiary">
                      {t("itinerary.day_label", { day: d.day })}
                    </p>
                    <p className="mt-1 text-body text-ink-primary">
                      {getLocalized(d.title, locale)}
                    </p>
                    <p className="mt-1 text-caption text-ink-secondary leading-relaxed">
                      {getLocalized(d.description, locale)}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {itinerary ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <section className="rounded-lg border border-border-subtle bg-bg-raised p-6">
                <h2 className="text-subheading text-ink-primary">
                  {t("itinerary.section.inclusions")}
                </h2>
                <ul className="mt-4 space-y-2">
                  {getLocalized(itinerary.inclusions, locale).map((i, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-caption text-ink-secondary">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                      {i}
                    </li>
                  ))}
                </ul>
              </section>
              <section className="rounded-lg border border-border-subtle bg-bg-raised p-6">
                <h2 className="text-subheading text-ink-primary">
                  {t("itinerary.section.exclusions")}
                </h2>
                <ul className="mt-4 space-y-2">
                  {getLocalized(itinerary.exclusions, locale).map((i, idx) => (
                    <li key={idx} className="text-caption text-ink-tertiary">
                      − {i}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4">
          {itinerary ? (
            <section className="rounded-lg border border-border-subtle bg-bg-raised p-5">
              <p className="text-label text-ink-tertiary">{t("itinerary.margin.dmc_net")}</p>
              <p className="mt-2 text-display-md text-ink-primary">
                {formatCurrency(itinerary.marginLayers.dmcNetPerPaxUSD, "USD", locale)}
              </p>
              <p className="mt-1 text-caption text-ink-tertiary">
                {t("pricing.per_pax")} · {formatDuration(duration.days, duration.nights, locale)}
              </p>
            </section>
          ) : (
            <section className="rounded-lg border border-border-default bg-bg-sunken/40 p-5">
              <p className="text-label text-ink-tertiary">{t("itinerary.margin.dmc_net")}</p>
              <p className="mt-2 text-body text-ink-tertiary">
                — {t("dmc.new.next.pricing_hint")}
              </p>
              <Button variant="ghost" size="sm" asChild className="mt-3">
                <Link href="/dmc/pricing">{t("nav.pricing")} →</Link>
              </Button>
            </section>
          )}

          {itinerary ? (
            <section className="rounded-lg border border-accent-border bg-accent-soft p-5">
              <p className="text-label text-accent">{t("translation.reviewed")}</p>
              <ul className="mt-3 space-y-2 text-caption">
                <li className="flex items-center justify-between">
                  <span className="text-ink-secondary">中文 · zh-CN</span>
                  <Badge variant={itinerary.translations["zh-CN"].reviewed ? "success" : "warning"}>
                    {itinerary.translations["zh-CN"].reviewed ? t("translation.reviewed") : t("translation.pending_review")}
                  </Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-ink-secondary">English</span>
                  <Badge variant={itinerary.translations.en.reviewed ? "success" : "warning"}>
                    {itinerary.translations.en.reviewed ? t("translation.reviewed") : t("translation.pending_review")}
                  </Badge>
                </li>
              </ul>
              <p className="mt-4 text-caption text-ink-tertiary">
                {locale === "zh-CN"
                  ? "我们会在发布给批发商之前完成校对"
                  : "We review translations before publishing to wholesalers"}
              </p>
            </section>
          ) : (
            <section className="rounded-lg border border-warning/30 bg-warning-soft/40 p-5">
              <p className="text-label text-warning">{t("translation.pending_review")}</p>
              <p className="mt-2 text-caption text-ink-secondary">
                {t("dmc.itinerary.draft_explainer")}
              </p>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

function DraftNextLink({
  href,
  icon: Icon,
  step,
  title,
  hint,
  toastOnly,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  step: number
  title: string
  hint: string
  toastOnly?: boolean
}) {
  const inner = (
    <span className="flex w-full items-start gap-3">
      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-warning/40 bg-bg-raised text-data text-warning">
        {step}
      </span>
      <span className="flex-1 space-y-1">
        <span className="flex items-center gap-2">
          <Icon className="size-3.5 text-ink-tertiary" />
          <span className="text-body text-ink-primary">{title}</span>
        </span>
        <span className="block text-caption text-ink-tertiary">{hint}</span>
      </span>
    </span>
  )
  if (toastOnly) {
    return (
      <li>
        <button
          type="button"
          onClick={() => toast.info(`${title} — ${hint}`)}
          className="block w-full rounded-md border border-border-subtle bg-bg-raised p-4 text-left transition-colors hover:border-warning/40"
        >
          {inner}
        </button>
      </li>
    )
  }
  return (
    <li>
      <Link
        href={href}
        className="block rounded-md border border-border-subtle bg-bg-raised p-4 transition-colors hover:border-warning/40"
      >
        {inner}
      </Link>
    </li>
  )
}

function DraftDaysEditor({ draft }: { draft: DraftItinerary }) {
  const { t } = useTranslation()
  const { updateDraftDays } = useDemoState()
  const [days, setDays] = useState<DraftDay[]>(draft.days)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setDays(draft.days)
    setDirty(false)
  }, [draft.days])

  const patchDay = (idx: number, patch: Partial<DraftDay>) => {
    setDays((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, ...patch, title: { ...d.title, ...(patch.title ?? {}) }, description: { ...d.description, ...(patch.description ?? {}) } } : d)),
    )
    setDirty(true)
  }

  const addDay = () => {
    setDays((prev) => [
      ...prev,
      {
        day: prev.length + 1,
        title: { "zh-CN": "", en: "" },
        description: { "zh-CN": "", en: "" },
      },
    ])
    setDirty(true)
  }

  const removeDay = (idx: number) => {
    setDays((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((d, i) => ({ ...d, day: i + 1 })),
    )
    setDirty(true)
  }

  const save = () => {
    updateDraftDays(draft.id, days)
    toast.success(t("toast.draft.days_saved", { count: days.length }))
    setDirty(false)
  }

  return (
    <section
      id="draft-days-editor"
      className="scroll-mt-20 rounded-lg border border-border-subtle bg-bg-raised p-6"
    >
      <header className="flex items-start justify-between gap-4 pb-4">
        <div>
          <h2 className="text-subheading text-ink-primary">{t("draft.days.title")}</h2>
          <p className="mt-1 text-caption text-ink-tertiary">{t("draft.days.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          {dirty ? <Badge variant="warning">{t("dmc.pricing.has_edits")}</Badge> : null}
          <Button size="sm" onClick={save} disabled={!dirty}>
            <Save className="size-3.5" />
            {t("actions.save")}
          </Button>
        </div>
      </header>

      {days.length === 0 ? (
        <p className="rounded-md border border-dashed border-border-default bg-bg-sunken/40 px-4 py-6 text-center text-caption text-ink-tertiary">
          {t("draft.days.empty_placeholder")}
        </p>
      ) : (
        <ol className="space-y-4">
          {days.map((d, idx) => (
            <li
              key={idx}
              className="rounded-md border border-border-subtle bg-bg-sunken/30 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <Badge variant="accent">
                  {t("itinerary.day_label", { day: d.day })}
                </Badge>
                <button
                  type="button"
                  onClick={() => removeDay(idx)}
                  className="inline-flex items-center gap-1 text-caption text-ink-tertiary transition-colors hover:text-danger"
                >
                  <Trash2 className="size-3" />
                  {t("draft.days.remove_day")}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-caption text-ink-tertiary">
                    {t("draft.days.field.title_zh")}
                  </span>
                  <Input
                    value={d.title["zh-CN"]}
                    onChange={(e) => patchDay(idx, { title: { ...d.title, "zh-CN": e.target.value } })}
                    placeholder="抵达安曼"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-caption text-ink-tertiary">
                    {t("draft.days.field.title_en")}
                  </span>
                  <Input
                    value={d.title.en}
                    onChange={(e) => patchDay(idx, { title: { ...d.title, en: e.target.value } })}
                    placeholder="Arrival in Amman"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-caption text-ink-tertiary">
                    {t("draft.days.field.description_zh")}
                  </span>
                  <textarea
                    value={d.description["zh-CN"]}
                    onChange={(e) => patchDay(idx, { description: { ...d.description, "zh-CN": e.target.value } })}
                    rows={3}
                    className="rounded-lg border border-border-strong bg-transparent px-3 py-2 text-body text-ink-primary outline-none placeholder:text-ink-tertiary focus:border-accent"
                    placeholder="抵达机场,专车接送至酒店休息..."
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-caption text-ink-tertiary">
                    {t("draft.days.field.description_en")}
                  </span>
                  <textarea
                    value={d.description.en}
                    onChange={(e) => patchDay(idx, { description: { ...d.description, en: e.target.value } })}
                    rows={3}
                    className="rounded-lg border border-border-strong bg-transparent px-3 py-2 text-body text-ink-primary outline-none placeholder:text-ink-tertiary focus:border-accent"
                    placeholder="Arrive at the airport, private transfer to hotel..."
                  />
                </label>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-4 flex justify-end">
        <Button variant="secondary" size="sm" onClick={addDay}>
          <Plus className="size-3.5" />
          {t("draft.days.add_day")}
        </Button>
      </div>
    </section>
  )
}

function DraftInclusionsEditor({ draft }: { draft: DraftItinerary }) {
  const { t } = useTranslation()
  const { updateDraftInclusions, updateDraftExclusions } = useDemoState()

  const linesToText = (lines: string[]) => lines.join("\n")
  const textToLines = (text: string) =>
    text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)

  const [inclZh, setInclZh] = useState(linesToText(draft.inclusions["zh-CN"]))
  const [inclEn, setInclEn] = useState(linesToText(draft.inclusions.en))
  const [exclZh, setExclZh] = useState(linesToText(draft.exclusions["zh-CN"]))
  const [exclEn, setExclEn] = useState(linesToText(draft.exclusions.en))

  const inclDirty =
    inclZh !== linesToText(draft.inclusions["zh-CN"]) ||
    inclEn !== linesToText(draft.inclusions.en)
  const exclDirty =
    exclZh !== linesToText(draft.exclusions["zh-CN"]) ||
    exclEn !== linesToText(draft.exclusions.en)
  const dirty = inclDirty || exclDirty

  useEffect(() => {
    setInclZh(linesToText(draft.inclusions["zh-CN"]))
    setInclEn(linesToText(draft.inclusions.en))
    setExclZh(linesToText(draft.exclusions["zh-CN"]))
    setExclEn(linesToText(draft.exclusions.en))
  }, [draft.inclusions, draft.exclusions])

  const save = () => {
    if (inclDirty) {
      const zh = textToLines(inclZh)
      const en = textToLines(inclEn)
      updateDraftInclusions(draft.id, { "zh-CN": zh, en })
      toast.success(t("toast.draft.inclusions_saved", { count: Math.max(zh.length, en.length) }))
    }
    if (exclDirty) {
      const zh = textToLines(exclZh)
      const en = textToLines(exclEn)
      updateDraftExclusions(draft.id, { "zh-CN": zh, en })
      toast.success(t("toast.draft.exclusions_saved", { count: Math.max(zh.length, en.length) }))
    }
  }

  const taClass = "rounded-lg border border-border-strong bg-transparent px-3 py-2 text-body text-ink-primary outline-none placeholder:text-ink-tertiary focus:border-accent"

  return (
    <section
      id="draft-incl-editor"
      className="scroll-mt-20 rounded-lg border border-border-subtle bg-bg-raised p-6"
    >
      <header className="flex items-start justify-between gap-4 pb-4">
        <div>
          <h2 className="text-subheading text-ink-primary">{t("draft.incl.title")}</h2>
          <p className="mt-1 text-caption text-ink-tertiary">{t("draft.incl.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          {dirty ? <Badge variant="warning">{t("dmc.pricing.has_edits")}</Badge> : null}
          <Button size="sm" onClick={save} disabled={!dirty}>
            <Save className="size-3.5" />
            {t("actions.save")}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-3 rounded-md border border-success/20 bg-success-soft/30 p-4">
          <p className="text-label text-success">{t("itinerary.section.inclusions")}</p>
          <label className="flex flex-col gap-1.5">
            <span className="text-caption text-ink-tertiary">{t("draft.incl.label_zh")}</span>
            <textarea
              value={inclZh}
              onChange={(e) => setInclZh(e.target.value)}
              rows={6}
              className={taClass}
              placeholder={t("draft.incl.placeholder_zh")}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-caption text-ink-tertiary">{t("draft.incl.label_en")}</span>
            <textarea
              value={inclEn}
              onChange={(e) => setInclEn(e.target.value)}
              rows={6}
              className={taClass}
              placeholder={t("draft.incl.placeholder_en")}
            />
          </label>
        </div>

        <div className="space-y-3 rounded-md border border-danger/20 bg-danger-soft/20 p-4">
          <p className="text-label text-danger">{t("itinerary.section.exclusions")}</p>
          <label className="flex flex-col gap-1.5">
            <span className="text-caption text-ink-tertiary">{t("draft.excl.label_zh")}</span>
            <textarea
              value={exclZh}
              onChange={(e) => setExclZh(e.target.value)}
              rows={6}
              className={taClass}
              placeholder={t("draft.excl.placeholder_zh")}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-caption text-ink-tertiary">{t("draft.excl.label_en")}</span>
            <textarea
              value={exclEn}
              onChange={(e) => setExclEn(e.target.value)}
              rows={6}
              className={taClass}
              placeholder={t("draft.excl.placeholder_en")}
            />
          </label>
        </div>
      </div>
    </section>
  )
}

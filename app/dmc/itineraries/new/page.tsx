"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  CalendarRange,
  ListChecks,
  Save,
  Sparkles,
  Tag,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/lib/i18n/provider"
import { useDemoState } from "@/lib/demo-state"
import { dmcs } from "@/lib/mock/dmcs"
import type { CountryCode, DepartureType, ItineraryTheme } from "@/lib/types"
import { cn } from "@/lib/utils"

const COUNTRY_LABEL: Record<CountryCode, { "zh-CN": string; en: string }> = {
  JO: { "zh-CN": "约旦", en: "Jordan" },
  MA: { "zh-CN": "摩洛哥", en: "Morocco" },
  EG: { "zh-CN": "埃及", en: "Egypt" },
  AE: { "zh-CN": "阿联酋", en: "UAE" },
  SA: { "zh-CN": "沙特", en: "Saudi Arabia" },
  OM: { "zh-CN": "阿曼", en: "Oman" },
}

const DEFAULT_HERO = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80"

const THEMES: ItineraryTheme[] = [
  "family",
  "luxury",
  "first-time",
  "adventure",
  "cultural",
  "religious",
]

const DEPARTURE_TYPES: Array<{ value: DepartureType; labelKey: Parameters<ReturnType<typeof useTranslation>["t"]>[0] }> = [
  { value: "FIXED", labelKey: "catalog.departure_type.fixed" },
  { value: "ON_DEMAND", labelKey: "catalog.departure_type.on_demand" },
  { value: "RFQ_ONLY", labelKey: "catalog.departure_type.rfq_only" },
]

export default function DMCNewItineraryPage() {
  const router = useRouter()
  const { t, locale } = useTranslation()
  const { dmcId, createDraftItinerary } = useDemoState()
  const dmc = dmcs.find((d) => d.id === dmcId) ?? dmcs[0]

  // Identity
  const [titleZh, setTitleZh] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [subtitleZh, setSubtitleZh] = useState("")
  const [subtitleEn, setSubtitleEn] = useState("")
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO)

  // Basics
  const [countries, setCountries] = useState<Set<CountryCode>>(new Set(["AE"]))
  const [citiesText, setCitiesText] = useState("")
  const [days, setDays] = useState(5)
  const [nights, setNights] = useState(4)
  const [departureType, setDepartureType] = useState<DepartureType>("FIXED")
  const [themes, setThemes] = useState<Set<ItineraryTheme>>(new Set(["first-time"]))

  const toggle = <T,>(set: Set<T>, setSet: (s: Set<T>) => void, value: T) => {
    const next = new Set(set)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    setSet(next)
  }

  const handleSave = () => {
    if (!titleZh || !titleEn || countries.size === 0 || !citiesText.trim()) {
      toast.error(t("dmc.new.validation.required"))
      return
    }

    const id = createDraftItinerary({
      dmcId: dmc.id,
      title: { "zh-CN": titleZh, en: titleEn },
      subtitle: { "zh-CN": subtitleZh || titleZh, en: subtitleEn || titleEn },
      departureType,
      duration: { days, nights },
      countries: Array.from(countries),
      cities: citiesText.split(",").map((s) => s.trim()).filter(Boolean),
      themes: Array.from(themes),
      heroImage,
    })

    toast.success(t("toast.itinerary.created"))
    router.push(`/dmc/itineraries/${id}`)
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
        eyebrow={dmc.name}
        title={t("dmc.new.title")}
        subtitle={t("dmc.new.subtitle")}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/dmc/itineraries">{t("actions.cancel")}</Link>
            </Button>
            <Button onClick={handleSave}>
              <Save className="size-4" />
              {t("dmc.new.save_draft")}
            </Button>
          </div>
        }
      />

      <div className="space-y-8 px-8 pt-8 max-w-5xl">
        {/* Identity */}
        <FormSection
          title={t("dmc.new.section.identity")}
          hint={t("dmc.new.section.identity_hint")}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label={t("dmc.new.field.title_zh")} required>
              <Input
                value={titleZh}
                onChange={(e) => setTitleZh(e.target.value)}
                placeholder="迪拜深度7日游"
              />
            </Field>
            <Field label={t("dmc.new.field.title_en")} required>
              <Input
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Dubai Deep Dive 7D"
              />
            </Field>
            <Field label={t("dmc.new.field.subtitle_zh")}>
              <Input
                value={subtitleZh}
                onChange={(e) => setSubtitleZh(e.target.value)}
                placeholder="帆船酒店 · 沙漠营地 · 米其林晚餐"
              />
            </Field>
            <Field label={t("dmc.new.field.subtitle_en")}>
              <Input
                value={subtitleEn}
                onChange={(e) => setSubtitleEn(e.target.value)}
                placeholder="Burj Al Arab · Desert camp · Michelin dining"
              />
            </Field>
          </div>
          <Field label={t("dmc.new.field.hero_image")}>
            <Input
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
            />
            <p className="mt-1 text-caption text-ink-tertiary">
              {t("dmc.new.field.hero_image_hint")}
            </p>
          </Field>
        </FormSection>

        {/* Basics */}
        <FormSection
          title={t("dmc.new.section.basics")}
          hint={t("dmc.new.section.basics_hint")}
        >
          <Field label={t("dmc.new.field.countries")} required>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(COUNTRY_LABEL) as CountryCode[]).map((c) => {
                const active = countries.has(c)
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggle(countries, setCountries, c)}
                    className={cn(
                      "rounded-[3px] border px-3 py-1.5 text-caption transition-colors",
                      active
                        ? "border-accent-border bg-accent-soft text-accent"
                        : "border-border-subtle bg-bg-raised text-ink-secondary hover:text-ink-primary",
                    )}
                  >
                    {locale === "zh-CN"
                      ? COUNTRY_LABEL[c]["zh-CN"]
                      : COUNTRY_LABEL[c].en}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field label={t("dmc.new.field.cities")} required>
            <Input
              value={citiesText}
              onChange={(e) => setCitiesText(e.target.value)}
              placeholder="Dubai, Abu Dhabi"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label={t("dmc.new.field.duration_days")}>
              <Input
                type="number"
                min={1}
                max={30}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              />
            </Field>
            <Field label={t("dmc.new.field.duration_nights")}>
              <Input
                type="number"
                min={0}
                max={30}
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
              />
            </Field>
            <Field label={t("dmc.new.field.departure_type")}>
              <div className="flex items-center gap-1 rounded-md border border-border-subtle bg-bg-raised p-1">
                {DEPARTURE_TYPES.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDepartureType(d.value)}
                    className={cn(
                      "flex-1 rounded-[3px] px-2 py-1.5 text-caption transition-colors",
                      departureType === d.value
                        ? "bg-accent-soft text-accent"
                        : "text-ink-secondary hover:text-ink-primary",
                    )}
                  >
                    {t(d.labelKey)}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Field label={t("dmc.new.field.themes")}>
            <div className="flex flex-wrap gap-1.5">
              {THEMES.map((th) => {
                const active = themes.has(th)
                return (
                  <button
                    key={th}
                    type="button"
                    onClick={() => toggle(themes, setThemes, th)}
                    className={cn(
                      "rounded-[3px] border px-3 py-1.5 text-caption transition-colors",
                      active
                        ? "border-accent-border bg-accent-soft text-accent"
                        : "border-border-subtle bg-bg-raised text-ink-secondary hover:text-ink-primary",
                    )}
                  >
                    {t(`itinerary.theme.${th}` as Parameters<typeof t>[0])}
                  </button>
                )
              })}
            </div>
          </Field>
        </FormSection>

        {/* Next steps */}
        <FormSection
          title={t("dmc.new.section.next_steps")}
          hint={t("dmc.new.section.next_steps_hint")}
        >
          <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <NextStepCard
              icon={ListChecks}
              step={1}
              title={t("dmc.new.next.days")}
              hint={t("dmc.new.next.days_hint")}
            />
            <NextStepCard
              icon={Tag}
              step={2}
              title={t("dmc.new.next.pricing")}
              hint={t("dmc.new.next.pricing_hint")}
            />
            <NextStepCard
              icon={CalendarRange}
              step={3}
              title={t("dmc.new.next.schedules")}
              hint={t("dmc.new.next.schedules_hint")}
              disabled={departureType !== "FIXED"}
              disabledHint={
                departureType === "ON_DEMAND"
                  ? "ON_DEMAND"
                  : departureType === "RFQ_ONLY"
                    ? "RFQ_ONLY"
                    : undefined
              }
            />
            <NextStepCard
              icon={Sparkles}
              step={4}
              title={t("dmc.new.next.inclusions")}
              hint={t("dmc.new.next.inclusions_hint")}
            />
          </ol>
        </FormSection>

        <div className="flex items-center justify-end gap-2 border-t border-border-subtle pt-6">
          <Button variant="ghost" asChild>
            <Link href="/dmc/itineraries">{t("actions.cancel")}</Link>
          </Button>
          <Button onClick={handleSave}>
            <Save className="size-4" />
            {t("dmc.new.save_draft")}
          </Button>
        </div>
      </div>
    </div>
  )
}

function FormSection({
  title,
  hint,
  children,
}: {
  title: string
  hint: string
  children: React.ReactNode
}) {
  return (
    <section className="grid grid-cols-1 gap-6 rounded-lg border border-border-subtle bg-bg-raised p-6 lg:grid-cols-[260px_1fr]">
      <header className="space-y-2">
        <h2 className="text-subheading text-ink-primary">{title}</h2>
        <p className="text-caption text-ink-tertiary leading-relaxed">{hint}</p>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Field({
  label,
  children,
  required,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-caption text-ink-secondary">
        {label}
        {required ? <span className="ml-1 text-accent">*</span> : null}
      </span>
      {children}
    </label>
  )
}

function NextStepCard({
  icon: Icon,
  step,
  title,
  hint,
  disabled,
  disabledHint,
}: {
  icon: React.ComponentType<{ className?: string }>
  step: number
  title: string
  hint: string
  disabled?: boolean
  disabledHint?: string
}) {
  return (
    <li
      className={cn(
        "flex items-start gap-3 rounded-md border border-border-subtle bg-bg-sunken/30 p-4",
        disabled && "opacity-50",
      )}
    >
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-border-default bg-bg-raised text-data text-ink-secondary">
        {step}
      </span>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Icon className="size-3.5 text-ink-tertiary" />
          <span className="text-body text-ink-primary">{title}</span>
        </div>
        <p className="text-caption text-ink-tertiary">{hint}</p>
        {disabled && disabledHint ? (
          <Badge variant="neutral">N/A · {disabledHint}</Badge>
        ) : null}
      </div>
      <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-ink-quaternary" />
    </li>
  )
}

import type {
  AgencyTier,
  CountryCode,
  CustomRequest,
  HotelTier,
  ItineraryTheme,
  MarkupRule,
  RequestType,
} from "@/lib/types"

export type RuleContext = {
  requestType: RequestType
  countries: CountryCode[]
  themes: ItineraryTheme[]
  hotelTier: HotelTier
  paxCount: number
  dmcNetTotalUSD?: number
  dmcNetPerPaxUSD?: number
  agencyTier?: AgencyTier
  dmcId?: string
}

export type RuleEvaluation = {
  matchedRule: MarkupRule | null
  markupUSD: number
  autoApply: boolean
  autoForward: boolean
}

/**
 * Pure rule evaluator. Picks the first enabled rule whose matchers all pass
 * (sorted by priority ascending — lowest priority value evaluates first).
 *
 * Markup is computed against `dmcNetTotalUSD` when present. For forward-only
 * stages (no DMC quote yet), call with `dmcNetTotalUSD = undefined` and the
 * markup is reported as 0 — only `autoForward` matters at that stage.
 */
export function evaluateRules(
  rules: MarkupRule[],
  context: RuleContext,
): RuleEvaluation {
  const sorted = [...rules]
    .filter((r) => r.enabled)
    .sort((a, b) => a.priority - b.priority)

  for (const rule of sorted) {
    if (!matches(rule, context)) continue
    const markupUSD = computeMarkup(rule, context)
    return {
      matchedRule: rule,
      markupUSD,
      autoApply: rule.autoApply,
      autoForward: rule.autoForward ?? false,
    }
  }

  return { matchedRule: null, markupUSD: 0, autoApply: false, autoForward: false }
}

function matches(rule: MarkupRule, ctx: RuleContext): boolean {
  const m = rule.matchers

  if (m.countries && m.countries.length > 0) {
    const hit = ctx.countries.some((c) => m.countries!.includes(c))
    if (!hit) return false
  }
  if (m.dmcIds && m.dmcIds.length > 0) {
    if (!ctx.dmcId || !m.dmcIds.includes(ctx.dmcId)) return false
  }
  if (m.themes && m.themes.length > 0) {
    const hit = ctx.themes.some((t) => m.themes!.includes(t))
    if (!hit) return false
  }
  if (m.requestType && m.requestType.length > 0) {
    if (!m.requestType.includes(ctx.requestType)) return false
  }
  if (m.hotelTier && m.hotelTier.length > 0) {
    if (!m.hotelTier.includes(ctx.hotelTier)) return false
  }
  if (m.agencyTier && m.agencyTier.length > 0) {
    if (!ctx.agencyTier || !m.agencyTier.includes(ctx.agencyTier)) return false
  }
  if (m.minPaxNetUSD !== undefined) {
    if (ctx.dmcNetPerPaxUSD === undefined || ctx.dmcNetPerPaxUSD < m.minPaxNetUSD) return false
  }
  if (m.maxPaxNetUSD !== undefined) {
    if (ctx.dmcNetPerPaxUSD === undefined || ctx.dmcNetPerPaxUSD > m.maxPaxNetUSD) return false
  }
  if (m.minTotalNetUSD !== undefined) {
    if (ctx.dmcNetTotalUSD === undefined || ctx.dmcNetTotalUSD < m.minTotalNetUSD) return false
  }
  if (m.maxTotalNetUSD !== undefined) {
    if (ctx.dmcNetTotalUSD === undefined || ctx.dmcNetTotalUSD > m.maxTotalNetUSD) return false
  }
  return true
}

function computeMarkup(rule: MarkupRule, ctx: RuleContext): number {
  const { formula, value, minMarkupUSD, maxMarkupUSD, tiers } = rule.markup
  const totalNet = ctx.dmcNetTotalUSD ?? 0
  const pax = Math.max(1, ctx.paxCount)

  let raw = 0
  switch (formula) {
    case "percentage":
      raw = totalNet * (value / 100)
      break
    case "fixed_per_pax":
      raw = value * pax
      break
    case "fixed_total":
      raw = value
      break
    case "tiered_percentage": {
      if (!tiers || tiers.length === 0) {
        raw = totalNet * (value / 100)
        break
      }
      const sortedTiers = [...tiers].sort((a, b) => a.uptoNetUSD - b.uptoNetUSD)
      const tier = sortedTiers.find((t) => totalNet <= t.uptoNetUSD)
      const percent = tier?.percent ?? value
      raw = totalNet * (percent / 100)
      break
    }
  }

  if (minMarkupUSD !== undefined && raw < minMarkupUSD) raw = minMarkupUSD
  if (maxMarkupUSD !== undefined && raw > maxMarkupUSD) raw = maxMarkupUSD
  return Math.round(raw)
}

/** Convenience: derive a `RuleContext` from a `CustomRequest`. */
export function contextFromRequest(
  req: CustomRequest,
  opts: { agencyTier?: AgencyTier; dmcId?: string } = {},
): RuleContext {
  const paxCount =
    req.payload.pax.adults + req.payload.pax.children + req.payload.pax.infants
  return {
    requestType: req.type,
    countries: req.payload.destinations,
    themes: req.payload.themes,
    hotelTier: req.payload.hotelTier,
    paxCount: Math.max(1, paxCount),
    dmcNetTotalUSD: req.pricing.dmcNetTotalUSD,
    dmcNetPerPaxUSD: req.pricing.dmcNetPerPaxUSD,
    agencyTier: opts.agencyTier,
    dmcId: opts.dmcId ?? req.routing.assignedDmcId,
  }
}

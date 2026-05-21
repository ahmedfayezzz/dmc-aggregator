"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  CustomRequest,
  MarkupRule,
  RequestEvent,
  RequestState,
  RequestActor,
} from "@/lib/types"
import { customRequests as seedRequests } from "@/lib/mock/custom-requests"
import {
  platformMarkupRules as seedPlatformRules,
  wholesalerMarkupRules as seedWholesalerRules,
} from "@/lib/mock/markup-rules"
import { evaluateRules, contextFromRequest } from "@/lib/rfq/evaluate-rules"

export type Persona = "wholesaler" | "agency" | "dmc" | "platform"

export type BookingAction = "confirmed" | "declined"
export type RFQAction =
  | { kind: "quoted"; amountUSD: number }
  | { kind: "declined" }

export type DepartureDraft = {
  itineraryId: string
  date: string
  capacity: number
}

export type PricingEdit = {
  itineraryId: string
  perPaxOverrides: Record<string, number> // key: "bandIdx-seasonIdx"
  seasonMultiplierOverrides: Record<number, number> // key: seasonIdx
}

export type AllotmentEdit = {
  itineraryId: string
  capacityOverrides: Record<string, number> // key: departureId
  weeklyCapacity?: number
  blackoutDates: string[]
}

export type DraftDay = {
  day: number
  title: { "zh-CN": string; en: string }
  description: { "zh-CN": string; en: string }
}

export type DraftItinerary = {
  id: string
  dmcId: string
  title: { "zh-CN": string; en: string }
  subtitle: { "zh-CN": string; en: string }
  departureType: "FIXED" | "ON_DEMAND" | "RFQ_ONLY"
  duration: { days: number; nights: number }
  countries: Array<"AE" | "SA" | "JO" | "OM" | "EG" | "MA">
  cities: string[]
  themes: Array<"family" | "luxury" | "first-time" | "adventure" | "cultural" | "religious">
  heroImage: string
  days: DraftDay[]
  inclusions: { "zh-CN": string[]; en: string[] }
  exclusions: { "zh-CN": string[]; en: string[] }
  createdAt: string
}

export type DemoState = {
  persona: Persona
  agencyId: string
  dmcId: string
  bookingDraft: {
    itineraryId: string | null
    departureId: string | null
    adults: number
    children: number
    infants: number
    twinRooms: number
    singleSupplement: boolean
  }
  /** DMC-side optimistic state overrides for bookings */
  bookingActions: Record<string, BookingAction>
  /** DMC-side itinerary publish state (true=published, false=draft, undefined=use original) */
  publishedItineraries: Record<string, boolean>
  /** Wholesaler-side: which agencies an itinerary is published to (overrides mock data) */
  publishedToAgencies: Record<string, string[]>
  /** Wholesaler-side: editable markup per itinerary */
  wholesalerMarkups: Record<string, number>
  /** Wholesaler-side: RFQ response actions */
  rfqActions: Record<string, RFQAction>
  /** Agency wallet balance override */
  agencyWalletDeltas: Record<string, number>
  /** Per-agency wallet mode override */
  agencyWalletModeOverrides: Record<string, "DEBIT" | "CREDIT">
  /** Added departures via DMC schedules */
  addedDepartures: DepartureDraft[]
  /** Pricing edits */
  pricingEdits: Record<string, PricingEdit>
  /** Allotment edits */
  allotmentEdits: Record<string, AllotmentEdit>
  /** Draft itineraries created via /dmc/itineraries/new */
  draftItineraries: DraftItinerary[]
  /** Custom RFQ pipeline — seeded from mock + new requests submitted at runtime */
  customRequests: CustomRequest[]
  /** Platform-wide markup rules (Safasoft DMC scope) */
  platformRules: MarkupRule[]
  /** Per-wholesaler markup rule sets, keyed by wholesalerId */
  wholesalerRules: Record<string, MarkupRule[]>

  setPersona: (p: Persona) => void
  setAgency: (id: string) => void
  setDMC: (id: string) => void
  setBookingDraft: (patch: Partial<DemoState["bookingDraft"]>) => void
  resetBookingDraft: () => void
  confirmBooking: (id: string) => void
  declineBooking: (id: string) => void
  resetBookingAction: (id: string) => void
  togglePublished: (itineraryId: string) => void
  setPublishedToAgencies: (itineraryId: string, agencyIds: string[]) => void
  setWholesalerMarkup: (itineraryId: string, amount: number) => void
  quoteRFQ: (rfqId: string, amountUSD: number) => void
  declineRFQ: (rfqId: string) => void
  topUpAgencyWallet: (agencyId: string, amountCNY: number) => void
  deductAgencyWallet: (agencyId: string, amountCNY: number) => void
  setAgencyWalletMode: (agencyId: string, mode: "DEBIT" | "CREDIT") => void
  addDeparture: (d: DepartureDraft) => void
  setPricingEdit: (itineraryId: string, patch: Partial<Omit<PricingEdit, "itineraryId">>) => void
  setAllotmentEdit: (itineraryId: string, patch: Partial<Omit<AllotmentEdit, "itineraryId">>) => void
  clearAllotmentEdit: (itineraryId: string) => void
  createDraftItinerary: (
    draft: Omit<DraftItinerary, "id" | "createdAt" | "days" | "inclusions" | "exclusions">,
  ) => string
  updateDraftDays: (itineraryId: string, days: DraftDay[]) => void
  updateDraftInclusions: (
    itineraryId: string,
    inclusions: { "zh-CN": string[]; en: string[] },
  ) => void
  updateDraftExclusions: (
    itineraryId: string,
    exclusions: { "zh-CN": string[]; en: string[] },
  ) => void

  // ── Custom RFQ pipeline ──
  /**
   * Submit a new custom request (from agency portal). The new request
   * automatically advances through the pipeline based on matching auto-rules
   * until it lands at a stage that requires human action.
   */
  submitCustomRequest: (
    draft: Omit<
      CustomRequest,
      "id" | "state" | "events" | "routing" | "pricing" | "createdAt" | "updatedAt"
    >,
  ) => string
  /** Forward a request to the next stage (wholesaler→platform→DMC). */
  forwardCustomRequest: (
    id: string,
    actor: RequestActor,
    actorName: string,
    note?: string,
  ) => void
  /** DMC submits their net quote — kicks off the return leg. */
  quoteCustomRequest: (
    id: string,
    dmcNetTotalUSD: number,
    actorName: string,
    note?: string,
  ) => void
  /** Apply a markup at the current return-leg stage (platform or wholesaler). */
  applyCustomRequestMarkup: (
    id: string,
    scope: "platform" | "wholesaler",
    markupUSD: number,
    actorName: string,
    matchedRuleId?: string,
    note?: string,
  ) => void
  /** Agency accepts the final quote. */
  acceptCustomRequest: (id: string, actorName: string) => void
  /** Decline at any stage. */
  declineCustomRequest: (id: string, actor: RequestActor, actorName: string, reason: string) => void

  // ── Markup rule management ──
  /** Insert or replace a rule. If `id` matches an existing rule it's replaced; otherwise appended. */
  upsertMarkupRule: (
    scope: "platform" | "wholesaler",
    wholesalerId: string | null,
    rule: MarkupRule,
  ) => void
  /** Remove a rule by id. */
  removeMarkupRule: (
    scope: "platform" | "wholesaler",
    wholesalerId: string | null,
    ruleId: string,
  ) => void
  /** Reorder rules by reassigning priorities. */
  reorderMarkupRules: (
    scope: "platform" | "wholesaler",
    wholesalerId: string | null,
    orderedIds: string[],
  ) => void
  /** Toggle a rule's enabled flag. */
  toggleRuleEnabled: (
    scope: "platform" | "wholesaler",
    wholesalerId: string | null,
    ruleId: string,
  ) => void
  /** Restore all rules in a scope to the original seed. */
  resetMarkupRules: (scope: "platform" | "wholesaler", wholesalerId: string | null) => void
}

const initialBookingDraft: DemoState["bookingDraft"] = {
  itineraryId: null,
  departureId: null,
  adults: 2,
  children: 0,
  infants: 0,
  twinRooms: 1,
  singleSupplement: false,
}

export const useDemoState = create<DemoState>()(
  persist(
    (set) => ({
      persona: "wholesaler",
      agencyId: "ag-001",
      dmcId: "dmc-001",
      bookingDraft: initialBookingDraft,
      bookingActions: {},
      publishedItineraries: {},
      publishedToAgencies: {},
      wholesalerMarkups: {},
      rfqActions: {},
      agencyWalletDeltas: {},
      agencyWalletModeOverrides: {},
      addedDepartures: [],
      pricingEdits: {},
      allotmentEdits: {},
      draftItineraries: [],
      customRequests: seedRequests,
      platformRules: seedPlatformRules,
      wholesalerRules: seedWholesalerRules,
      setPersona: (p) => set({ persona: p }),
      setAgency: (id) => set({ agencyId: id }),
      setDMC: (id) => set({ dmcId: id }),
      setBookingDraft: (patch) =>
        set((s) => ({ bookingDraft: { ...s.bookingDraft, ...patch } })),
      resetBookingDraft: () => set({ bookingDraft: initialBookingDraft }),
      confirmBooking: (id) =>
        set((s) => ({ bookingActions: { ...s.bookingActions, [id]: "confirmed" } })),
      declineBooking: (id) =>
        set((s) => ({ bookingActions: { ...s.bookingActions, [id]: "declined" } })),
      resetBookingAction: (id) =>
        set((s) => {
          const next = { ...s.bookingActions }
          delete next[id]
          return { bookingActions: next }
        }),
      togglePublished: (itineraryId) =>
        set((s) => ({
          publishedItineraries: {
            ...s.publishedItineraries,
            [itineraryId]: !(s.publishedItineraries[itineraryId] ?? true),
          },
        })),
      setPublishedToAgencies: (itineraryId, agencyIds) =>
        set((s) => ({
          publishedToAgencies: { ...s.publishedToAgencies, [itineraryId]: agencyIds },
        })),
      setWholesalerMarkup: (itineraryId, amount) =>
        set((s) => ({
          wholesalerMarkups: { ...s.wholesalerMarkups, [itineraryId]: amount },
        })),
      quoteRFQ: (rfqId, amountUSD) =>
        set((s) => ({
          rfqActions: { ...s.rfqActions, [rfqId]: { kind: "quoted", amountUSD } },
        })),
      declineRFQ: (rfqId) =>
        set((s) => ({
          rfqActions: { ...s.rfqActions, [rfqId]: { kind: "declined" } },
        })),
      topUpAgencyWallet: (agencyId, amountCNY) =>
        set((s) => ({
          agencyWalletDeltas: {
            ...s.agencyWalletDeltas,
            [agencyId]: (s.agencyWalletDeltas[agencyId] ?? 0) + amountCNY,
          },
        })),
      deductAgencyWallet: (agencyId, amountCNY) =>
        set((s) => ({
          agencyWalletDeltas: {
            ...s.agencyWalletDeltas,
            [agencyId]: (s.agencyWalletDeltas[agencyId] ?? 0) - amountCNY,
          },
        })),
      setAgencyWalletMode: (agencyId, mode) =>
        set((s) => ({
          agencyWalletModeOverrides: { ...s.agencyWalletModeOverrides, [agencyId]: mode },
        })),
      addDeparture: (d) =>
        set((s) => ({ addedDepartures: [...s.addedDepartures, d] })),
      setPricingEdit: (itineraryId, patch) =>
        set((s) => {
          const current = s.pricingEdits[itineraryId] ?? {
            itineraryId,
            perPaxOverrides: {},
            seasonMultiplierOverrides: {},
          }
          return {
            pricingEdits: {
              ...s.pricingEdits,
              [itineraryId]: {
                ...current,
                ...patch,
                perPaxOverrides: { ...current.perPaxOverrides, ...(patch.perPaxOverrides ?? {}) },
                seasonMultiplierOverrides: {
                  ...current.seasonMultiplierOverrides,
                  ...(patch.seasonMultiplierOverrides ?? {}),
                },
              },
            },
          }
        }),
      setAllotmentEdit: (itineraryId, patch) =>
        set((s) => {
          const current = s.allotmentEdits[itineraryId] ?? {
            itineraryId,
            capacityOverrides: {},
            blackoutDates: [],
          }
          return {
            allotmentEdits: {
              ...s.allotmentEdits,
              [itineraryId]: {
                ...current,
                ...patch,
                capacityOverrides: {
                  ...current.capacityOverrides,
                  ...(patch.capacityOverrides ?? {}),
                },
                blackoutDates: patch.blackoutDates ?? current.blackoutDates,
              },
            },
          }
        }),
      clearAllotmentEdit: (itineraryId) =>
        set((s) => {
          const next = { ...s.allotmentEdits }
          delete next[itineraryId]
          return { allotmentEdits: next }
        }),
      createDraftItinerary: (draft) => {
        const id = `it-draft-${Date.now().toString(36)}`
        const days: DraftDay[] = Array.from(
          { length: Math.max(1, draft.duration.days) },
          (_, i) => ({
            day: i + 1,
            title: { "zh-CN": "", en: "" },
            description: { "zh-CN": "", en: "" },
          }),
        )
        const newDraft: DraftItinerary = {
          ...draft,
          id,
          createdAt: new Date().toISOString(),
          days,
          inclusions: { "zh-CN": [], en: [] },
          exclusions: { "zh-CN": [], en: [] },
        }
        set((s) => ({
          draftItineraries: [...s.draftItineraries, newDraft],
          // New drafts default to unpublished (not yet on the catalog)
          publishedItineraries: { ...s.publishedItineraries, [id]: false },
        }))
        return id
      },
      updateDraftDays: (itineraryId, days) =>
        set((s) => ({
          draftItineraries: s.draftItineraries.map((d) =>
            d.id === itineraryId ? { ...d, days } : d,
          ),
        })),
      updateDraftInclusions: (itineraryId, inclusions) =>
        set((s) => ({
          draftItineraries: s.draftItineraries.map((d) =>
            d.id === itineraryId ? { ...d, inclusions } : d,
          ),
        })),
      updateDraftExclusions: (itineraryId, exclusions) =>
        set((s) => ({
          draftItineraries: s.draftItineraries.map((d) =>
            d.id === itineraryId ? { ...d, exclusions } : d,
          ),
        })),

      // ── Custom RFQ pipeline ──

      submitCustomRequest: (draft) => {
        const id = `cr-${Date.now().toString(36)}`
        const nowIso = new Date().toISOString()
        const events: RequestEvent[] = [
          {
            ts: nowIso,
            actor: "agency",
            action: "submitted",
          },
        ]
        // Read live rules from state (editable via the rules pages)
        const currentState = useDemoState.getState()
        const wholesalerRules = currentState.wholesalerRules[draft.wholesalerId] ?? []
        const ctxNoDmc = {
          requestType: draft.type,
          countries: draft.payload.destinations,
          themes: draft.payload.themes,
          hotelTier: draft.payload.hotelTier,
          paxCount: Math.max(
            1,
            draft.payload.pax.adults + draft.payload.pax.children + draft.payload.pax.infants,
          ),
          agencyTier: "standard" as const,
        }
        const wEval = evaluateRules(wholesalerRules, ctxNoDmc)
        const pEval = evaluateRules(currentState.platformRules, ctxNoDmc)

        let nextState: RequestState = "AWAITING_WHOLESALER_REVIEW"
        let holder: RequestActor = "wholesaler"

        if (wEval.autoForward) {
          events.push({
            ts: nowIso,
            actor: "system",
            action: "forwarded",
            matchedRuleId: wEval.matchedRule?.id,
            note: `Auto-forwarded by wholesaler rule ${wEval.matchedRule?.name ?? ""}`,
          })
          nextState = "AWAITING_PLATFORM_REVIEW"
          holder = "platform"

          if (pEval.autoForward) {
            events.push({
              ts: nowIso,
              actor: "system",
              action: "forwarded",
              matchedRuleId: pEval.matchedRule?.id,
              note: `Auto-forwarded by platform rule ${pEval.matchedRule?.name ?? ""}`,
            })
            nextState = "AWAITING_DMC_QUOTE"
            holder = "dmc"
          }
        }

        const newRequest: CustomRequest = {
          ...draft,
          id,
          state: nextState,
          routing: {
            currentHolder: holder,
            direction: "forward",
            assignedDmcId: nextState === "AWAITING_DMC_QUOTE" ? undefined : undefined,
          },
          pricing: {},
          events,
          createdAt: nowIso,
          updatedAt: nowIso,
        }
        set((s) => ({ customRequests: [...s.customRequests, newRequest] }))
        return id
      },

      forwardCustomRequest: (id, actor, actorName, note) =>
        set((s) => ({
          customRequests: s.customRequests.map((r) => {
            if (r.id !== id) return r
            const nowIso = new Date().toISOString()
            const nextStateMap: Record<RequestState, { state: RequestState; holder: RequestActor }> = {
              AWAITING_WHOLESALER_REVIEW: {
                state: "AWAITING_PLATFORM_REVIEW",
                holder: "platform",
              },
              AWAITING_PLATFORM_REVIEW: {
                state: "AWAITING_DMC_QUOTE",
                holder: "dmc",
              },
              AWAITING_DMC_QUOTE: r.routing, // no-op
              PLATFORM_APPLYING_MARKUP: r.routing,
              WHOLESALER_APPLYING_MARKUP: r.routing,
              QUOTED_TO_AGENCY: r.routing,
              ACCEPTED: r.routing,
              DECLINED: r.routing,
              EXPIRED: r.routing,
              DRAFT: r.routing,
              AWAITING_AGENCY_CLARIFICATION: r.routing,
            } as never
            const next = (nextStateMap as Record<RequestState, { state: RequestState; holder: RequestActor }>)[r.state]
            const nextState = "state" in next ? next.state : r.state
            const nextHolder = "holder" in next ? next.holder : r.routing.currentHolder
            return {
              ...r,
              state: nextState,
              routing: { ...r.routing, currentHolder: nextHolder, direction: "forward" },
              events: [
                ...r.events,
                { ts: nowIso, actor, actorName, action: "forwarded", note },
              ],
              updatedAt: nowIso,
            }
          }),
        })),

      quoteCustomRequest: (id, dmcNetTotalUSD, actorName, note) =>
        set((s) => ({
          customRequests: s.customRequests.map((r) => {
            if (r.id !== id) return r
            const nowIso = new Date().toISOString()
            const paxCount = Math.max(
              1,
              r.payload.pax.adults + r.payload.pax.children + r.payload.pax.infants,
            )
            const dmcNetPerPaxUSD = Math.round(dmcNetTotalUSD / paxCount)
            const updated: CustomRequest = {
              ...r,
              state: "PLATFORM_APPLYING_MARKUP",
              routing: { ...r.routing, currentHolder: "platform", direction: "backward" },
              pricing: { ...r.pricing, dmcNetTotalUSD, dmcNetPerPaxUSD },
              events: [
                ...r.events,
                { ts: nowIso, actor: "dmc", actorName, action: "quoted", amountUSD: dmcNetTotalUSD, note },
              ],
              updatedAt: nowIso,
            }
            // Now try to auto-apply platform markup if rule permits
            const platformRules = useDemoState.getState().platformRules
            const pEval = evaluateRules(
              platformRules,
              contextFromRequest(updated, { agencyTier: "standard" }),
            )
            if (pEval.autoApply && pEval.matchedRule) {
              const next: CustomRequest = {
                ...updated,
                state: "WHOLESALER_APPLYING_MARKUP",
                routing: { ...updated.routing, currentHolder: "wholesaler" },
                pricing: {
                  ...updated.pricing,
                  platformMarkupUSD: pEval.markupUSD,
                  platformMarkupRuleId: pEval.matchedRule.id,
                },
                events: [
                  ...updated.events,
                  {
                    ts: nowIso,
                    actor: "system",
                    action: "markup_applied",
                    amountUSD: pEval.markupUSD,
                    matchedRuleId: pEval.matchedRule.id,
                    note: `Auto-applied · ${pEval.matchedRule.name}`,
                  },
                ],
                updatedAt: nowIso,
              }
              // Try to auto-apply wholesaler markup too
              const wRules = useDemoState.getState().wholesalerRules[next.wholesalerId] ?? []
              const wEval = evaluateRules(
                wRules,
                contextFromRequest(next, { agencyTier: "standard" }),
              )
              if (wEval.autoApply && wEval.matchedRule) {
                const agencyRetailUSD =
                  (next.pricing.dmcNetTotalUSD ?? 0) +
                  (next.pricing.platformMarkupUSD ?? 0) +
                  wEval.markupUSD
                return {
                  ...next,
                  state: "QUOTED_TO_AGENCY",
                  routing: { ...next.routing, currentHolder: "agency" },
                  pricing: {
                    ...next.pricing,
                    wholesalerMarkupUSD: wEval.markupUSD,
                    wholesalerMarkupRuleId: wEval.matchedRule.id,
                    agencyRetailUSD,
                  },
                  events: [
                    ...next.events,
                    {
                      ts: nowIso,
                      actor: "system",
                      action: "markup_applied",
                      amountUSD: wEval.markupUSD,
                      matchedRuleId: wEval.matchedRule.id,
                      note: `Auto-applied · ${wEval.matchedRule.name}`,
                    },
                  ],
                  expiresAt: new Date(Date.now() + 72 * 3600_000).toISOString(),
                  updatedAt: nowIso,
                }
              }
              return next
            }
            return updated
          }),
        })),

      applyCustomRequestMarkup: (id, scope, markupUSD, actorName, matchedRuleId, note) =>
        set((s) => ({
          customRequests: s.customRequests.map((r) => {
            if (r.id !== id) return r
            const nowIso = new Date().toISOString()
            const pricingPatch =
              scope === "platform"
                ? { platformMarkupUSD: markupUSD, platformMarkupRuleId: matchedRuleId }
                : { wholesalerMarkupUSD: markupUSD, wholesalerMarkupRuleId: matchedRuleId }
            const newPricing = { ...r.pricing, ...pricingPatch }
            const nextState: RequestState =
              scope === "platform" ? "WHOLESALER_APPLYING_MARKUP" : "QUOTED_TO_AGENCY"
            const nextHolder: RequestActor = scope === "platform" ? "wholesaler" : "agency"
            const agencyRetailUSD =
              scope === "wholesaler"
                ? (newPricing.dmcNetTotalUSD ?? 0) +
                  (newPricing.platformMarkupUSD ?? 0) +
                  (newPricing.wholesalerMarkupUSD ?? 0)
                : undefined
            return {
              ...r,
              state: nextState,
              routing: { ...r.routing, currentHolder: nextHolder, direction: "backward" },
              pricing: {
                ...newPricing,
                ...(agencyRetailUSD !== undefined ? { agencyRetailUSD } : {}),
              },
              events: [
                ...r.events,
                {
                  ts: nowIso,
                  actor: scope,
                  actorName,
                  action: "markup_applied",
                  amountUSD: markupUSD,
                  matchedRuleId,
                  note,
                },
              ],
              expiresAt:
                scope === "wholesaler"
                  ? new Date(Date.now() + 72 * 3600_000).toISOString()
                  : r.expiresAt,
              updatedAt: nowIso,
            }
          }),
        })),

      acceptCustomRequest: (id, actorName) =>
        set((s) => ({
          customRequests: s.customRequests.map((r) => {
            if (r.id !== id) return r
            const nowIso = new Date().toISOString()
            return {
              ...r,
              state: "ACCEPTED",
              events: [
                ...r.events,
                { ts: nowIso, actor: "agency", actorName, action: "accepted" },
              ],
              updatedAt: nowIso,
            }
          }),
        })),

      declineCustomRequest: (id, actor, actorName, reason) =>
        set((s) => ({
          customRequests: s.customRequests.map((r) => {
            if (r.id !== id) return r
            const nowIso = new Date().toISOString()
            return {
              ...r,
              state: "DECLINED",
              routing: { ...r.routing, direction: "backward" },
              events: [
                ...r.events,
                { ts: nowIso, actor, actorName, action: "declined", note: reason },
              ],
              updatedAt: nowIso,
            }
          }),
        })),

      // ── Markup rule management ──

      upsertMarkupRule: (scope, wholesalerId, rule) =>
        set((s) => {
          const nowIso = new Date().toISOString()
          const incoming: MarkupRule = { ...rule, updatedAt: nowIso }
          if (scope === "platform") {
            const idx = s.platformRules.findIndex((r) => r.id === incoming.id)
            const next =
              idx >= 0
                ? s.platformRules.map((r, i) => (i === idx ? incoming : r))
                : [...s.platformRules, incoming]
            return { platformRules: next.sort((a, b) => a.priority - b.priority) }
          }
          if (!wholesalerId) return s
          const list = s.wholesalerRules[wholesalerId] ?? []
          const idx = list.findIndex((r) => r.id === incoming.id)
          const next =
            idx >= 0
              ? list.map((r, i) => (i === idx ? incoming : r))
              : [...list, incoming]
          return {
            wholesalerRules: {
              ...s.wholesalerRules,
              [wholesalerId]: next.sort((a, b) => a.priority - b.priority),
            },
          }
        }),

      removeMarkupRule: (scope, wholesalerId, ruleId) =>
        set((s) => {
          if (scope === "platform") {
            return { platformRules: s.platformRules.filter((r) => r.id !== ruleId) }
          }
          if (!wholesalerId) return s
          const list = s.wholesalerRules[wholesalerId] ?? []
          return {
            wholesalerRules: {
              ...s.wholesalerRules,
              [wholesalerId]: list.filter((r) => r.id !== ruleId),
            },
          }
        }),

      reorderMarkupRules: (scope, wholesalerId, orderedIds) =>
        set((s) => {
          const reorder = (list: MarkupRule[]) => {
            const byId = new Map(list.map((r) => [r.id, r]))
            return orderedIds
              .map((id, idx) => {
                const r = byId.get(id)
                if (!r) return null
                // Reassign priority based on new position, in increments of 10
                return { ...r, priority: (idx + 1) * 10 }
              })
              .filter(Boolean) as MarkupRule[]
          }
          if (scope === "platform") {
            return { platformRules: reorder(s.platformRules) }
          }
          if (!wholesalerId) return s
          const list = s.wholesalerRules[wholesalerId] ?? []
          return {
            wholesalerRules: { ...s.wholesalerRules, [wholesalerId]: reorder(list) },
          }
        }),

      toggleRuleEnabled: (scope, wholesalerId, ruleId) =>
        set((s) => {
          const flip = (list: MarkupRule[]) =>
            list.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
          if (scope === "platform") {
            return { platformRules: flip(s.platformRules) }
          }
          if (!wholesalerId) return s
          const list = s.wholesalerRules[wholesalerId] ?? []
          return {
            wholesalerRules: { ...s.wholesalerRules, [wholesalerId]: flip(list) },
          }
        }),

      resetMarkupRules: (scope, wholesalerId) =>
        set((s) => {
          if (scope === "platform") {
            return { platformRules: seedPlatformRules }
          }
          if (!wholesalerId) return s
          const seed = seedWholesalerRules[wholesalerId] ?? []
          return {
            wholesalerRules: { ...s.wholesalerRules, [wholesalerId]: seed },
          }
        }),
    }),
    { name: "dmc-aggregator:demo" },
  ),
)

export const personaHome: Record<Persona, string> = {
  wholesaler: "/wholesaler/dashboard",
  agency: "/agency/browse",
  dmc: "/dmc/dashboard",
  platform: "/platform/overview",
}

"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

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

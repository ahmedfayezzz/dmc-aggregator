import type { Localized } from "./i18n/get-localized"

// ─── Identity ─────────────────────────────────────────────────

export type Wholesaler = {
  id: string
  legalName: Localized
  displayName: Localized
  subdomain: string
  brand: {
    primary: string
    accent: string
    logoUrl: string
    markUrl: string
  }
  contractStart: string
  walletWithPlatform: {
    mode: "DEBIT" | "CREDIT"
    creditLimitUSD: number
    currentBalanceUSD: number
  }
  agencyCount: number
  monthlyGMV_USD: number
}

export type Agency = {
  id: string
  wholesalerId: string
  name: Localized
  location: Localized
  licenseNumber: string
  contactName: Localized
  contactRole: Localized
  walletMode: "DEBIT" | "CREDIT"
  walletBalanceCNY: number
  creditLimit: number
  totalBookings: number
  gmvCNY: number
  status: "active" | "pending_kyc" | "suspended"
  joinedAt: string
}

export type CountryCode = "AE" | "SA" | "JO" | "OM" | "EG" | "MA"

export type DMC = {
  id: string
  name: string
  country: CountryCode
  city: string
  contact: string
  trustTier: "NEW" | "VERIFIED" | "TRUSTED"
  settlementCurrency: "USD" | "AED" | "SAR" | "OMR" | "JOD" | "MAD" | "EGP" | "EUR"
  paymentTermsDays: 15 | 30 | 60
}

// ─── Catalog ──────────────────────────────────────────────────

export type ItineraryTheme =
  | "family"
  | "luxury"
  | "first-time"
  | "adventure"
  | "cultural"
  | "religious"

export type DepartureType = "FIXED" | "ON_DEMAND" | "RFQ_ONLY"

export type Itinerary = {
  id: string
  dmcId: string
  title: Localized
  subtitle: Localized
  departureType: DepartureType
  duration: { days: number; nights: number }
  countries: CountryCode[]
  cities: string[]
  themes: ItineraryTheme[]
  heroImage: string
  gallery: string[]
  highlights: Localized<string[]>
  days: ItineraryDay[]
  inclusions: Localized<string[]>
  exclusions: Localized<string[]>
  pricing: PricingRules
  marginLayers: MarginBreakdown
  cancellationPolicy: CancellationPolicy
  departures: Departure[]
  translations: {
    "zh-CN": { reviewed: boolean; reviewedAt?: string }
    en: { reviewed: boolean; reviewedAt?: string }
  }
  publishedToAgencies: string[]
}

export type ItineraryActivityType =
  | "TRANSFER"
  | "ACCOMMODATION"
  | "GUIDE"
  | "MEAL"
  | "ENTRANCE"
  | "ACTIVITY"

export type ItineraryDay = {
  day: number
  title: Localized
  description: Localized
  activities: Array<{
    type: ItineraryActivityType
    name: Localized
  }>
}

export type PricingRules = {
  sourceCurrency: "USD" | "AED" | "SAR" | "OMR" | "JOD" | "MAD" | "EGP" | "EUR"
  bands: Array<{
    paxRange: string
    minPax: number
    maxPax: number
    perPaxUSD: number
  }>
  singleSupplementUSD: number
  seasons: Array<{
    name: string
    dateRange: string
    multiplier: number
  }>
}

export type MarginBreakdown = {
  dmcNetPerPaxUSD: number
  ourMarkupUSD: number
  wholesalerSellUSD: number
  wholesalerSuggestedMarkupUSD: number
  agencyRetailUSD: number
}

export type CancellationPolicy = {
  name: Localized
  tiers: Array<{
    daysBefore: number
    penaltyPercent: number
  }>
}

export type DepartureStatus = "OPEN" | "GUARANTEED" | "FULL" | "CLOSED" | "CANCELLED"

export type Departure = {
  id: string
  itineraryId: string
  date: string
  capacity: number
  booked: number
  status: DepartureStatus
}

// ─── Bookings ─────────────────────────────────────────────────

export type BookingState =
  | "DRAFT"
  | "QUOTE"
  | "RFQ_SUBMITTED"
  | "RFQ_QUOTED"
  | "RFQ_DECLINED"
  | "EXPIRED"
  | "BOOKING_REQUESTED"
  | "BOOKING_PENDING"
  | "CONFIRMED_PENDING_GUARANTEE"
  | "CONFIRMED"
  | "CONFIRMED_AMENDMENT_PENDING"
  | "CANCELLED"
  | "TRAVELLED"
  | "SETTLED"

export type Booking = {
  id: string
  reference: string
  agencyId: string
  itineraryId: string
  departureId?: string
  state: BookingState
  pax: { adults: number; children: number; infants: number }
  totalAmountUSD: number
  totalAmountCNY: number
  createdAt: string
  confirmedAt?: string
  cancelledAt?: string
  voucherUrl?: string
}

// ─── RFQ ──────────────────────────────────────────────────────

export type RFQState = "RFQ_SUBMITTED" | "RFQ_QUOTED" | "RFQ_DECLINED"

export type RFQ = {
  id: string
  agencyId: string
  itineraryId: string
  customization: Localized
  notes: Localized
  submittedAt: string
  slaExpiresAt: string
  state: RFQState
  quotedAmountUSD?: number
}

// ─── Custom RFQ pipeline ──────────────────────────────────────

export type RequestType = "MODIFY_EXISTING" | "FROM_SCRATCH"

export type RequestState =
  | "DRAFT"
  | "AWAITING_WHOLESALER_REVIEW"
  | "AWAITING_PLATFORM_REVIEW"
  | "AWAITING_DMC_QUOTE"
  | "PLATFORM_APPLYING_MARKUP"
  | "WHOLESALER_APPLYING_MARKUP"
  | "QUOTED_TO_AGENCY"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "AWAITING_AGENCY_CLARIFICATION"

export type HotelTier = "3" | "4" | "5" | "5+" | "mixed"
export type BudgetBand = "standard" | "premium" | "luxury" | "unlimited"
export type AgencyTier = "standard" | "gold" | "vip"

export type RequestActor = "agency" | "wholesaler" | "platform" | "dmc" | "system"
export type RequestDirection = "forward" | "backward"

export type RequestEvent = {
  ts: string
  actor: RequestActor
  actorName?: string
  action:
    | "submitted"
    | "forwarded"
    | "declined"
    | "quoted"
    | "markup_applied"
    | "accepted"
    | "expired"
    | "clarification_requested"
    | "clarification_provided"
  note?: string
  matchedRuleId?: string
  amountUSD?: number
}

export type CustomRequest = {
  id: string
  type: RequestType
  state: RequestState
  agencyId: string
  wholesalerId: string
  baseItineraryId?: string
  payload: {
    destinations: CountryCode[]
    cities?: string[]
    travelWindow: { from: string; to: string }
    durationDays: number
    pax: { adults: number; children: number; infants: number }
    themes: ItineraryTheme[]
    hotelTier: HotelTier
    budgetPerPaxUSD?: number
    budgetBand?: BudgetBand
    activitiesRequested?: Localized
    specialNeeds?: Localized
    notes?: Localized
    dayModifications?: Array<{
      day: number
      action: "ADD" | "REMOVE" | "REPLACE"
      description: Localized
    }>
  }
  routing: {
    assignedDmcId?: string
    currentHolder: RequestActor
    direction: RequestDirection
  }
  pricing: {
    dmcNetTotalUSD?: number
    dmcNetPerPaxUSD?: number
    platformMarkupUSD?: number
    platformMarkupRuleId?: string
    wholesalerMarkupUSD?: number
    wholesalerMarkupRuleId?: string
    agencyRetailUSD?: number
  }
  events: RequestEvent[]
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

// ─── Markup rules engine ──────────────────────────────────────

export type RuleScope = "platform" | "wholesaler"

export type MarkupFormula = "percentage" | "fixed_per_pax" | "fixed_total" | "tiered_percentage"

export type MarkupRule = {
  id: string
  scope: RuleScope
  wholesalerId?: string
  priority: number
  name: string
  enabled: boolean
  matchers: {
    countries?: CountryCode[]
    dmcIds?: string[]
    themes?: ItineraryTheme[]
    minPaxNetUSD?: number
    maxPaxNetUSD?: number
    minTotalNetUSD?: number
    maxTotalNetUSD?: number
    agencyTier?: AgencyTier[]
    requestType?: RequestType[]
    hotelTier?: HotelTier[]
  }
  markup: {
    formula: MarkupFormula
    value: number
    minMarkupUSD?: number
    maxMarkupUSD?: number
    tiers?: Array<{ uptoNetUSD: number; percent: number }>
  }
  autoApply: boolean
  autoForward?: boolean
  createdAt: string
  updatedAt: string
}

// ─── Wallet ───────────────────────────────────────────────────

export type WalletTransactionType =
  | "TOPUP"
  | "BOOKING_HOLD"
  | "BOOKING_CAPTURE"
  | "BOOKING_RELEASE"
  | "REFUND"

export type WalletTransaction = {
  id: string
  agencyId: string
  type: WalletTransactionType
  amountCNY: number
  amountUSD: number
  description: Localized
  bookingId?: string
  createdAt: string
}

// ─── Photos ───────────────────────────────────────────────────

export type DestinationKey =
  | "petra"
  | "wadiRum"
  | "deadSea"
  | "amman"
  | "aqaba"
  | "marrakech"
  | "fez"
  | "casablanca"
  | "sahara"
  | "chefchaouen"
  | "rabat"
  | "tangier"
  | "volubilis"
  | "meknes"
  | "ouarzazate"
  | "ouzoud"
  | "cairo"
  | "luxor"
  | "aswan"
  | "redSea"
  | "hurghada"

export type PhotoLibrary = Record<DestinationKey, { hero: string[]; gallery: string[] }>

// ─── Currency ─────────────────────────────────────────────────

export type CurrencyCode = "USD" | "CNY" | "AED" | "SAR" | "OMR" | "EUR" | "JOD" | "EGP" | "MAD"

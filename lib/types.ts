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
  | "marrakech"
  | "fez"
  | "casablanca"
  | "sahara"
  | "chefchaouen"
  | "cairo"
  | "luxor"
  | "aswan"
  | "redSea"

export type PhotoLibrary = Record<DestinationKey, { hero: string[]; gallery: string[] }>

// ─── Currency ─────────────────────────────────────────────────

export type CurrencyCode = "USD" | "CNY" | "AED" | "SAR" | "OMR" | "EUR" | "JOD" | "EGP" | "MAD"

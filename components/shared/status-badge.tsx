import { Badge } from "@/components/ui/badge"
import type { BookingState, RequestState } from "@/lib/types"
import { useTranslation } from "@/lib/i18n/provider"

type Variant = "success" | "warning" | "danger" | "info" | "neutral" | "accent"

const bookingStateVariant: Record<BookingState, Variant> = {
  DRAFT: "neutral",
  QUOTE: "info",
  RFQ_SUBMITTED: "info",
  RFQ_QUOTED: "warning",
  RFQ_DECLINED: "danger",
  EXPIRED: "neutral",
  BOOKING_REQUESTED: "info",
  BOOKING_PENDING: "warning",
  CONFIRMED_PENDING_GUARANTEE: "accent",
  CONFIRMED: "success",
  CONFIRMED_AMENDMENT_PENDING: "warning",
  CANCELLED: "danger",
  TRAVELLED: "neutral",
  SETTLED: "neutral",
}

const bookingStateKey: Record<BookingState, string> = {
  DRAFT: "status.draft",
  QUOTE: "status.quote",
  RFQ_SUBMITTED: "status.rfq_submitted",
  RFQ_QUOTED: "status.rfq_quoted",
  RFQ_DECLINED: "status.rfq_declined",
  EXPIRED: "status.expired",
  BOOKING_REQUESTED: "status.booking_requested",
  BOOKING_PENDING: "status.booking_pending",
  CONFIRMED_PENDING_GUARANTEE: "status.confirmed_pending_guarantee",
  CONFIRMED: "status.confirmed",
  CONFIRMED_AMENDMENT_PENDING: "status.confirmed_amendment_pending",
  CANCELLED: "status.cancelled",
  TRAVELLED: "status.travelled",
  SETTLED: "status.settled",
}

export function BookingStatusBadge({ state }: { state: BookingState }) {
  const { t } = useTranslation()
  return (
    <Badge variant={bookingStateVariant[state]}>
      {t(bookingStateKey[state] as Parameters<typeof t>[0])}
    </Badge>
  )
}

export function AgencyStatusBadge({
  status,
}: {
  status: "active" | "pending_kyc" | "suspended"
}) {
  const { t } = useTranslation()
  const map: Record<typeof status, Variant> = {
    active: "success",
    pending_kyc: "warning",
    suspended: "danger",
  }
  return <Badge variant={map[status]}>{t(`status.${status}` as Parameters<typeof t>[0])}</Badge>
}

export function DepartureStatusBadge({
  status,
}: {
  status: "OPEN" | "GUARANTEED" | "FULL" | "CLOSED" | "CANCELLED"
}) {
  const { t } = useTranslation()
  const map: Record<typeof status, Variant> = {
    OPEN: "info",
    GUARANTEED: "success",
    FULL: "neutral",
    CLOSED: "neutral",
    CANCELLED: "danger",
  }
  const labelKey: Record<typeof status, string> = {
    OPEN: "departure.status.open",
    GUARANTEED: "departure.status.guaranteed",
    FULL: "departure.status.full",
    CLOSED: "departure.status.closed",
    CANCELLED: "departure.status.cancelled",
  }
  return <Badge variant={map[status]}>{t(labelKey[status] as Parameters<typeof t>[0])}</Badge>
}

const requestStateVariant: Record<RequestState, Variant> = {
  DRAFT: "neutral",
  AWAITING_WHOLESALER_REVIEW: "info",
  AWAITING_PLATFORM_REVIEW: "info",
  AWAITING_DMC_QUOTE: "warning",
  PLATFORM_APPLYING_MARKUP: "accent",
  WHOLESALER_APPLYING_MARKUP: "accent",
  QUOTED_TO_AGENCY: "success",
  ACCEPTED: "success",
  DECLINED: "danger",
  EXPIRED: "neutral",
  AWAITING_AGENCY_CLARIFICATION: "warning",
}

export function RequestStatusBadge({ state }: { state: RequestState }) {
  const { t } = useTranslation()
  return (
    <Badge variant={requestStateVariant[state]}>
      {t(`rfq.state.${state}` as Parameters<typeof t>[0])}
    </Badge>
  )
}

import type { WalletTransaction } from "@/lib/types"
import { bookings } from "./bookings"

// Build wallet transactions deterministically from bookings.
// Confirmed/travelled/settled → TOPUP precedes BOOKING_CAPTURE.
// Cancelled → BOOKING_HOLD then BOOKING_RELEASE / REFUND.
// Pending → BOOKING_HOLD.

const USD_PER_CNY = 1 / 7.2

let serial = 1000
const id = () => `wt-${(serial += 1).toString(36)}`

const txs: WalletTransaction[] = []

// Seed topups for active agencies
const seedTopups: Array<{ agencyId: string; amountCNY: number; daysAgo: number }> = [
  { agencyId: "ag-001", amountCNY: 200_000, daysAgo: 90 },
  { agencyId: "ag-001", amountCNY: 150_000, daysAgo: 30 },
  { agencyId: "ag-002", amountCNY: 500_000, daysAgo: 60 },
  { agencyId: "ag-003", amountCNY: 400_000, daysAgo: 75 },
  { agencyId: "ag-003", amountCNY: 200_000, daysAgo: 25 },
  { agencyId: "ag-004", amountCNY: 100_000, daysAgo: 45 },
  { agencyId: "ag-005", amountCNY: 250_000, daysAgo: 70 },
  { agencyId: "ag-006", amountCNY: 200_000, daysAgo: 65 },
  { agencyId: "ag-006", amountCNY: 100_000, daysAgo: 20 },
  { agencyId: "ag-007", amountCNY: 120_000, daysAgo: 50 },
  { agencyId: "ag-009", amountCNY: 150_000, daysAgo: 40 },
  { agencyId: "ag-010", amountCNY: 80_000, daysAgo: 35 },
  { agencyId: "ag-011", amountCNY: 100_000, daysAgo: 55 },
  { agencyId: "ag-012", amountCNY: 250_000, daysAgo: 60 },
  { agencyId: "ag-013", amountCNY: 250_000, daysAgo: 30 },
  { agencyId: "ag-015", amountCNY: 100_000, daysAgo: 28 },
]

const dayMs = 86_400_000
const now = Date.now()

for (const t of seedTopups) {
  txs.push({
    id: id(),
    agencyId: t.agencyId,
    type: "TOPUP",
    amountCNY: t.amountCNY,
    amountUSD: Math.round(t.amountCNY * USD_PER_CNY),
    description: { "zh-CN": "钱包充值", en: "Wallet top-up" },
    createdAt: new Date(now - t.daysAgo * dayMs).toISOString(),
  })
}

for (const b of bookings) {
  const baseTime = new Date(b.createdAt).getTime()

  // Always a hold on creation
  txs.push({
    id: id(),
    agencyId: b.agencyId,
    bookingId: b.id,
    type: "BOOKING_HOLD",
    amountCNY: -b.totalAmountCNY,
    amountUSD: -b.totalAmountUSD,
    description: { "zh-CN": `预订占用 · ${b.reference}`, en: `Booking hold · ${b.reference}` },
    createdAt: b.createdAt,
  })

  if (b.state === "CANCELLED") {
    txs.push({
      id: id(),
      agencyId: b.agencyId,
      bookingId: b.id,
      type: "REFUND",
      amountCNY: Math.round(b.totalAmountCNY * 0.75),
      amountUSD: Math.round(b.totalAmountUSD * 0.75),
      description: { "zh-CN": `取消退款 · ${b.reference}`, en: `Refund · ${b.reference}` },
      createdAt: b.cancelledAt ?? new Date(baseTime + 5 * dayMs).toISOString(),
    })
  } else if (
    b.state === "CONFIRMED" ||
    b.state === "CONFIRMED_PENDING_GUARANTEE" ||
    b.state === "CONFIRMED_AMENDMENT_PENDING" ||
    b.state === "TRAVELLED" ||
    b.state === "SETTLED"
  ) {
    txs.push({
      id: id(),
      agencyId: b.agencyId,
      bookingId: b.id,
      type: "BOOKING_CAPTURE",
      amountCNY: 0,
      amountUSD: 0,
      description: { "zh-CN": `预订确认入账 · ${b.reference}`, en: `Booking captured · ${b.reference}` },
      createdAt: b.confirmedAt ?? new Date(baseTime + dayMs).toISOString(),
    })
  }
}

txs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

export const walletTransactions: WalletTransaction[] = txs

export const getTransactionsForAgency = (agencyId: string) =>
  walletTransactions.filter((t) => t.agencyId === agencyId)

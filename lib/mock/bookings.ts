import type { Booking } from "@/lib/types"

// 38 bookings distributed across varied states per the data guide §2.8.
// All itineraryIds reference the 6 real packages (it-001 .. it-006) and the
// departure IDs match the seeds in itineraries.ts.

const ref = (s: string) => `TX-${s}`

export const bookings: Booking[] = [
  // ── BOOKING_PENDING (4) — fresh, SLA timers running ──
  { id: "bk-001", reference: ref("A8K3M2"), agencyId: "ag-001", itineraryId: "it-001", departureId: "dep-002", state: "BOOKING_PENDING", pax: { adults: 4, children: 0, infants: 0 }, totalAmountUSD: 3360, totalAmountCNY: 24_220, createdAt: "2026-05-17T18:00:00Z" },
  { id: "bk-002", reference: ref("B4N9P1"), agencyId: "ag-002", itineraryId: "it-003", departureId: "dep-202", state: "BOOKING_PENDING", pax: { adults: 6, children: 2, infants: 0 }, totalAmountUSD: 20_480, totalAmountCNY: 147_700, createdAt: "2026-05-17T22:30:00Z" },
  { id: "bk-003", reference: ref("C7Q4R5"), agencyId: "ag-003", itineraryId: "it-002", departureId: "dep-102", state: "BOOKING_PENDING", pax: { adults: 8, children: 0, infants: 0 }, totalAmountUSD: 3040, totalAmountCNY: 21_920, createdAt: "2026-05-17T14:00:00Z" },
  { id: "bk-004", reference: ref("D2S6T8"), agencyId: "ag-009", itineraryId: "it-005", state: "BOOKING_PENDING", pax: { adults: 2, children: 2, infants: 0 }, totalAmountUSD: 7880, totalAmountCNY: 56_800, createdAt: "2026-05-17T05:00:00Z" },

  // ── CONFIRMED_PENDING_GUARANTEE (2) ──
  { id: "bk-005", reference: ref("E9U3V4"), agencyId: "ag-005", itineraryId: "it-004", departureId: "dep-301", state: "CONFIRMED_PENDING_GUARANTEE", pax: { adults: 4, children: 0, infants: 0 }, totalAmountUSD: 6720, totalAmountCNY: 48_500, createdAt: "2026-05-10T12:00:00Z", confirmedAt: "2026-05-12T10:00:00Z" },
  { id: "bk-006", reference: ref("F5W7X1"), agencyId: "ag-006", itineraryId: "it-006", state: "CONFIRMED_PENDING_GUARANTEE", pax: { adults: 5, children: 1, infants: 0 }, totalAmountUSD: 16_920, totalAmountCNY: 122_000, createdAt: "2026-05-08T09:30:00Z", confirmedAt: "2026-05-10T16:00:00Z" },

  // ── CONFIRMED (15) ──
  { id: "bk-007", reference: ref("G1Y2Z3"), agencyId: "ag-001", itineraryId: "it-001", departureId: "dep-001", state: "CONFIRMED", pax: { adults: 6, children: 2, infants: 0 }, totalAmountUSD: 5440, totalAmountCNY: 39_240, createdAt: "2026-04-12T10:00:00Z", confirmedAt: "2026-04-13T11:00:00Z" },
  { id: "bk-008", reference: ref("H8A4B6"), agencyId: "ag-002", itineraryId: "it-003", departureId: "dep-201", state: "CONFIRMED", pax: { adults: 8, children: 0, infants: 0 }, totalAmountUSD: 17_840, totalAmountCNY: 128_700, createdAt: "2026-04-15T08:00:00Z", confirmedAt: "2026-04-16T09:30:00Z" },
  { id: "bk-009", reference: ref("J3C5D7"), agencyId: "ag-003", itineraryId: "it-001", departureId: "dep-003", state: "CONFIRMED", pax: { adults: 4, children: 0, infants: 0 }, totalAmountUSD: 2960, totalAmountCNY: 21_350, createdAt: "2026-04-20T14:00:00Z", confirmedAt: "2026-04-21T10:00:00Z" },
  { id: "bk-010", reference: ref("K9E1F2"), agencyId: "ag-004", itineraryId: "it-002", departureId: "dep-101", state: "CONFIRMED", pax: { adults: 2, children: 1, infants: 0 }, totalAmountUSD: 1080, totalAmountCNY: 7_790, createdAt: "2026-04-22T11:00:00Z", confirmedAt: "2026-04-23T08:00:00Z" },
  { id: "bk-011", reference: ref("L4G6H8"), agencyId: "ag-005", itineraryId: "it-005", state: "CONFIRMED", pax: { adults: 8, children: 0, infants: 0 }, totalAmountUSD: 13_440, totalAmountCNY: 96_900, createdAt: "2026-04-08T16:00:00Z", confirmedAt: "2026-04-09T11:00:00Z" },
  { id: "bk-012", reference: ref("M5J7K9"), agencyId: "ag-006", itineraryId: "it-003", departureId: "dep-203", state: "CONFIRMED", pax: { adults: 6, children: 0, infants: 0 }, totalAmountUSD: 11_280, totalAmountCNY: 81_400, createdAt: "2026-03-25T10:00:00Z", confirmedAt: "2026-03-27T09:00:00Z" },
  { id: "bk-013", reference: ref("N2L4P6"), agencyId: "ag-007", itineraryId: "it-002", departureId: "dep-103", state: "CONFIRMED", pax: { adults: 2, children: 2, infants: 0 }, totalAmountUSD: 1520, totalAmountCNY: 10_960, createdAt: "2026-05-01T13:00:00Z", confirmedAt: "2026-05-02T10:00:00Z" },
  { id: "bk-014", reference: ref("Q7R3S5"), agencyId: "ag-009", itineraryId: "it-006", state: "CONFIRMED", pax: { adults: 10, children: 0, infants: 0 }, totalAmountUSD: 18_800, totalAmountCNY: 135_600, createdAt: "2026-04-30T09:00:00Z", confirmedAt: "2026-05-01T15:00:00Z" },
  { id: "bk-015", reference: ref("T1U8V3"), agencyId: "ag-010", itineraryId: "it-001", departureId: "dep-004", state: "CONFIRMED", pax: { adults: 4, children: 0, infants: 0 }, totalAmountUSD: 2960, totalAmountCNY: 21_350, createdAt: "2026-04-18T11:00:00Z", confirmedAt: "2026-04-19T09:00:00Z" },
  { id: "bk-016", reference: ref("W4X9Y2"), agencyId: "ag-011", itineraryId: "it-001", departureId: "dep-005", state: "CONFIRMED", pax: { adults: 5, children: 1, infants: 0 }, totalAmountUSD: 4140, totalAmountCNY: 29_850, createdAt: "2026-05-02T14:30:00Z", confirmedAt: "2026-05-03T10:00:00Z" },
  { id: "bk-017", reference: ref("Z5A1B7"), agencyId: "ag-012", itineraryId: "it-006", state: "CONFIRMED", pax: { adults: 6, children: 0, infants: 0 }, totalAmountUSD: 11_280, totalAmountCNY: 81_400, createdAt: "2026-04-26T08:00:00Z", confirmedAt: "2026-04-27T14:00:00Z" },
  { id: "bk-018", reference: ref("C3D9E4"), agencyId: "ag-013", itineraryId: "it-004", departureId: "dep-302", state: "CONFIRMED", pax: { adults: 2, children: 0, infants: 0 }, totalAmountUSD: 3360, totalAmountCNY: 24_250, createdAt: "2026-04-12T15:00:00Z", confirmedAt: "2026-04-13T11:00:00Z" },
  { id: "bk-019", reference: ref("F6G2H5"), agencyId: "ag-015", itineraryId: "it-002", departureId: "dep-104", state: "CONFIRMED", pax: { adults: 2, children: 1, infants: 1 }, totalAmountUSD: 1140, totalAmountCNY: 8_240, createdAt: "2026-05-05T09:00:00Z", confirmedAt: "2026-05-06T10:00:00Z" },
  { id: "bk-020", reference: ref("J7K4L1"), agencyId: "ag-001", itineraryId: "it-005", state: "CONFIRMED", pax: { adults: 12, children: 0, infants: 0 }, totalAmountUSD: 19_320, totalAmountCNY: 139_400, createdAt: "2026-04-10T09:00:00Z", confirmedAt: "2026-04-11T11:00:00Z" },
  { id: "bk-021", reference: ref("M8N5P3"), agencyId: "ag-002", itineraryId: "it-003", departureId: "dep-204", state: "CONFIRMED", pax: { adults: 2, children: 0, infants: 0 }, totalAmountUSD: 5160, totalAmountCNY: 37_240, createdAt: "2026-03-15T10:00:00Z", confirmedAt: "2026-03-18T12:00:00Z" },

  // ── CONFIRMED_AMENDMENT_PENDING (3) ──
  { id: "bk-022", reference: ref("Q9R6S2"), agencyId: "ag-001", itineraryId: "it-001", departureId: "dep-006", state: "CONFIRMED_AMENDMENT_PENDING", pax: { adults: 6, children: 2, infants: 0 }, totalAmountUSD: 5040, totalAmountCNY: 36_400, createdAt: "2026-04-25T11:00:00Z", confirmedAt: "2026-04-26T15:00:00Z" },
  { id: "bk-023", reference: ref("T1V7W8"), agencyId: "ag-003", itineraryId: "it-002", departureId: "dep-105", state: "CONFIRMED_AMENDMENT_PENDING", pax: { adults: 4, children: 1, infants: 0 }, totalAmountUSD: 1500, totalAmountCNY: 10_820, createdAt: "2026-04-22T13:00:00Z", confirmedAt: "2026-04-23T11:00:00Z" },
  { id: "bk-024", reference: ref("X4Y8Z5"), agencyId: "ag-009", itineraryId: "it-003", departureId: "dep-203", state: "CONFIRMED_AMENDMENT_PENDING", pax: { adults: 5, children: 0, infants: 0 }, totalAmountUSD: 9400, totalAmountCNY: 67_810, createdAt: "2026-05-05T10:00:00Z", confirmedAt: "2026-05-06T12:00:00Z" },

  // ── CANCELLED (4) ──
  { id: "bk-025", reference: ref("A2B6C9"), agencyId: "ag-004", itineraryId: "it-001", state: "CANCELLED", pax: { adults: 2, children: 0, infants: 0 }, totalAmountUSD: 1680, totalAmountCNY: 12_120, createdAt: "2026-03-20T14:00:00Z", confirmedAt: "2026-03-21T10:00:00Z", cancelledAt: "2026-04-15T11:00:00Z" },
  { id: "bk-026", reference: ref("D3E7F2"), agencyId: "ag-005", itineraryId: "it-004", state: "CANCELLED", pax: { adults: 2, children: 0, infants: 0 }, totalAmountUSD: 3360, totalAmountCNY: 24_250, createdAt: "2026-03-05T09:00:00Z", confirmedAt: "2026-03-06T10:00:00Z", cancelledAt: "2026-04-02T14:00:00Z" },
  { id: "bk-027", reference: ref("G8H4J1"), agencyId: "ag-007", itineraryId: "it-002", departureId: "dep-103", state: "CANCELLED", pax: { adults: 4, children: 0, infants: 0 }, totalAmountUSD: 1520, totalAmountCNY: 10_960, createdAt: "2026-04-01T12:00:00Z", confirmedAt: "2026-04-02T09:00:00Z", cancelledAt: "2026-05-08T15:00:00Z" },
  { id: "bk-028", reference: ref("K5L9M2"), agencyId: "ag-011", itineraryId: "it-005", state: "CANCELLED", pax: { adults: 2, children: 2, infants: 0 }, totalAmountUSD: 7880, totalAmountCNY: 56_800, createdAt: "2026-04-08T10:00:00Z", confirmedAt: "2026-04-09T11:00:00Z", cancelledAt: "2026-04-25T13:00:00Z" },

  // ── TRAVELLED (8) ──
  { id: "bk-029", reference: ref("N6P3Q4"), agencyId: "ag-001", itineraryId: "it-001", state: "TRAVELLED", pax: { adults: 8, children: 0, infants: 0 }, totalAmountUSD: 5440, totalAmountCNY: 39_240, createdAt: "2026-01-10T10:00:00Z", confirmedAt: "2026-01-11T09:00:00Z", voucherUrl: "/voucher/bk-029" },
  { id: "bk-030", reference: ref("R7S2T9"), agencyId: "ag-002", itineraryId: "it-005", state: "TRAVELLED", pax: { adults: 14, children: 0, infants: 0 }, totalAmountUSD: 22_540, totalAmountCNY: 162_600, createdAt: "2025-12-15T11:00:00Z", confirmedAt: "2025-12-16T10:00:00Z", voucherUrl: "/voucher/bk-030" },
  { id: "bk-031", reference: ref("V4W1X8"), agencyId: "ag-003", itineraryId: "it-003", state: "TRAVELLED", pax: { adults: 6, children: 0, infants: 0 }, totalAmountUSD: 11_280, totalAmountCNY: 81_400, createdAt: "2026-01-22T14:00:00Z", confirmedAt: "2026-01-23T11:00:00Z", voucherUrl: "/voucher/bk-031" },
  { id: "bk-032", reference: ref("Y5Z9A2"), agencyId: "ag-005", itineraryId: "it-002", state: "TRAVELLED", pax: { adults: 6, children: 2, infants: 0 }, totalAmountUSD: 2240, totalAmountCNY: 16_160, createdAt: "2026-02-05T10:00:00Z", confirmedAt: "2026-02-06T09:00:00Z", voucherUrl: "/voucher/bk-032" },
  { id: "bk-033", reference: ref("B3C8D5"), agencyId: "ag-006", itineraryId: "it-001", state: "TRAVELLED", pax: { adults: 4, children: 0, infants: 0 }, totalAmountUSD: 2960, totalAmountCNY: 21_350, createdAt: "2026-02-12T12:00:00Z", confirmedAt: "2026-02-13T09:00:00Z", voucherUrl: "/voucher/bk-033" },
  { id: "bk-034", reference: ref("F1G6H3"), agencyId: "ag-009", itineraryId: "it-006", state: "TRAVELLED", pax: { adults: 8, children: 0, infants: 0 }, totalAmountUSD: 18_800, totalAmountCNY: 135_600, createdAt: "2025-12-20T09:00:00Z", confirmedAt: "2025-12-21T11:00:00Z", voucherUrl: "/voucher/bk-034" },
  { id: "bk-035", reference: ref("J7K2L4"), agencyId: "ag-012", itineraryId: "it-004", state: "TRAVELLED", pax: { adults: 4, children: 0, infants: 0 }, totalAmountUSD: 6720, totalAmountCNY: 48_500, createdAt: "2026-02-20T13:00:00Z", confirmedAt: "2026-02-21T10:00:00Z", voucherUrl: "/voucher/bk-035" },
  { id: "bk-036", reference: ref("M5N3P7"), agencyId: "ag-013", itineraryId: "it-001", state: "TRAVELLED", pax: { adults: 6, children: 0, infants: 0 }, totalAmountUSD: 4440, totalAmountCNY: 32_040, createdAt: "2026-01-30T11:00:00Z", confirmedAt: "2026-01-31T10:00:00Z", voucherUrl: "/voucher/bk-036" },

  // ── SETTLED (2) ──
  { id: "bk-037", reference: ref("Q8R4S1"), agencyId: "ag-001", itineraryId: "it-001", state: "SETTLED", pax: { adults: 6, children: 0, infants: 0 }, totalAmountUSD: 4440, totalAmountCNY: 32_040, createdAt: "2025-10-15T10:00:00Z", confirmedAt: "2025-10-16T09:00:00Z", voucherUrl: "/voucher/bk-037" },
  { id: "bk-038", reference: ref("T6V2W9"), agencyId: "ag-002", itineraryId: "it-006", state: "SETTLED", pax: { adults: 10, children: 0, infants: 0 }, totalAmountUSD: 28_200, totalAmountCNY: 203_500, createdAt: "2025-11-05T11:00:00Z", confirmedAt: "2025-11-06T14:00:00Z", voucherUrl: "/voucher/bk-038" },
]

export const getBookingsForAgency = (agencyId: string) =>
  bookings.filter((b) => b.agencyId === agencyId)

# Feature plan — wholesaler flight attachments

**Status:** Planned · not started
**Owner:** Ahmed
**Last updated:** 2026-05-19

## Why this matters

Chinese travel wholesalers (UB Trip in our case) operationally **own the air contract**: charter blocks, group fares, and negotiated routes out of PEK / PVG / CAN to MEA destinations. They are the airline's counterparty, not the platform, and not the DMC.

Today the Safasoft platform ships **land-only** itineraries — DMC supplies the ground services, the wholesaler resells, the agency books. The wholesaler currently has to tape flights onto the package manually outside the system, which means:

- They can't sell a complete package directly from the agency portal
- Their downstream agencies see only land-only pricing
- Flight margin (their differentiator vs other wholesalers reselling the same DMC content) lives in spreadsheets
- The voucher misses half the trip

Adding flight attachment is what turns UB Trip from a re-seller into a packager. It's the upgrade the platform sells them.

## Locked design decisions

| # | Decision | Choice | Rationale |
|---|---|---|---|
| 1 | Ownership | **Wholesaler-owned** | Flights belong to the wholesaler's books. Platform admin never sees airline contracts or flight pricing. Matches the real partnership shape. Tradeoff: no cross-wholesaler flight marketplace. |
| 2 | Attach granularity | **Itinerary-level, with date-window filter on agency display** | Wholesaler attaches a flight to an itinerary once. The agency only sees a flight if its `validFromDate / validToDate` window overlaps the picked tour departure. Light wholesaler config, smart agency surfacing. |
| 3 | Margin display | **Separate "Flight options" card on the catalog detail page** | The land-margin breakdown (DMC net → platform markup → wholesaler markup → agency retail) stays intact — that's the trust mechanism. Flight pricing is the wholesaler's private business and lives in its own card. |

---

## Data model

### `SourcedFlight` (new — `lib/types.ts`)

```ts
export type FlightClass = "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS"

export type SourcedFlight = {
  id: string                          // "fl-001"
  wholesalerId: string                // "wh-001"

  // Carrier
  carrier: string                     // "Air China"
  carrierCode: string                 // "CA"
  flightNumberOut: string             // "CA723"
  flightNumberReturn: string          // "CA724"

  // Route (origin in China, destination in MEA)
  origin: {
    city: Localized                   // { "zh-CN": "北京", en: "Beijing" }
    iata: string                      // "PEK"
  }
  destination: {
    city: Localized                   // { "zh-CN": "开罗", en: "Cairo" }
    iata: string                      // "CAI"
    country: CountryCode              // "EG"
  }

  // Schedule (one-way segments; "+1" indicates next-day arrival)
  outDepartureTime: string            // "23:30"
  outArrivalTime: string              // "06:15+1"
  returnDepartureTime: string         // "13:20"
  returnArrivalTime: string           // "05:45+1"
  durationMinutesOneWay: number       // 705

  // Validity window — the contracted period during which this flight is sellable
  validFromDate: string               // ISO date "2026-05-01"
  validToDate: string                 // ISO date "2026-10-31"

  // Capacity (block-level)
  totalSeats: number                  // 80
  bookedSeats: number                 // 32

  // Pricing — round-trip per pax, per class
  // economy is required; premium/business optional (not every contract covers them)
  pricing: {
    economy:        { netCNY: number; retailUSD: number }
    premiumEconomy?: { netCNY: number; retailUSD: number }
    business?:      { netCNY: number; retailUSD: number }
  }

  status: "ACTIVE" | "CLOSED" | "SOLD_OUT"
  createdAt: string
}
```

### Mock data (new — `lib/mock/flights.ts`)

Six flights covering the JO/MA/EG corridor:

| ID | Carrier | Route | Validity | Net CNY (Y) | Retail USD (Y) |
|---|---|---|---|---|---|
| fl-001 | Air China · CA723/724 | PEK ↔ CAI | Jun–Oct 2026 | ¥4,800 | $850 |
| fl-002 | Egyptair · MS956/955 | PEK ↔ CAI | May–Dec 2026 | ¥4,500 | $820 |
| fl-003 | Royal Jordanian · RJ181/182 | PEK ↔ AMM (via Bangkok) | Sep–Nov 2026 | ¥5,400 | $950 |
| fl-004 | Air China · CA947/948 | PVG ↔ AMM | Sep 2026 only | ¥5,200 | $920 |
| fl-005 | Royal Air Maroc · AT203/202 | PEK ↔ CMN (via DOH) | Jul–Oct 2026 | ¥7,200 | $1,280 |
| fl-006 | Qatar Airways · QR889/888 | PVG ↔ CMN (via DOH) | year-round | ¥6,800 | $1,180 |

All bilingual (city names in 中文 + English). Premium economy + business tiers populated for fl-001, fl-004, fl-005.

---

## State extensions

### `lib/demo-state.ts` additions

```ts
export type FlightAttachment = {
  itineraryId: string
  flightId: string
}

export type DemoState = {
  // ... existing
  flightAttachments: FlightAttachment[]
  attachFlight: (itineraryId: string, flightId: string) => void
  detachFlight: (itineraryId: string, flightId: string) => void
  setFlightAttachmentsForItinerary: (itineraryId: string, flightIds: string[]) => void
}
```

`setFlightAttachmentsForItinerary` replaces the list (used by the bulk save UI). The granular attach/detach helpers exist for the Save / Cancel pattern in the catalog page.

### Bookings extension

To carry the selected flight through the booking flow:

```ts
// in `bookingDraft` (already in DemoState)
bookingDraft: {
  // ... existing
  flightId: string | null            // null = land only
  flightClass: FlightClass | null    // populated when flightId is set
}
```

### Booking entity (eventual — `lib/types.ts`)

When (eventually) we add real booking records that persist:

```ts
export type Booking = {
  // ... existing
  flight?: {
    flightId: string
    class: FlightClass
    paxCount: number
    netCNY: number
    retailUSD: number
  }
}
```

For the v1 demo: just thread `flightId + flightClass` through `bookingDraft`; the success screen and voucher display them from state.

---

## UX surfaces

### 1. New page — `/wholesaler/flights`

Central inventory list. Same shape as `/wholesaler/agencies`.

Columns:
- Carrier + flight numbers
- Route (origin IATA → destination IATA, with stopover badge if any)
- Validity window
- Capacity bar (booked / total)
- Economy retail USD (representative price)
- Status badge (Active / Closed / Sold out)

Filters: by destination country, by status.
Actions: "Add flight block" button (toast for v1, real form later).

**Sidebar nav:** Add `Flights` between `Catalog` and `Bookings`. New i18n key `nav.flights`.

### 2. Existing page — `/wholesaler/catalog/[id]`

Below the existing publishing controls in the right column, add a **new card** titled "Attach flights from your inventory" (separate from the margin breakdown — see decision #3).

Card contents:
- Eyebrow: "Flight options" / "航班选项"
- Subtitle: "Show your sourced flights to agencies viewing this itinerary"
- List filtered to flights where `destination.country === itinerary.countries[0]` (or any of the itinerary's countries for multi-country tours)
- Each row: carrier · flight number · route summary · validity window · checkbox
- Footer: Save / Cancel (dirty tracking, same pattern as publishing control)
- Empty state: "No matching flight inventory. Add flights at `/wholesaler/flights` first." with a link

State sink: `setFlightAttachmentsForItinerary(itinerary.id, selectedIds)` on Save → toast "Attached N flights to this itinerary".

### 3. Existing page — `/agency/browse/[id]`

On the wow page, below the existing sticky booking panel (or as a new tab beside Highlights/Days/Inclusions/Policy), add a **"Flight options"** section.

Logic:
- Read `flightAttachments` for this itinerary
- Cross-reference with `flights` mock data
- **Filter:** only show flights where `validFromDate ≤ selectedDeparture ≤ validToDate` (selected departure comes from the FIXED departure picker, or from the customize-page date for ON_DEMAND)
- If no departure date selected yet: show all attached flights, marked "select a departure date to confirm availability"

Display per flight:
- Carrier + route summary in a card
- Outbound: city · time · → · city · time
- Return: same
- Class selector: Economy / Premium Economy / Business (only available classes)
- Per-class retail USD displayed
- "Add to booking" toggle — checked means flight is included; unchecked means land only

Selected flight + class persists to `bookingDraft.flightId` + `bookingDraft.flightClass`.

The total in the right booking panel becomes `land × pax + flightRetail × pax`.

### 4. Existing flow — `/agency/book/[id]`

Step 1 (Review) now shows two stacked rows:
- "Land services" — itinerary title + dates + price
- "Flight" — carrier + route + class + price (only if `bookingDraft.flightId` is set)

Step 3 (Confirm) shows the total wallet deduction with the flight portion clearly delineated:

```
Land services        ¥ 38,650
Flight (Air China CA723, Economy)   ¥ 24,480
─────────────────────────────────
Total                ¥ 63,130
```

### 5. Existing page — `/agency/voucher/[id]`

After the day-by-day section and before the supplier-contact footer, insert a **"Flight" section**:

```
─── FLIGHT ─────────────────────────
Air China · CA723 / CA724
PEK 23:30  →  CAI 06:15+1
CAI 13:20  →  PEK 05:45+1

Class: Economy · Confirmation pending
PNR: ────── (issued at ticket time)
─────────────────────────────────────
```

Co-branding stays as-is (wholesaler header + DMC contact). The flight section sits between them since it's the wholesaler's piece.

---

## Implementation plan (file-by-file)

### v1 — wholesaler-side flow

1. **`lib/types.ts`** — add `SourcedFlight`, `FlightClass`, `FlightAttachment` types
2. **`lib/mock/flights.ts`** — new file, 6 mock flights
3. **`lib/mock/index.ts`** — re-export `flights` and `findFlight`
4. **`lib/demo-state.ts`** — add `flightAttachments`, `attachFlight`, `detachFlight`, `setFlightAttachmentsForItinerary`, extend `bookingDraft`
5. **`lib/i18n/zh-CN.ts` + `en.ts`** — keys for: nav, flight classes, statuses, page titles, toast feedback, validity-window copy, "land only" / "add flight" toggle
6. **`app/wholesaler/layout.tsx`** — add `Flights` to sidebar nav with `Plane` icon
7. **`app/wholesaler/flights/page.tsx`** — list page

### v2 — wholesaler attach flow

8. **`app/wholesaler/catalog/[id]/page.tsx`** — add `<FlightAttachmentCard>` component below `<PublishControl>` in the right column

### v3 — agency display + booking

9. **`app/agency/browse/[id]/page.tsx`** — add "Flight options" section + class selector + land-only toggle
10. **`app/agency/customize/[id]/page.tsx`** — same (since ON_DEMAND tours go through customize)
11. **`app/agency/book/[id]/page.tsx`** — Review + Confirm steps show flight row
12. **`app/agency/voucher/[id]/page.tsx`** — Flight section after day-by-day

### v4 — polish

13. Wholesaler bookings list shows a small `✈` badge for bookings that included a flight
14. Platform admin sees flight-attachment counts per wholesaler (`/platform/wholesalers` table)
15. DMC bookings inbox is unchanged — DMC sees only the land portion (right behavior, since they fulfill only that)

Estimate: v1+v2 ≈ 1 day of work · v3 ≈ ½ day · v4 ≈ 2 hours

---

## Out of scope for the demo

Defer these unless the partner specifically asks:

- **Per-class allotment tracking** — for v1, capacity is a single number across all classes. Real airline blocks split economy vs premium quotas, but the demo doesn't need that.
- **Multi-segment / connecting flight builder** — flights are represented as outbound + return single legs even if they really have stopovers. The mock data can mention "via DOH" or "via BKK" in the carrier text for credibility.
- **Real PNR generation or GDS integration** — voucher shows "PNR: pending".
- **Flight change / refund / cancellation policy editor** — assumed standard airline rules apply, no UI.
- **Auto-attach by destination match** — wholesaler chooses every attachment manually. No auto-suggestion.
- **Cross-wholesaler flight pooling** — flights are private per wholesaler. The platform admin never sees flight inventory across tenants.
- **Currency mixing** — flight pricing is round-trip per pax in CNY (cost) and USD (retail). No multi-currency display logic for v1.
- **Code-share or alliance handling** — single carrier per flight.

---

## Open questions to resolve when we come back to this

1. **What happens if a wholesaler attaches a flight but no agency books with it?** Today the wholesaler still pays the airline for the contracted seats. Should the system surface a "seats at risk" warning when bookedSeats is low and validToDate is approaching? — probably yes, in a later iteration, on `/wholesaler/flights`.

2. **Does the wholesaler want to offer flight-only sales?** I.e., sell just a seat on their block to an agency, without an itinerary attached. Current design says no (attachment is mandatory). Confirm with UB Trip.

3. **How does the wholesaler price differently for different agencies?** Today: one retail price per class per flight, agency-agnostic. Wholesalers might want VIP-agency pricing or volume discounts. Probably out of v1, add to roadmap.

4. **Should the platform charge a fee on flight attachments?** Today the design assumes no — flight margin is 100% the wholesaler's. But there's a case for a small per-PNR processing fee since the platform handles the booking-day workflow. Probably defer; if added, it goes into the existing margin breakdown as a separate "Flight booking fee" line.

5. **What about non-flight transport that's still wholesaler-owned?** High-speed rail PEK → relevant Chinese departure airport, or charter bus for group transfers in MEA — same conceptual category. Worth modeling as a generic "Wholesaler-attached service" rather than flight-specific? Mild refactoring suggestion for v2.

6. **Mobile UX for class selector on the agency portal** — the radio-group pattern works at desktop sizes but might be cramped on phones. Address during the mobile polish phase.

---

## Files touched (summary)

**New files**
- `lib/mock/flights.ts`
- `app/wholesaler/flights/page.tsx`

**Modified files**
- `lib/types.ts` — types
- `lib/mock/index.ts` — re-exports + finder
- `lib/demo-state.ts` — state + actions
- `lib/i18n/zh-CN.ts` + `lib/i18n/en.ts` — new strings
- `app/wholesaler/layout.tsx` — sidebar nav
- `app/wholesaler/catalog/[id]/page.tsx` — attach card
- `app/agency/browse/[id]/page.tsx` — flight options on wow page
- `app/agency/customize/[id]/page.tsx` — flight options on customize
- `app/agency/book/[id]/page.tsx` — flight in review + confirm
- `app/agency/voucher/[id]/page.tsx` — flight section

**Tests / verification**
- Type-check clean
- Production build succeeds
- Browser smoke-test: attach a flight to it-001 (Jordan), navigate to /agency/browse/it-001, see the flight, select Premium Economy, book through to voucher with the flight section rendered

---

## Resume notes

When picking this up again:

1. Read this doc start-to-finish
2. Verify the locked decisions still hold (re-confirm with the team if a few weeks have passed)
3. Start at step 1 of the implementation plan; each step builds on the previous
4. v1 is shippable on its own — `/wholesaler/flights` is a useful page even before agency-side integration lands
5. Keep the demo guide (`public/demo-guide.html`) in sync — add a new "Flight attach demo path" section
6. The pitch deck (`public/pitch.html`) should mention flight attachment as a wholesaler capability — currently it doesn't

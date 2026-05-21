# Feature plan — custom RFQ pipeline + markup rules engine

**Status:** Planned · not started · supersedes the current basic RFQ flow
**Owner:** Ahmed
**Last updated:** 2026-05-19

## Why this matters

China is vast and traveler preferences are infinitely variable. No matter how many DMCs we onboard, the curated catalog will never cover 100% of agency demand. The product story to a Chinese mid-tier agency is incomplete without an answer to:

> "What if my customer wants something not in your catalog?"

Today's basic RFQ feature (`/wholesaler/rfqs`) is a one-hop transaction: agency asks, wholesaler answers. That works for light customizations the wholesaler can handle from memory, but it breaks down when the request needs DMC input. The wholesaler today either calls the DMC manually outside the system, or declines. Both options leak revenue and erode the platform's value proposition.

The new pipeline closes the loop end-to-end inside the system, with three benefits:

1. **Captures requests outside the curated catalog** — the wholesaler's full demand is now visible to the platform, surfacing supply gaps we can fix.
2. **Margin layers compose automatically** — each party in the chain stacks their markup; nobody negotiates retail downstream.
3. **Configurable speed** — manual review at every step for high-value custom tours; full auto-routing for low-stakes requests that fit pre-approved rules.

## Locked design decisions

| # | Decision | Choice |
|---|---|---|
| 1 | Two entry points → one entity | A customize-existing flow AND a from-scratch flow both produce the same underlying `CustomRequest` record. Differs only by whether `baseItineraryId` is set. |
| 2 | Pipeline shape | **Forward leg:** agency → wholesaler → platform → DMC. **Return leg with markup:** DMC quote → platform applies markup → wholesaler applies markup → agency sees final retail. |
| 3 | Skip rules | If a stage's matching rule has `auto_apply: true`, the stage is bypassed. Auto-applied stages still leave an audit-log entry but require no human action. |
| 4 | Markup transparency | Each party sees its own layer + the layers below it. Agency sees only retail. Wholesaler sees DMC net + platform markup + their own markup. Platform sees DMC net + their own markup. DMC sees only their net (same as today). |
| 5 | Configuration scope | Two configuration UIs: `/platform/settings/rules` for Safasoft's rules, `/wholesaler/settings/rules` for UB Trip's rules. Per-tenant rule sets, no cross-tenant rule sharing. |
| 6 | Replaces or extends? | **Extends.** The existing RFQ schema stays as a special case (it's a `CustomRequest` with no platform/DMC routing, where the wholesaler quotes directly). New requests can opt into the full pipeline. |

---

## The two entry points

### Entry A — Customize-existing

The agency starts from a catalog itinerary (the `/agency/browse/[id]` wow page) and clicks **"定制此行程"** ("Customize this itinerary"). Today this routes to `/agency/customize/[id]` which lets them tweak dates, pax counts, and pick from a fixed set of upgrades/excursions. That stays.

We add a second button on the customize page: **"申请更多定制"** ("Request further customization") that opens a richer form on top of the existing customize state. Fields:

- Inherited: dates, pax, room config (already filled by the customize form)
- **Hotel star tier** — radio: 3-star / 4-star / 5-star / 5-star deluxe / mixed
- **Day modifications** — repeating editor: { day number, action: ADD / REMOVE / REPLACE, description }
- **Inclusion changes** — text area: "what to add or remove from the inclusion list"
- **Special needs** — text area: dietary, accessibility, religious observance
- **Budget hint** — optional dropdown: "within standard pricing", "premium up to +30%", "luxury up to +100%", "unlimited"
- **Notes** — free text
- **Pre-fill from base** — checkbox: agree the request inherits the base itinerary as its starting structure

Submit → `CustomRequest` created with `baseItineraryId = the catalog item`, `type: "MODIFY_EXISTING"`.

### Entry B — From-scratch

New page: `/agency/request/new`. A clean form, no base itinerary.

- **Destinations** — country chips (multi-select)
- **Cities I'd like** — free text or autocomplete (optional)
- **Travel window** — date range picker
- **Duration** — number of days
- **Pax composition** — adults / children / infants
- **Travel theme** — multi-select chips (family / luxury / first-time / adventure / cultural / religious / wellness / business)
- **Hotel tier** — radio as above
- **Budget per pax** — slider or band selector
- **Activities / experiences I'd like included** — free text or pickable list
- **Special needs** — text area
- **Anything else** — free text
- **Submit**

Submit → `CustomRequest` with `baseItineraryId = null`, `type: "FROM_SCRATCH"`.

Both entry points land in the same review pipeline.

---

## The pipeline

```
                                          QUOTE RETURNS (markup applied)
                                          ←─────────────────────────────
agency  ⟶  wholesaler  ⟶  platform  ⟶  DMC                       ⟶ accept / decline
        forward route               provides net quote
```

### State machine

```
DRAFT
   ↓ (agency submits)
AWAITING_WHOLESALER_REVIEW
   ↓ (wholesaler forwards | auto-forward rule matched)
AWAITING_PLATFORM_REVIEW
   ↓ (platform forwards | auto-forward rule matched)
AWAITING_DMC_QUOTE
   ↓ (DMC provides net quote)
PLATFORM_APPLYING_MARKUP
   ↓ (platform applies markup | auto-apply rule matched)
WHOLESALER_APPLYING_MARKUP
   ↓ (wholesaler applies markup | auto-apply rule matched)
QUOTED_TO_AGENCY  ─────────────────────┐
   ↓ (agency accepts)        (agency declines or TTL expires)
ACCEPTED → becomes a booking            ↓
                                       DECLINED / EXPIRED
```

**Any stage can decline.** If wholesaler, platform, or DMC declines, the request short-circuits to `DECLINED` with a reason and notifies the agency.

**Any stage can request revision.** A "needs more info" branch lets a downstream party kick the request back to the agency for clarification, then re-enter the pipeline.

### Auto-routing behavior

At each stage, the system evaluates that party's matching rules. If a rule matches **and** has `auto_apply: true`:
- For forward stages → the request advances to the next stage automatically. No human in the queue.
- For markup stages → the markup is applied automatically using the rule's formula. No human review.

If a rule matches but `auto_apply: false`, the request lands in that party's manual queue with the rule's suggested markup pre-filled (for markup stages) or pre-flagged as "auto-eligible if you approve" (for forward stages).

If no rule matches, the request lands in the manual queue with no suggestion.

### Demo magic: all-auto flow

When **both** the wholesaler's rule **and** the platform's rule auto-apply for a given request:

```
T+00s   Agency submits
T+01s   Wholesaler stage skipped (auto-forward rule matched)
T+01s   Platform stage skipped (auto-forward rule matched)
T+01s   Request lands in DMC inbox
T+15m   DMC provides net quote (real-world DMC response time)
T+15m   Platform markup auto-applied
T+15m   Wholesaler markup auto-applied
T+15m   Quote arrives in agency's inbox
        — no human upstream of the DMC touched it
```

This is the moment that justifies the system to the wholesaler: their downstream agencies get DMC-direct response speed without losing margin governance.

---

## Markup rules engine

A rule is a single record. Rules are evaluated in priority order; the first match wins. A rule belongs to a scope (`platform` or `wholesaler`).

### Rule shape

```ts
export type MarkupRule = {
  id: string
  scope: "platform" | "wholesaler"
  wholesalerId?: string                  // required when scope = "wholesaler"
  priority: number                       // lower = evaluated first
  name: string                           // human-readable, for the UI list
  enabled: boolean

  // Matchers — all must pass for the rule to apply
  matchers: {
    countries?: CountryCode[]            // any of
    dmcIds?: string[]                    // any of
    themes?: ItineraryTheme[]            // any of
    minPaxNet?: number                   // DMC net per pax >= this
    maxPaxNet?: number                   // DMC net per pax <= this
    minTotalNet?: number                 // DMC net total >= this
    maxTotalNet?: number                 // DMC net total <= this
    agencyTier?: ("standard" | "gold" | "vip")[]
    requestType?: ("MODIFY_EXISTING" | "FROM_SCRATCH")[]
    hotelTier?: ("3" | "4" | "5" | "5+")[]
  }

  // Action when matched
  markup: {
    formula: "percentage" | "fixed_per_pax" | "fixed_total" | "tiered_percentage"
    value: number                        // for percentage: 12 = 12%; for fixed: USD
    minMarkupUSD?: number                // floor
    maxMarkupUSD?: number                // cap
    tiers?: Array<{ uptoNetUSD: number; percent: number }>  // for tiered_percentage
  }

  autoApply: boolean                     // true = skip human review, apply automatically

  // Forward-stage behavior
  autoForward?: boolean                  // true at scope's forward stage = auto-skip that party's review queue

  createdAt: string
  updatedAt: string
}
```

### Example rules — Safasoft platform

| Priority | Name | Match | Markup | Auto-forward | Auto-apply |
|---|---|---|---|---|---|
| 10 | Standard JO low-volume | country=JO · minTotalNet < $20k | 12% | ✓ | ✓ |
| 20 | Standard MA low-volume | country=MA · minTotalNet < $25k | 14% | ✓ | ✓ |
| 30 | Standard EG low-volume | country=EG · minTotalNet < $20k | 13% | ✓ | ✓ |
| 50 | Mid-volume any country | $20k ≤ total < $50k | 10% | ✓ | ✓ |
| 80 | High-value (manual review) | total ≥ $50k | suggest 7% | ✗ | ✗ |
| 99 | Catch-all fallback | (no matchers) | 10% | ✗ | ✗ |

### Example rules — UB Trip wholesaler

| Priority | Name | Match | Markup | Auto-forward | Auto-apply |
|---|---|---|---|---|---|
| 10 | Gold agencies — all destinations | agencyTier=gold | 18% | ✓ | ✓ |
| 20 | Standard agencies — JO/MA/EG | agencyTier=standard · country ∈ JO,MA,EG | 22% | ✓ | ✓ |
| 30 | VIP / luxury (manual review) | hotelTier=5+ OR theme=luxury | suggest 25% (cap $4k/pax) | ✗ | ✗ |
| 40 | Religious tours | theme=religious | 15% | ✓ | ✓ |
| 99 | Catch-all fallback | (no matchers) | 20% | ✗ | ✗ |

### Rule editor UX

`/wholesaler/settings/rules` and `/platform/settings/rules`:
- Sortable list (drag to reorder priority)
- Inline create + edit
- Test button: paste a sample request payload, see which rule matches and what markup applies
- Disable toggle (rule preserved but inactive)
- Audit trail: who changed what + when

---

## UX surfaces

### Agency

- **`/agency/request/new`** — from-scratch form (new)
- **`/agency/customize/[id]`** — existing customize page + new "Request further customization" button (modify)
- **`/agency/requests`** — agency's own request inbox (new, or rebrand of existing `/agency/quotes`)
  - Three tabs: In progress · Quoted (awaiting decision) · Closed
  - Status badge per row showing pipeline progress
- **`/agency/requests/[id]`** — detail view showing:
  - Original request payload
  - Pipeline progress timeline (visual: which stage holds the request)
  - When `QUOTED_TO_AGENCY` — full pricing display + Accept / Decline / Negotiate buttons
  - Accept → converts to a booking with `bookingType: "CUSTOM_RFQ"`

### Wholesaler

- **`/wholesaler/rfqs`** — extends today's list to show requests in all pipeline states (was: only WAITING_QUOTE / QUOTED / DECLINED)
  - Three tabs: My queue (manual review needed) · In flight (auto-routed or downstream) · History
- **`/wholesaler/rfqs/[id]`** — detail page (extends today's):
  - Original request
  - Pipeline timeline
  - Action buttons depending on current stage:
    - At `AWAITING_WHOLESALER_REVIEW`: Forward to platform · Decline · Send back to agency for revision
    - At `WHOLESALER_APPLYING_MARKUP`: shows DMC net + platform markup. Wholesaler enters their markup (pre-filled from matching rule if any). Send to agency.
- **`/wholesaler/settings/rules`** — markup + auto-forward rule editor (new)

### Platform (Safasoft)

- **`/platform/rfqs`** — global RFQ inbox (new) — sees requests across all wholesalers and DMCs
  - Tabs by state, filters by wholesaler / DMC
- **`/platform/rfqs/[id]`** — detail page
  - Pipeline timeline
  - At `AWAITING_PLATFORM_REVIEW`: Forward to DMC · Reject · Send back to wholesaler
  - At `PLATFORM_APPLYING_MARKUP`: shows DMC net. Platform enters their markup. Forward to wholesaler.
- **`/platform/settings/rules`** — markup + auto-forward rule editor (new)

### DMC

- **`/dmc/rfqs`** — DMC's request inbox (new)
  - One tab: Pending quotes
- **`/dmc/rfqs/[id]`** — quote form
  - Reads the request structure (destinations, dates, pax, themes, hotel tier, special needs)
  - DMC enters their net pricing — usually per pax × pax count, optionally with line items (accommodation, transport, guides, activities)
  - Submit → kicks the request into the return-leg of the pipeline
  - Decline → short-circuits to DECLINED with reason

---

## Data model

### `CustomRequest` (new — `lib/types.ts`)

```ts
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

export type CustomRequest = {
  id: string
  type: RequestType
  state: RequestState

  // Originator
  agencyId: string
  wholesalerId: string

  // Optional base
  baseItineraryId?: string

  // Request payload (structured + freeform)
  payload: {
    destinations: CountryCode[]
    cities?: string[]
    travelWindow: { from: string; to: string }
    durationDays: number
    pax: { adults: number; children: number; infants: number }
    themes: ItineraryTheme[]
    hotelTier: "3" | "4" | "5" | "5+" | "mixed"
    budgetPerPaxUSD?: number
    budgetBand?: "standard" | "premium" | "luxury" | "unlimited"
    activitiesRequested?: Localized<string[]>
    specialNeeds?: Localized<string>
    notes?: Localized<string>
    dayModifications?: Array<{ day: number; action: "ADD" | "REMOVE" | "REPLACE"; description: Localized<string> }>
  }

  // Routing
  routing: {
    assignedDmcId?: string                  // platform picks this when forwarding to DMC
    currentHolder: "agency" | "wholesaler" | "platform" | "dmc"
    direction: "forward" | "backward"
  }

  // Pricing — populated stage by stage
  pricing: {
    dmcNetTotalUSD?: number                 // populated when DMC quotes
    dmcNetPerPaxUSD?: number                // computed convenience field
    platformMarkupUSD?: number              // platform's add (total)
    platformMarkupRuleId?: string           // which rule applied (or null = manual)
    wholesalerMarkupUSD?: number            // wholesaler's add (total)
    wholesalerMarkupRuleId?: string
    agencyRetailUSD?: number                // = dmcNet + platformMarkup + wholesalerMarkup
  }

  // Audit log — append-only
  events: Array<{
    ts: string
    actor: "agency" | "wholesaler" | "platform" | "dmc" | "system"
    actorName?: string                      // "张经理" / "UB Trip Ops" / "Safasoft Auto-Router" / DMC name
    action: "submitted" | "forwarded" | "declined" | "quoted" | "markup_applied" | "accepted" | "expired" | "clarification_requested"
    note?: string
    matchedRuleId?: string                  // if action was driven by a rule
  }>

  // Quote TTL after QUOTED_TO_AGENCY
  expiresAt?: string

  createdAt: string
  updatedAt: string
}
```

### `MarkupRule` — see schema in §"Rules engine" above

### State extensions — `lib/demo-state.ts`

```ts
export type DemoState = {
  // ... existing
  customRequests: CustomRequest[]
  markupRules: { platform: MarkupRule[]; wholesaler: Record<string, MarkupRule[]> }

  // Actions
  submitCustomRequest: (payload: Omit<CustomRequest, "id" | "state" | "events" | "createdAt" | "updatedAt" | "routing" | "pricing">) => string
  advanceRequest: (id: string, action: "forward" | "decline" | "request_clarification", note?: string) => void
  quoteRequestAsDmc: (id: string, dmcNetTotalUSD: number, note?: string) => void
  applyMarkup: (id: string, scope: "platform" | "wholesaler", markupUSD: number, ruleId?: string) => void
  acceptRequest: (id: string) => void
  declineRequest: (id: string, reason: string) => void

  // Rules management
  upsertMarkupRule: (rule: MarkupRule) => void
  removeMarkupRule: (ruleId: string) => void
  reorderMarkupRules: (scope: "platform" | "wholesaler", wholesalerId: string | null, orderedIds: string[]) => void
}
```

The rule-evaluation function is a pure utility that lives in `lib/rfq/evaluate-rules.ts`:

```ts
export function evaluateRules(
  rules: MarkupRule[],
  context: {
    requestType: RequestType
    countries: CountryCode[]
    themes: ItineraryTheme[]
    hotelTier: string
    dmcNetTotalUSD?: number
    dmcNetPerPaxUSD?: number
    agencyTier?: "standard" | "gold" | "vip"
    dmcId?: string
  }
): { matchedRule: MarkupRule | null; markupUSD: number; autoApply: boolean; autoForward: boolean }
```

Pure, testable, no React.

---

## Implementation phases

### Phase 1 — Schema + state (no UI yet)

1. `lib/types.ts` — add `CustomRequest`, `RequestState`, `RequestType`, `MarkupRule`
2. `lib/mock/custom-requests.ts` — seed ~8 mock requests across all states (DRAFT, in-flight, quoted, accepted, declined, expired)
3. `lib/mock/markup-rules.ts` — seed the example rule sets
4. `lib/demo-state.ts` — extend with the new state + actions
5. `lib/rfq/evaluate-rules.ts` — pure rule-evaluation utility
6. `lib/i18n/zh-CN.ts` + `en.ts` — all new string keys

### Phase 2 — Agency entry points

7. `app/agency/request/new/page.tsx` — from-scratch form
8. `app/agency/customize/[id]/page.tsx` — extend existing customize page with "Request further customization" button + dialog
9. `app/agency/requests/page.tsx` — agency's request inbox (or rebrand `/agency/quotes`)
10. `app/agency/requests/[id]/page.tsx` — detail with pipeline timeline + accept/decline

### Phase 3 — Wholesaler review + markup

11. `app/wholesaler/rfqs/page.tsx` — extend existing list to show all pipeline states with tabs
12. `app/wholesaler/rfqs/[id]/page.tsx` — extend detail with new actions (forward to platform, apply markup, request clarification)
13. `app/wholesaler/settings/rules/page.tsx` — wholesaler markup rule editor

### Phase 4 — Platform review + markup

14. `app/platform/rfqs/page.tsx` — global RFQ inbox
15. `app/platform/rfqs/[id]/page.tsx` — detail with forward-to-DMC + apply-markup actions
16. `app/platform/settings/rules/page.tsx` — platform markup rule editor

### Phase 5 — DMC quote workflow

17. `app/dmc/rfqs/page.tsx` — DMC inbox
18. `app/dmc/rfqs/[id]/page.tsx` — quote form
19. Update DMC sidebar nav to include RFQs

### Phase 6 — Polish + demo support

20. Pipeline timeline component shared across all 4 portal detail pages
21. Audit log component
22. Auto-routing telemetry: dashboard widget on `/wholesaler/dashboard` showing "% of requests auto-routed", "avg time to quote", etc.
23. Accept → booking conversion path
24. Update `public/demo-guide.html` with the new demo arc
25. Update `public/pitch.html` to mention the custom-request capability

Rough size estimates: Phase 1 ≈ 4h · Phase 2 ≈ 6h · Phase 3 ≈ 4h · Phase 4 ≈ 4h · Phase 5 ≈ 3h · Phase 6 ≈ 4h. **Total ≈ 3 working days.**

---

## Demo arc

When this lands, the demo gains a powerful new beat:

**"Beyond the catalog"** — 4 minutes, slotted between the agency wow page and the booking flow.

1. From `/agency/browse/it-005` (Morocco Luxury Honeymoon), the agency clicks "Request further customization" → wants to swap La Mamounia for a private riad in Marrakech + add 2 days in Essaouira.
2. Submit. (Show the auto-routing simulation — pipeline timeline jumps from agency → DMC inbox in under a second.)
3. Switch persona to DMC (Atlas Mountains DMC, Marrakech). The new request appears in their inbox. DMC enters a net quote of $4,200/pax × 2 pax = $8,400.
4. Switch persona to platform. Show the audit log: platform's "Standard MA mid-volume" rule auto-applied 12% = $1,008. Forwarded to wholesaler.
5. Switch persona to wholesaler. Same audit log shows UB Trip's "Standard agencies" rule auto-applied 22% = $2,069. Quote pushed to agency.
6. Switch back to agency. Quote of $11,477 is in their inbox with full pipeline timeline. Accept → becomes a booking.
7. **Total elapsed time on screen: under 90 seconds. Total human intervention: just the DMC quote.**

That's the moment that sells the platform vs cold-calling a DMC. Speed + governance + transparency, all at once.

For the manual-review story, walk through the same flow but with high-value triggers (e.g., budget = "luxury") that hit a manual-review rule. Show the request landing in each party's inbox with the suggested markup pre-filled, and the human approver clicking through.

---

## Out of scope for v1

- **Multi-DMC bidding** — request fanned out to multiple DMCs simultaneously, lowest quote wins. Useful but complex; deferred.
- **Inline negotiation** — agency counter-offers, DMC adjusts. Just accept / decline / clarify for v1.
- **Currency translation in rules** — all matchers assume USD. Multi-currency support deferred.
- **Real-time notifications** — for the demo, state updates appear when the user navigates to the relevant page. Push notifications via WebSocket / email / WeChat is a real-world need, not demo-day need.
- **Pricing breakdown line items from DMC** — DMC quotes a single net total, not itemized (accommodation / transport / guides / activities). Line-item breakdown is nice-to-have but not required to demonstrate the flow.
- **Capacity check** — request doesn't verify with DMC schedules / allotments. Assumed: if DMC accepts the quote, capacity exists.
- **Booking conversion flow** — accept → booking is a transition; the booking creation logic is simplified (just sets state). Full conversion with payment, voucher, etc. is a follow-up.
- **Rule simulator** — "show me which rule would apply for this hypothetical request" — useful diagnostic tool, deferred.
- **Rule import/export** — wholesalers can't bulk import rule sets from CSV. Manual entry only for v1.
- **Per-agency rule overrides** — rules apply per wholesaler tenant uniformly. "VIP agency gets a special markup" is a single rule, not a per-agency override map. Acceptable for v1.

---

## Open questions to resolve later

1. **Who picks the DMC?** When platform forwards the request to DMC, the platform must decide WHICH DMC. Options: (a) platform admin picks manually, (b) round-robin among DMCs serving that destination, (c) DMC has self-claim from a shared queue, (d) auto-route by DMC trust tier. For v1 probably (a) with a "suggested DMC" hint based on country.

2. **What if the DMC declines?** Re-route to another DMC? Bounce back to platform for manual reassignment? Notify the agency immediately? For v1: bounce back to platform, platform decides what to do.

3. **TTL on quotes** — when the request reaches `QUOTED_TO_AGENCY`, how long does the agency have to accept? 72 hours feels right but should be configurable per wholesaler.

4. **Audit-log permissions** — does the wholesaler see who at Safasoft approved their request? Does the agency see the wholesaler's reviewer name? Probably yes for transparency, but check before exposing.

5. **What about DMCs outside the platform's network?** A wholesaler might have a relationship with a DMC we haven't onboarded. Do we let them route a request to a "platform-suggested" external DMC? Probably not for v1 — that's a network-effect leak.

6. **Pricing surge / FX** — if a request sits in the pipeline for 48 hours and the local currency moves, who eats the FX delta? Probably DMC (they quote in USD). Worth documenting in the DMC contract.

7. **Should the platform see the wholesaler's markup?** Today's design says yes (full transparency upward). But wholesalers might want to keep their margin private from the platform. Trade-off: platform analytics need it for cross-tenant insights; wholesalers value privacy. Probably show platform admins aggregate stats but not per-request markup. Decide before building `/platform/rfqs`.

8. **What's the relationship to existing `bookings`?** When a request is accepted, does it become a booking immediately or sit in a "to-be-confirmed" state? Probably becomes a booking with `state = BOOKING_PENDING` and goes through normal DMC confirmation, which is mostly automatic since the DMC already quoted.

9. **Agency clarification round-trips** — if any stage requests clarification, the request goes back to the agency. When the agency responds, does the request re-enter the pipeline from the start, or from where it left off? Probably from where it left off (preserves the audit log + any markups already applied).

10. **Mobile agency UX** — Chinese mid-tier agency owners do a lot of work on WeChat. The from-scratch form might be too long for mobile. Consider a chat-style intake (sequence of bubbles) for mobile only. Defer to mobile polish phase.

---

## Files touched (summary)

**New files** (~10):
- `lib/mock/custom-requests.ts`
- `lib/mock/markup-rules.ts`
- `lib/rfq/evaluate-rules.ts`
- `app/agency/request/new/page.tsx`
- `app/agency/requests/page.tsx`
- `app/agency/requests/[id]/page.tsx`
- `app/wholesaler/settings/rules/page.tsx`
- `app/platform/rfqs/page.tsx`
- `app/platform/rfqs/[id]/page.tsx`
- `app/platform/settings/rules/page.tsx`
- `app/dmc/rfqs/page.tsx`
- `app/dmc/rfqs/[id]/page.tsx`
- `components/shared/pipeline-timeline.tsx`
- `components/shared/audit-log.tsx`

**Modified files** (~12):
- `lib/types.ts`
- `lib/demo-state.ts`
- `lib/i18n/zh-CN.ts` + `lib/i18n/en.ts`
- `app/wholesaler/rfqs/page.tsx` — extend
- `app/wholesaler/rfqs/[id]/page.tsx` — extend
- `app/agency/customize/[id]/page.tsx` — add request CTA
- `app/agency/browse/[id]/page.tsx` — mention "Need something custom? Request a quote →"
- `app/dmc/layout.tsx` — sidebar nav
- `app/platform/layout.tsx` — sidebar nav
- `app/wholesaler/settings/page.tsx` — link to rules editor
- `app/platform/settings/page.tsx` — link to rules editor
- `public/demo-guide.html` — new demo arc
- `public/pitch.html` — mention beyond-catalog capability

**Verification:**
- Type-check clean
- Production build succeeds
- End-to-end browser walk-through: submit from-scratch request → confirm auto-routes to DMC → DMC quotes → markups auto-apply → quote reaches agency inbox → accept → booking created
- Manual-review walk-through: high-value request hits manual rules at every stage; all four roles complete their stages with the rule's suggested markup pre-filled

---

## Resume notes

When picking this up again:

1. Read this doc start-to-finish. Confirm the locked decisions still hold.
2. Decide on the open questions in §"Open questions" — especially #1 (DMC selection), #3 (TTL), #7 (markup visibility).
3. Phase 1 alone delivers the data plumbing; safe to ship without UI as a foundational checkpoint.
4. Best demo value comes after Phase 4. Phases 5 + 6 add depth but the headline auto-routing story is demoable at end of Phase 4 with mock DMC quotes (the DMC inbox UI from Phase 5 just makes the demo story more concrete).
5. Consider building the rule-evaluation utility (Phase 1, step 5) with proper unit tests — it's the only piece of pure logic in this feature and the only place a bug would actually cost the platform money.
6. The current `/wholesaler/rfqs` flow stays as-is during Phases 1-2. Migrating it to the new pipeline happens in Phase 3.

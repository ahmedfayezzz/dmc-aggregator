# Demo Build Plan — DMC Aggregator Platform

**For:** Claude Code session(s)
**Goal:** Clickable demo prototype for wholesaler partner pitch
**Timeline:** 10 days
**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui, single repo, no backend
**Deployment:** Vercel

**Companion documents (read these first, in order):**
1. [`ui-design-guide.md`](./ui-design-guide.md) — Design system, typography, color, components, motion
2. [`i18n-and-mock-data-guide.md`](./i18n-and-mock-data-guide.md) — Internationalization architecture and mock data structure

---

## 0. Context for Claude Code

You are building a **clickable interactive prototype**, not a production application. The goal is to demo a B2B travel platform to a wholesaler partner. Read these rules before doing anything:

### Hard constraints

1. **No backend.** No database, no API routes that talk to external services, no authentication that actually authenticates. Mock data lives in TypeScript files under `/lib/mock/` per the mock data guide.
2. **No real persistence.** State held in React (`useState`, `useReducer`, Zustand for cross-page state). Page reload resets everything — that's fine for demo.
3. **No error handling beyond happy paths.** This demo only needs to work on the demo-day click path. Don't build defensive code.
4. **No mobile responsiveness beyond "doesn't visually break."** Demo runs on a laptop projector. Optimize for 1440px+ wide screens.
5. **i18n is foundational, not retrofit.** Every UI string comes from i18n keys. All mock data is bilingual (zh-CN + en). There is **no hardcoded Chinese or English in JSX, ever.** See the i18n guide.
6. **Default locale is zh-CN.** Language toggle visible in topbar. Wholesaler and agency portals default to zh-CN; DMC portal defaults to en; platform admin defaults to en. User can switch any time.
7. **Reuse shadcn/ui components as scaffolding.** Don't ship shadcn defaults — apply the UI design guide overrides. If a new primitive is needed, follow the patterns in the guide.
8. **Follow the UI design guide religiously.** No improvising on visual patterns. The aesthetic direction is committed.

### What makes this demo win

- **Feels expensive.** Premium typography, generous spacing, considered transitions.
- **Feels bilingual-native.** Chinese and English both look first-class. No second-class language treatment.
- **Feels purposeful.** Every screen tells part of a story. No filler.
- **Feels real.** Realistic data (real-looking Chinese agency names, real Middle East destinations, plausible prices, realistic dates).

### What we are NOT building

- Not real authentication
- Not real payments
- Not a working booking engine (it's mocked)
- Not multi-tenant database isolation (single hardcoded wholesaler)
- Not production deployment infrastructure (Vercel preview is fine)
- Not test coverage, error tracking, or analytics

---

## 1. The four portals — narrative roles

Each portal serves a different demo purpose. Build them with that in mind.

| Portal | URL | Default locale | Demo role | Build depth |
|---|---|---|---|---|
| **DMC portal** | `/dmc/*` | en | Proves the supply story | Medium — credible operational surface |
| **Platform admin** | `/platform/*` | en | Shows our control plane | Light — overview level |
| **Wholesaler portal** | `/wholesaler/*` | zh-CN | The star — partner sees themselves operating | Deep — full operational tooling |
| **Agency portal** | `/agency/*` | zh-CN | The desire trigger — what their agencies experience | Deep — full purchase journey |

The wholesaler portal and agency portal are the centerpieces. The DMC portal proves the supply curation story. The platform portal is short context only.

---

## 2. Project structure

```
/
├── app/
│   ├── page.tsx                              # Demo landing / persona switcher
│   ├── layout.tsx                            # Root layout, fonts, providers
│   ├── globals.css
│   │
│   ├── dmc/                                  # DMC portal
│   │   ├── layout.tsx                        # DMC-branded shell, en default
│   │   ├── dashboard/page.tsx
│   │   ├── itineraries/page.tsx
│   │   ├── itineraries/[id]/page.tsx
│   │   ├── itineraries/new/page.tsx
│   │   ├── schedules/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── allotments/page.tsx
│   │   ├── bookings/page.tsx
│   │   ├── bookings/[id]/page.tsx
│   │   ├── statements/page.tsx
│   │   └── settings/page.tsx
│   │
│   ├── platform/                             # Our aggregator admin
│   │   ├── layout.tsx
│   │   ├── overview/page.tsx
│   │   ├── wholesalers/page.tsx
│   │   ├── dmcs/page.tsx
│   │   ├── supply/page.tsx
│   │   └── settings/page.tsx
│   │
│   ├── wholesaler/                           # Wholesaler admin portal
│   │   ├── layout.tsx                        # Wholesaler-branded shell
│   │   ├── dashboard/page.tsx
│   │   ├── catalog/page.tsx
│   │   ├── catalog/[id]/page.tsx
│   │   ├── agencies/page.tsx
│   │   ├── agencies/[id]/page.tsx
│   │   ├── bookings/page.tsx
│   │   ├── bookings/[id]/page.tsx
│   │   ├── rfqs/page.tsx
│   │   ├── rfqs/[id]/page.tsx
│   │   ├── reports/page.tsx
│   │   └── settings/page.tsx
│   │
│   └── agency/                               # Sub-agency portal (white-labeled)
│       ├── layout.tsx                        # Wholesaler-branded shell
│       ├── browse/page.tsx
│       ├── browse/[id]/page.tsx
│       ├── customize/[id]/page.tsx
│       ├── quote/[id]/page.tsx
│       ├── book/[id]/page.tsx
│       ├── bookings/page.tsx
│       ├── bookings/[id]/page.tsx
│       ├── wallet/page.tsx
│       └── voucher/[id]/page.tsx
│
├── components/
│   ├── ui/                                   # shadcn/ui (don't modify)
│   ├── shared/                               # Cross-portal components
│   │   ├── itinerary-card.tsx
│   │   ├── price-tag.tsx
│   │   ├── pax-selector.tsx
│   │   ├── date-picker.tsx
│   │   ├── wallet-badge.tsx
│   │   ├── empty-state.tsx
│   │   ├── stat-card.tsx
│   │   ├── status-badge.tsx
│   │   ├── locale-switcher.tsx
│   │   └── persona-switcher.tsx
│   ├── dmc/                                  # DMC-specific
│   ├── platform/                             # Platform-specific
│   ├── wholesaler/                           # Wholesaler-specific
│   └── agency/                               # Agency-specific
│
├── lib/
│   ├── mock/                                 # ALL mock data (see mock data guide)
│   │   ├── dmcs.ts
│   │   ├── wholesalers.ts
│   │   ├── agencies.ts
│   │   ├── itineraries.ts
│   │   ├── pricing.ts
│   │   ├── departures.ts
│   │   ├── bookings.ts
│   │   ├── pax.ts
│   │   ├── rfqs.ts
│   │   ├── wallet.ts
│   │   ├── photos.ts
│   │   └── index.ts                          # Re-exports
│   ├── types.ts                              # All TS interfaces
│   ├── utils.ts                              # cn, formatter helpers
│   ├── formatters/
│   │   ├── currency.ts                       # Locale-aware
│   │   ├── date.ts                           # Locale-aware
│   │   └── duration.ts
│   ├── i18n/                                 # See i18n guide
│   │   ├── config.ts                         # Locale config
│   │   ├── provider.tsx                      # React context
│   │   ├── use-translation.ts                # The t() hook
│   │   ├── get-localized.ts                  # For bilingual mock data
│   │   ├── zh-CN.ts                          # All zh-CN UI strings
│   │   └── en.ts                             # All en UI strings
│   ├── theme/
│   │   ├── tokens.ts                         # Color tokens (light + dark)
│   │   └── tenant-themes.ts                  # Wholesaler-branded overrides
│   └── demo-state.ts                         # Zustand for demo state
│
├── public/
│   ├── brand/
│   │   ├── platform-logo.svg                 # Our brand
│   │   ├── wholesaler-tianxing-logo.svg
│   │   ├── wholesaler-tianxing-mark.svg
│   │   └── dmc-logos/                        # Mock DMC logos
│   └── icons/
│
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── README.md
```

---

## 3. Build sequence (revised for 10 days with 4 portals)

The critical adjustment: Day 7 splits between completing the agency journey and building the DMC portal. Day 8 is platform admin (light) + polish. Days 1-2 are heavier because everything downstream depends on foundations being right.

### Day 1: Foundation (heavy day)

**Deliverables:**
- Next.js 15 project initialized with TS, Tailwind, shadcn/ui
- All fonts loaded via `next/font/google` per UI guide: Fraunces, Geist, Noto Sans SC, Source Han Serif, JetBrains Mono
- `tailwind.config.ts` with full color tokens (light + dark) per UI guide
- `globals.css` with CSS custom properties, dark mode as default
- shadcn overrides applied: `--radius: 0.25rem`, neutral palette → warm palette, button/input heights
- **i18n infrastructure fully wired:**
  - `/lib/i18n/zh-CN.ts` and `/lib/i18n/en.ts` with skeleton keys per i18n guide (nav, common actions, status labels, validation — populated incrementally as portals are built)
  - `LocaleProvider` mounted at root
  - `useTranslation()` hook working
  - `LocaleSwitcher` component in topbar (functional, persists to localStorage)
- TypeScript types in `/lib/types.ts` covering all entities (see mock data guide)
- Empty `/lib/mock/*` files created with type-only exports

**Checkpoint:** `npm run dev` shows a placeholder page with working dark mode (default), locale switcher toggling between zh-CN and en for a few demo strings, Fraunces displaying correctly, Chinese rendering correctly in Noto Sans SC.

### Day 2: Mock data + demo landing + persona switcher

**Deliverables:**
- All mock data files populated per the mock data guide. **This is the single most important day for demo realism.** Do not skip this to "start building UI" — every screen depends on data being credible.
  - 1 wholesaler (天行国旅)
  - 12-15 sub-agencies
  - 7 DMCs across UAE/Saudi/Jordan/Oman
  - 10-12 itineraries with full bilingual content
  - Pricing rules, seasonal multipliers
  - 30-40 bookings across varied states
  - 8 RFQs in varied states
  - Wallet transaction history
  - Photo URL list (pre-curated Unsplash MEA imagery — Ahmed provides this list)
- `/` — demo landing page. Two entry routes prominent: "Enter as Wholesaler" / "Enter as Agency". Smaller secondary entries: "DMC View" / "Platform View"
- `PersonaSwitcher` floating component working — switches user context and routes to relevant portal landing page
- Demo state setup (Zustand): current persona, current locale, "in-progress booking" placeholder
- One end-to-end utility test: `getLocalized(itinerary.title, 'zh-CN')` returns `'迪拜阿布扎比深度5日游'`; same call with `'en'` returns `'Dubai & Abu Dhabi Deep Dive 5D'`

**Checkpoint:** All mock data importable; locale switcher reflects in real time on a sample bilingual string.

### Day 3: Wholesaler shell + dashboard + agencies

**Deliverables:**
- `/wholesaler/layout.tsx` — sidebar nav, topbar with wholesaler logo, search, locale switcher, persona menu. Wholesaler branding applied via `data-tenant="tianxing"` attribute and CSS variable theme override.
- `/wholesaler/dashboard` — 4 KPI tiles (GMV this month, Active bookings, Pending RFQs, Active agencies), recent bookings panel (5 rows), upcoming departures panel (5 rows), recent agency activity feed
- `/wholesaler/agencies` — table of 12-15 agencies with filters (status, mode). Columns: name (zh-CN + license #), location, wallet mode badge, balance/credit, recent activity, GMV, status
- `/wholesaler/agencies/[id]` — agency detail: header with KYC status and wallet config, tabs for Overview / Bookings / Wallet ledger / Settings. Wallet mode toggle (visual only). Credit limit editor.

**Checkpoint:** Wholesaler can land on dashboard, navigate to agencies, click into one, see realistic detail.

### Day 4: Wholesaler catalog + RFQs

**Deliverables:**
- `/wholesaler/catalog` — Grid of all itineraries from our aggregator. Each card: photo, bilingual title (zh-CN visible, en in subtitle when locale=zh-CN), duration, DMC source, "published to my agencies" toggle, your markup display
- `/wholesaler/catalog/[id]` — Itinerary detail showing:
  - Full content (day-by-day, inclusions, exclusions)
  - **Margin breakdown card** (key demo moment): DMC net → our markup → wholesaler markup (editable) → suggested agency retail. Critical visual.
  - Departure schedule (for FIXED): table of dates with fill rates
  - Pricing rules (for ON_DEMAND): season-by-season pricing matrix
  - Cancellation policy preview
  - "Publish to agencies" controls with agency-selection
- `/wholesaler/rfqs` — Queue of RFQs with SLA countdown timers (visual, decrementing). Each row: agency name, itinerary, customization summary, time-in-queue, status
- `/wholesaler/rfqs/[id]` — RFQ detail: original itinerary, agency's modifications, pricing tool sidebar, response form (quote / decline)

**Checkpoint:** Wholesaler can browse catalog, drill into an itinerary, see margin layers clearly, manage their RFQ queue.

### Day 5: Wholesaler bookings + reports + settings

**Deliverables:**
- `/wholesaler/bookings` — Filterable table (status, date range, agency, destination). Columns: ref, agency, itinerary, departure date, pax, amount, status badge
- `/wholesaler/bookings/[id]` — Booking detail with timeline visualization (state transitions), pax data summary, voucher preview link, wallet impact, audit log of state changes
- `/wholesaler/reports` — 4 charts using `recharts`:
  - GMV by month (line)
  - Top 5 agencies by volume (bar)
  - Top 5 itineraries by bookings (bar)
  - Conversion funnel (quote → book → confirmed)
- `/wholesaler/settings` — wholesaler profile, brand preview (logo, colors), markup defaults, cancellation policy management, locale defaults

**Checkpoint:** Wholesaler portal is feature-complete for the demo.

### Day 6: Agency portal — browse, detail, customize

**Deliverables:**
- `/agency/layout.tsx` — Agency portal shell, wholesaler-branded (logo, primary color, "天行国旅" identity). Sidebar nav: 浏览 / 我的预订 / 钱包 / 报价单 / 设置
- `/agency/browse` — Catalog browse with rich left-sidebar filters (destination country/city, dates, duration, pax, theme, price range, departure type). Card grid with hover states. Featured itineraries surfaced at top.
- `/agency/browse/[id]` — **The wow page.** Hero photo (large, immersive), photo gallery, day-by-day with rich bilingual content, inclusions/exclusions tabs, sticky right-side price calculation panel, departure picker (FIXED) or date+pax picker (ON_DEMAND). Big "立即预订" and "保存为报价单" CTAs.
- `/agency/customize/[id]` — For ON_DEMAND or modified FIXED. Pick dates (date picker), pax counts (adult/child/infant), room config, optional hotel upgrades (2-3 options shown per city), optional excursion add-ons. Right panel: real-time price update with breakdown.

**Checkpoint:** Agency browse → detail → customize flow is silky smooth. Detail page should feel premium enough that the wholesaler thinks "my agencies would love this."

### Day 7: Agency completion + DMC portal

Heavy day. Cut anything not essential to demo.

**Agency completion (morning):**
- `/agency/quote/[id]` — Saved quote view styled like a proposal preview. Branded with wholesaler. "Convert to booking" CTA. TTL countdown visible.
- `/agency/book/[id]` — 3-step flow: review → pax count (skip individual data entry for demo) → confirm. Final step shows wallet deduction.
- `/agency/voucher/[id]` — Voucher PDF preview rendered in-browser. Co-branded with wholesaler + DMC. Pax summary, day-by-day services, supplier contact. "Download PDF" / "Share to WeChat" buttons (visual only).
- `/agency/bookings` — Agency's bookings list, filtered to their own
- `/agency/bookings/[id]` — Booking detail from agency POV (no margin info)
- `/agency/wallet` — Balance, ledger, top-up button (mock)

**DMC portal (afternoon):**
- `/dmc/layout.tsx` — DMC portal shell, our platform's brand. en default. Sidebar nav: Dashboard / Itineraries / Schedules / Pricing / Allotments / Bookings / Statements / Settings
- `/dmc/dashboard` — KPI tiles (Bookings this month, Confirmed bookings, Pending confirmations, Upcoming departures), inbound bookings feed, fill rate summary per active itinerary
- `/dmc/itineraries` — list of DMC's own itineraries. Status indicators (DRAFT / PENDING_REVIEW / PUBLISHED). Quick edit access.
- `/dmc/itineraries/[id]` — itinerary editor showing what the DMC manages: content (with translation status indicators), components, pricing rules. Photos, inclusions, day-by-day. Show "this is what we'll review before publishing to wholesalers" callout.
- `/dmc/schedules` — for FIXED departures: schedule editor (RRULE or explicit dates), capacity, min-pax, blackouts
- `/dmc/allotments` — allotment management table by date
- `/dmc/bookings` — bookings received from us, with pending-confirmation queue at top. Confirm/decline actions on pending bookings.
- `/dmc/statements` — monthly statement preview

**Checkpoint:** Agency journey complete end-to-end. DMC portal shows credible operational surface. The supply story is now demoable.

### Day 8: Platform admin (light) + visual polish pass

**Platform admin (morning, ~3 hours):**
- `/platform/overview` — KPIs across all wholesalers (visually structured for many, populated with one). Total GMV, DMCs, bookings.
- `/platform/wholesalers` — list (one entry: 天行国旅, with key contract metrics)
- `/platform/dmcs` — list of 7 DMCs with trust tier indicators
- `/platform/supply` — aggregated catalog from our POV, shows DMC source per item
- Settings page — minimal

Keep these screens functional but unspectacular. They're context, not centerpiece.

**Visual polish (afternoon):**
- Review every page for visual issues: alignment, spacing, type hierarchy
- Add page transitions per UI guide (Framer Motion)
- Stagger reveals on card grids
- Loading skeletons where data appears
- Refine empty states
- Verify hover states feel intentional
- Cross-portal consistency check: same component on different pages looks identical

**Checkpoint:** All four portals navigable. Visual quality consistent across all of them.

### Day 9: i18n completeness audit + demo rehearsal

**Morning — i18n audit:**
- Walk every screen in both zh-CN and en
- Verify zero hardcoded strings remain (use the linter recommended in i18n guide)
- Check Chinese typography: proper line-height, no awkward breaks, currency rendering
- Check English typography: similar pass
- Locale switching mid-flow doesn't break state
- Date and currency formatters working per locale

**Afternoon — demo rehearsal:**
- Ahmed runs full 20-minute demo script (in section 5 below)
- Identify every visual glitch, broken link, awkward transition
- Note timing on each section
- Fix P0/P1 issues found
- Deploy to Vercel (custom domain if Ahmed has DNS access, otherwise `*.vercel.app`)

**Checkpoint:** End-to-end demo runs in 20-22 minutes, no major hitches.

### Day 10: Final polish + buffer + dry run

- Final issues fixed
- Cold dry run with someone outside the project — get "what's confusing" feedback
- Optional: record a 5-minute Loom backup
- Optional: print/PDF summary deck for handout

**Checkpoint:** Ready to present.

---

## 4. Demo narrative (20-minute script)

Build to support exactly this click path.

### Part 1: Opening framing (2 min)
- Use 2-3 slides from the existing stakeholder deck (cover, "the gap", money flow)
- Or open directly on `/` if partner prefers product-first

### Part 2: The supply story — DMC portal (3 min)
- Switch persona to DMC (Arabian Adventures DMC, Dubai)
- Land on `/dmc/dashboard` — "this is what our supplier partners use to manage their inventory"
- Navigate to `/dmc/itineraries` — show inventory with translation status badges
- Click into one — show content, pricing, schedule
- Quick look at `/dmc/bookings` with pending confirmation — "every booking flows through, with SLA tracking"
- Frame: "This is where supply comes from. The supplier curates and manages. Now let's see how that supply gets distributed to you."

### Part 3: Wholesaler operations (6 min)
- Switch persona to Wholesaler Admin (张经理 @ 天行国旅)
- Note that the brand changes — "this is your portal, branded as you"
- Land on `/wholesaler/dashboard` — point out KPIs, recent bookings, agency activity
- Navigate to `/wholesaler/agencies` — "47 agencies under you, fully managed in your control"
- Click into one agency — show wallet config, debit/credit mode toggle
- Navigate to `/wholesaler/catalog` — "supply curated for you from our DMC network"
- Click into an itinerary — **show the margin breakdown card.** "Here's the DMC's net, here's our markup, here's where you set yours, here's what your agencies pay."
- Hit `/wholesaler/rfqs` briefly — SLA queue
- Brief look at `/wholesaler/reports`

### Part 4: Agency experience (7 min)
- Switch persona to Agency Owner (王明 @ 北京华夏国旅)
- Note URL/branding change — "your agencies operate in your brand, not ours"
- Land on `/agency/browse` — browse with Chinese filters
- Filter to UAE, click into "迪拜阿布扎比深度5日游"
- Walk through the detail page — hero photo, days, inclusions
- Click "立即预订" — go through customize flow (date, 4 pax, twin rooms)
- Generate quote — show branded proposal preview
- Convert to booking — wallet deduction
- Land on voucher — co-branded
- Quick look at `/agency/bookings` — list view
- Brief locale toggle to English — "fully bilingual, just one click"

### Part 5: Platform view (1 min, brief)
- Switch to Platform Admin
- `/platform/overview` — "this is our control plane across all wholesalers and DMCs"
- Don't dwell

### Part 6: Roadmap & close (1-2 min)
- Pull up stakeholder deck timeline slide
- 40-week phased delivery
- What's needed: contract terms, first DMCs, launch agency list
- Q&A

**Total: ~20 min with light buffer.**

---

## 5. Critical setup gotchas

1. **Use `next/font/google` for all fonts.** Don't `<link>` tag them. SSR-safe loading.
2. **CSS custom properties for theming, not Tailwind theme switching.** This lets us do `data-tenant="tianxing"` for the wholesaler-branded portals.
3. **Locale state:** stored in Zustand + localStorage, applied via `<html lang>` attribute. Not in URL path (would complicate route structure for demo).
4. **No backend means no Server Actions for mutations.** Use client-side state for everything. RSC for static rendering of mock data is fine.
5. **shadcn install:** install components as needed, not all upfront. Keeps the codebase clean.
6. **Don't let Claude Code write Chinese strings inline.** Catching this early matters — once a single hardcoded zh-CN string slips in, the codebase loses the "every string from i18n" discipline.

---

## 6. Things Ahmed needs to confirm before Day 1

1. **Wholesaler placeholder name and brand color.** Suggesting: `天行国旅` (Tianxing Tours) with deep teal `#1E4D5C` as primary, gold `#D4A65A` as accent. Confirm or override.
2. **Domain/subdomain for demo deployment.** Need a Vercel custom domain or accept `*.vercel.app`.
3. **Wholesaler logo asset.** Recommend Ahmed generates a simple wordmark + monogram in Figma in 30 min, or AI generates SVG. Don't let Claude Code spend a day on this.
4. **Photo curation.** Recommend Ahmed pre-picks 60-80 Unsplash URLs for itinerary heroes/galleries and provides them in `/lib/mock/photos.ts`. AI-picked photos look generic.
5. **Confirmation that the partner won't see these internal documents.** These docs are internal only — partner sees only the running demo.

---

## 7. Out-of-scope reminder

These are NOT being built:
- Real database, real authentication, real payment processing
- Real DMC API integrations
- Real translation pipeline (mock data is pre-translated)
- Real notification sending or PDF generation
- Real WeChat integration
- Multi-tenant architecture (single hardcoded wholesaler)
- Production deployment infrastructure
- Test coverage, accessibility audit, performance optimization

These matter for the comprehensive PRD and the real build. Not now.

---

## 8. Success criteria

The demo wins if, by the end of the 20-minute walkthrough, the partner is asking:

- "When can we start?"
- "Can our agencies start with this catalogue first?"
- "What's the commercial structure?"
- "Can we add our existing DMC relationships?"

If they're asking those questions, the demo did its job.

If they're asking technical questions about uptime, API specs, or detailed feature behavior — pivot to "let's set up a follow-up to walk through the technical roadmap" and produce the comprehensive PRD then.

---

**End of plan. Read this together with:**
- [`ui-design-guide.md`](./ui-design-guide.md)
- [`i18n-and-mock-data-guide.md`](./i18n-and-mock-data-guide.md)

**Hand all three to Claude Code as context, and start with Day 1 deliverables.**

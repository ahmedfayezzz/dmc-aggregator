# Demo video script — Custom Request flow, end-to-end

**Duration target:** 4 min 30 sec (record longer, trim later)
**Language:** English narration, English UI
**Recommended tool:** Loom, QuickTime screen recording, or OBS
**Recording resolution:** 1440×900 minimum (so the UI doesn't feel cramped)

---

## Pre-recording checklist (do these once before you hit Record)

1. **Open the app in a fresh browser profile** (Chrome incognito works) — clears any persisted demo state so seed data is fresh.
2. **HTTP basic auth login:** `tripon` / `safasoft2026` when the browser prompts.
3. **Locale:** make sure top-right shows **EN** (click the globe icon if it's 中文).
4. **Theme:** dark mode is the default and looks better on video; leave it.
5. **Verify the four seed personas exist** by clicking the persona switcher in the sidebar bottom-left. You should see: Agency · Wholesaler · DMC · Supplier.
6. **Close DevTools** before recording — Loom captures whatever's on screen.
7. **Window-size your browser to ~1440px wide** so the sidebar + main content both render comfortably.
8. **Mute notifications** on your laptop so toast pop-ins from other apps don't appear in the recording.

---

## Recording structure (5 chapters)

| # | Chapter | URL we land on | Time |
|---|---------|----------------|------|
| 1 | Setup & agency submits a request | `/agency/request/new` | 1:15 |
| 2 | Auto-routing — watch the wholesaler and DMC stages skip | `/agency/requests/[id]` | 0:45 |
| 3 | Supplier quotes the net cost | `/dmc/rfqs/[id]` | 1:00 |
| 4 | Markups stack on the return leg (auto-applied) | `/wholesaler/requests/[id]` | 0:30 |
| 5 | Agency sees the final price and accepts | `/agency/requests/[id]` | 1:00 |

Total approx 4:30. The audit log on the agency detail page tells the whole story in one view — that's the closing visual.

---

# Chapter 1 — Setup & Agency Submits (1:15)

**Start URL:** `http://<your-host>/` (the landing page with 4 persona cards)

### 1.1 — Opening shot (5 sec)

> "This is the Safasoft demo platform. Four personas — Agency, Wholesaler, DMC, and Supplier — represent the four parties that touch every custom-request deal. I'm going to walk one custom request from the agency all the way to a supplier and back."

**Visual:** the 4-card landing page. Just sit on it for 3 seconds so viewers can read.

### 1.2 — Enter as Agency (5 sec)

**Click:** the **Agency** card (top-left).
**Lands on:** `/agency/browse`

> "Agencies enter here. This is what an outbound tour agent in Beijing or Shanghai sees — our catalog of curated Middle East and North Africa itineraries. But today's traveler wants something we don't have in the catalog yet. So we click into the custom request flow."

### 1.3 — Open the request form (10 sec)

**Scroll down** past the itinerary cards until you see the dashed accent-colored card with a lightbulb icon: **"Beyond the catalog?"**.

**Click:** "Beyond the catalog? — Submit a custom request — we'll match it to a supplier from our network"

**Lands on:** `/agency/request/new`

> "Every itinerary page also has a 'Pick your travel dates' or 'Request a custom quote' link in the booking panel — we wired the same entry point into multiple places. This is the form an agency fills out when their client needs something bespoke."

### 1.4 — Fill the form (45 sec)

Fill the form top-to-bottom. **Speak as you click** — don't type silently.

**Section: Basics**

| Field | What to do | What to say |
|---|---|---|
| **Destination countries** | Click **Morocco** (it should highlight in accent gold) | "Morocco" |
| **Cities to include** | Type `Marrakech, Sahara, Fez` | "Marrakech, Sahara, and Fez" |
| **Travel window** | Leave defaults (Oct 15 → Oct 25) | "October" |
| **Duration** | Leave 8 days (or click + to 10) | "10 days" |
| **Travellers** | Leave Adults at 4, Children/Infants at 0 | "Four adults" |

**Section: Preferences & budget**

| Field | What to do | What to say |
|---|---|---|
| **Themes** | Click **Cultural** then **Family** | "Cultural and family — kids are with them" |
| **Hotel tier** | Click **4** | "Four-star hotels throughout" |
| **Budget band** | Leave **Standard** | "Standard budget" |
| **Per-pax budget** | Type `2500` | "$2,500 per pax target" |

**Section: Special needs & notes**

| Field | What to do | What to say |
|---|---|---|
| **Activities** (English textarea) | Type `Atlas Mountains horseback ride day for the kids; Marrakech cooking class for the parents` | "Two specific asks the client made — a horseback day for the kids, a cooking class for the parents" |
| Skip special needs | — | — |
| **Notes** (English textarea) | Type `Repeat client from Beijing, third trip with us` | "Quick note for context — repeat client" |

### 1.5 — Submit (5 sec)

**Click:** the gold **Submit request** button bottom-right.

**Watch for:** toast pops up reading **"Request submitted · auto-routing in progress"**.

**Lands on:** `/agency/requests/[newly-generated-id]`

> "Submit. Watch what happens."

---

# Chapter 2 — Auto-routing visible in the timeline (0:45)

**Current URL:** `/agency/requests/[id]` — the request detail page we just landed on.

### 2.1 — Point at the pipeline timeline (15 sec)

**Scroll down** past the original request brief to the **Pipeline timeline** section. There's a 4-stage horizontal stepper: Agency → Wholesaler → DMC → Supplier. The **Supplier** circle is highlighted in gold with "Currently with" underneath.

> "The request didn't just sit at the wholesaler. The pipeline shows it's currently sitting with the supplier — which means it auto-routed past both the wholesaler and the DMC layer."

### 2.2 — Show the audit log (20 sec)

**Scroll down further** to the **Audit log** section directly below the timeline. There are 3 entries:

1. **Agency · submitted** — just now
2. **Auto-router · Forwarded** — "Auto-forwarded by wholesaler rule [name]"
3. **Auto-router · Forwarded** — "Auto-forwarded by platform rule [name]"

**Point at** each line as you talk:

> "Every step is logged. The system auto-forwarded through the wholesaler — that's because UB Trip's rule wr-002 says 'standard agency requesting Jordan, Morocco, or Egypt? Auto-forward with 22% markup.' Then immediately the DMC's rule pr-002 said 'Morocco under twenty-five thousand dollars net? Auto-forward.' Both rules are visible and editable in the rules editor — I'll show that at the end."

### 2.3 — Set up the next switch (10 sec)

**Scroll back up** so the pipeline stepper is visible.

> "But the supplier — the actual local operator in Morocco who's going to deliver the tour — they have to quote the net cost. That's the only human in the chain right now. Let me switch to their portal."

---

# Chapter 3 — Supplier quotes the net cost (1:00)

### 3.1 — Switch persona (10 sec)

**Bottom-left of the sidebar:** click the persona switcher (it currently shows "Agency · [contact name]"). A dropdown opens with 4 personas in flow order.

**Click:** **Supplier View** (the bottom entry, with the compass icon).

**Lands on:** `/dmc/dashboard`

> "Switching to the supplier persona. In production each of these is a separate login — for the demo they're just one click."

### 3.2 — Navigate to supplier RFQ inbox (10 sec)

**Click:** the **Custom requests** entry in the sidebar (Inbox icon, between Bookings and Statements).

**Lands on:** `/dmc/rfqs`

> "This is the supplier's inbox of pending quote requests. The new one we just submitted is here at the top — see the destination match with what we typed."

**Visual:** the new request shows with status `Awaiting supplier quote` (warning yellow badge).

### 3.3 — Open the request (5 sec)

**Click:** the new request row.

**Lands on:** `/dmc/rfqs/[id]`

> "The supplier sees a clean brief — no commercial layer, no markup, no Chinese-market noise. Just the trip facts: destinations, dates, pax, hotel tier, special asks. They have to come back with one number — the net cost in USD."

### 3.4 — Submit the quote (25 sec)

**Find:** the gold-bordered card titled **"Submit net quote"** at the top of the page.

**In the "Net total USD" field** type: `18800`

**Pause** so the per-pax preview auto-computes — it should show `$4,700` next to it.

> "The supplier is quoting eighteen thousand eight hundred net. The per-pax field auto-computes — that's $4,700 per traveler for the four-pax group."

**In the "Note (optional)" textarea** type: `Includes private guide, Sahara luxury camp upgrade, and the horseback Atlas Mountains day with kids' insurance.`

> "Quick note for our records. Submit."

**Click:** **Submit net quote** button.

**Watch for:** toast says **"Quote submitted · markup stage entering"**.

### 3.5 — Show the timeline updated (10 sec)

The page reloads with the request now in a later state. **Scroll down** to the pipeline timeline.

The arrow direction reverses (now points up — "Quote returning to agency"). The audit log now has new entries:

- **Supplier · DMC quote** — $18,800
- **Auto-router · markup applied** — for the DMC layer (auto-applied by rule)
- **Auto-router · markup applied** — for the wholesaler layer (also auto-applied)

> "Quote submitted. The audit log shows what happened next: the DMC rule pr-002 auto-applied 14% — that's $2,632. Then the wholesaler rule wr-002 auto-applied 22% — that's another $4,718. Both happened automatically because the rules are configured to auto-apply on standard requests like this one. No human touched the markups."

---

# Chapter 4 — Markups stack on the return leg (0:30)

*(This is the chapter you can cut if you need to land at 3:30. The story is told just as well by the audit log on the agency view. Keep this chapter only if you want to show the wholesaler perspective explicitly.)*

### 4.1 — Switch to Wholesaler persona (5 sec)

**Persona switcher** (sidebar bottom) → **Wholesaler View**.

**Lands on:** `/wholesaler/dashboard`

### 4.2 — Navigate to wholesaler request inbox (5 sec)

**Click:** **Custom requests** in the sidebar.

**Lands on:** `/wholesaler/requests`

### 4.3 — Switch to "History" tab (5 sec)

**Click:** the **History** tab (the third tab — the request is no longer in the wholesaler's queue because the markup was applied automatically and it's already gone to the agency).

> "From the wholesaler's perspective, the request flowed through their queue and back without needing them to touch it. It's now in their History tab with the final price visible."

### 4.4 — Open it briefly (15 sec)

**Click:** the request row.

**Lands on:** `/wholesaler/requests/[id]`

**Point at the right sidebar:** the **Pricing** card now shows all four layers:

- Supplier net: $18,800
- DMC markup: $2,632
- Wholesaler markup: $4,718
- **Agency retail: $26,150**

> "From this view — and only from this view — the wholesaler sees every margin layer end to end. The supplier sees only their net. The agency sees only the retail. The DMC sees their layer plus the supplier net. Everyone sees what they own, nothing they don't."

---

# Chapter 5 — Agency sees the final price and accepts (1:00)

### 5.1 — Switch back to Agency (5 sec)

**Persona switcher** → **Agency View**.

**Lands on:** `/agency/browse`

### 5.2 — Go to requests inbox (5 sec)

**Sidebar:** click **Custom requests** (Inbox icon).

**Lands on:** `/agency/requests`

### 5.3 — Show the new state (10 sec)

The request we submitted is now in the **Quoted** tab with the final retail price visible on the right side of the row.

> "From the agency's side — same request, completely different view. The status is now 'Quoted to agency.' They see the retail price — $26,150 — and a 72-hour expiry."

### 5.4 — Open the detail (10 sec)

**Click:** the request row.

**Lands on:** `/agency/requests/[id]`

### 5.5 — The hero of the demo — the accept card (15 sec)

At the very top there's an accent-gold card with **Accept quote** and **Decline** buttons. The price is the headline.

> "The agency client now has exactly what they need to decide — one number, full breakdown one click away, and a deadline. Watch the right sidebar."

**Point at the right sidebar Pricing card:** it shows only **Your total: $26,150** — no upstream layers exposed.

> "Even at the moment of decision, the agency doesn't see what the supplier charged, doesn't see the DMC's cut, doesn't see the wholesaler's cut. They see what they owe."

### 5.6 — Accept (5 sec)

**Click:** the gold **Accept quote** button.

**Watch for:** toast says **"Quote accepted · booking flow next"**.

The status badge flips to **Accepted** (green).

> "Accept. From here the booking flow takes over — wallet capture, voucher generation, supplier confirmation — but the custom request lifecycle is done."

### 5.7 — Closing on the audit log (10 sec)

**Scroll down** to the audit log section.

> "And the audit log is the receipt. Every state transition, every actor, every auto-rule that fired, every dollar amount, all timestamped. This is what a compliance team or a finance team needs when they ask 'why did this trip cost what it cost.'"

---

# Optional outro — Rule editor (15 sec)

If you have a few more seconds and want to address the "but who set those rules?" question that the demo naturally raises:

**Persona switcher** → **DMC View** → sidebar click **Markup rules**.

**Lands on:** `/platform/settings/rules`

> "And those auto-routing rules I kept mentioning — they're not hidden in code, they're here. DMC operations can reorder them, edit the percentages, run a sample request through the tester before a rule goes live. The wholesaler has the same editor for their layer. The rules engine is the network's economic floor — and it's editable, not magic."

---

# Pacing notes

- **Don't rush.** Stakeholders need 2–3 seconds on every visual to register what they're looking at. If you blast through, they lose the thread.
- **Pause before clicking anything important.** Especially the Submit button at the end of the form, and the Accept button at the end. Let viewers see what they're about to commit to.
- **Verbal cues that work well:**
  - "Watch what happens" — primes the viewer for a state change
  - "Notice the …" — directs attention to a specific UI element
  - "This is the only … in the entire flow" — establishes asymmetry/uniqueness
- **If you fluff a click, just keep going.** Stop, scroll back, redo verbally. Loom edits the silence out.

# What to NOT do

- Don't open Settings panes other than what's listed
- Don't switch personas more than the script says (each switch costs ~3 seconds of viewer attention)
- Don't show wallet, bookings, or any other portal feature in the same recording — it dilutes the custom-request story. Save those for a separate video.
- Don't explain the rule engine matchers in detail. The audit log naming convention (`wr-002`, `pr-002`) plants the seed — the optional outro is the only place that's safe to expand.

# After recording

1. Trim the dead frames at the beginning and end (3 seconds each end is plenty).
2. Speed up the form-fill section by 1.5x if you want it under 4 minutes total — it's the densest part.
3. Add captions for accessibility — Loom and Descript both do this automatically from the audio.
4. Export at 1080p, share the link. Don't share the raw file; it'll be huge.

# If anything looks off during recording

- **The new request didn't appear in the supplier inbox** → check the wholesaler & DMC rules were auto-forwarding (rare but possible if state was edited). Re-submit with a different city to make sure the matchers fire.
- **Audit log shows the wrong markup percentages** → someone edited the rules. Either accept it and adjust your narration to the actual numbers, or go to `/wholesaler/settings/rules` and `/platform/settings/rules`, click **Reset to defaults** on each.
- **Persona switcher is empty / broken** → clear localStorage (DevTools → Application → Local Storage → clear `dmc-aggregator:demo`), refresh, log back in.

---

# Companion artifacts in the repo

- **`/public/custom-requests.html`** — 12-slide walkthrough deck of the same flow. Open this on a second monitor while recording for reference visuals.
- **`/public/pitch.html`** — the full product pitch deck (12 slides). Open the four-portal architecture slide if you want a "this is the cast of characters" intro shot.
- **`/public/demo-guide.html`** — long-form recording script for the broader demo (covers booking, wallet, supplier portal etc.). This script is a custom-request-only subset.

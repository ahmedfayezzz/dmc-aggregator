# UI Design Guide — DMC Aggregator Demo

**For:** Claude Code building the demo
**Companion to:** `demo-build-plan.md` and `i18n-and-mock-data-guide.md`
**Aesthetic direction:** Refined enterprise — premium B2B that reads as confident, not corporate

---

## 0. Reference points

Study these before building. They define the bar.

**Reference points to match:**
- **Linear.app** — information density, motion timing, premium feel on dark
- **Stripe Dashboard** — data tables done correctly, status indicators
- **Mercury (mercury.com)** — financial UI clarity, dashboard composition
- **Booking.com Partner Hub** — industry credibility, what travel B2B looks like
- **Resend dashboard** — typography on dark surfaces, clean status pills
- **Cron / Notion Calendar** — date pickers and time-based UIs

**Reference points to actively avoid:**
- shadcn default kitchen-sink demos (overused, instantly recognizable)
- Material Design (looks 2018, kills premium feel)
- Anything heavy on purple-blue gradients (the AI-generated tell)
- Stripe Atlas / consumer Stripe (different audience)
- "Modern dashboard template" anything off ThemeForest

**Goal:** if you screenshot any page side-by-side with Linear, Stripe Dashboard, or Mercury, the demo should not look out of place.

---

## 1. Theme & color system

### Mode: dark default, light secondary

Build dark mode as primary. Premium B2B trends dark; Chinese B2B users skew dark-preference; screenshots look better. Light mode is secondary, fully functional, accessible via toggle.

### Color tokens

Use CSS custom properties + Tailwind config. **Don't use Tailwind's default gray/slate/zinc.** These read as generic. Use warm neutrals.

**Light mode:**

```typescript
{
  bg: {
    base: '#FAF8F3',         // Page background — warm off-white
    raised: '#FFFFFF',       // Cards, panels
    sunken: '#F2EFE8',       // Inset areas
  },
  ink: {
    primary: '#1A1612',      // Body text — NOT pure black
    secondary: '#5C564E',    // Secondary text
    tertiary: '#8A8278',     // Captions, hints
    quaternary: '#B5AC9F',   // Disabled
  },
  border: {
    subtle: '#EEE9DD',       // Default
    default: '#DDD5C5',      // Stronger
    strong: '#C9C1AC',       // Inputs
  },
  accent: {
    DEFAULT: '#B58A3F',      // Primary action — deeper than display gold
    hover: '#8A6628',
    soft: '#FBF7ED',
    border: '#E5C988',
  },
  success: { DEFAULT: '#3D7A5C', soft: '#E8F0EA' },
  warning: { DEFAULT: '#B58A3F', soft: '#FBF7ED' },
  danger:  { DEFAULT: '#A04428', soft: '#F5E5DF' },
  info:    { DEFAULT: '#4A7C9E', soft: '#E7EFF5' },
}
```

**Dark mode:**

```typescript
{
  bg: {
    base: '#0E0C09',         // Deep warm near-black
    raised: '#161310',       // Cards
    sunken: '#0A0807',       // Insets
  },
  ink: {
    primary: '#F5EFE0',
    secondary: '#A89F8B',
    tertiary: '#6B6557',
    quaternary: '#4A4538',
  },
  border: {
    subtle: 'rgba(245, 239, 224, 0.06)',
    default: 'rgba(245, 239, 224, 0.10)',
    strong: 'rgba(245, 239, 224, 0.16)',
  },
  accent: {
    DEFAULT: '#D4A65A',      // Gold pops on dark
    hover: '#E5C988',
    soft: 'rgba(212, 166, 90, 0.08)',
    border: 'rgba(212, 166, 90, 0.24)',
  },
  success: { DEFAULT: '#7AAA8B', soft: 'rgba(122, 170, 139, 0.10)' },
  warning: { DEFAULT: '#D4A65A', soft: 'rgba(212, 166, 90, 0.10)' },
  danger:  { DEFAULT: '#C25A3D', soft: 'rgba(194, 90, 61, 0.10)' },
  info:    { DEFAULT: '#5E8FA8', soft: 'rgba(94, 143, 168, 0.10)' },
}
```

### Tenant theming (wholesaler branding)

The wholesaler-branded portals (agency, wholesaler admin) get CSS variable overrides applied to `<html data-tenant="tianxing">`:

```css
[data-tenant="tianxing"] {
  --color-brand-primary: #1E4D5C;
  --color-brand-accent: #D4A65A;
  --logo-mark: url('/brand/wholesaler-tianxing-mark.svg');
  --logo-wordmark: url('/brand/wholesaler-tianxing-logo.svg');
}
```

What changes between branded and platform:
- Logo in topbar
- Primary accent color (used for active nav, primary buttons)
- Voucher header design
- Email "from" preview name

What stays constant:
- Typography, spacing, layout grid, component shapes, motion patterns, status colors, most neutrals

This is what makes white-labeling feel real without becoming a customization nightmare.

### Color usage rules

- **Gold accent is rare, not pervasive.** Use for: primary CTAs, active nav state, key data points (price, status indicators), brand moments. Don't paint everything gold.
- **Status colors are for status only.** No "decorative green" or "decorative red."
- **Most UI is neutral.** Aim for 80% neutral surfaces and ink, 15% borders, 5% color. That ratio is what makes Linear and Stripe feel premium.

---

## 2. Typography

### Fonts (load via `next/font/google`)

```typescript
// app/layout.tsx
import { Fraunces, Geist, Geist_Mono, Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['SOFT', 'opsz'],
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-sans-sc',
  preload: false,  // Heavy font — load on demand
})

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-serif-sc',
  preload: false,
})
```

### Font role assignments

| Use | Font | Why |
|---|---|---|
| Display (page titles, hero numbers, itinerary names) | Fraunces | Editorial serif with character, SOFT axis adds warmth |
| Display Chinese | Noto Serif SC | Mirrors Fraunces; serif character matters in display Chinese |
| Body sans (everything else) | Geist | Distinctive enough to not pattern-match to "AI dashboard"; Inter is overused |
| Body Chinese | Noto Sans SC | Best free CJK sans, pairs cleanly with Geist |
| Monospace (labels, codes, data) | Geist Mono | Matches Geist; pairs better than JetBrains Mono with Geist |

### CSS font-family chain

```css
:root {
  --font-display: var(--font-fraunces), var(--font-noto-serif-sc), Georgia, serif;
  --font-body: var(--font-geist), var(--font-noto-sans-sc), -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: var(--font-geist-mono), 'SF Mono', Menlo, monospace;
}
```

Browser auto-falls-back to Noto SC for Chinese characters within Geist text. No manual switching needed.

### Type scale

Define your own — don't use Tailwind defaults. Put in `tailwind.config.ts` or in a custom plugin.

```
display-xl:  64px / 1.05 / -0.04em  (font-display, weight 300, SOFT 80)
display-lg:  48px / 1.05 / -0.03em  (font-display, weight 300, SOFT 60)
display-md:  32px / 1.1  / -0.02em  (font-display, weight 400, SOFT 40)
heading:     22px / 1.25 / -0.01em  (font-body, weight 500)
subheading:  18px / 1.3  /  0       (font-body, weight 500)
body:        14px / 1.5  /  0       (font-body, weight 400)
caption:     13px / 1.4  /  0       (font-body, weight 400)
label:       11px / 1.2  /  0.12em  (font-mono, weight 500, uppercase)
data:        14px / 1.4  / -0.005em (font-mono, weight 400, tabular-nums)
```

**Two specific decisions worth noting:**
- **Default body is 14px, not 16px.** Enterprise tools are data-dense. 16px reads consumer; 14px reads professional.
- **Use `font-feature-settings: 'tnum'` on all data displays.** Numbers align. Tables look correct. Critical for B2B credibility.

### Tailwind typography utility classes

```css
.text-display-xl { font: 300 64px/1.05 var(--font-display); letter-spacing: -0.04em; font-variation-settings: 'SOFT' 80, 'opsz' 144; }
.text-display-lg { font: 300 48px/1.05 var(--font-display); letter-spacing: -0.03em; font-variation-settings: 'SOFT' 60, 'opsz' 100; }
.text-display-md { font: 400 32px/1.1 var(--font-display); letter-spacing: -0.02em; font-variation-settings: 'SOFT' 40, 'opsz' 80; }
.text-heading { font: 500 22px/1.25 var(--font-body); letter-spacing: -0.01em; }
.text-subheading { font: 500 18px/1.3 var(--font-body); }
.text-body { font: 400 14px/1.5 var(--font-body); }
.text-caption { font: 400 13px/1.4 var(--font-body); }
.text-label { font: 500 11px/1.2 var(--font-mono); letter-spacing: 0.12em; text-transform: uppercase; }
.text-data { font: 400 14px/1.4 var(--font-mono); letter-spacing: -0.005em; font-variant-numeric: tabular-nums; }
```

---

## 3. shadcn overrides (Day 1 essentials)

Don't ship shadcn's defaults. After init, apply these overrides:

### Global

```css
/* globals.css */
:root {
  --radius: 0.25rem;  /* 4px, not shadcn's default 0.5rem */
}
```

### Button

Override default heights and add ghost variant if needed:

```typescript
// components/ui/button.tsx (modified shadcn)
size: {
  sm: 'h-8 px-3 text-xs',        // 32px
  default: 'h-10 px-4 text-sm',  // 40px (NOT 36px)
  lg: 'h-12 px-5 text-sm',       // 48px
  icon: 'h-10 w-10',
}
```

### Input

```typescript
className: 'h-10 px-3 text-sm'  // 40px (NOT 36px)
```

### Card

Remove default shadow. Use border only:

```typescript
// components/ui/card.tsx
className: 'rounded border border-border-subtle bg-bg-raised'
```

### Table

Increase row height:

```typescript
// components/ui/table.tsx — TableRow
className: 'border-b border-border-subtle transition-colors hover:bg-bg-sunken/50 h-[52px]'
```

---

## 4. Layout patterns

### Page structure (universal)

```
┌────────────────────────────────────────────────┐
│ Topbar (60px, persistent)                      │
├──────┬─────────────────────────────────────────┤
│      │ Page header (48–64px below topbar)      │
│ Side │ ────────────────────────────────────────│
│ bar  │                                         │
│      │ Content area                            │
│ 240px│ (max-w-7xl, centered after that)        │
│      │                                         │
└──────┴─────────────────────────────────────────┘
```

**Sidebar:** 240px wide, sticky, contains nav. Subtle separator (`border-r border-border-subtle`), not a different background color. Active nav item uses accent-tinted background with accent-bordered left edge (3px).

**Topbar:** 60px tall, sticky, contains: logo (left), search (center when relevant), persona/user menu + locale switcher (right). `bg-raised` with subtle bottom border.

**Page header:** Title (display-md), subtitle (body, muted), right-aligned action buttons. Below: 1px bottom border, 32px space, content.

**Content max-width:** `max-w-7xl` (1280px) for dashboards, `max-w-5xl` (1024px) for forms/detail pages. Never full-bleed except catalog grids.

### Grid systems

12-column grid with 24px gutters. Two dominant patterns:
- **2-col split:** main 8/12, sidebar 4/12 (booking detail, agency detail)
- **3-col KPIs:** three tiles atop dashboards
- **4-col KPIs:** four tiles when more metrics needed

### Spacing rhythm

Use 4px base. Stick to these multiples: 1, 2, 3, 4, 6, 8, 12, 16, 24. Avoid 5, 7, 9, 10, 11, 14 — they break rhythm.

- **Vertical rhythm between sections:** 48px (`space-y-12`)
- **Within a section:** 24px (`space-y-6`)
- **Within a card:** 16px (`space-y-4`)
- **Tight clusters:** 8px (`space-y-2`)

---

## 5. Cards — three variants only

### Stat card (KPI tiles)

```
┌─────────────────────────┐
│ GMV THIS MONTH          │ ← text-label, ink-secondary
│                         │
│ ¥1,840,000              │ ← text-display-md, ink-primary
│ USD this month          │ ← text-caption, ink-tertiary
│                         │
│ ↗ +12.4% vs last month  │ ← text-caption, success color
└─────────────────────────┘
```

Component: `<StatCard label="GMV_THIS_MONTH" value="¥1,840,000" subtitle="USD this month" delta={{value: 12.4, direction: 'up'}} />`

### Content card (itinerary, agency, booking)

```
┌─────────────────────────┐
│ ▓▓▓▓ HERO IMAGE ▓▓▓▓▓▓ │ ← 16:9 or 4:3
├─────────────────────────┤
│ DUBAI · UAE             │ ← text-label, ink-tertiary
│ 迪拜阿布扎比深度5日游    │ ← text-subheading, ink-primary (Fraunces)
│ 帆船酒店·哈利法塔        │ ← text-caption, ink-secondary
│                         │
│ ¥6,800 起               │ ← text-heading, accent
│ 5天 · UAE               │ ← text-caption, ink-tertiary
└─────────────────────────┘
```

### List card (table-like rows)

```
┌─────────────────────────────────────────────────┐
│ 北京华夏国旅  · 北京 · 38 bookings · [Active]   │
└─────────────────────────────────────────────────┘
```

### Common rules

All three: 1px border (`border-border-subtle`), `bg-raised`, 4px radius (`rounded`), **no shadow by default**. Hover: border becomes `border-default`, no transform, optional subtle `bg-sunken/30` shift.

---

## 6. Tables

shadcn `Table` as base, with these modifications:

- **Row height: 52px** (not default 40px). Breathing room.
- **First column: extra left padding (24px). Last column: extra right padding (24px).**
- **Hover: subtle bg shift** (`bg-sunken/30`). No border or color change.
- **Sortable headers:** caret indicator on hover, persistent on active sort. JetBrains Mono / Geist Mono, uppercase, 11px, `tracking-wide`.
- **Numeric columns: right-aligned, tabular-nums, mono font.**
- **Status column: pill badges, not text.**
- **Empty rows: explicit em dash (`—`), not blank.**
- **Loading states: skeleton rows of correct dimensions**, not spinners.

### Table example

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>{t('agencies.columns.name')}</TableHead>
      <TableHead>{t('agencies.columns.location')}</TableHead>
      <TableHead className="text-right">{t('agencies.columns.balance')}</TableHead>
      <TableHead>{t('agencies.columns.status')}</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {agencies.map(a => (
      <TableRow key={a.id}>
        <TableCell className="font-medium">
          {getLocalized(a.name, locale)}
        </TableCell>
        <TableCell className="text-ink-secondary">
          {getLocalized(a.location, locale)}
        </TableCell>
        <TableCell className="text-right text-data">
          {formatCurrency(a.walletBalanceCNY, 'CNY', locale)}
        </TableCell>
        <TableCell>
          <StatusBadge variant={mapStatus(a.status)}>
            {t(`status.${a.status}`)}
          </StatusBadge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 7. Status badges

One component, used everywhere. Variants map to color tokens; labels come from i18n keys.

```tsx
<StatusBadge variant="success">{t('status.confirmed')}</StatusBadge>
<StatusBadge variant="warning">{t('status.pending_dmc')}</StatusBadge>
<StatusBadge variant="danger">{t('status.cancelled')}</StatusBadge>
<StatusBadge variant="neutral">{t('status.completed')}</StatusBadge>
<StatusBadge variant="accent">{t('status.guaranteed')}</StatusBadge>
```

Spec:
- Height: 22–24px
- Horizontal padding: 8px
- Radius: 3px (a hair smaller than cards)
- Tinted background (`*.soft` token), tinted border (`*.DEFAULT` at 20% opacity), solid text (`*.DEFAULT`)
- **Not solid-filled** — solid pills look cheap
- Font: text-caption (13px), weight 500

---

## 8. KPI numbers

Hero numbers (GMV, booking counts, etc.) use a strict three-tier hierarchy:

```
TINY UPPERCASE LABEL    ← text-label, ink-tertiary
1,840,000               ← text-display-md, ink-primary (Fraunces)
USD this month          ← text-caption, ink-tertiary
↗ +12.4% vs last month  ← text-caption, success/danger color
```

This pattern is what makes dashboard tiles feel composed instead of slapped together. Always include comparison context — never show a number alone.

---

## 9. Empty states

No "No data" text. No sad illustrations. Pattern:

```
┌─────────────────────────────────────┐
│                                     │
│         [subtle icon, 32px]         │ ← Lucide icon, ink-tertiary
│                                     │
│         {t('empty.bookings.title')} │ ← text-subheading, ink-primary
│   {t('empty.bookings.description')} │ ← text-caption, ink-tertiary
│                                     │
│      [{t('actions.browse')} →]      │ ← Button, accent variant
│                                     │
└─────────────────────────────────────┘
```

Centered. Max-width 320px. No background, no card border. Just space.

---

## 10. Forms

shadcn `Form` + `react-hook-form` + `zod`. Light validation for demo (not edge cases).

Patterns:
- **Labels above inputs**, never floating
- **Label: text-caption, ink-secondary, 8px below input**
- **Required indicator: small asterisk in accent color, not red**
- **Input height: 40px, padding 10px 12px, 4px radius**
- **Input border: `border-strong` default, `accent.DEFAULT` on focus.** No glow ring — just border color change.
- **Helper text below input: 12px, ink-tertiary**
- **Error text: 12px, danger color, replaces helper text**
- **Submit button right-aligned at bottom**, primary variant, never full-width on desktop

---

## 11. Buttons

Three variants used consistently:

**Primary** — `bg-accent.DEFAULT`, `text-ink.primary` (high contrast). For the one main action per screen.

**Secondary** — `bg-raised`, `border-border-default`, `text-ink-primary`. For supporting actions.

**Ghost** — transparent, `text-ink-secondary`, subtle bg-sunken on hover. For tertiary actions.

Sizes: `sm` (32px), `md` (40px, default), `lg` (48px — only for hero CTAs).

**Never use:**
- Outlined buttons without clear hierarchy purpose
- "Subtle" variants that disappear into bg
- Multiple primary buttons on one screen
- Button + icon-only button without spacing rhythm

---

## 12. Iconography

**Use Lucide.** Bundled with shadcn, excellent breadth.

Rules:
- Sizes: 16px inline (next to text), 20px buttons, 24px nav, 32px+ empty states
- Stroke weight: 1.5 (Lucide default). Don't mix weights.
- Color: inherits from text by default. Accent color only when iconographic emphasis intended.
- **No icon-only buttons without tooltip** unless universally understood (settings gear, search magnifier)
- **Especially careful with Chinese contexts** — icon-only nav loses readability quickly in Chinese

---

## 13. Motion design

Less is more. Specific rules:

| Pattern | Specification |
|---|---|
| Page transition | 200ms fade-in + 8px translate-up. No more. Faster feels twitchy; slower feels sluggish. |
| Card stagger reveal | 40ms between children on first load. Don't restage on every navigation — only initial mount. |
| Hover lift on cards | `translate-y: -1px` (not -4px), 150ms ease-out, border color shift only. No shadow expansion. |
| Modal/drawer entrance | Slide-in from edge, 250ms `cubic-bezier(0.16, 1, 0.3, 1)`. Backdrop fades in 150ms. |
| Loading skeletons | Shimmer cycle: 2 seconds. Fast shimmer looks panicked. |
| Status change | Subtle color pulse on status badge, 600ms, once. No celebrations, no confetti. |

### What NOT to do

- No bounce springs anywhere
- No rotating spinners (use skeletons)
- No "elastic" easing
- No scroll-jacking
- No parallax
- No animated illustrations
- No micro-animations on every hover
- No "wow" entrance animations on data — data appears, doesn't perform

---

## 14. Composition patterns

### Sidebar navigation

```
┌──────────────────────┐
│ [Logo wordmark]      │  ← clickable, returns to dashboard
│                      │
│ ─────────────────    │  ← border-subtle
│                      │
│  📊  Dashboard       │  ← active: bg-accent-soft, border-l-2 accent
│  🌐  Catalog         │  ← inactive: ink-secondary, hover bg-sunken/30
│  👥  Agencies        │
│  📋  Bookings        │
│  ✉️   RFQs           │
│  📈  Reports         │
│                      │
│ ─────────────────    │
│                      │
│  ⚙️   Settings        │  ← footer section
│  👤  Profile         │
└──────────────────────┘
```

Each nav item: 40px tall, 12px horizontal padding, 8px gap between icon and text. Active state: accent tint background + 2px accent left border.

### Topbar composition

```
┌────────────────────────────────────────────────────────┐
│ [☰] [Logo]      [🔍 Search...]      [🌐 中] [🔔] [👤] │
└────────────────────────────────────────────────────────┘
```

Left section: optional sidebar toggle, logo/wordmark
Center section: search input (60% width, when applicable)
Right section: locale switcher, notifications, user menu

### Persona switcher

Floating bottom-right, always present in demo mode. Glass-morphism background (slightly translucent, backdrop-blur).

```
┌─────────────────────────────┐
│  👤 Currently: Wholesaler   │  ← compact view
│       张经理 @ 天行国旅      │
└─────────────────────────────┘
         ↓ on click ↓
┌─────────────────────────────┐
│  Switch persona             │
│                             │
│  ▣ DMC                      │
│    Arabian Adventures       │
│                             │
│  ● Wholesaler              │  ← current
│    天行国旅                  │
│                             │
│  ▣ Agency                  │
│    北京华夏国旅              │
│                             │
│  ▣ Platform Admin          │
│    Travel Leap              │
└─────────────────────────────┘
```

Hide entirely in production. Make obvious during demo, easy to hit, but visually subtle when not active.

---

## 15. Demo-specific UX touches

A few things that disproportionately impact the partner's impression:

### Wallet deduction animation

When the agency books and wallet balance decreases, show a quick animated transition:
- Balance number ticks down (300ms, ease-out)
- Subtle danger-tinted flash on the new value (400ms)
- Toast confirmation appears

This visceral "transaction happened" feedback is high-impact for the demo.

### SLA countdown timers

On RFQ rows and pending bookings, show live countdown timers:
- `23h 14m 02s` format
- Use Geist Mono for digits
- Color shifts: ink-secondary → warning → danger as time runs out
- Visual urgency, but don't make them blink

### Status transition pulses

When a status badge changes (manually triggered in demo), it should briefly pulse with the new color. Not celebrate — just acknowledge.

### Photo loading

Use `next/image` with `placeholder="blur"` and a generated blurhash. The fade-from-blur is more elegant than a hard pop-in.

### Voucher PDF preview

Render in-browser using HTML/CSS styled to look like a print document:
- White background regardless of dark mode
- Co-branded header (wholesaler logo + DMC logo)
- Booking reference in mono
- Day-by-day services laid out cleanly
- "DOWNLOAD PDF" and "SHARE VIA WECHAT" buttons (visual only)

This is the closing visual of the agency journey. Make it feel premium.

---

## 16. What to actively resist

Patterns Claude Code (or any AI) reaches for that we should preempt:

- **Generic colored "info cards" with icons in colored circles.** Bootstrap-era. Use stat cards instead.
- **Gradient backgrounds.** Solid surfaces with subtle borders. Only acceptable gradient is a very subtle radial for atmosphere on landing/hero sections.
- **Card hover translate-y -4px or more.** Too consumery. -1px max.
- **Drop shadows on cards by default.** Borders only. Shadows are reserved for elevated overlays (modals, dropdowns).
- **Icon-heavy navigation.** Text first, icons supporting. Especially critical with Chinese.
- **Skeuomorphic anything.** No wallet that looks like a wallet, no calendar that looks like a calendar.
- **Generic SaaS marketing copy in UI.** "Manage your bookings effortlessly" → just "预订管理". Direct and professional.
- **Multiple primary buttons on one screen.** One per page.
- **Animated icons.** Static.
- **Tooltips on everything.** Reserve for icon-only actions only.

---

## 17. What success looks like

After Day 8 (visual polish day), screenshot any page and put it side-by-side with Linear, Stripe Dashboard, or Mercury. Your demo should:
- Not look out of place in that tier
- Not look like another shadcn dashboard
- Read as Chinese-bilingual without feeling like an afterthought
- Feel considered in every spacing, every weight, every interaction

If it looks generic, the demo loses. If it feels alive, the demo wins.

---

**End of UI guide.** Apply throughout the build. When in doubt, look at Linear or Mercury and ask "would they do this?"

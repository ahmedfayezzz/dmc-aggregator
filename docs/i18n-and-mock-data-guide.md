# i18n & Mock Data Guide — DMC Aggregator Demo

**For:** Claude Code building the demo
**Companion to:** `demo-build-plan.md` and `ui-design-guide.md`
**Core principle:** Every UI string comes from i18n keys. All mock data is bilingual (zh-CN + en). No hardcoded language strings anywhere in JSX.

---

## Part 1: Internationalization

### 1.1 Architecture decision

**Use a lightweight custom i18n setup, not next-intl or i18next.**

Reasoning: for a 10-day demo with two locales, full i18n libraries add complexity (locale routing, message extraction, namespaces) we don't need. A typed `useTranslation()` hook over a flat object lookup is simpler, type-safe, and Claude Code handles it cleanly.

If this project graduates to production, swap to `next-intl` — but only then.

### 1.2 File structure

```
lib/i18n/
├── config.ts             # Locale list, default locale, locale labels
├── zh-CN.ts              # All Chinese strings (the source of truth)
├── en.ts                 # All English strings
├── provider.tsx          # React context provider
├── use-translation.ts    # The t() hook
├── get-localized.ts      # For bilingual mock data
└── types.ts              # TS types derived from zh-CN.ts
```

### 1.3 Config

```typescript
// lib/i18n/config.ts
export const LOCALES = ['zh-CN', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'zh-CN'

export const LOCALE_LABELS: Record<Locale, { native: string; en: string }> = {
  'zh-CN': { native: '中文', en: 'Chinese' },
  'en':    { native: 'English', en: 'English' },
}

// Per-portal locale defaults
export const PORTAL_DEFAULTS: Record<string, Locale> = {
  wholesaler: 'zh-CN',
  agency: 'zh-CN',
  dmc: 'en',
  platform: 'en',
}
```

### 1.4 Translation files

Use a flat object with dot-namespaced keys. Type the zh-CN file as the source of truth; the en file must match the same shape.

```typescript
// lib/i18n/zh-CN.ts
export const zhCN = {
  // === COMMON ACTIONS ===
  'actions.book_now': '立即预订',
  'actions.save_quote': '保存为报价单',
  'actions.convert_to_booking': '转换为预订',
  'actions.customize': '定制行程',
  'actions.cancel': '取消',
  'actions.confirm': '确认',
  'actions.save': '保存',
  'actions.search': '搜索',
  'actions.filter': '筛选',
  'actions.view_details': '查看详情',
  'actions.download_pdf': '下载 PDF',
  'actions.share_to_wechat': '分享到微信',
  'actions.add_to_cart': '加入购物车',
  'actions.contact_agency': '联系机构',
  'actions.back_to_browse': '返回浏览',
  
  // === NAVIGATION ===
  'nav.dashboard': '仪表板',
  'nav.catalog': '产品目录',
  'nav.agencies': '机构管理',
  'nav.bookings': '预订管理',
  'nav.rfqs': '询价管理',
  'nav.reports': '报表分析',
  'nav.settings': '设置',
  'nav.browse': '浏览目的地',
  'nav.my_bookings': '我的预订',
  'nav.wallet': '钱包',
  'nav.quotes': '报价单',
  'nav.itineraries': '行程管理',
  'nav.schedules': '团期管理',
  'nav.pricing': '价格管理',
  'nav.allotments': '配额管理',
  'nav.statements': '对账单',
  
  // === BOOKING STATUS LABELS ===
  'status.draft': '草稿',
  'status.quote': '报价中',
  'status.rfq_submitted': '已提交询价',
  'status.rfq_quoted': '已报价',
  'status.rfq_declined': '已拒绝',
  'status.expired': '已过期',
  'status.booking_requested': '预订处理中',
  'status.booking_pending': '等待 DMC 确认',
  'status.confirmed_pending_guarantee': '已确认 · 待团期成行',
  'status.confirmed': '已确认',
  'status.confirmed_amendment_pending': '已确认 · 修改待处理',
  'status.cancelled': '已取消',
  'status.travelled': '已出行',
  'status.settled': '已结算',
  
  // === DASHBOARD ===
  'dashboard.kpi.gmv_this_month': '本月销售额',
  'dashboard.kpi.active_bookings': '活跃预订',
  'dashboard.kpi.pending_rfqs': '待处理询价',
  'dashboard.kpi.active_agencies': '活跃机构',
  'dashboard.recent_bookings': '最近预订',
  'dashboard.upcoming_departures': '即将出团',
  'dashboard.recent_activity': '近期动态',
  'dashboard.vs_last_month': '环比上月',
  
  // === CATALOG ===
  'catalog.title': '产品目录',
  'catalog.subtitle': '为您精选的中东目的地产品',
  'catalog.filters.destination': '目的地',
  'catalog.filters.duration': '行程天数',
  'catalog.filters.departure_type': '行程类型',
  'catalog.filters.theme': '主题',
  'catalog.filters.price_range': '价格区间',
  'catalog.filters.departure_date': '出行日期',
  'catalog.filters.pax_count': '人数',
  'catalog.departure_type.fixed': '团队游(固定团期)',
  'catalog.departure_type.on_demand': '私家定制',
  'catalog.departure_type.rfq_only': '高端定制',
  'catalog.from_price': '起价',
  'catalog.publish_to_agencies': '发布给我的机构',
  
  // === ITINERARY DETAIL ===
  'itinerary.duration_days': '{days}天{nights}晚',
  'itinerary.day_label': '第{day}天',
  'itinerary.section.highlights': '行程亮点',
  'itinerary.section.day_by_day': '每日行程',
  'itinerary.section.inclusions': '包含',
  'itinerary.section.exclusions': '不包含',
  'itinerary.section.cancellation': '取消政策',
  'itinerary.departures.available': '可选团期',
  'itinerary.departures.filled': '{booked}/{capacity} 已预订',
  'itinerary.margin.dmc_net': 'DMC 净价',
  'itinerary.margin.our_markup': '平台加价',
  'itinerary.margin.your_markup': '您的加价',
  'itinerary.margin.agency_retail': '建议机构售价',
  
  // === BOOKING FLOW ===
  'booking.step.review': '确认行程',
  'booking.step.pax': '出行人数',
  'booking.step.confirm': '完成预订',
  'booking.adults': '成人',
  'booking.children': '儿童',
  'booking.infants': '婴儿',
  'booking.twin_room': '双人间',
  'booking.single_supplement': '单房差',
  'booking.total': '合计',
  'booking.wallet_balance': '钱包余额',
  'booking.confirm_message': '从钱包扣除 {amount} 完成预订?',
  'booking.success.title': '预订成功',
  'booking.success.subtitle': '凭证已生成,可立即下载',
  
  // === WALLET ===
  'wallet.balance.available': '可用余额',
  'wallet.balance.held': '占用余额',
  'wallet.mode.debit': '预付模式',
  'wallet.mode.credit': '后付模式',
  'wallet.credit_limit': '信用额度',
  'wallet.topup': '充值',
  'wallet.ledger.title': '交易记录',
  
  // === RFQ ===
  'rfq.title': '询价管理',
  'rfq.sla.responding_in': '剩余 {time}',
  'rfq.sla.overdue': '已超时',
  'rfq.action.quote': '报价',
  'rfq.action.decline': '拒绝',
  'rfq.customization_summary': '客户修改',
  
  // === REPORTS ===
  'reports.gmv_by_month': '月度销售额',
  'reports.top_agencies': '机构销量榜',
  'reports.top_itineraries': '热销产品',
  'reports.conversion_funnel': '转化漏斗',
  
  // === EMPTY STATES ===
  'empty.bookings.title': '还没有预订记录',
  'empty.bookings.description': '开始浏览目的地,创建您的第一笔预订',
  'empty.agencies.title': '还没有机构',
  'empty.agencies.description': '邀请您的合作机构加入',
  'empty.rfqs.title': '没有待处理的询价',
  'empty.rfqs.description': '机构提交询价后将出现在这里',
  
  // === LOCALE SWITCHER ===
  'locale.switcher.label': '语言',
  
  // === COMMON FIELD LABELS ===
  'field.name': '名称',
  'field.location': '所在地',
  'field.status': '状态',
  'field.balance': '余额',
  'field.actions': '操作',
  'field.date': '日期',
  'field.amount': '金额',
  'field.reference': '编号',
  'field.created_at': '创建时间',
  'field.updated_at': '更新时间',
  
  // ... (continue exhaustively as portals are built)
} as const

export type TranslationKey = keyof typeof zhCN
```

```typescript
// lib/i18n/en.ts
import type { TranslationKey } from './zh-CN'

export const en: Record<TranslationKey, string> = {
  'actions.book_now': 'Book Now',
  'actions.save_quote': 'Save Quote',
  'actions.convert_to_booking': 'Convert to Booking',
  'actions.customize': 'Customize',
  'actions.cancel': 'Cancel',
  'actions.confirm': 'Confirm',
  'actions.save': 'Save',
  'actions.search': 'Search',
  'actions.filter': 'Filter',
  'actions.view_details': 'View Details',
  'actions.download_pdf': 'Download PDF',
  'actions.share_to_wechat': 'Share via WeChat',
  'actions.add_to_cart': 'Add to Cart',
  'actions.contact_agency': 'Contact Agency',
  'actions.back_to_browse': 'Back to Browse',
  
  'nav.dashboard': 'Dashboard',
  'nav.catalog': 'Catalog',
  'nav.agencies': 'Agencies',
  'nav.bookings': 'Bookings',
  'nav.rfqs': 'RFQs',
  'nav.reports': 'Reports',
  'nav.settings': 'Settings',
  'nav.browse': 'Browse Destinations',
  'nav.my_bookings': 'My Bookings',
  'nav.wallet': 'Wallet',
  'nav.quotes': 'Quotes',
  'nav.itineraries': 'Itineraries',
  'nav.schedules': 'Schedules',
  'nav.pricing': 'Pricing',
  'nav.allotments': 'Allotments',
  'nav.statements': 'Statements',
  
  'status.draft': 'Draft',
  'status.quote': 'Quote',
  'status.rfq_submitted': 'RFQ Submitted',
  'status.rfq_quoted': 'RFQ Quoted',
  'status.rfq_declined': 'RFQ Declined',
  'status.expired': 'Expired',
  'status.booking_requested': 'Processing',
  'status.booking_pending': 'Pending DMC',
  'status.confirmed_pending_guarantee': 'Pending Guarantee',
  'status.confirmed': 'Confirmed',
  'status.confirmed_amendment_pending': 'Amendment Pending',
  'status.cancelled': 'Cancelled',
  'status.travelled': 'Travelled',
  'status.settled': 'Settled',
  
  'dashboard.kpi.gmv_this_month': 'GMV This Month',
  'dashboard.kpi.active_bookings': 'Active Bookings',
  'dashboard.kpi.pending_rfqs': 'Pending RFQs',
  'dashboard.kpi.active_agencies': 'Active Agencies',
  'dashboard.recent_bookings': 'Recent Bookings',
  'dashboard.upcoming_departures': 'Upcoming Departures',
  'dashboard.recent_activity': 'Recent Activity',
  'dashboard.vs_last_month': 'vs last month',
  
  // ... fill all remaining keys
} as const
```

### 1.5 Provider and hook

```typescript
// lib/i18n/provider.tsx
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { DEFAULT_LOCALE, Locale } from './config'
import { zhCN } from './zh-CN'
import { en } from './en'

const dictionaries = { 'zh-CN': zhCN, en } as const

type Ctx = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: keyof typeof zhCN, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<Ctx | null>(null)

export function LocaleProvider({ initialLocale, children }: { initialLocale?: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE)
  
  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale | null
    if (stored && stored in dictionaries) setLocaleState(stored)
  }, [])
  
  useEffect(() => {
    document.documentElement.lang = locale
    localStorage.setItem('locale', locale)
  }, [locale])
  
  const t = (key: keyof typeof zhCN, params?: Record<string, string | number>) => {
    let str = dictionaries[locale][key] ?? key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v))
      })
    }
    return str
  }
  
  return (
    <I18nContext.Provider value={{ locale, setLocale: setLocaleState, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation must be used within LocaleProvider')
  return ctx
}
```

### 1.6 Per-portal default locale

Apply portal-default locale in each portal's layout:

```typescript
// app/wholesaler/layout.tsx
'use client'
import { useEffect } from 'react'
import { useTranslation } from '@/lib/i18n/provider'
import { PORTAL_DEFAULTS } from '@/lib/i18n/config'

export default function WholesalerLayout({ children }) {
  const { locale, setLocale } = useTranslation()
  
  useEffect(() => {
    // Only set default if user hasn't explicitly chosen
    if (!localStorage.getItem('locale')) {
      setLocale(PORTAL_DEFAULTS.wholesaler)
    }
  }, [])
  
  return (
    <div data-tenant="tianxing">
      {/* sidebar + topbar + content */}
      {children}
    </div>
  )
}
```

### 1.7 The localized-content helper (for mock data)

UI strings come from i18n files. **Bilingual content within mock data** (itinerary titles, day descriptions, agency names) uses a different pattern: stored as objects on the entity.

```typescript
// lib/i18n/get-localized.ts
import type { Locale } from './config'

export type Localized<T = string> = {
  'zh-CN': T
  'en': T
}

export function getLocalized<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value['en']
}
```

Usage:

```typescript
const { locale } = useTranslation()
const itinerary = itineraries[0]

<h1>{getLocalized(itinerary.title, locale)}</h1>
// When locale=zh-CN: "迪拜阿布扎比深度5日游"
// When locale=en:    "Dubai & Abu Dhabi Deep Dive 5D"
```

### 1.8 Locale switcher component

```typescript
// components/shared/locale-switcher.tsx
'use client'
import { useTranslation } from '@/lib/i18n/provider'
import { LOCALES, LOCALE_LABELS } from '@/lib/i18n/config'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useTranslation()
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="w-4 h-4" />
          <span className="text-data">{LOCALE_LABELS[locale].native}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map(l => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLocale(l)}
            data-active={locale === l}
          >
            {LOCALE_LABELS[l].native}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### 1.9 Locale-aware formatters

```typescript
// lib/formatters/currency.ts
import type { Locale } from '@/lib/i18n/config'

export function formatCurrency(amount: number, currency: 'CNY' | 'USD' | 'AED' | 'EUR', locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    'zh-CN': 'zh-CN',
    'en': 'en-US',
  }
  
  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Examples:
// formatCurrency(1840000, 'CNY', 'zh-CN') → "¥1,840,000"
// formatCurrency(1840000, 'CNY', 'en')    → "CN¥1,840,000"
// formatCurrency(6800, 'USD', 'en')       → "$6,800"
```

```typescript
// lib/formatters/date.ts
import type { Locale } from '@/lib/i18n/config'

export function formatDate(date: Date | string, locale: Locale, format: 'long' | 'short' | 'iso' = 'long'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'iso') return d.toISOString().split('T')[0]
  
  if (locale === 'zh-CN') {
    const y = d.getFullYear()
    const m = d.getMonth() + 1
    const day = d.getDate()
    const weekday = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
    return format === 'long' ? `${y}年${m}月${day}日 周${weekday}` : `${m}月${day}日`
  }
  
  return d.toLocaleDateString('en-US', format === 'long'
    ? { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }
    : { month: 'short', day: 'numeric' }
  )
}
```

### 1.10 The "no hardcoded strings" rule

**Every visible string in JSX is either:**
1. A call to `t('some.key')`, OR
2. A call to `getLocalized(entity.field, locale)`, OR
3. A pure data value (numbers, dates, IDs, formatted by a locale-aware formatter)

**These are violations:**

```tsx
// ❌ NO
<Button>Book Now</Button>
<h1>立即预订</h1>
<p>Welcome back</p>

// ✅ YES
<Button>{t('actions.book_now')}</Button>
<h1>{t('booking.title')}</h1>
<p>{t('welcome.title')}</p>
```

```tsx
// ❌ NO — hardcoded itinerary title in JSX
<h1>{itinerary.titleEn}</h1>

// ✅ YES
<h1>{getLocalized(itinerary.title, locale)}</h1>
```

**Recommend installing a simple ESLint rule** to flag JSX strings containing Chinese characters or English words longer than 3 letters. Catches violations during the build.

### 1.11 The "translation status" badge (for DMC portal)

In the DMC portal, when showing itineraries, indicate translation status with a visual badge:

```tsx
{!itinerary.translations.zh-CN.reviewed && (
  <StatusBadge variant="warning">{t('translation.pending_review')}</StatusBadge>
)}
```

This sells the operational story: "we have a translation workflow."

---

## Part 2: Mock Data

### 2.1 Architectural principle

**All mock data exists in `/lib/mock/*.ts` files. Period.**

No inline data in components. No "let me just put this here." No fetching from APIs. Components import what they need from `@/lib/mock`.

**Why this matters for the demo:** consistency. If "北京华夏国旅" appears in 8 different places, it must be the same name everywhere. The only way to guarantee that is single source of truth.

### 2.2 Entity types

Define every shape in `/lib/types.ts`:

```typescript
// lib/types.ts
import type { Localized } from './i18n/get-localized'

// ─── Identity ───────────────────────────────────────────
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
    mode: 'DEBIT' | 'CREDIT'
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
  walletMode: 'DEBIT' | 'CREDIT'
  walletBalanceCNY: number
  creditLimit: number
  totalBookings: number
  gmvCNY: number
  status: 'active' | 'pending_kyc' | 'suspended'
  joinedAt: string
}

export type DMC = {
  id: string
  name: string                      // English-only for B2B supplier names
  country: 'AE' | 'SA' | 'JO' | 'OM' | 'EG'
  city: string
  contact: string
  trustTier: 'NEW' | 'VERIFIED' | 'TRUSTED'
  settlementCurrency: 'USD' | 'AED' | 'SAR' | 'OMR'
  paymentTermsDays: 15 | 30 | 60
}

// ─── Catalog ────────────────────────────────────────────
export type Itinerary = {
  id: string
  dmcId: string
  title: Localized
  subtitle: Localized
  departureType: 'FIXED' | 'ON_DEMAND' | 'RFQ_ONLY'
  duration: { days: number; nights: number }
  countries: Array<'AE' | 'SA' | 'JO' | 'OM' | 'EG'>
  cities: string[]
  themes: Array<'family' | 'luxury' | 'first-time' | 'adventure' | 'cultural' | 'religious'>
  heroImage: string                 // URL
  gallery: string[]                 // URLs
  highlights: Localized<string[]>
  days: ItineraryDay[]
  inclusions: Localized<string[]>
  exclusions: Localized<string[>
  pricing: PricingRules
  marginLayers: MarginBreakdown
  cancellationPolicy: CancellationPolicy
  departures: Departure[]
  translations: {
    'zh-CN': { reviewed: boolean; reviewedAt?: string }
    'en':    { reviewed: boolean; reviewedAt?: string }
  }
  publishedToAgencies: string[]    // Agency IDs this is published to
}

export type ItineraryDay = {
  day: number
  title: Localized
  description: Localized
  activities: Array<{
    type: 'TRANSFER' | 'ACCOMMODATION' | 'GUIDE' | 'MEAL' | 'ENTRANCE' | 'ACTIVITY'
    name: Localized
  }>
}

export type PricingRules = {
  sourceCurrency: 'USD' | 'AED' | 'SAR' | 'OMR'
  bands: Array<{ paxRange: string; minPax: number; maxPax: number; perPaxUSD: number }>
  singleSupplementUSD: number
  seasons: Array<{ name: string; dateRange: string; multiplier: number }>
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
  tiers: Array<{ daysBefore: number; penaltyPercent: number }>
}

export type Departure = {
  id: string
  itineraryId: string
  date: string                      // ISO
  capacity: number
  booked: number
  status: 'OPEN' | 'GUARANTEED' | 'FULL' | 'CLOSED' | 'CANCELLED'
}

// ─── Bookings ──────────────────────────────────────────
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

export type BookingState =
  | 'DRAFT' | 'QUOTE' | 'RFQ_SUBMITTED' | 'RFQ_QUOTED' | 'RFQ_DECLINED' | 'EXPIRED'
  | 'BOOKING_REQUESTED' | 'BOOKING_PENDING'
  | 'CONFIRMED_PENDING_GUARANTEE' | 'CONFIRMED' | 'CONFIRMED_AMENDMENT_PENDING'
  | 'CANCELLED' | 'TRAVELLED' | 'SETTLED'

// ─── RFQ ────────────────────────────────────────────────
export type RFQ = {
  id: string
  agencyId: string
  itineraryId: string
  customization: Localized
  notes: Localized
  submittedAt: string
  slaExpiresAt: string
  state: 'RFQ_SUBMITTED' | 'RFQ_QUOTED' | 'RFQ_DECLINED'
  quotedAmountUSD?: number
}

// ─── Wallet ─────────────────────────────────────────────
export type WalletTransaction = {
  id: string
  agencyId: string
  type: 'TOPUP' | 'BOOKING_HOLD' | 'BOOKING_CAPTURE' | 'BOOKING_RELEASE' | 'REFUND'
  amountCNY: number
  amountUSD: number
  description: Localized
  bookingId?: string
  createdAt: string
}
```

### 2.3 The wholesaler

```typescript
// lib/mock/wholesalers.ts
import type { Wholesaler } from '@/lib/types'

export const wholesaler: Wholesaler = {
  id: 'wh-001',
  legalName: {
    'zh-CN': '天行国际旅行社有限公司',
    'en': 'Tianxing International Travel Co., Ltd',
  },
  displayName: {
    'zh-CN': '天行国旅',
    'en': 'Tianxing Tours',
  },
  subdomain: 'tianxing',
  brand: {
    primary: '#1E4D5C',
    accent: '#D4A65A',
    logoUrl: '/brand/wholesaler-tianxing-logo.svg',
    markUrl: '/brand/wholesaler-tianxing-mark.svg',
  },
  contractStart: '2025-09-01',
  walletWithPlatform: {
    mode: 'CREDIT',
    creditLimitUSD: 500_000,
    currentBalanceUSD: -127_840,
  },
  agencyCount: 47,
  monthlyGMV_USD: 1_840_000,
}
```

### 2.4 Sub-agencies — 12-15 realistic Chinese agencies

Critical for credibility. Mix cities, sizes, statuses, modes. Sample:

```typescript
// lib/mock/agencies.ts
import type { Agency } from '@/lib/types'

export const agencies: Agency[] = [
  {
    id: 'ag-001',
    wholesalerId: 'wh-001',
    name: {
      'zh-CN': '北京华夏国际旅行社',
      'en': 'Beijing Huaxia International',
    },
    location: { 'zh-CN': '北京市朝阳区', 'en': 'Chaoyang, Beijing' },
    licenseNumber: 'L-BJ-CJ00123',
    contactName: { 'zh-CN': '王明', 'en': 'Wang Ming' },
    contactRole: { 'zh-CN': '出境部经理', 'en': 'Outbound Manager' },
    walletMode: 'DEBIT',
    walletBalanceCNY: 142_500,
    creditLimit: 0,
    totalBookings: 38,
    gmvCNY: 1_240_000,
    status: 'active',
    joinedAt: '2025-09-15',
  },
  {
    id: 'ag-002',
    wholesalerId: 'wh-001',
    name: {
      'zh-CN': '上海中青旅控股股份有限公司',
      'en': 'Shanghai CYTS Holdings',
    },
    location: { 'zh-CN': '上海市黄浦区', 'en': 'Huangpu, Shanghai' },
    licenseNumber: 'L-SH-CJ00087',
    contactName: { 'zh-CN': '李娜', 'en': 'Li Na' },
    contactRole: { 'zh-CN': '副总经理', 'en': 'Deputy GM' },
    walletMode: 'CREDIT',
    walletBalanceCNY: -85_300,        // currently owes
    creditLimit: 500_000,
    totalBookings: 67,
    gmvCNY: 2_180_000,
    status: 'active',
    joinedAt: '2025-09-01',
  },
  {
    id: 'ag-003',
    wholesalerId: 'wh-001',
    name: {
      'zh-CN': '广州南湖国旅',
      'en': 'Guangzhou Nanhu Travel',
    },
    location: { 'zh-CN': '广州市天河区', 'en': 'Tianhe, Guangzhou' },
    licenseNumber: 'L-GD-CJ00256',
    contactName: { 'zh-CN': '陈伟强', 'en': 'Chen Weiqiang' },
    contactRole: { 'zh-CN': '总经理', 'en': 'General Manager' },
    walletMode: 'DEBIT',
    walletBalanceCNY: 320_000,
    creditLimit: 0,
    totalBookings: 51,
    gmvCNY: 1_680_000,
    status: 'active',
    joinedAt: '2025-09-12',
  },
  {
    id: 'ag-004',
    wholesalerId: 'wh-001',
    name: {
      'zh-CN': '深圳康辉旅行社',
      'en': 'Shenzhen Comfort Tour',
    },
    location: { 'zh-CN': '深圳市福田区', 'en': 'Futian, Shenzhen' },
    licenseNumber: 'L-GD-CJ00301',
    contactName: { 'zh-CN': '张丽', 'en': 'Zhang Li' },
    contactRole: { 'zh-CN': '运营总监', 'en': 'Operations Director' },
    walletMode: 'DEBIT',
    walletBalanceCNY: 78_900,
    creditLimit: 0,
    totalBookings: 22,
    gmvCNY: 745_000,
    status: 'active',
    joinedAt: '2025-10-05',
  },
  {
    id: 'ag-005',
    wholesalerId: 'wh-001',
    name: {
      'zh-CN': '成都海外国旅',
      'en': 'Chengdu Overseas Travel',
    },
    location: { 'zh-CN': '成都市锦江区', 'en': 'Jinjiang, Chengdu' },
    licenseNumber: 'L-SC-CJ00178',
    contactName: { 'zh-CN': '刘建国', 'en': 'Liu Jianguo' },
    contactRole: { 'zh-CN': '出境部主管', 'en': 'Outbound Director' },
    walletMode: 'CREDIT',
    walletBalanceCNY: -42_000,
    creditLimit: 200_000,
    totalBookings: 19,
    gmvCNY: 620_000,
    status: 'active',
    joinedAt: '2025-10-12',
  },
  {
    id: 'ag-006',
    wholesalerId: 'wh-001',
    name: {
      'zh-CN': '西安丝路国际旅行社',
      'en': "Xi'an Silk Road International",
    },
    location: { 'zh-CN': '西安市雁塔区', 'en': "Yanta, Xi'an" },
    licenseNumber: 'L-SAX-CJ00092',
    contactName: { 'zh-CN': '马志强', 'en': 'Ma Zhiqiang' },
    contactRole: { 'zh-CN': '总经理', 'en': 'General Manager' },
    walletMode: 'DEBIT',
    walletBalanceCNY: 156_400,
    creditLimit: 0,
    totalBookings: 28,
    gmvCNY: 890_000,
    status: 'active',
    joinedAt: '2025-09-28',
  },
  {
    id: 'ag-007',
    wholesalerId: 'wh-001',
    name: {
      'zh-CN': '杭州神舟国旅',
      'en': 'Hangzhou Shenzhou Travel',
    },
    location: { 'zh-CN': '杭州市西湖区', 'en': 'Xihu, Hangzhou' },
    licenseNumber: 'L-ZJ-CJ00145',
    contactName: { 'zh-CN': '周小燕', 'en': 'Zhou Xiaoyan' },
    contactRole: { 'zh-CN': '产品经理', 'en': 'Product Manager' },
    walletMode: 'DEBIT',
    walletBalanceCNY: 95_200,
    creditLimit: 0,
    totalBookings: 14,
    gmvCNY: 480_000,
    status: 'active',
    joinedAt: '2025-11-02',
  },
  {
    id: 'ag-008',
    wholesalerId: 'wh-001',
    name: {
      'zh-CN': '武汉新华国旅',
      'en': 'Wuhan Xinhua Travel',
    },
    location: { 'zh-CN': '武汉市江汉区', 'en': 'Jianghan, Wuhan' },
    licenseNumber: 'L-HB-CJ00211',
    contactName: { 'zh-CN': '黄海涛', 'en': 'Huang Haitao' },
    contactRole: { 'zh-CN': '出境部经理', 'en': 'Outbound Manager' },
    walletMode: 'DEBIT',
    walletBalanceCNY: 0,
    creditLimit: 0,
    totalBookings: 0,
    gmvCNY: 0,
    status: 'pending_kyc',
    joinedAt: '2026-04-22',
  },
  {
    id: 'ag-009',
    wholesalerId: 'wh-001',
    name: {
      'zh-CN': '青岛海洋国际旅行社',
      'en': 'Qingdao Ocean International',
    },
    location: { 'zh-CN': '青岛市市南区', 'en': 'Shinan, Qingdao' },
    licenseNumber: 'L-SD-CJ00067',
    contactName: { 'zh-CN': '孙涛', 'en': 'Sun Tao' },
    contactRole: { 'zh-CN': '副总经理', 'en': 'Deputy GM' },
    walletMode: 'CREDIT',
    walletBalanceCNY: 15_000,         // positive balance in credit mode (just topped up)
    creditLimit: 150_000,
    totalBookings: 31,
    gmvCNY: 1_080_000,
    status: 'active',
    joinedAt: '2025-09-20',
  },
  {
    id: 'ag-010',
    wholesalerId: 'wh-001',
    name: {
      'zh-CN': '重庆金沙国旅',
      'en': 'Chongqing Jinsha Travel',
    },
    location: { 'zh-CN': '重庆市渝中区', 'en': 'Yuzhong, Chongqing' },
    licenseNumber: 'L-CQ-CJ00089',
    contactName: { 'zh-CN': '罗芳', 'en': 'Luo Fang' },
    contactRole: { 'zh-CN': '总经理', 'en': 'General Manager' },
    walletMode: 'DEBIT',
    walletBalanceCNY: 42_500,
    creditLimit: 0,
    totalBookings: 9,
    gmvCNY: 285_000,
    status: 'active',
    joinedAt: '2025-11-18',
  },
  {
    id: 'ag-011',
    wholesalerId: 'wh-001',
    name: {
      'zh-CN': '天津滨海国际旅行社',
      'en': 'Tianjin Binhai International',
    },
    location: { 'zh-CN': '天津市和平区', 'en': 'Heping, Tianjin' },
    licenseNumber: 'L-TJ-CJ00134',
    contactName: { 'zh-CN': '吴敏', 'en': 'Wu Min' },
    contactRole: { 'zh-CN': '出境部经理', 'en': 'Outbound Manager' },
    walletMode: 'DEBIT',
    walletBalanceCNY: 8_200,           // low balance — triggers warning
    creditLimit: 0,
    totalBookings: 17,
    gmvCNY: 540_000,
    status: 'active',
    joinedAt: '2025-10-08',
  },
  {
    id: 'ag-012',
    wholesalerId: 'wh-001',
    name: {
      'zh-CN': '南京山水国际旅行社',
      'en': 'Nanjing Shanshui International',
    },
    location: { 'zh-CN': '南京市鼓楼区', 'en': 'Gulou, Nanjing' },
    licenseNumber: 'L-JS-CJ00198',
    contactName: { 'zh-CN': '蒋勇', 'en': 'Jiang Yong' },
    contactRole: { 'zh-CN': '总经理', 'en': 'General Manager' },
    walletMode: 'CREDIT',
    walletBalanceCNY: -120_500,
    creditLimit: 300_000,
    totalBookings: 24,
    gmvCNY: 810_000,
    status: 'active',
    joinedAt: '2025-09-25',
  },
  {
    id: 'ag-013',
    wholesalerId: 'wh-001',
    name: {
      'zh-CN': '苏州凯撒旅行社',
      'en': 'Suzhou Caesar Travel',
    },
    location: { 'zh-CN': '苏州市姑苏区', 'en': 'Gusu, Suzhou' },
    licenseNumber: 'L-JS-CJ00276',
    contactName: { 'zh-CN': '夏梦', 'en': 'Xia Meng' },
    contactRole: { 'zh-CN': '产品经理', 'en': 'Product Manager' },
    walletMode: 'DEBIT',
    walletBalanceCNY: 215_000,
    creditLimit: 0,
    totalBookings: 12,
    gmvCNY: 390_000,
    status: 'active',
    joinedAt: '2025-11-15',
  },
  {
    id: 'ag-014',
    wholesalerId: 'wh-001',
    name: {
      'zh-CN': '哈尔滨北方国旅',
      'en': 'Harbin Beifang Travel',
    },
    location: { 'zh-CN': '哈尔滨市南岗区', 'en': 'Nangang, Harbin' },
    licenseNumber: 'L-HLJ-CJ00045',
    contactName: { 'zh-CN': '宋伟', 'en': 'Song Wei' },
    contactRole: { 'zh-CN': '出境部主管', 'en': 'Outbound Director' },
    walletMode: 'DEBIT',
    walletBalanceCNY: 0,
    creditLimit: 0,
    totalBookings: 5,
    gmvCNY: 145_000,
    status: 'suspended',                // suspended case
    joinedAt: '2025-10-18',
  },
  {
    id: 'ag-015',
    wholesalerId: 'wh-001',
    name: {
      'zh-CN': '昆明春城国旅',
      'en': 'Kunming Chuncheng Travel',
    },
    location: { 'zh-CN': '昆明市五华区', 'en': 'Wuhua, Kunming' },
    licenseNumber: 'L-YN-CJ00112',
    contactName: { 'zh-CN': '杨光', 'en': 'Yang Guang' },
    contactRole: { 'zh-CN': '总经理', 'en': 'General Manager' },
    walletMode: 'DEBIT',
    walletBalanceCNY: 67_800,
    creditLimit: 0,
    totalBookings: 8,
    gmvCNY: 235_000,
    status: 'active',
    joinedAt: '2025-12-01',
  },
]
```

### 2.5 DMCs — 7 across MEA

```typescript
// lib/mock/dmcs.ts
import type { DMC } from '@/lib/types'

export const dmcs: DMC[] = [
  { id: 'dmc-001', name: 'Arabian Adventures DMC', country: 'AE', city: 'Dubai', contact: 'ops@arabianadv.example', trustTier: 'TRUSTED', settlementCurrency: 'USD', paymentTermsDays: 30 },
  { id: 'dmc-002', name: 'Falcon Tours & Travel', country: 'AE', city: 'Abu Dhabi', contact: 'reservations@falcontours.example', trustTier: 'VERIFIED', settlementCurrency: 'AED', paymentTermsDays: 30 },
  { id: 'dmc-003', name: 'Petra Heritage Travel', country: 'JO', city: 'Amman', contact: 'sales@petraheritage.example', trustTier: 'VERIFIED', settlementCurrency: 'USD', paymentTermsDays: 30 },
  { id: 'dmc-004', name: 'AlUla Destinations', country: 'SA', city: 'Riyadh', contact: 'business@aluladest.example', trustTier: 'NEW', settlementCurrency: 'SAR', paymentTermsDays: 60 },
  { id: 'dmc-005', name: 'Muscat Bay Travel', country: 'OM', city: 'Muscat', contact: 'ops@muscatbay.example', trustTier: 'VERIFIED', settlementCurrency: 'OMR', paymentTermsDays: 30 },
  { id: 'dmc-006', name: 'Red Sea Holidays', country: 'EG', city: 'Cairo', contact: 'b2b@redseaholidays.example', trustTier: 'TRUSTED', settlementCurrency: 'USD', paymentTermsDays: 15 },
  { id: 'dmc-007', name: 'Gulf Premier Tours', country: 'AE', city: 'Dubai', contact: 'sales@gulfpremier.example', trustTier: 'TRUSTED', settlementCurrency: 'USD', paymentTermsDays: 30 },
]
```

### 2.6 Itineraries — the core asset

10-12 itineraries, fully fleshed out. Each one needs **bilingual content for every prose field**.

Template for one itinerary:

```typescript
// lib/mock/itineraries.ts (partial — example of one)
import type { Itinerary } from '@/lib/types'

export const itineraries: Itinerary[] = [
  {
    id: 'it-001',
    dmcId: 'dmc-001',
    title: {
      'zh-CN': '迪拜阿布扎比深度5日游',
      'en': 'Dubai & Abu Dhabi Deep Dive 5D',
    },
    subtitle: {
      'zh-CN': '帆船酒店·哈利法塔·法拉利世界·谢赫扎耶德大清真寺',
      'en': 'Burj Al Arab · Burj Khalifa · Ferrari World · Sheikh Zayed Grand Mosque',
    },
    departureType: 'FIXED',
    duration: { days: 5, nights: 4 },
    countries: ['AE'],
    cities: ['Dubai', 'Abu Dhabi'],
    themes: ['family', 'luxury', 'first-time'],
    heroImage: 'https://images.unsplash.com/photo-XXXXX',  // Ahmed provides
    gallery: [
      'https://images.unsplash.com/photo-YYY1',
      'https://images.unsplash.com/photo-YYY2',
      'https://images.unsplash.com/photo-YYY3',
      'https://images.unsplash.com/photo-YYY4',
      'https://images.unsplash.com/photo-YYY5',
      'https://images.unsplash.com/photo-YYY6',
    ],
    highlights: {
      'zh-CN': [
        '入住迪拜五星酒店,可升级帆船酒店',
        '专车专导,全程中文服务',
        '哈利法塔148层观景,法拉利世界一日畅玩',
        '阿布扎比大清真寺深度游览',
        '中式餐 + 自助餐 + 阿拉伯特色餐',
      ],
      'en': [
        'Five-star Dubai accommodation with Burj Al Arab upgrade option',
        'Private vehicle and Mandarin-speaking guide throughout',
        'Burj Khalifa Level 148 observation; Ferrari World full day',
        'Sheikh Zayed Grand Mosque deep tour',
        'Chinese cuisine + buffet + Arabian specialty dining',
      ],
    },
    days: [
      {
        day: 1,
        title: { 'zh-CN': '抵达迪拜', 'en': 'Arrival in Dubai' },
        description: {
          'zh-CN': '抵达迪拜国际机场后,专车专导接机送至酒店休息。晚餐自理,可自由探索附近购物中心,品尝迪拜夜生活。',
          'en': 'Arrive at Dubai International Airport. Private transfer and Mandarin-speaking guide will meet you and take you to your hotel for rest. Dinner at leisure; optional exploration of nearby shopping mall to experience Dubai nightlife.',
        },
        activities: [
          { type: 'TRANSFER', name: { 'zh-CN': '机场接机', 'en': 'Airport pickup' } },
          { type: 'ACCOMMODATION', name: { 'zh-CN': '迪拜JW万豪酒店', 'en': 'JW Marriott Marquis Dubai' } },
        ],
      },
      // ... days 2-5 with same structure
    ],
    inclusions: {
      'zh-CN': [
        '4晚五星级酒店住宿(双人间)',
        '全程中文导游服务',
        '专车接送及景点交通',
        '7次正餐(早餐+午餐/晚餐)',
        '景点门票:哈利法塔、法拉利世界、大清真寺',
        '阿联酋签证(免签政策适用)',
        '旅游意外险',
      ],
      'en': [
        '4 nights 5-star hotel (twin sharing)',
        'Full-trip Mandarin-speaking guide',
        'Private vehicle for transfers and excursions',
        '7 meals (breakfast + lunch/dinner)',
        'Entrance: Burj Khalifa, Ferrari World, Grand Mosque',
        'UAE visa (visa-free policy applicable)',
        'Travel accident insurance',
      ],
    },
    exclusions: {
      'zh-CN': [
        '国际机票(可代订)',
        '酒店升级费用(如帆船酒店)',
        '个人消费及小费',
        '行程外自费项目',
      ],
      'en': [
        'International flights (booking assistance available)',
        'Hotel upgrade fees (e.g., Burj Al Arab)',
        'Personal expenses and gratuities',
        'Optional excursions not listed',
      ],
    },
    pricing: {
      sourceCurrency: 'USD',
      bands: [
        { paxRange: '2-3', minPax: 2, maxPax: 3, perPaxUSD: 1340 },
        { paxRange: '4-5', minPax: 4, maxPax: 5, perPaxUSD: 1180 },
        { paxRange: '6-8', minPax: 6, maxPax: 8, perPaxUSD: 1020 },
        { paxRange: '9+', minPax: 9, maxPax: 99, perPaxUSD: 940 },
      ],
      singleSupplementUSD: 380,
      seasons: [
        { name: 'low', dateRange: '2026-05-01..2026-09-30', multiplier: 1.0 },
        { name: 'shoulder', dateRange: '2026-10-01..2026-11-30', multiplier: 1.15 },
        { name: 'peak', dateRange: '2026-12-01..2026-04-30', multiplier: 1.35 },
      ],
    },
    marginLayers: {
      dmcNetPerPaxUSD: 1020,
      ourMarkupUSD: 160,
      wholesalerSellUSD: 1180,
      wholesalerSuggestedMarkupUSD: 220,
      agencyRetailUSD: 1400,
    },
    cancellationPolicy: {
      name: { 'zh-CN': '标准中东游政策', 'en': 'Standard MEA Tour' },
      tiers: [
        { daysBefore: 60, penaltyPercent: 0 },
        { daysBefore: 30, penaltyPercent: 25 },
        { daysBefore: 15, penaltyPercent: 50 },
        { daysBefore: 7, penaltyPercent: 75 },
        { daysBefore: 0, penaltyPercent: 100 },
      ],
    },
    departures: [
      { id: 'dep-001', itineraryId: 'it-001', date: '2026-06-04', capacity: 25, booked: 18, status: 'GUARANTEED' },
      { id: 'dep-002', itineraryId: 'it-001', date: '2026-06-11', capacity: 25, booked: 8,  status: 'OPEN' },
      { id: 'dep-003', itineraryId: 'it-001', date: '2026-06-18', capacity: 25, booked: 22, status: 'GUARANTEED' },
      { id: 'dep-004', itineraryId: 'it-001', date: '2026-06-25', capacity: 25, booked: 12, status: 'OPEN' },
      { id: 'dep-005', itineraryId: 'it-001', date: '2026-07-02', capacity: 25, booked: 6,  status: 'OPEN' },
      { id: 'dep-006', itineraryId: 'it-001', date: '2026-07-09', capacity: 25, booked: 25, status: 'FULL' },
      { id: 'dep-007', itineraryId: 'it-001', date: '2026-07-16', capacity: 25, booked: 14, status: 'OPEN' },
      { id: 'dep-008', itineraryId: 'it-001', date: '2026-07-23', capacity: 25, booked: 9,  status: 'OPEN' },
    ],
    translations: {
      'zh-CN': { reviewed: true,  reviewedAt: '2026-03-15' },
      'en':    { reviewed: true,  reviewedAt: '2026-03-15' },
    },
    publishedToAgencies: ['ag-001', 'ag-002', 'ag-003', 'ag-005', 'ag-006', 'ag-009', 'ag-012'],
  },
  // ... 9-11 more itineraries
]
```

### 2.7 Itinerary list (full set to build)

| ID | Title (zh-CN) | Type | Days | Country | DMC | Notes |
|---|---|---|---|---|---|---|
| it-001 | 迪拜阿布扎比深度5日游 | FIXED | 5 | UAE | dmc-001 | Bestseller — many departures |
| it-002 | 阿联酋全景7日精华游 | FIXED | 7 | UAE | dmc-001 | Longer FIXED |
| it-003 | 迪拜私家定制游 | ON_DEMAND | 5 | UAE | dmc-002 | FIT example |
| it-004 | 约旦佩特拉古城7日游 | FIXED | 7 | JO | dmc-003 | Cultural |
| it-005 | 沙特利雅得+欧拉8日 | FIXED | 8 | SA | dmc-004 | New destination |
| it-006 | 阿曼苏丹国奇迹6日 | ON_DEMAND | 6 | OM | dmc-005 | FIT, niche |
| it-007 | 迪拜豪华定制 | RFQ_ONLY | flex | UAE | dmc-002 | High-end RFQ |
| it-008 | 海湾三国精华12日 | FIXED | 12 | multi | dmc-001 | Multi-country |
| it-009 | 埃及+迪拜联游10日 | FIXED | 10 | EG+AE | dmc-006 | Multi-country |
| it-010 | 阿布扎比家庭亲子5日 | FIXED | 5 | AE | dmc-007 | Family-focused |
| it-011 | 沙特高端商务考察7日 | RFQ_ONLY | 7 | SA | dmc-004 | Corporate RFQ |
| it-012 | 迪拜豪华婚礼蜜月8日 | ON_DEMAND | 8 | AE | dmc-002 | Niche FIT |

Each gets the full structure shown in 2.6. Don't shortcut — fully-fleshed itineraries are the wow factor.

### 2.8 Bookings — 30-40 across varied states

Distribution recommendation:
- 4 in `BOOKING_PENDING` (with SLA timers — set `submittedAt` to 18-22 hours ago)
- 2 in `CONFIRMED_PENDING_GUARANTEE`
- 15 in `CONFIRMED`
- 3 in `CONFIRMED_AMENDMENT_PENDING`
- 4 in `CANCELLED`
- 8 in `TRAVELLED`
- 2 in `SETTLED`

Distribute across agencies. Mix recent (last week), upcoming (next 30 days), past (last 90 days).

### 2.9 RFQs — 8 in queue

- 2 fresh (within 4h, `RFQ_SUBMITTED`, SLA still running)
- 3 quoted, awaiting agency action (`RFQ_QUOTED`)
- 1 quoted but TTL expiring soon
- 1 declined (`RFQ_DECLINED`)
- 1 escalated to platform (us)

### 2.10 Wallet transactions

For each agency, generate 5-15 transactions spanning their booking history. Mix:
- TOPUP entries (positive)
- BOOKING_HOLD + BOOKING_CAPTURE pairs (negative pair for confirmed booking)
- BOOKING_RELEASE (positive reversal for declined)
- REFUND (positive for cancelled)

### 2.11 Photos

Ahmed provides 60-80 Unsplash URLs in `/lib/mock/photos.ts`, organized by destination:

```typescript
// lib/mock/photos.ts
export const photos = {
  dubai: {
    hero: [
      'https://images.unsplash.com/photo-1582672060674-bc2bd808a8f5',  // example
      // ... 6-8 Dubai hero shots
    ],
    gallery: [
      'https://images.unsplash.com/photo-...',
      // ... 12-15 Dubai gallery shots
    ],
  },
  abuDhabi: { hero: [...], gallery: [...] },
  petra: { hero: [...], gallery: [...] },
  alUla: { hero: [...], gallery: [...] },
  muscat: { hero: [...], gallery: [...] },
  cairo: { hero: [...], gallery: [...] },
  riyadh: { hero: [...], gallery: [...] },
}
```

Each itinerary references specific photos by URL.

**Critical:** don't let Claude Code pick photos by searching the web. Ahmed curates. AI-picked photos are visually generic.

### 2.12 Data realism rules

- **Chinese names:** real surnames (王, 李, 张, 陈, 刘, 黄, 周, 吴, 徐, 孙, 马, 朱, 胡, 林, 郭, 何, 高, 罗, 郑, 梁) with plausible given names. Don't repeat names across agencies.
- **License numbers:** format `L-{province}-CJ{5digits}` for credibility
- **Phone numbers:** if shown, format `+86 1XX XXXX XXXX`
- **Prices in CNY:** always with thousands separator, no decimals
- **Prices in USD:** always with thousands separator, no decimals
- **Dates:** zh-CN format `2026年6月4日 周四`; en format `Jun 4, 2026 · Thu`; ISO in tables `2026-06-04`
- **Booking references:** format `TX-{6 chars alphanumeric}` (e.g., `TX-A8K3M2`)
- **No "John Doe" anywhere.** No "Test Agency." No "Sample Tour."

### 2.13 Locale-aware data display in components

Anywhere a component renders a bilingual mock field:

```tsx
import { useTranslation } from '@/lib/i18n/provider'
import { getLocalized } from '@/lib/i18n/get-localized'
import { itineraries } from '@/lib/mock'

export function ItineraryCard({ itineraryId }: { itineraryId: string }) {
  const { locale, t } = useTranslation()
  const itinerary = itineraries.find(i => i.id === itineraryId)!
  
  return (
    <Card>
      <img src={itinerary.heroImage} alt="" />
      <div>
        <p className="text-label">{t('catalog.from_price')}</p>
        <h3 className="text-subheading">{getLocalized(itinerary.title, locale)}</h3>
        <p className="text-caption">{getLocalized(itinerary.subtitle, locale)}</p>
        <p className="text-heading text-accent">
          {formatCurrency(itinerary.marginLayers.agencyRetailUSD, 'USD', locale)}
        </p>
      </div>
    </Card>
  )
}
```

---

## Part 3: Validation rules (linter setup)

To enforce "no hardcoded strings," add a simple ESLint rule. Easiest path: install `eslint-plugin-i18next` or write a custom rule that flags:

1. JSX text containing Chinese characters (Unicode range `\u4e00-\u9fff`)
2. JSX text containing English alphabetic words longer than 3 characters that aren't:
   - Numbers
   - Currency codes
   - Brand names (whitelist: Tianxing, Dubai, Petra, etc.)
   - Code identifiers

Configure to error, not warn. Block CI/build on violations.

For demo-time simplicity, even a grep check in the build script catches most violations:

```bash
# package.json scripts
"check-strings": "grep -rE '>[^<>{}]*[a-zA-Z]{4,}[^<>{}]*<' app/ components/ --include='*.tsx' | grep -v 't(' && echo 'Found hardcoded strings' && exit 1 || echo 'OK'"
```

Imperfect but better than nothing.

---

**End of i18n & mock data guide.** Apply throughout the build. The "every string from i18n, every prose field bilingual" discipline is what makes the demo feel genuinely bilingual rather than translated-as-an-afterthought.

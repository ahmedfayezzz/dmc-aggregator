import type { RFQ } from "@/lib/types"

const now = Date.now()
const hoursFromNow = (h: number) => new Date(now + h * 3600_000).toISOString()
const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString()

export const rfqs: RFQ[] = [
  // ── 2 fresh, SLA running ──
  {
    id: "rfq-001",
    agencyId: "ag-001",
    itineraryId: "it-008",
    customization: {
      "zh-CN": "客户要求埃及深度文化10日,升级 Sanctuary Sun Boat 顶级游轮,3月8日妇女节出发,女性私人考古学家",
      en: "Egypt Deep Culture 10D — upgrade to Sanctuary Sun Boat, March 8 Women's Day departure, female Egyptologist",
    },
    notes: { "zh-CN": "VIP老客户,二次复购,预算充足", en: "VIP repeat client, generous budget" },
    submittedAt: hoursAgo(2),
    slaExpiresAt: hoursFromNow(22),
    state: "RFQ_SUBMITTED",
  },
  {
    id: "rfq-002",
    agencyId: "ag-009",
    itineraryId: "it-012",
    customization: {
      "zh-CN": "10人约旦商务考察团,需对接约旦工商会与亚喀巴自贸区,9月初出发",
      en: "10-person Jordan business mission, intros at Jordan Chamber + Aqaba Free Zone, departure early September",
    },
    notes: { "zh-CN": "公司团,需提供发票,可签框架协议", en: "Corporate group, invoice required, framework agreement possible" },
    submittedAt: hoursAgo(3.5),
    slaExpiresAt: hoursFromNow(20.5),
    state: "RFQ_SUBMITTED",
  },

  // ── 3 quoted, awaiting agency action ──
  {
    id: "rfq-003",
    agencyId: "ag-003",
    itineraryId: "it-009",
    customization: {
      "zh-CN": "8人北非中东大环线15日,要求10月15日出发,升级摩洛哥段为撒哈拉豪华泡泡帐篷",
      en: "8-person North Africa & MEA grand tour 15D, depart Oct 15, upgrade Morocco leg to Sahara luxury bubble tent",
    },
    notes: { "zh-CN": "等待客户最终确认", en: "Awaiting client final confirmation" },
    submittedAt: hoursAgo(36),
    slaExpiresAt: hoursFromNow(108),
    state: "RFQ_QUOTED",
    quotedAmountUSD: 4480 * 8,
  },
  {
    id: "rfq-004",
    agencyId: "ag-002",
    itineraryId: "it-005",
    customization: {
      "zh-CN": "摩洛哥蜜月奢华10日,4人(两对),要求 La Mamounia 升级总统套房",
      en: "Morocco Honeymoon Luxury 10D, 4 pax (two couples), upgrade La Mamounia to Presidential Suite",
    },
    notes: { "zh-CN": "明星客户,保密要求高", en: "Celebrity client, strict confidentiality" },
    submittedAt: hoursAgo(48),
    slaExpiresAt: hoursFromNow(120),
    state: "RFQ_QUOTED",
    quotedAmountUSD: 8800 * 4,
  },
  {
    id: "rfq-005",
    agencyId: "ag-012",
    itineraryId: "it-004",
    customization: {
      "zh-CN": "摩洛哥撒哈拉6日,4人,需中餐每日一餐保证,老年客户需协调步行强度",
      en: "Morocco Sahara 6D, 4 pax, guarantee one Chinese meal per day, senior clients — adjust walking pace",
    },
    notes: { "zh-CN": "老年客户,饮食偏好严格", en: "Senior clients, strict dietary preferences" },
    submittedAt: hoursAgo(60),
    slaExpiresAt: hoursFromNow(36),
    state: "RFQ_QUOTED",
    quotedAmountUSD: 2080 * 4,
  },

  // ── 1 quoted with TTL expiring soon ──
  {
    id: "rfq-006",
    agencyId: "ag-006",
    itineraryId: "it-005",
    customization: {
      "zh-CN": "摩洛哥蜜月10日,双人,要求埃萨乌伊拉海边沙滩仪式,中阿混合菜单",
      en: "Morocco Honeymoon 10D, couple — Essaouira beach ceremony, Chinese-Arabian menu",
    },
    notes: { "zh-CN": "客户优柔寡断,需主动跟进", en: "Client indecisive, requires proactive follow-up" },
    submittedAt: hoursAgo(70),
    slaExpiresAt: hoursFromNow(2),
    state: "RFQ_QUOTED",
    quotedAmountUSD: 7400 * 2,
  },

  // ── 1 declined ──
  {
    id: "rfq-007",
    agencyId: "ag-011",
    itineraryId: "it-008",
    customization: {
      "zh-CN": "埃及深度文化定制,预算偏低,要求 Sun Boat 顶级游轮但只愿付60%价格",
      en: "Egypt Deep Culture, budget too low — wants Sun Boat top-tier cruise at 60% off",
    },
    notes: { "zh-CN": "客户预算不匹配,已委婉拒绝并推荐标准 it-006", en: "Budget mismatch, politely declined, recommended standard it-006 instead" },
    submittedAt: hoursAgo(96),
    slaExpiresAt: hoursAgo(24),
    state: "RFQ_DECLINED",
  },

  // ── 1 escalated to platform ──
  {
    id: "rfq-008",
    agencyId: "ag-002",
    itineraryId: "it-012",
    customization: {
      "zh-CN": "25人约旦政府考察团,需中约双方高层接洽,商务签批量办理",
      en: "25-person Jordan government delegation, high-level intros needed, bulk business visa",
    },
    notes: { "zh-CN": "超出我们能力范围,已上报平台协调", en: "Beyond our scope, escalated to platform" },
    submittedAt: hoursAgo(120),
    slaExpiresAt: hoursFromNow(48),
    state: "RFQ_SUBMITTED",
  },
]

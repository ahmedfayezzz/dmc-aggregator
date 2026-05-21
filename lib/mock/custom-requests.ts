import type { CustomRequest } from "@/lib/types"

const now = Date.now()
const isoAgo = (h: number) => new Date(now - h * 3600_000).toISOString()
const isoFromNow = (h: number) => new Date(now + h * 3600_000).toISOString()

// 8 sample requests across the pipeline, showcasing every state the demo will surface.

export const customRequests: CustomRequest[] = [
  // ── 1 · in DMC inbox awaiting quote (from-scratch, Jordan) ──
  {
    id: "cr-001",
    type: "FROM_SCRATCH",
    state: "AWAITING_DMC_QUOTE",
    agencyId: "ag-001",
    wholesalerId: "wh-001",
    payload: {
      destinations: ["JO"],
      cities: ["Petra", "Wadi Rum", "Dead Sea"],
      travelWindow: { from: "2026-10-15", to: "2026-10-25" },
      durationDays: 8,
      pax: { adults: 6, children: 2, infants: 0 },
      themes: ["family", "cultural"],
      hotelTier: "4",
      budgetBand: "standard",
      activitiesRequested: {
        "zh-CN": "希望包含哈布塔骆驼骑行、佩特拉夜游、贝都因人家访",
        en: "Camel ride at Wadi Rum, Petra by Night, Bedouin family visit",
      },
      specialNeeds: {
        "zh-CN": "一位长者需轮椅辅助",
        en: "One senior traveler requires wheelchair assistance",
      },
      notes: {
        "zh-CN": "客户是上海老客户,介意酒店位置离老城近",
        en: "Repeat client from Shanghai, prefers hotels near old town",
      },
    },
    routing: {
      assignedDmcId: "dmc-001",
      currentHolder: "dmc",
      direction: "forward",
    },
    pricing: {},
    events: [
      {
        ts: isoAgo(6),
        actor: "agency",
        actorName: "王明 · Beijing Huaxia",
        action: "submitted",
      },
      {
        ts: isoAgo(6),
        actor: "system",
        action: "forwarded",
        note: "Auto-forwarded by wholesaler rule wr-002",
        matchedRuleId: "wr-002",
      },
      {
        ts: isoAgo(5.9),
        actor: "system",
        action: "forwarded",
        note: "Auto-forwarded by platform rule pr-001",
        matchedRuleId: "pr-001",
      },
      {
        ts: isoAgo(5.9),
        actor: "platform",
        action: "forwarded",
        note: "Assigned to Petra Heritage Travel (dmc-001)",
      },
    ],
    createdAt: isoAgo(6),
    updatedAt: isoAgo(5.9),
  },

  // ── 2 · just submitted by agency, awaiting wholesaler review (luxury manual) ──
  {
    id: "cr-002",
    type: "FROM_SCRATCH",
    state: "AWAITING_WHOLESALER_REVIEW",
    agencyId: "ag-002",
    wholesalerId: "wh-001",
    payload: {
      destinations: ["MA"],
      cities: ["Marrakech", "Essaouira", "Sahara"],
      travelWindow: { from: "2026-11-08", to: "2026-11-20" },
      durationDays: 12,
      pax: { adults: 2, children: 0, infants: 0 },
      themes: ["luxury"],
      hotelTier: "5+",
      budgetBand: "luxury",
      budgetPerPaxUSD: 12_000,
      activitiesRequested: {
        "zh-CN": "私人厨师每晚到 La Mamounia,撒哈拉豪华泡泡帐篷,直升机俯瞰阿特拉斯山",
        en: "Private chef nightly at La Mamounia, Sahara luxury bubble tent, helicopter over Atlas Mountains",
      },
      notes: {
        "zh-CN": "明星客户,保密要求高,需女性礼宾",
        en: "Celebrity client · strict confidentiality · requires female concierge",
      },
    },
    routing: {
      currentHolder: "wholesaler",
      direction: "forward",
    },
    pricing: {},
    events: [
      {
        ts: isoAgo(0.5),
        actor: "agency",
        actorName: "李娜 · CYTS Shanghai",
        action: "submitted",
      },
      {
        ts: isoAgo(0.5),
        actor: "system",
        action: "forwarded",
        note: "Held for manual review · rule wr-003 (Luxury / 5-star+) requires approval",
        matchedRuleId: "wr-003",
      },
    ],
    createdAt: isoAgo(0.5),
    updatedAt: isoAgo(0.5),
  },

  // ── 3 · platform reviewing (high-value, after wholesaler manually forwarded) ──
  {
    id: "cr-003",
    type: "MODIFY_EXISTING",
    state: "AWAITING_PLATFORM_REVIEW",
    agencyId: "ag-009",
    wholesalerId: "wh-001",
    baseItineraryId: "it-006",
    payload: {
      destinations: ["JO", "MA", "EG"],
      travelWindow: { from: "2026-09-22", to: "2026-10-12" },
      durationDays: 20,
      pax: { adults: 16, children: 0, infants: 0 },
      themes: ["luxury", "cultural"],
      hotelTier: "5",
      budgetBand: "luxury",
      activitiesRequested: {
        "zh-CN": "三国大环线,要求商务专机 PEK-AMM-CMN-CAI-PEK,沿途五星顶级酒店",
        en: "MEA grand tour, business charter PEK-AMM-CMN-CAI-PEK with top-tier 5-star hotels throughout",
      },
      notes: {
        "zh-CN": "16人企业激励团,500万 RMB 总预算",
        en: "16-pax corporate incentive · CNY 5M total budget",
      },
    },
    routing: {
      currentHolder: "platform",
      direction: "forward",
    },
    pricing: {},
    events: [
      {
        ts: isoAgo(20),
        actor: "agency",
        actorName: "孙涛 · Qingdao Ocean International",
        action: "submitted",
      },
      {
        ts: isoAgo(18),
        actor: "wholesaler",
        actorName: "张经理 · UB Trip",
        action: "forwarded",
        note: "Manually reviewed and forwarded — escalating to Safasoft for DMC coordination",
      },
    ],
    createdAt: isoAgo(20),
    updatedAt: isoAgo(18),
  },

  // ── 4 · DMC quoted, platform applying markup (auto path) ──
  {
    id: "cr-004",
    type: "FROM_SCRATCH",
    state: "PLATFORM_APPLYING_MARKUP",
    agencyId: "ag-003",
    wholesalerId: "wh-001",
    payload: {
      destinations: ["EG"],
      cities: ["Cairo", "Luxor", "Aswan"],
      travelWindow: { from: "2026-12-02", to: "2026-12-12" },
      durationDays: 10,
      pax: { adults: 4, children: 0, infants: 0 },
      themes: ["cultural", "first-time"],
      hotelTier: "4",
      budgetBand: "standard",
      activitiesRequested: {
        "zh-CN": "完整尼罗河游轮3晚,女法老埃及学家全程",
        en: "Full Nile cruise 3 nights, female Egyptologist throughout",
      },
    },
    routing: {
      assignedDmcId: "dmc-006",
      currentHolder: "platform",
      direction: "backward",
    },
    pricing: {
      dmcNetTotalUSD: 12_400,
      dmcNetPerPaxUSD: 3100,
    },
    events: [
      {
        ts: isoAgo(48),
        actor: "agency",
        actorName: "陈伟强 · Nanhu Guangzhou",
        action: "submitted",
      },
      {
        ts: isoAgo(48),
        actor: "system",
        action: "forwarded",
        matchedRuleId: "wr-002",
      },
      {
        ts: isoAgo(48),
        actor: "system",
        action: "forwarded",
        matchedRuleId: "pr-003",
      },
      {
        ts: isoAgo(2),
        actor: "dmc",
        actorName: "Red Sea Holidays · Cairo",
        action: "quoted",
        amountUSD: 12_400,
        note: "Per-pax breakdown attached",
      },
    ],
    createdAt: isoAgo(48),
    updatedAt: isoAgo(2),
  },

  // ── 5 · DMC quoted, wholesaler manually applying markup (luxury) ──
  {
    id: "cr-005",
    type: "FROM_SCRATCH",
    state: "WHOLESALER_APPLYING_MARKUP",
    agencyId: "ag-006",
    wholesalerId: "wh-001",
    payload: {
      destinations: ["JO"],
      cities: ["Amman", "Petra", "Wadi Rum"],
      travelWindow: { from: "2026-10-28", to: "2026-11-04" },
      durationDays: 7,
      pax: { adults: 4, children: 0, infants: 0 },
      themes: ["luxury", "religious"],
      hotelTier: "5+",
      budgetBand: "luxury",
      notes: {
        "zh-CN": "穆斯林客户,要求清真餐和祈祷时间安排",
        en: "Muslim travelers · halal meals + prayer-time scheduling required",
      },
    },
    routing: {
      assignedDmcId: "dmc-001",
      currentHolder: "wholesaler",
      direction: "backward",
    },
    pricing: {
      dmcNetTotalUSD: 28_400,
      dmcNetPerPaxUSD: 7100,
      platformMarkupUSD: 1988,
      platformMarkupRuleId: "pr-050",
    },
    events: [
      {
        ts: isoAgo(72),
        actor: "agency",
        actorName: "马志强 · Xi'an Silk Road",
        action: "submitted",
      },
      {
        ts: isoAgo(70),
        actor: "wholesaler",
        actorName: "张经理 · UB Trip",
        action: "forwarded",
        note: "Manual review · luxury request",
      },
      {
        ts: isoAgo(70),
        actor: "system",
        action: "forwarded",
        matchedRuleId: "pr-080",
      },
      {
        ts: isoAgo(4),
        actor: "dmc",
        actorName: "Petra Heritage Travel",
        action: "quoted",
        amountUSD: 28_400,
      },
      {
        ts: isoAgo(2),
        actor: "platform",
        actorName: "Safasoft Ops",
        action: "markup_applied",
        amountUSD: 1988,
        note: "Manual review · 7% on high-value tour",
      },
    ],
    createdAt: isoAgo(72),
    updatedAt: isoAgo(2),
  },

  // ── 6 · quoted to agency, awaiting decision ──
  {
    id: "cr-006",
    type: "MODIFY_EXISTING",
    state: "QUOTED_TO_AGENCY",
    agencyId: "ag-001",
    wholesalerId: "wh-001",
    baseItineraryId: "it-005",
    payload: {
      destinations: ["MA"],
      travelWindow: { from: "2026-09-15", to: "2026-09-25" },
      durationDays: 10,
      pax: { adults: 2, children: 0, infants: 0 },
      themes: ["luxury"],
      hotelTier: "5+",
      budgetBand: "luxury",
      dayModifications: [
        {
          day: 4,
          action: "REPLACE",
          description: {
            "zh-CN": "将 La Mamounia 升级为 Royal Mansour Marrakech 总统套房",
            en: "Upgrade La Mamounia to Royal Mansour Marrakech Presidential Suite",
          },
        },
        {
          day: 7,
          action: "ADD",
          description: {
            "zh-CN": "加一天埃萨乌伊拉海滩私人晚宴",
            en: "Add one day for private Essaouira beach dinner",
          },
        },
      ],
      notes: {
        "zh-CN": "蜜月,要求所有酒店海景套房",
        en: "Honeymoon · sea-view suite at every hotel",
      },
    },
    routing: {
      assignedDmcId: "dmc-003",
      currentHolder: "agency",
      direction: "backward",
    },
    pricing: {
      dmcNetTotalUSD: 18_800,
      dmcNetPerPaxUSD: 9400,
      platformMarkupUSD: 1880,
      platformMarkupRuleId: "pr-002",
      wholesalerMarkupUSD: 5168,
      wholesalerMarkupRuleId: "wr-003",
      agencyRetailUSD: 25_848,
    },
    events: [
      { ts: isoAgo(96), actor: "agency", actorName: "王明 · Beijing Huaxia", action: "submitted" },
      { ts: isoAgo(96), actor: "system", action: "forwarded", matchedRuleId: "wr-002" },
      { ts: isoAgo(96), actor: "system", action: "forwarded", matchedRuleId: "pr-002" },
      { ts: isoAgo(24), actor: "dmc", actorName: "Atlas Mountains DMC", action: "quoted", amountUSD: 18_800 },
      {
        ts: isoAgo(20),
        actor: "system",
        action: "markup_applied",
        amountUSD: 1880,
        matchedRuleId: "pr-002",
      },
      {
        ts: isoAgo(2),
        actor: "wholesaler",
        actorName: "张经理 · UB Trip",
        action: "markup_applied",
        amountUSD: 5168,
        note: "Manual · luxury markup with maxMarkupUSD cap applied",
        matchedRuleId: "wr-003",
      },
    ],
    expiresAt: isoFromNow(70),
    createdAt: isoAgo(96),
    updatedAt: isoAgo(2),
  },

  // ── 7 · accepted, now flowing into booking ──
  {
    id: "cr-007",
    type: "FROM_SCRATCH",
    state: "ACCEPTED",
    agencyId: "ag-005",
    wholesalerId: "wh-001",
    payload: {
      destinations: ["EG"],
      cities: ["Cairo", "Red Sea (Hurghada)"],
      travelWindow: { from: "2026-11-22", to: "2026-11-29" },
      durationDays: 7,
      pax: { adults: 8, children: 2, infants: 0 },
      themes: ["family"],
      hotelTier: "4",
      budgetBand: "standard",
    },
    routing: {
      assignedDmcId: "dmc-006",
      currentHolder: "agency",
      direction: "backward",
    },
    pricing: {
      dmcNetTotalUSD: 14_500,
      dmcNetPerPaxUSD: 1450,
      platformMarkupUSD: 1885,
      platformMarkupRuleId: "pr-003",
      wholesalerMarkupUSD: 3604,
      wholesalerMarkupRuleId: "wr-002",
      agencyRetailUSD: 19_989,
    },
    events: [
      { ts: isoAgo(168), actor: "agency", actorName: "刘建国 · Chengdu Overseas", action: "submitted" },
      { ts: isoAgo(168), actor: "system", action: "forwarded", matchedRuleId: "wr-002" },
      { ts: isoAgo(168), actor: "system", action: "forwarded", matchedRuleId: "pr-003" },
      { ts: isoAgo(140), actor: "dmc", actorName: "Red Sea Holidays", action: "quoted", amountUSD: 14_500 },
      { ts: isoAgo(140), actor: "system", action: "markup_applied", amountUSD: 1885, matchedRuleId: "pr-003" },
      { ts: isoAgo(140), actor: "system", action: "markup_applied", amountUSD: 3604, matchedRuleId: "wr-002" },
      { ts: isoAgo(48), actor: "agency", actorName: "刘建国 · Chengdu Overseas", action: "accepted" },
    ],
    createdAt: isoAgo(168),
    updatedAt: isoAgo(48),
  },

  // ── 8 · declined by DMC mid-pipeline ──
  {
    id: "cr-008",
    type: "FROM_SCRATCH",
    state: "DECLINED",
    agencyId: "ag-011",
    wholesalerId: "wh-001",
    payload: {
      destinations: ["MA"],
      travelWindow: { from: "2026-08-10", to: "2026-08-14" },
      durationDays: 4,
      pax: { adults: 25, children: 0, infants: 0 },
      themes: ["adventure"],
      hotelTier: "5",
      budgetBand: "premium",
      notes: {
        "zh-CN": "学生团,需青年旅舍价格但要求五星酒店服务",
        en: "Student group · hostel budget but 5-star service expected",
      },
    },
    routing: {
      assignedDmcId: "dmc-003",
      currentHolder: "agency",
      direction: "backward",
    },
    pricing: {},
    events: [
      { ts: isoAgo(120), actor: "agency", actorName: "吴敏 · Tianjin Binhai", action: "submitted" },
      { ts: isoAgo(118), actor: "system", action: "forwarded", matchedRuleId: "wr-002" },
      { ts: isoAgo(118), actor: "system", action: "forwarded", matchedRuleId: "pr-002" },
      {
        ts: isoAgo(96),
        actor: "dmc",
        actorName: "Atlas Mountains DMC",
        action: "declined",
        note: "Budget mismatch — cannot deliver 5-star service at requested price point. Recommend re-pricing.",
      },
    ],
    createdAt: isoAgo(120),
    updatedAt: isoAgo(96),
  },
]

export function findCustomRequest(id: string): CustomRequest | undefined {
  return customRequests.find((r) => r.id === id)
}

export function customRequestsForAgency(agencyId: string): CustomRequest[] {
  return customRequests.filter((r) => r.agencyId === agencyId)
}

export function customRequestsForWholesaler(wholesalerId: string): CustomRequest[] {
  return customRequests.filter((r) => r.wholesalerId === wholesalerId)
}

export function customRequestsForDmc(dmcId: string): CustomRequest[] {
  return customRequests.filter((r) => r.routing.assignedDmcId === dmcId)
}

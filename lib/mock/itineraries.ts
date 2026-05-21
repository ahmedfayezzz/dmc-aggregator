import type { Itinerary } from "@/lib/types"
import { photos } from "./photos"

/**
 * Six real travel packages from Tripon partners — supplied as source docx
 * files and reformatted into the platform's bilingual itinerary structure.
 * Pricing is illustrative for the demo; cancellation policy aligns with the
 * cancellation tiers in the source documents.
 */
export const itineraries: Itinerary[] = [
  // ─── it-001 · Eid Al-Adha Jordan Discovery (4D) · dmc-001 ──────
  {
    id: "it-001",
    dmcId: "dmc-001",
    title: {
      "zh-CN": "约旦古迹·沙漠·红海 4 日游",
      en: "Eid Al-Adha Jordan Discovery — Petra, Wadi Rum & Aqaba",
    },
    subtitle: {
      "zh-CN": "玫瑰之城佩特拉 · 瓦迪拉姆星空营地 · 亚喀巴红海度假",
      en: "Rose City of Petra · Wadi Rum starlit camp · Aqaba on the Red Sea",
    },
    departureType: "FIXED",
    duration: { days: 4, nights: 3 },
    countries: ["JO"],
    cities: ["Amman", "Petra", "Wadi Rum", "Aqaba"],
    themes: ["cultural", "first-time", "adventure", "family"],
    heroImage: photos.petra.hero[0],
    gallery: [
      ...photos.petra.gallery.slice(0, 3),
      ...photos.wadiRum.gallery.slice(0, 2),
      ...photos.aqaba.gallery.slice(0, 2),
    ],
    highlights: {
      "zh-CN": [
        "佩特拉古城 3 小时专业导游讲解",
        "瓦迪拉姆贝都因营地住宿,沙漠星空晚餐(Zarb 地下烧烤)",
        "亚喀巴红海休闲一日:中国村 / Shweikh Mall 购物 + 南滩游泳",
        "可选项目:沙漠吉普探险、Prince Boat 游艇出海、潜水摄影",
        "全程现代空调旅游巴士,公司随团领队",
      ],
      en: [
        "3-hour licensed-guide walking tour through the rose-red city of Petra",
        "Overnight at a Bedouin camp in Wadi Rum with traditional Zarb dinner under the stars",
        "Aqaba leisure day — Chinese Village / Shweikh Mall shopping + Southern Beach swim",
        "Optional add-ons: jeep safari, Prince Boat yacht trip, diving with photography",
        "Modern air-conditioned coach throughout, company tour leader on every departure",
      ],
    },
    days: [
      {
        day: 1,
        title: { "zh-CN": "安曼 → 佩特拉 → 瓦迪拉姆", en: "Amman → Petra → Wadi Rum" },
        description: {
          "zh-CN":
            "清晨 5:00 安曼集合,经沙漠公路 Al Qatranah 休息站(20 分钟),抵达玫瑰之城佩特拉,3 小时专业导游讲解(蛇道、卡兹尼神殿、皇家陵墓)。下午前往瓦迪拉姆贝都因营地,入住帐篷,可选吉普车日落探险与骆驼骑乘。傍晚贝都因风味自助晚餐(Zarb 地下烧烤),星空围炉夜话。",
          en:
            "5:00 AM gather in Amman, depart via the Desert Highway with a 20-minute break at Al Qatranah. Arrive Petra for a 3-hour guided walk (the Siq, the Treasury, the Royal Tombs). Afternoon transfer to Wadi Rum, check into Bedouin camp; optional jeep sunset tour and camel ride. Evening buffet dinner Bedouin-style (Zarb — underground cooking) with stargazing.",
        },
        activities: [
          { type: "TRANSFER", name: { "zh-CN": "安曼集合出发", en: "Departure from Amman HQ" } },
          { type: "GUIDE", name: { "zh-CN": "佩特拉 3 小时讲解", en: "Petra 3-hour guided tour" } },
          { type: "ACCOMMODATION", name: { "zh-CN": "瓦迪拉姆贝都因营地", en: "Wadi Rum Bedouin camp tent" } },
          { type: "MEAL", name: { "zh-CN": "Zarb 贝都因晚餐", en: "Zarb Bedouin dinner" } },
        ],
      },
      {
        day: 2,
        title: { "zh-CN": "瓦迪拉姆 → 亚喀巴", en: "Wadi Rum → Aqaba" },
        description: {
          "zh-CN":
            "7:00 营地早餐后前往亚喀巴,沿途参观中国村与 Shweikh Mall(购物区),抵达南滩自由游泳与拍照。入住亚喀巴酒店,自由活动。可选游艇出海(Prince Boat,含/不含午餐)。",
          en:
            "Camp breakfast at 7:00, transfer to Aqaba. En route stop at Chinese Village and Shweikh Mall shopping area, then Southern Beach for swimming and photos. Hotel check-in, free time. Optional Prince Boat / White Prince yacht (with or without lunch).",
        },
        activities: [
          { type: "MEAL", name: { "zh-CN": "营地早餐", en: "Camp breakfast" } },
          { type: "ENTRANCE", name: { "zh-CN": "中国村 / Shweikh Mall", en: "Chinese Village / Shweikh Mall" } },
          { type: "ACTIVITY", name: { "zh-CN": "南滩游泳", en: "Southern Beach swim" } },
          { type: "ACCOMMODATION", name: { "zh-CN": "亚喀巴酒店", en: "Selected Aqaba hotel" } },
        ],
      },
      {
        day: 3,
        title: { "zh-CN": "亚喀巴自由日 / 自费项目", en: "Aqaba Free Day / Optional Activities" },
        description: {
          "zh-CN":
            "酒店自助早餐后自由活动 — 海边游泳、购物或自费项目:晨间沙漠探险、Eilat 日落沙漠 + 晚餐、潜水摄影、Prince Boat 游艇、潜水艇(含珊瑚保护区与观鱼)等。",
          en:
            "Buffet breakfast, then a free day for leisure swimming, shopping or optional excursions: morning desert safari, Eilat sunset safari with dinner, diving with photography, Prince Boat yacht, submarine ride with coral-reserve fish watching, and more.",
        },
        activities: [
          { type: "MEAL", name: { "zh-CN": "酒店自助早餐", en: "Hotel buffet breakfast" } },
          { type: "ACTIVITY", name: { "zh-CN": "自由日 / 自费项目", en: "Leisure / optional add-ons" } },
        ],
      },
      {
        day: 4,
        title: { "zh-CN": "亚喀巴 → 安曼", en: "Aqaba → Amman" },
        description: {
          "zh-CN":
            "酒店早餐后退房,返程安曼。注:若返程团满座不足,领队可改派 Jet 等其他客运公司座位。",
          en:
            "Hotel breakfast, check-out, return transfer to Amman. Note: if the return group is undersized, the tour leader may book seats on Jet or another transport company.",
        },
        activities: [
          { type: "TRANSFER", name: { "zh-CN": "返程安曼", en: "Return to Amman" } },
        ],
      },
    ],
    inclusions: {
      "zh-CN": [
        "瓦迪拉姆营地住宿(含晚餐与早餐)",
        "亚喀巴酒店住宿(按所选等级)",
        "全程现代空调旅游巴士",
        "营地与亚喀巴酒店餐食(早餐 + 营地晚餐)",
        "中国村购物点参观",
        "公司随团领队",
      ],
      en: [
        "Wadi Rum camp tent stay incl. dinner & breakfast",
        "Aqaba hotel night (per selected category)",
        "All transfers by modern air-conditioned coach",
        "Meals: camp dinner & breakfast + Aqaba hotel breakfast",
        "Visit to Chinese Village shopping area",
        "Company representative / tour leader throughout",
      ],
    },
    exclusions: {
      "zh-CN": [
        "景点门票(佩特拉、瓦迪拉姆保护区) — 外籍约 50 JOD / 7 JOD",
        "瓦迪拉姆吉普探险 7 JOD",
        "Prince Boat 游艇 12 / 16 JOD,Eilat 日落 25 JOD,潜水摄影 30 JOD,佩特拉热气球 20 JOD",
        "个人消费、小费、未列明项目",
        "禁止在车内吸烟",
      ],
      en: [
        "Site entry fees (Petra ~50 JOD foreign, Wadi Rum 7 JOD foreign)",
        "Wadi Rum jeep safari 7 JOD",
        "Prince Boat yacht 12 / 16 JOD · Eilat sunset 25 JOD · diving 30 JOD · Petra hot-air balloon 20 JOD",
        "Personal expenses, tips, anything not listed",
        "Smoking strictly prohibited inside the coach",
      ],
    },
    pricing: {
      sourceCurrency: "USD",
      bands: [
        { paxRange: "2-3", minPax: 2, maxPax: 3, perPaxUSD: 860 },
        { paxRange: "4-7", minPax: 4, maxPax: 7, perPaxUSD: 720 },
        { paxRange: "8-15", minPax: 8, maxPax: 15, perPaxUSD: 620 },
        { paxRange: "16+", minPax: 16, maxPax: 40, perPaxUSD: 540 },
      ],
      singleSupplementUSD: 180,
      seasons: [
        { name: "regular", dateRange: "2026-04-01..2026-05-31", multiplier: 1.0 },
        { name: "eid-peak", dateRange: "2026-06-01..2026-06-30", multiplier: 1.35 },
        { name: "summer", dateRange: "2026-07-01..2026-08-31", multiplier: 0.95 },
        { name: "autumn", dateRange: "2026-09-01..2026-11-30", multiplier: 1.15 },
      ],
    },
    marginLayers: {
      dmcNetPerPaxUSD: 620,
      ourMarkupUSD: 80,
      wholesalerSellUSD: 700,
      wholesalerSuggestedMarkupUSD: 140,
      agencyRetailUSD: 840,
    },
    cancellationPolicy: {
      name: { "zh-CN": "约旦标准政策", en: "Jordan Standard Policy" },
      tiers: [
        { daysBefore: 30, penaltyPercent: 0 },
        { daysBefore: 15, penaltyPercent: 25 },
        { daysBefore: 7, penaltyPercent: 50 },
        { daysBefore: 0, penaltyPercent: 100 },
      ],
    },
    departures: [
      { id: "dep-001", itineraryId: "it-001", date: "2026-06-04", capacity: 40, booked: 36, status: "GUARANTEED" },
      { id: "dep-002", itineraryId: "it-001", date: "2026-06-06", capacity: 40, booked: 18, status: "OPEN" },
      { id: "dep-003", itineraryId: "it-001", date: "2026-06-11", capacity: 40, booked: 12, status: "OPEN" },
      { id: "dep-004", itineraryId: "it-001", date: "2026-07-09", capacity: 40, booked: 9, status: "OPEN" },
      { id: "dep-005", itineraryId: "it-001", date: "2026-09-10", capacity: 40, booked: 22, status: "GUARANTEED" },
      { id: "dep-006", itineraryId: "it-001", date: "2026-10-08", capacity: 40, booked: 14, status: "OPEN" },
    ],
    translations: {
      "zh-CN": { reviewed: true, reviewedAt: "2026-04-12" },
      en: { reviewed: true, reviewedAt: "2026-04-12" },
    },
    publishedToAgencies: ["ag-001", "ag-002", "ag-003", "ag-005", "ag-006", "ag-009", "ag-012"],
  },

  // ─── it-002 · Aqaba Eid Retreat (3D) · dmc-002 ───────────────
  {
    id: "it-002",
    dmcId: "dmc-002",
    title: {
      "zh-CN": "亚喀巴红海 3 日度假",
      en: "Aqaba Eid Retreat — Red Sea getaway",
    },
    subtitle: {
      "zh-CN": "红海新娘 · 南滩游泳 · Prince Boat 游艇可选",
      en: "Bride of the Red Sea · Southern Beach · optional Prince Boat yacht",
    },
    departureType: "FIXED",
    duration: { days: 3, nights: 2 },
    countries: ["JO"],
    cities: ["Amman", "Aqaba"],
    themes: ["family", "first-time"],
    heroImage: photos.aqaba.hero[0],
    gallery: photos.aqaba.gallery,
    highlights: {
      "zh-CN": [
        "三个集合点出发:Irbid 4:00、Zarqa 4:45、Amman 5:30",
        "Dragon Mall + Shweikh Mall + 中国村三大购物中心",
        "南滩游泳 + 自由购物时间",
        "可选最大游艇 Prince Boat / White Prince 出海",
        "现代空调旅游巴士,公司随团领队",
      ],
      en: [
        "Three pickup points — Irbid 4:00 AM, Zarqa 4:45 AM, Amman HQ 5:30 AM",
        "Dragon Mall + Shweikh Mall + Chinese Village shopping circuit",
        "Southern Beach swim + free shopping time",
        "Optional sail on Aqaba's largest tourist yacht (Prince Boat / White Prince)",
        "Modern air-conditioned coach, company tour leader",
      ],
    },
    days: [
      {
        day: 1,
        title: { "zh-CN": "安曼 / Zarqa / Irbid → 亚喀巴", en: "Amman / Zarqa / Irbid → Aqaba" },
        description: {
          "zh-CN":
            "凌晨多点集合(Irbid 4:00、Zarqa Bali 药店附近 4:45、Amman 总部 5:30),经沙漠公路 Al Qatranah 休息 20 分钟,抵达亚喀巴。参观 Dragon Mall(1 小时),酒店入住,自由活动。",
          en:
            "Multi-point dawn pickups (Irbid 4:00, Zarqa near Bali Pharmacy 4:45, Amman HQ 5:30) via the Desert Highway with a 20-min rest at Al Qatranah. Arrive Aqaba, 1-hour stop at Dragon Mall, hotel check-in, free time.",
        },
        activities: [
          { type: "TRANSFER", name: { "zh-CN": "凌晨集合发车", en: "Pre-dawn pickup & coach" } },
          { type: "ENTRANCE", name: { "zh-CN": "Dragon Mall", en: "Dragon Mall" } },
          { type: "ACCOMMODATION", name: { "zh-CN": "亚喀巴选定酒店", en: "Selected Aqaba hotel" } },
        ],
      },
      {
        day: 2,
        title: { "zh-CN": "亚喀巴海滩 / 自费游艇", en: "Aqaba Beach / Optional Yacht" },
        description: {
          "zh-CN":
            "酒店自助早餐后自由活动。集合前往南滩游泳,午餐自理。13:30 集合至 Al Thawra 广场,可选自费搭乘亚喀巴最大游艇出海。返回酒店住宿。",
          en:
            "Hotel buffet breakfast, morning at leisure. Group transfer to Southern Beach for swimming, lunch on own. 13:30 gather at Al Thawra Square for optional yacht trip on the largest tourist boat in Aqaba. Return to hotel.",
        },
        activities: [
          { type: "MEAL", name: { "zh-CN": "酒店自助早餐", en: "Hotel buffet breakfast" } },
          { type: "ACTIVITY", name: { "zh-CN": "南滩游泳", en: "Southern Beach swim" } },
          { type: "ACTIVITY", name: { "zh-CN": "可选游艇出海", en: "Optional yacht trip" } },
        ],
      },
      {
        day: 3,
        title: { "zh-CN": "亚喀巴 → 安曼", en: "Aqaba → Amman" },
        description: {
          "zh-CN":
            "酒店自助早餐,退房后前往市场购物。参观 Shweikh Mall 与中国村(1 小时),集合返程安曼。4 日选项可加一晚自由日。",
          en:
            "Hotel buffet breakfast, check-out, shopping in the markets. Visit Shweikh Mall and Chinese Village (1 hour), gather for the return trip to Amman. The 4-day option adds one extra free night in Aqaba.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "Shweikh Mall / 中国村", en: "Shweikh Mall / Chinese Village" } },
          { type: "TRANSFER", name: { "zh-CN": "返程安曼", en: "Return to Amman" } },
        ],
      },
    ],
    inclusions: {
      "zh-CN": [
        "亚喀巴选定酒店住宿",
        "酒店自助早餐",
        "现代空调旅游巴士",
        "Dragon Mall / Shweikh Mall / 中国村 / 南滩参观",
        "公司随团领队",
      ],
      en: [
        "Selected Aqaba hotel accommodation",
        "Hotel buffet breakfast daily",
        "Modern air-conditioned coach throughout",
        "Visits: Dragon Mall · Shweikh Mall · Chinese Village · Southern Beach",
        "Company representative / tour leader",
      ],
    },
    exclusions: {
      "zh-CN": [
        "午餐与晚餐",
        "可选游艇:White Prince 含午餐 16 JOD / 不含 12 JOD",
        "Eilat 游艇 2 小时 含午餐 20 / 不含 17 JOD",
        "潜水艇 + 珊瑚保护区 含午餐 25 / 不含 20 JOD",
        "景点门票、小费、个人消费",
      ],
      en: [
        "Lunch and dinner not included",
        "Optional White Prince yacht: 16 JOD with lunch / 12 JOD without",
        "Eilat-based 2-hour boat: 20 / 17 JOD with/without lunch",
        "Submarine + coral reserve fish watching: 25 / 20 JOD",
        "Site entry fees, tips, personal expenses",
      ],
    },
    pricing: {
      sourceCurrency: "USD",
      bands: [
        { paxRange: "2-3", minPax: 2, maxPax: 3, perPaxUSD: 410 },
        { paxRange: "4-7", minPax: 4, maxPax: 7, perPaxUSD: 340 },
        { paxRange: "8-19", minPax: 8, maxPax: 19, perPaxUSD: 280 },
        { paxRange: "20+", minPax: 20, maxPax: 45, perPaxUSD: 230 },
      ],
      singleSupplementUSD: 90,
      seasons: [
        { name: "regular", dateRange: "2026-04-01..2026-05-31", multiplier: 1.0 },
        { name: "eid-peak", dateRange: "2026-06-01..2026-06-30", multiplier: 1.4 },
        { name: "summer", dateRange: "2026-07-01..2026-08-31", multiplier: 0.9 },
      ],
    },
    marginLayers: {
      dmcNetPerPaxUSD: 280,
      ourMarkupUSD: 40,
      wholesalerSellUSD: 320,
      wholesalerSuggestedMarkupUSD: 60,
      agencyRetailUSD: 380,
    },
    cancellationPolicy: {
      name: { "zh-CN": "亚喀巴节假日政策", en: "Aqaba Holiday Policy" },
      tiers: [
        { daysBefore: 15, penaltyPercent: 0 },
        { daysBefore: 7, penaltyPercent: 35 },
        { daysBefore: 0, penaltyPercent: 100 },
      ],
    },
    departures: [
      { id: "dep-101", itineraryId: "it-002", date: "2026-06-06", capacity: 45, booked: 42, status: "GUARANTEED" },
      { id: "dep-102", itineraryId: "it-002", date: "2026-06-13", capacity: 45, booked: 28, status: "GUARANTEED" },
      { id: "dep-103", itineraryId: "it-002", date: "2026-06-20", capacity: 45, booked: 16, status: "OPEN" },
      { id: "dep-104", itineraryId: "it-002", date: "2026-07-04", capacity: 45, booked: 11, status: "OPEN" },
      { id: "dep-105", itineraryId: "it-002", date: "2026-09-12", capacity: 45, booked: 6, status: "OPEN" },
    ],
    translations: {
      "zh-CN": { reviewed: true, reviewedAt: "2026-04-15" },
      en: { reviewed: true, reviewedAt: "2026-04-15" },
    },
    publishedToAgencies: ["ag-001", "ag-003", "ag-005", "ag-006", "ag-009", "ag-012", "ag-013"],
  },

  // ─── it-003 · Grand Morocco Tour (12D) · dmc-003 ───────────────
  {
    id: "it-003",
    dmcId: "dmc-003",
    title: {
      "zh-CN": "摩洛哥大环线 12 日深度游",
      en: "Grand Morocco Tour — 12 days, 11 nights",
    },
    subtitle: {
      "zh-CN": "卡萨布兰卡·拉巴特·丹吉尔·舍夫沙万·非斯·撒哈拉·瓦尔扎扎特·马拉喀什",
      en: "Casablanca · Rabat · Tangier · Chefchaouen · Fes · Sahara · Ouarzazate · Marrakech",
    },
    departureType: "FIXED",
    duration: { days: 12, nights: 11 },
    countries: ["MA"],
    cities: [
      "Casablanca",
      "Rabat",
      "Tangier",
      "Chefchaouen",
      "Fez",
      "Merzouga",
      "Ouarzazate",
      "Marrakech",
    ],
    themes: ["cultural", "luxury", "first-time", "adventure"],
    heroImage: photos.ouarzazate.hero[0],
    gallery: [
      ...photos.casablanca.gallery.slice(0, 2),
      ...photos.chefchaouen.gallery.slice(0, 2),
      ...photos.fez.gallery.slice(0, 1),
      ...photos.sahara.gallery.slice(0, 3),
      ...photos.ouarzazate.gallery.slice(0, 2),
      ...photos.marrakech.gallery.slice(0, 2),
    ],
    highlights: {
      "zh-CN": [
        "覆盖摩洛哥四大皇城 + 蓝白小镇 + 撒哈拉沙漠豪华营地",
        "梅尔祖卡 4×4 日出体验 + 篝火晚餐 + Gnawa 民俗表演",
        "Aït Ben Haddou 联合国教科文世遗 + Atlas 电影城",
        "非斯里亚德特色晚餐 + 千年皮革染坊",
        "全程 4 星酒店住宿 + 持牌中阿翻译导游",
      ],
      en: [
        "Four imperial cities + Chefchaouen blue town + luxury Sahara desert camp",
        "Merzouga 4×4 sunrise experience + welcome dinner with Gnawa folklore show",
        "Aït Ben Haddou UNESCO kasbah + Atlas Film Studios",
        "Riad-style traditional dinner in Fes + thousand-year-old tanneries",
        "4-star hotels throughout + licensed Mandarin/Arabic guide",
      ],
    },
    days: [
      {
        day: 1,
        title: { "zh-CN": "抵达卡萨布兰卡", en: "Arrival Casablanca" },
        description: {
          "zh-CN": "抵达穆罕默德五世国际机场,迎接服务,送往酒店办理入住。",
          en: "Arrival at Mohammed V International Airport, meet & assist, transfer to hotel, check-in.",
        },
        activities: [
          { type: "TRANSFER", name: { "zh-CN": "机场接机", en: "Airport pickup" } },
          { type: "ACCOMMODATION", name: { "zh-CN": "卡萨布兰卡 4 星酒店", en: "4-star Casablanca hotel" } },
        ],
      },
      {
        day: 2,
        title: { "zh-CN": "卡萨布兰卡 → 拉巴特", en: "Casablanca → Rabat" },
        description: {
          "zh-CN":
            "上午游览哈桑二世大清真寺(世界最高宣礼塔),驱车前往首都拉巴特,游览 Chellah、Udayas 城堡、老麦地那、哈桑塔与穆罕默德五世陵墓。",
          en:
            "Morning historical tour of Hassan II Mosque (iconic landmark with the world's tallest minaret). Transfer to Rabat — Chellah, Kasbah of the Udayas, old medina, Hassan Tower, and the Mohammed V Mausoleum.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "哈桑二世大清真寺", en: "Hassan II Mosque" } },
          { type: "ENTRANCE", name: { "zh-CN": "Udayas 城堡", en: "Kasbah of the Udayas" } },
        ],
      },
      {
        day: 3,
        title: { "zh-CN": "拉巴特 → Asilah → 丹吉尔", en: "Rabat → Asilah → Tangier" },
        description: {
          "zh-CN":
            "前往丹吉尔,中途短停 Asilah 艺术海港小镇。抵达后游览老麦地那、Cap Spartel(大西洋与地中海交汇)与海格力斯洞穴。",
          en:
            "Drive to Tangier with a short stop at the artistic seaside town of Asilah. Visit the old medina, Cap Spartel (where Atlantic meets Mediterranean), and Hercules Caves.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "海格力斯洞穴", en: "Hercules Caves" } },
          { type: "ACCOMMODATION", name: { "zh-CN": "丹吉尔酒店", en: "Tangier hotel" } },
        ],
      },
      {
        day: 4,
        title: { "zh-CN": "舍夫沙万蓝色小镇", en: "Chefchaouen — the Blue City" },
        description: {
          "zh-CN":
            "驱车前往舍夫沙万。漫步蓝色街道,拍照打卡,游览 Outa Hamam 广场与 15 世纪 Kasbah 城堡。酒店入住。",
          en:
            "Transfer to Chefchaouen. Walk the famous blue streets, photo stops, Outa Hamam Square and the 15th-century Kasbah fortress. Hotel check-in.",
        },
        activities: [
          { type: "GUIDE", name: { "zh-CN": "蓝城漫步", en: "Blue medina walk" } },
          { type: "ENTRANCE", name: { "zh-CN": "Kasbah 城堡", en: "Chefchaouen Kasbah" } },
        ],
      },
      {
        day: 5,
        title: { "zh-CN": "Volubilis → Meknes → 非斯", en: "Volubilis → Meknes → Fes" },
        description: {
          "zh-CN":
            "参观 Volubilis 罗马遗迹(古城 Walili),继续前往 Meknes:老麦地那、Moulay Ismail 陵墓、Bab Mansour 凯旋门、El Hedim 广场。傍晚抵达非斯。",
          en:
            "Visit Volubilis (Roman ruins of Walili). Continue to Meknes — old medina, Moulay Ismail Mausoleum, Bab Mansour gate, El Hedim Square. Arrive Fes by evening.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "Volubilis 罗马遗迹", en: "Volubilis Roman ruins" } },
          { type: "ENTRANCE", name: { "zh-CN": "Bab Mansour 凯旋门", en: "Bab Mansour gate" } },
        ],
      },
      {
        day: 6,
        title: { "zh-CN": "非斯老城深度游", en: "Fes Medina Deep Dive" },
        description: {
          "zh-CN":
            "全日游览 Fes el-Bali 老麦地那(联合国教科文世界遗产):Al Quaraouiyine 大学(世界最古老大学之一)、Nejjarine 喷泉、Bou Inania 神学院(13 世纪)、Batha 艺术博物馆。傍晚特色里亚德摩洛哥晚餐。",
          en:
            "Full day in Fes el-Bali (UNESCO World Heritage): Al Quaraouiyine University, Nejjarine Fountain, the 13th-century Bou Inania Madrasa, and Batha Palace Museum of Arts. Evening special dinner at a traditional Riad.",
        },
        activities: [
          { type: "GUIDE", name: { "zh-CN": "非斯老城讲解", en: "Fes medina guided" } },
          { type: "ENTRANCE", name: { "zh-CN": "Bou Inania 神学院", en: "Bou Inania Madrasa" } },
          { type: "MEAL", name: { "zh-CN": "里亚德特色晚餐", en: "Riad dinner experience" } },
        ],
      },
      {
        day: 7,
        title: { "zh-CN": "非斯 → 梅尔祖卡撒哈拉", en: "Fes → Merzouga (Sahara)" },
        description: {
          "zh-CN":
            "经 Ifrane 瑞士风小镇与 Errachidia 抵达梅尔祖卡,换乘 4×4 越野车进入沙漠豪华营地。摩洛哥式欢迎仪式,晚餐 + Gnawa 民俗表演。营地住宿。",
          en:
            "Across the Atlas via Swiss-style Ifrane and Errachidia to Merzouga. Switch to 4×4 vehicles to a luxury desert camp. Moroccan welcome ceremony, dinner with Gnawa folklore show. Overnight in the Sahara.",
        },
        activities: [
          { type: "TRANSFER", name: { "zh-CN": "4×4 越野进沙漠", en: "4×4 desert transfer" } },
          { type: "ACCOMMODATION", name: { "zh-CN": "梅尔祖卡豪华营地", en: "Merzouga luxury camp" } },
          { type: "ACTIVITY", name: { "zh-CN": "Gnawa 民俗表演", en: "Gnawa folklore show" } },
        ],
      },
      {
        day: 8,
        title: { "zh-CN": "梅尔祖卡 → Tinghir → 瓦尔扎扎特", en: "Merzouga → Tinghir → Ouarzazate" },
        description: {
          "zh-CN":
            "清晨 4×4 沙丘日出体验,营地早餐后驱车 Tinghir,游览 Todgha 峡谷(摩洛哥最高最窄峡谷)。继续前往瓦尔扎扎特,晚餐 + 住宿。",
          en:
            "Early morning 4×4 sunrise over the dunes, camp breakfast, then drive to Tinghir — Todgha Gorges (the tallest and narrowest in Morocco). Continue to Ouarzazate; dinner and overnight.",
        },
        activities: [
          { type: "ACTIVITY", name: { "zh-CN": "沙丘日出 4×4", en: "Sunrise 4×4 in dunes" } },
          { type: "ENTRANCE", name: { "zh-CN": "Todgha 峡谷", en: "Todgha Gorges" } },
        ],
      },
      {
        day: 9,
        title: { "zh-CN": "瓦尔扎扎特 → Aït Ben Haddou → 马拉喀什", en: "Ouarzazate → Aït Ben Haddou → Marrakech" },
        description: {
          "zh-CN":
            "瓦尔扎扎特短游 + Atlas 电影城参观。途经 Aït Ben Haddou(联合国教科文世遗 Kasbah,《角斗士》取景地),继续前往红城马拉喀什入住。",
          en:
            "Short tour of Ouarzazate + Atlas Film Studios. En route stop at Aït Ben Haddou (UNESCO World Heritage kasbah, filming location for Gladiator). Continue to the Red City of Marrakech, hotel check-in.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "Atlas 电影城", en: "Atlas Film Studios" } },
          { type: "ENTRANCE", name: { "zh-CN": "Aït Ben Haddou", en: "Aït Ben Haddou kasbah" } },
        ],
      },
      {
        day: 10,
        title: { "zh-CN": "马拉喀什导游游览", en: "Marrakech Guided Tour" },
        description: {
          "zh-CN":
            "马若雷勒花园(YSL 故居)、库图比亚清真寺、Ben Youssef 神学院、Bahia 宫、Badi 宫。马拉喀什麦地那马车游 + Jemaa el-Fnaa 不眠广场自由活动。",
          en:
            "Majorelle Garden (YSL's home), Koutoubia Mosque, Ben Youssef Madrasa, Bahia Palace, Badi Palace. Calèche horse-drawn carriage around the medina + free time at Jemaa el-Fnaa night square.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "马若雷勒花园", en: "Majorelle Garden" } },
          { type: "ACTIVITY", name: { "zh-CN": "马车游麦地那", en: "Calèche tour" } },
          { type: "MEAL", name: { "zh-CN": "不眠广场晚餐", en: "Jemaa el-Fnaa dinner" } },
        ],
      },
      {
        day: 11,
        title: { "zh-CN": "马拉喀什自由日", en: "Marrakech Free Day" },
        description: {
          "zh-CN": "全日自由活动:可购物、SPA、Atlas 山区一日游、Agafay 沙漠日落等。",
          en: "Full day for leisure — shopping, hammam spa, Atlas Mountains day trip, Agafay desert sunset, etc.",
        },
        activities: [
          { type: "ACTIVITY", name: { "zh-CN": "自由日 / 自费", en: "Leisure / optional" } },
        ],
      },
      {
        day: 12,
        title: { "zh-CN": "返程", en: "Departure" },
        description: {
          "zh-CN": "酒店早餐,根据航班送往马拉喀什或卡萨布兰卡机场。",
          en: "Hotel breakfast, transfer to Marrakech or Casablanca airport per flight schedule.",
        },
        activities: [
          { type: "TRANSFER", name: { "zh-CN": "机场送机", en: "Airport drop-off" } },
        ],
      },
    ],
    inclusions: {
      "zh-CN": [
        "舒适旅游车交通 + 持牌中阿/中英翻译导游全程",
        "4 星酒店住宿(卡萨 1、拉巴特 1、丹吉尔 1、舍夫沙万 1、非斯 2、梅尔祖卡 1、瓦尔扎扎特 1、马拉喀什 3)",
        "梅尔祖卡含晚餐 + 早餐 + Gnawa 民俗",
        "非斯里亚德特色晚餐",
        "Majorelle 花园 + Volubilis 门票 + 马拉喀什马车 + 梅尔祖卡 4×4 日出",
        "机场接送 + 后勤服务",
      ],
      en: [
        "Comfortable touring vehicle + licensed Mandarin/Arabic guide throughout",
        "4-star hotels — Casablanca 1, Rabat 1, Tangier 1, Chefchaouen 1, Fes 2, Merzouga camp 1, Ouarzazate 1, Marrakech 3",
        "Merzouga: breakfast + dinner + Gnawa folklore",
        "Special Riad dinner in Fes",
        "Majorelle Garden + Volubilis tickets + Marrakech calèche + Merzouga 4×4 sunrise",
        "Airport meet & assist + logistics",
      ],
    },
    exclusions: {
      "zh-CN": [
        "国际机票",
        "正餐与晚餐(除标注外)",
        "自由日内城市内自费交通",
        "个人消费",
        "其他未列明项目",
      ],
      en: [
        "International flights",
        "Lunch and dinner (except where stated)",
        "Free-day in-city transfers for personal shopping",
        "Personal expenses",
        "Anything not mentioned in inclusions",
      ],
    },
    pricing: {
      sourceCurrency: "EUR",
      bands: [
        { paxRange: "2-3", minPax: 2, maxPax: 3, perPaxUSD: 2480 },
        { paxRange: "4-5", minPax: 4, maxPax: 5, perPaxUSD: 2180 },
        { paxRange: "6-9", minPax: 6, maxPax: 9, perPaxUSD: 1880 },
        { paxRange: "10+", minPax: 10, maxPax: 24, perPaxUSD: 1680 },
      ],
      singleSupplementUSD: 620,
      seasons: [
        { name: "summer", dateRange: "2026-06-15..2026-08-31", multiplier: 1.0 },
        { name: "shoulder", dateRange: "2026-03-01..2026-06-14", multiplier: 1.2 },
        { name: "peak", dateRange: "2026-09-01..2026-11-30", multiplier: 1.4 },
      ],
    },
    marginLayers: {
      dmcNetPerPaxUSD: 1880,
      ourMarkupUSD: 260,
      wholesalerSellUSD: 2140,
      wholesalerSuggestedMarkupUSD: 420,
      agencyRetailUSD: 2560,
    },
    cancellationPolicy: {
      name: { "zh-CN": "摩洛哥标准政策", en: "Morocco Standard Policy" },
      tiers: [
        { daysBefore: 60, penaltyPercent: 0 },
        { daysBefore: 30, penaltyPercent: 25 },
        { daysBefore: 15, penaltyPercent: 50 },
        { daysBefore: 7, penaltyPercent: 75 },
        { daysBefore: 0, penaltyPercent: 100 },
      ],
    },
    departures: [
      { id: "dep-201", itineraryId: "it-003", date: "2026-09-12", capacity: 18, booked: 14, status: "OPEN" },
      { id: "dep-202", itineraryId: "it-003", date: "2026-10-03", capacity: 18, booked: 18, status: "FULL" },
      { id: "dep-203", itineraryId: "it-003", date: "2026-10-24", capacity: 18, booked: 11, status: "OPEN" },
      { id: "dep-204", itineraryId: "it-003", date: "2026-11-14", capacity: 18, booked: 16, status: "GUARANTEED" },
    ],
    translations: {
      "zh-CN": { reviewed: true, reviewedAt: "2026-04-18" },
      en: { reviewed: true, reviewedAt: "2026-04-18" },
    },
    publishedToAgencies: ["ag-001", "ag-002", "ag-003", "ag-005", "ag-006", "ag-009", "ag-012", "ag-013"],
  },

  // ─── it-004 · North Morocco Discovery (8D) · dmc-005 ──────────
  {
    id: "it-004",
    dmcId: "dmc-005",
    title: {
      "zh-CN": "摩洛哥北部精华 8 日",
      en: "North Morocco Discovery — 8 days, 7 nights",
    },
    subtitle: {
      "zh-CN": "卡萨布兰卡 · 拉巴特 · 丹吉尔 · 蓝白小镇 · Akchour 瀑布 · Volubilis",
      en: "Casablanca · Rabat · Tangier · Chefchaouen · Akchour Falls · Volubilis",
    },
    departureType: "FIXED",
    duration: { days: 8, nights: 7 },
    countries: ["MA"],
    cities: ["Casablanca", "Rabat", "Tangier", "Tetouan", "Chefchaouen", "Meknes"],
    themes: ["cultural", "adventure", "first-time"],
    heroImage: photos.chefchaouen.hero[0],
    gallery: [
      ...photos.chefchaouen.gallery.slice(0, 3),
      ...photos.casablanca.gallery.slice(0, 2),
      ...photos.tangier.gallery,
      ...photos.volubilis.gallery,
    ],
    highlights: {
      "zh-CN": [
        "聚焦摩洛哥北部最美城市与自然景观",
        "蓝白山城舍夫沙万 2 晚住宿,深度漫游",
        "Akchour 瀑布徒步自然体验",
        "Volubilis 罗马遗迹联合国教科文世遗",
        "丹吉尔 Cap Spartel 大西洋与地中海分界点",
      ],
      en: [
        "Focused circuit of northern Morocco's most beautiful cities and nature",
        "Two nights in the blue mountain town of Chefchaouen for deeper exploration",
        "Hiking experience at Akchour Falls",
        "Volubilis Roman ruins UNESCO World Heritage",
        "Cap Spartel in Tangier — where Atlantic meets Mediterranean",
      ],
    },
    days: [
      {
        day: 1,
        title: { "zh-CN": "抵达卡萨布兰卡", en: "Arrival Casablanca" },
        description: {
          "zh-CN": "抵达穆罕默德五世国际机场,迎接送往酒店入住。",
          en: "Arrival at Mohammed V Airport, meet & assist transfer to hotel.",
        },
        activities: [
          { type: "TRANSFER", name: { "zh-CN": "机场接机", en: "Airport pickup" } },
          { type: "ACCOMMODATION", name: { "zh-CN": "卡萨布兰卡 4 星酒店", en: "4-star Casablanca hotel" } },
        ],
      },
      {
        day: 2,
        title: { "zh-CN": "卡萨布兰卡 → 拉巴特", en: "Casablanca → Rabat" },
        description: {
          "zh-CN": "哈桑二世大清真寺外观参观,前往首都拉巴特城市游览,夜宿拉巴特。",
          en: "Visit Hassan II Mosque exterior, then transfer to the capital Rabat for a city tour, overnight in Rabat.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "哈桑二世大清真寺", en: "Hassan II Mosque" } },
        ],
      },
      {
        day: 3,
        title: { "zh-CN": "Asilah → 丹吉尔", en: "Asilah → Tangier" },
        description: {
          "zh-CN": "经 Asilah 短停,抵达丹吉尔游览老麦地那、Cap Spartel、海格力斯洞穴,夜宿丹吉尔。",
          en: "Stop in Asilah, then Tangier — old medina, Cap Spartel, Hercules Caves. Overnight Tangier.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "海格力斯洞穴", en: "Hercules Caves" } },
        ],
      },
      {
        day: 4,
        title: { "zh-CN": "Tetouan 自由日", en: "Tetouan Free Day" },
        description: {
          "zh-CN":
            "前往 Tetouan,这座白色山城被列为联合国教科文世遗。自由探索老城与艺术博物馆。",
          en:
            "Transfer to Tetouan, a UNESCO-listed white mountain town. Free time to explore the old medina and art museum.",
        },
        activities: [
          { type: "ACCOMMODATION", name: { "zh-CN": "Tetouan 酒店", en: "Tetouan hotel" } },
        ],
      },
      {
        day: 5,
        title: { "zh-CN": "舍夫沙万蓝白小镇", en: "Chefchaouen Blue Town" },
        description: {
          "zh-CN":
            "驱车前往舍夫沙万,导游带领游览蓝色街道、Outa Hamam 广场、Kasbah 城堡。",
          en:
            "Drive to Chefchaouen. Guided tour of the blue streets, Outa Hamam Square, and the Kasbah fortress.",
        },
        activities: [
          { type: "GUIDE", name: { "zh-CN": "蓝城讲解", en: "Blue town guided tour" } },
          { type: "ENTRANCE", name: { "zh-CN": "Kasbah 城堡", en: "Chefchaouen Kasbah" } },
        ],
      },
      {
        day: 6,
        title: { "zh-CN": "Akchour 瀑布徒步", en: "Akchour Falls Hike" },
        description: {
          "zh-CN":
            "前往 Akchour 瀑布(Rif 山脉中),进行轻松徒步与自然体验。傍晚返回舍夫沙万。",
          en:
            "Day excursion to Akchour Falls in the Rif Mountains for an easy hike and nature experience. Return to Chefchaouen by evening.",
        },
        activities: [
          { type: "ACTIVITY", name: { "zh-CN": "Akchour 瀑布徒步", en: "Akchour Falls hike" } },
        ],
      },
      {
        day: 7,
        title: { "zh-CN": "Volubilis → Meknes", en: "Volubilis → Meknes" },
        description: {
          "zh-CN":
            "参观 Volubilis 罗马遗迹 → Meknes 麦地那:Moulay Ismail 陵墓 + Bab Mansour 凯旋门。夜宿 Meknes。",
          en:
            "Volubilis Roman ruins → Meknes: Moulay Ismail Mausoleum + Bab Mansour gate. Overnight in Meknes.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "Volubilis", en: "Volubilis Roman ruins" } },
          { type: "ENTRANCE", name: { "zh-CN": "Bab Mansour", en: "Bab Mansour" } },
        ],
      },
      {
        day: 8,
        title: { "zh-CN": "返程卡萨布兰卡", en: "Depart from Casablanca" },
        description: {
          "zh-CN": "酒店早餐,送往卡萨布兰卡机场。",
          en: "Hotel breakfast, transfer to Casablanca airport for departure.",
        },
        activities: [
          { type: "TRANSFER", name: { "zh-CN": "机场送机", en: "Airport drop-off" } },
        ],
      },
    ],
    inclusions: {
      "zh-CN": [
        "舒适旅游车交通",
        "持牌导游",
        "机场接送服务",
        "4 星酒店住宿(含早餐)",
        "Volubilis 门票",
      ],
      en: [
        "Comfortable touring vehicle",
        "Licensed guide",
        "Meet & assist airport transfers",
        "4-star hotels with breakfast",
        "Entry fee to Volubilis",
      ],
    },
    exclusions: {
      "zh-CN": ["午餐与晚餐", "自费活动", "个人消费"],
      en: ["Lunch and dinner", "Optional activities", "Personal expenses"],
    },
    pricing: {
      sourceCurrency: "EUR",
      bands: [
        { paxRange: "2-3", minPax: 2, maxPax: 3, perPaxUSD: 1680 },
        { paxRange: "4-7", minPax: 4, maxPax: 7, perPaxUSD: 1420 },
        { paxRange: "8-15", minPax: 8, maxPax: 15, perPaxUSD: 1220 },
        { paxRange: "16+", minPax: 16, maxPax: 28, perPaxUSD: 1080 },
      ],
      singleSupplementUSD: 420,
      seasons: [
        { name: "summer", dateRange: "2026-06-15..2026-08-31", multiplier: 1.0 },
        { name: "shoulder", dateRange: "2026-03-01..2026-06-14", multiplier: 1.2 },
        { name: "peak", dateRange: "2026-09-01..2026-11-30", multiplier: 1.35 },
      ],
    },
    marginLayers: {
      dmcNetPerPaxUSD: 1220,
      ourMarkupUSD: 180,
      wholesalerSellUSD: 1400,
      wholesalerSuggestedMarkupUSD: 280,
      agencyRetailUSD: 1680,
    },
    cancellationPolicy: {
      name: { "zh-CN": "摩洛哥标准政策", en: "Morocco Standard Policy" },
      tiers: [
        { daysBefore: 45, penaltyPercent: 0 },
        { daysBefore: 21, penaltyPercent: 30 },
        { daysBefore: 7, penaltyPercent: 70 },
        { daysBefore: 0, penaltyPercent: 100 },
      ],
    },
    departures: [
      { id: "dep-301", itineraryId: "it-004", date: "2026-09-15", capacity: 22, booked: 14, status: "OPEN" },
      { id: "dep-302", itineraryId: "it-004", date: "2026-10-13", capacity: 22, booked: 18, status: "GUARANTEED" },
      { id: "dep-303", itineraryId: "it-004", date: "2026-11-10", capacity: 22, booked: 8, status: "OPEN" },
    ],
    translations: {
      "zh-CN": { reviewed: true, reviewedAt: "2026-04-22" },
      en: { reviewed: true, reviewedAt: "2026-04-22" },
    },
    publishedToAgencies: ["ag-001", "ag-003", "ag-006", "ag-009", "ag-013"],
  },

  // ─── it-005 · Heart of Morocco (9D · ON_DEMAND FIT) · dmc-004 ──
  {
    id: "it-005",
    dmcId: "dmc-004",
    title: {
      "zh-CN": "摩洛哥心脏地带 9 日 · 私家定制",
      en: "Heart of Morocco — 9 days, 8 nights (private FIT)",
    },
    subtitle: {
      "zh-CN": "马拉喀什 · Ouzoud 瀑布 · 卡萨 · 拉巴特 · Meknes · Volubilis · 非斯",
      en: "Marrakech · Ouzoud Falls · Casablanca · Rabat · Meknes · Volubilis · Fes",
    },
    departureType: "ON_DEMAND",
    duration: { days: 9, nights: 8 },
    countries: ["MA"],
    cities: ["Marrakech", "Beni Mellal", "Casablanca", "Rabat", "Meknes", "Fez"],
    themes: ["cultural", "family", "first-time"],
    heroImage: photos.marrakech.hero[0],
    gallery: [
      ...photos.marrakech.gallery.slice(0, 2),
      ...photos.ouzoud.gallery,
      ...photos.casablanca.gallery.slice(0, 1),
      ...photos.fez.gallery,
      ...photos.volubilis.gallery,
    ],
    highlights: {
      "zh-CN": [
        "穿越摩洛哥中部 — 瀑布、皇城与深度文化遗产",
        "马拉喀什深度:Majorelle 花园 + Koutoubia + Ben Youssef + Bahia + Badi 宫 + 马车",
        "Ouzoud 瀑布 + Bin El Ouidane 湖泊游船",
        "非斯老城里亚德特色晚餐",
        "Volubilis 罗马遗迹联合国教科文世遗",
      ],
      en: [
        "A journey through central Morocco — waterfalls, imperial cities, and deep heritage",
        "Marrakech deep dive — Majorelle Garden + Koutoubia + Ben Youssef + Bahia + Badi + calèche",
        "Ouzoud Falls + boat ride on Bin El Ouidane Lake",
        "Special Riad dinner in Fes old medina",
        "Volubilis Roman ruins UNESCO World Heritage",
      ],
    },
    days: [
      {
        day: 1,
        title: { "zh-CN": "抵达马拉喀什", en: "Arrival Marrakech" },
        description: {
          "zh-CN": "抵达马拉喀什机场,送往酒店入住,自由活动。",
          en: "Arrive Marrakech airport, transfer to hotel, leisure time.",
        },
        activities: [
          { type: "TRANSFER", name: { "zh-CN": "机场接机", en: "Airport pickup" } },
          { type: "ACCOMMODATION", name: { "zh-CN": "马拉喀什 4 星酒店", en: "4-star Marrakech hotel" } },
        ],
      },
      {
        day: 2,
        title: { "zh-CN": "马拉喀什全日导游", en: "Marrakech Full-Day Guided" },
        description: {
          "zh-CN":
            "马若雷勒花园 → Koutoubia 清真寺 → Ben Youssef 神学院 → Bahia 宫 → Badi 宫 → 马车游麦地那 → Jemaa el-Fnaa 不眠广场。",
          en:
            "Majorelle Garden → Koutoubia Mosque → Ben Youssef Madrasa → Bahia Palace → Badi Palace → calèche tour around the medina → Jemaa el-Fnaa night square.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "马若雷勒花园", en: "Majorelle Garden" } },
          { type: "ENTRANCE", name: { "zh-CN": "Bahia 宫", en: "Bahia Palace" } },
          { type: "ACTIVITY", name: { "zh-CN": "马车游麦地那", en: "Calèche medina tour" } },
        ],
      },
      {
        day: 3,
        title: { "zh-CN": "Ouzoud 瀑布 → Bin El Ouidane → Beni Mellal", en: "Ouzoud Falls → Bin El Ouidane → Beni Mellal" },
        description: {
          "zh-CN":
            "前往 Ouzoud 瀑布(摩洛哥最高瀑布之一)→ Bin El Ouidane 湖泊游船 → Beni Mellal 入住。",
          en:
            "Drive to Ouzoud Falls (one of Morocco's tallest) → boat ride on Bin El Ouidane Lake → overnight Beni Mellal.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "Ouzoud 瀑布", en: "Ouzoud Falls" } },
          { type: "ACTIVITY", name: { "zh-CN": "Bin El Ouidane 游船", en: "Bin El Ouidane boat ride" } },
        ],
      },
      {
        day: 4,
        title: { "zh-CN": "Beni Mellal → 卡萨布兰卡", en: "Beni Mellal → Casablanca" },
        description: {
          "zh-CN":
            "前往卡萨布兰卡,Morocco Mall 购物 + Corniche 海滨自由活动。",
          en:
            "Transfer to Casablanca, free time at Morocco Mall and the Corniche seafront.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "Morocco Mall", en: "Morocco Mall" } },
        ],
      },
      {
        day: 5,
        title: { "zh-CN": "卡萨布兰卡 → 拉巴特", en: "Casablanca → Rabat" },
        description: {
          "zh-CN":
            "上午哈桑二世大清真寺(地标),下午拉巴特 — Chellah、Kasbah of the Udayas、哈桑塔。",
          en:
            "Morning Hassan II Mosque, then Rabat — Chellah, Kasbah of the Udayas, Hassan Tower.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "哈桑二世大清真寺", en: "Hassan II Mosque" } },
          { type: "ENTRANCE", name: { "zh-CN": "Chellah", en: "Chellah" } },
        ],
      },
      {
        day: 6,
        title: { "zh-CN": "Meknes → Volubilis → 非斯", en: "Meknes → Volubilis → Fes" },
        description: {
          "zh-CN":
            "Meknes:Moulay Ismail 陵墓、Bab Mansour;Volubilis 罗马遗迹;傍晚抵达非斯。",
          en:
            "Meknes: Moulay Ismail Mausoleum, Bab Mansour; Volubilis Roman ruins; arrive Fes by evening.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "Volubilis", en: "Volubilis Roman ruins" } },
        ],
      },
      {
        day: 7,
        title: { "zh-CN": "非斯导游游览", en: "Fes Guided Tour" },
        description: {
          "zh-CN":
            "非斯麦地那:Bou Inania 神学院、Nejjarine 喷泉、皮革染坊。傍晚里亚德特色摩洛哥晚餐。",
          en:
            "Fes medina: Bou Inania Madrasa, Nejjarine Fountain, leather tanneries. Evening Riad special dinner.",
        },
        activities: [
          { type: "GUIDE", name: { "zh-CN": "非斯老城导游", en: "Fes medina guided" } },
          { type: "MEAL", name: { "zh-CN": "里亚德特色晚餐", en: "Riad special dinner" } },
        ],
      },
      {
        day: 8,
        title: { "zh-CN": "非斯自由日", en: "Fes Free Day" },
        description: {
          "zh-CN": "全日自由活动 — 购物、SPA、陶器作坊或自费深度游。",
          en: "Free day — shopping, hammam spa, pottery workshop, or optional deep-dive tours.",
        },
        activities: [
          { type: "ACTIVITY", name: { "zh-CN": "自由日", en: "Leisure day" } },
        ],
      },
      {
        day: 9,
        title: { "zh-CN": "返程", en: "Departure" },
        description: {
          "zh-CN": "送往非斯或卡萨布兰卡机场。",
          en: "Transfer to Fes or Casablanca airport.",
        },
        activities: [
          { type: "TRANSFER", name: { "zh-CN": "机场送机", en: "Airport drop-off" } },
        ],
      },
    ],
    inclusions: {
      "zh-CN": [
        "4 星酒店住宿(含早餐)",
        "舒适旅游车交通",
        "持牌导游",
        "Majorelle 花园 + Volubilis 门票",
        "马拉喀什马车游",
        "非斯里亚德特色晚餐",
      ],
      en: [
        "4-star hotels with breakfast",
        "Comfortable touring vehicle",
        "Licensed guide",
        "Majorelle Garden + Volubilis tickets",
        "Marrakech calèche ride",
        "Special Riad dinner in Fes",
      ],
    },
    exclusions: {
      "zh-CN": ["午餐与晚餐(除标注外)", "自费项目", "个人消费"],
      en: ["Lunch and dinner (except where stated)", "Optional tours", "Personal expenses"],
    },
    pricing: {
      sourceCurrency: "EUR",
      bands: [
        { paxRange: "2-3", minPax: 2, maxPax: 3, perPaxUSD: 1980 },
        { paxRange: "4-7", minPax: 4, maxPax: 7, perPaxUSD: 1680 },
        { paxRange: "8-15", minPax: 8, maxPax: 15, perPaxUSD: 1450 },
        { paxRange: "16+", minPax: 16, maxPax: 28, perPaxUSD: 1280 },
      ],
      singleSupplementUSD: 480,
      seasons: [
        { name: "summer", dateRange: "2026-06-15..2026-08-31", multiplier: 1.0 },
        { name: "shoulder", dateRange: "2026-03-01..2026-06-14", multiplier: 1.2 },
        { name: "peak", dateRange: "2026-09-01..2026-11-30", multiplier: 1.35 },
      ],
    },
    marginLayers: {
      dmcNetPerPaxUSD: 1450,
      ourMarkupUSD: 200,
      wholesalerSellUSD: 1650,
      wholesalerSuggestedMarkupUSD: 320,
      agencyRetailUSD: 1970,
    },
    cancellationPolicy: {
      name: { "zh-CN": "摩洛哥标准政策", en: "Morocco Standard Policy" },
      tiers: [
        { daysBefore: 60, penaltyPercent: 0 },
        { daysBefore: 30, penaltyPercent: 25 },
        { daysBefore: 15, penaltyPercent: 50 },
        { daysBefore: 7, penaltyPercent: 75 },
        { daysBefore: 0, penaltyPercent: 100 },
      ],
    },
    // ON_DEMAND: no fixed departures; weekly rolling capacity managed in allotments.
    departures: [],
    translations: {
      "zh-CN": { reviewed: true, reviewedAt: "2026-04-20" },
      en: { reviewed: true, reviewedAt: "2026-04-20" },
    },
    publishedToAgencies: ["ag-001", "ag-002", "ag-003", "ag-005", "ag-006", "ag-009", "ag-012", "ag-013", "ag-015"],
  },

  // ─── it-006 · Gems of Egypt (10D · RFQ_ONLY premium) · dmc-006 ──
  {
    id: "it-006",
    dmcId: "dmc-006",
    title: {
      "zh-CN": "埃及精华 10 日 · 高端定制(尼罗河游轮 + 红海)",
      en: "Gems of Egypt — 10 days, 9 nights (premium RFQ)",
    },
    subtitle: {
      "zh-CN": "开罗 · 吉萨金字塔 · 卢克索 · 5 星尼罗河游轮 · 阿斯旺 · 红海度假",
      en: "Cairo · Giza Pyramids · Luxor · 5★ Nile cruise · Aswan · Red Sea leisure",
    },
    departureType: "RFQ_ONLY",
    duration: { days: 10, nights: 9 },
    countries: ["EG"],
    cities: ["Cairo", "Giza", "Luxor", "Aswan", "Hurghada"],
    themes: ["cultural", "luxury", "first-time", "family"],
    heroImage: photos.cairo.hero[0],
    gallery: [
      ...photos.cairo.gallery.slice(0, 3),
      ...photos.luxor.gallery.slice(0, 3),
      ...photos.aswan.gallery,
      ...photos.hurghada.gallery.slice(0, 2),
    ],
    highlights: {
      "zh-CN": [
        "吉萨金字塔 + 狮身人面像 + Saqqara + Memphis 全日游",
        "大埃及博物馆(GEM 新馆)+ Khan El Khalili 老市集",
        "5 星尼罗河游轮 4 晚(全餐) — 卢克索至阿斯旺",
        "国王谷 + 哈特谢普苏特女王神庙 + Edfu + Kom Ombo + Philae 神庙",
        "红海洪加达度假酒店休闲 2 晚(可选浮潜、潜水、沙漠探险)",
      ],
      en: [
        "Full day Giza Pyramids + Sphinx + Saqqara + Memphis",
        "Grand Egyptian Museum (GEM) + Khan El Khalili bazaar",
        "4-night 5-star Nile cruise full-board — Luxor to Aswan",
        "Valley of the Kings + Hatshepsut Temple + Edfu + Kom Ombo + Philae",
        "Two nights Red Sea Hurghada resort — optional snorkeling, diving, desert safari",
      ],
    },
    days: [
      {
        day: 1,
        title: { "zh-CN": "抵达开罗", en: "Arrival Cairo" },
        description: {
          "zh-CN": "抵达开罗国际机场,迎接服务,豪华空调车送往酒店入住。",
          en: "Arrival at Cairo International, meet & assist, deluxe air-conditioned transfer to hotel.",
        },
        activities: [
          { type: "TRANSFER", name: { "zh-CN": "机场接机", en: "Airport pickup" } },
          { type: "ACCOMMODATION", name: { "zh-CN": "开罗 5 星酒店", en: "5-star Cairo hotel" } },
        ],
      },
      {
        day: 2,
        title: { "zh-CN": "开罗 / 吉萨全日游", en: "Cairo / Giza Full Day" },
        description: {
          "zh-CN":
            "吉萨金字塔(胡夫、哈夫拉、孟卡拉)+ 狮身人面像 + Saqqara 阶梯金字塔 + Memphis + 大埃及博物馆(GEM)+ Khan El Khalili 老市集。中餐当地餐厅,夜晚可选金字塔声光秀。",
          en:
            "Great Pyramids of Giza (Khufu, Khafre, Menkaure) + Sphinx + Saqqara + Memphis + Grand Egyptian Museum + Khan El Khalili Bazaar. Lunch at a local restaurant. Optional evening Sound & Light show at the Pyramids.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "吉萨金字塔 + 狮身人面像", en: "Giza Pyramids + Sphinx" } },
          { type: "ENTRANCE", name: { "zh-CN": "大埃及博物馆", en: "Grand Egyptian Museum" } },
          { type: "MEAL", name: { "zh-CN": "当地餐厅午餐", en: "Local restaurant lunch" } },
        ],
      },
      {
        day: 3,
        title: { "zh-CN": "开罗 → 卢克索", en: "Cairo → Luxor" },
        description: {
          "zh-CN":
            "国内航班飞卢克索,游览 Karnak 神庙(全球最大宗教建筑群之一)与 Luxor 神庙。傍晚登 5 星尼罗河游轮,含午晚餐。",
          en:
            "Domestic flight to Luxor. Visit Karnak Temple (among the largest religious complexes in the world) and Luxor Temple. Embark 5-star Nile cruise, lunch and dinner onboard.",
        },
        activities: [
          { type: "TRANSFER", name: { "zh-CN": "卢克索国内航班", en: "Domestic flight to Luxor" } },
          { type: "ENTRANCE", name: { "zh-CN": "Karnak 神庙", en: "Karnak Temple" } },
          { type: "ACCOMMODATION", name: { "zh-CN": "5 星尼罗河游轮", en: "5-star Nile cruise" } },
        ],
      },
      {
        day: 4,
        title: { "zh-CN": "卢克索西岸", en: "Luxor West Bank" },
        description: {
          "zh-CN":
            "游船早餐,国王谷 + 哈特谢普苏特女王神庙 + Memnon 巨像。游船午餐,启航前往 Esna / Edfu,船上晚餐。",
          en:
            "Onboard breakfast. Valley of the Kings + Temple of Queen Hatshepsut + Colossi of Memnon. Lunch onboard, sail toward Esna / Edfu, dinner onboard.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "国王谷", en: "Valley of the Kings" } },
          { type: "ENTRANCE", name: { "zh-CN": "哈特谢普苏特女王神庙", en: "Hatshepsut Temple" } },
        ],
      },
      {
        day: 5,
        title: { "zh-CN": "Edfu → Kom Ombo → 阿斯旺", en: "Edfu → Kom Ombo → Aswan" },
        description: {
          "zh-CN":
            "Edfu 神庙(乘马车前往),启航 Kom Ombo,游览双神殿,继续启航至阿斯旺。游船全餐。",
          en:
            "Edfu Temple by horse carriage, sail to Kom Ombo for the double temple, continue sailing to Aswan. Full board onboard.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "Edfu 神庙", en: "Edfu Temple" } },
          { type: "ENTRANCE", name: { "zh-CN": "Kom Ombo 神庙", en: "Kom Ombo Temple" } },
        ],
      },
      {
        day: 6,
        title: { "zh-CN": "阿斯旺", en: "Aswan" },
        description: {
          "zh-CN":
            "游览 Philae 神庙、阿斯旺高坝、未完成方尖碑。可选 Abu Simbel 远征(自费)。游船全餐,阿斯旺入住游船。",
          en:
            "Philae Temple, High Dam, Unfinished Obelisk. Optional Abu Simbel excursion (own expense). Full board onboard, overnight in Aswan.",
        },
        activities: [
          { type: "ENTRANCE", name: { "zh-CN": "Philae 神庙", en: "Philae Temple" } },
          { type: "ENTRANCE", name: { "zh-CN": "阿斯旺高坝", en: "Aswan High Dam" } },
        ],
      },
      {
        day: 7,
        title: { "zh-CN": "阿斯旺 → 洪加达", en: "Aswan → Hurghada" },
        description: {
          "zh-CN":
            "酒店早餐,陆路转场前往洪加达 Red Sea 度假酒店入住。自由休闲。",
          en:
            "Breakfast, overland transfer to Hurghada Red Sea resort, check-in, leisure time.",
        },
        activities: [
          { type: "TRANSFER", name: { "zh-CN": "洪加达陆运", en: "Overland to Hurghada" } },
          { type: "ACCOMMODATION", name: { "zh-CN": "洪加达红海度假酒店", en: "Hurghada Red Sea resort" } },
        ],
      },
      {
        day: 8,
        title: { "zh-CN": "洪加达休闲日", en: "Hurghada Leisure Day" },
        description: {
          "zh-CN":
            "全日自由活动 — 浮潜、潜水、水上运动、Quad ATV 沙漠探险、玻璃底船等(自费安排)。",
          en:
            "Free day for leisure — snorkeling, diving, water sports, quad ATV desert safari, glass-bottom boat (optional add-ons).",
        },
        activities: [
          { type: "ACTIVITY", name: { "zh-CN": "自由日 / 自费水上活动", en: "Leisure / optional water activities" } },
        ],
      },
      {
        day: 9,
        title: { "zh-CN": "洪加达 → 开罗", en: "Hurghada → Cairo" },
        description: {
          "zh-CN": "返回开罗,自由购物或可选岛城自费游。",
          en: "Transfer back to Cairo, free time for shopping or optional tours.",
        },
        activities: [
          { type: "TRANSFER", name: { "zh-CN": "返回开罗", en: "Return to Cairo" } },
        ],
      },
      {
        day: 10,
        title: { "zh-CN": "返程", en: "Final Departure" },
        description: {
          "zh-CN": "酒店早餐后送往开罗国际机场。",
          en: "Hotel breakfast, transfer to Cairo International Airport for final departure.",
        },
        activities: [
          { type: "TRANSFER", name: { "zh-CN": "机场送机", en: "Airport drop-off" } },
        ],
      },
    ],
    inclusions: {
      "zh-CN": [
        "机场接送服务",
        "开罗 5 星酒店住宿",
        "5 星尼罗河游轮(全餐 4 晚)",
        "洪加达红海度假酒店 2 晚",
        "全程每日早餐 + 行程标注午晚餐",
        "行程标注景点门票",
        "专业埃及考古学家导游全程",
        "全程豪华空调车接送",
        "国内航班(开罗 → 卢克索)",
      ],
      en: [
        "Meet & assist on arrival and departure",
        "Cairo 5-star hotel accommodation",
        "5-star Nile cruise full board (4 nights)",
        "Hurghada Red Sea resort 2 nights",
        "Daily breakfast + listed lunches & dinners",
        "All listed entrance fees",
        "Professional Egyptologist tour guide throughout",
        "All transfers by deluxe air-conditioned vehicles",
        "Domestic flights as per itinerary (Cairo → Luxor)",
      ],
    },
    exclusions: {
      "zh-CN": [
        "国际机票",
        "埃及签证(可代办)",
        "Abu Simbel 远征自费",
        "金字塔声光秀自费",
        "洪加达水上活动 / 沙漠安排",
        "个人消费与小费",
      ],
      en: [
        "International flights",
        "Egypt visa (assistance available)",
        "Optional Abu Simbel excursion",
        "Pyramids Sound & Light show",
        "Hurghada water sports / desert add-ons",
        "Personal expenses and tips",
      ],
    },
    pricing: {
      sourceCurrency: "USD",
      bands: [
        { paxRange: "2-3", minPax: 2, maxPax: 3, perPaxUSD: 2780 },
        { paxRange: "4-7", minPax: 4, maxPax: 7, perPaxUSD: 2380 },
        { paxRange: "8-15", minPax: 8, maxPax: 15, perPaxUSD: 2080 },
        { paxRange: "16+", minPax: 16, maxPax: 30, perPaxUSD: 1880 },
      ],
      singleSupplementUSD: 720,
      seasons: [
        { name: "low", dateRange: "2026-06-01..2026-08-31", multiplier: 0.9 },
        { name: "shoulder", dateRange: "2026-03-01..2026-05-31", multiplier: 1.15 },
        { name: "peak", dateRange: "2026-09-01..2026-12-15", multiplier: 1.4 },
      ],
    },
    marginLayers: {
      dmcNetPerPaxUSD: 2080,
      ourMarkupUSD: 280,
      wholesalerSellUSD: 2360,
      wholesalerSuggestedMarkupUSD: 460,
      agencyRetailUSD: 2820,
    },
    cancellationPolicy: {
      name: { "zh-CN": "埃及尼罗河政策", en: "Egypt Nile Cruise Policy" },
      tiers: [
        { daysBefore: 60, penaltyPercent: 0 },
        { daysBefore: 30, penaltyPercent: 30 },
        { daysBefore: 15, penaltyPercent: 60 },
        { daysBefore: 7, penaltyPercent: 85 },
        { daysBefore: 0, penaltyPercent: 100 },
      ],
    },
    // RFQ_ONLY: no published departures; each booking starts as a custom quote request.
    departures: [],
    translations: {
      "zh-CN": { reviewed: true, reviewedAt: "2026-04-25" },
      en: { reviewed: true, reviewedAt: "2026-04-25" },
    },
    publishedToAgencies: ["ag-001", "ag-002", "ag-003", "ag-005", "ag-006", "ag-009", "ag-012", "ag-013", "ag-015"],
  },
]

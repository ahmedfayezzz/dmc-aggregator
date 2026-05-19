import type { Wholesaler } from "@/lib/types"

export const wholesalers: Wholesaler[] = [
  {
    id: "wh-001",
    legalName: {
      "zh-CN": "UB Trip 国际旅行社有限公司",
      en: "UB Trip International Travel Co., Ltd",
    },
    displayName: {
      "zh-CN": "UB Trip",
      en: "UB Trip",
    },
    subdomain: "ubtrip",
    brand: {
      primary: "#1E4D5C",
      accent: "#D4A65A",
      logoUrl: "/brand/wholesaler-ubtrip-logo.svg",
      markUrl: "/brand/wholesaler-ubtrip-mark.svg",
    },
    contractStart: "2025-09-01",
    walletWithPlatform: {
      mode: "CREDIT",
      creditLimitUSD: 500_000,
      currentBalanceUSD: -127_840,
    },
    agencyCount: 47,
    monthlyGMV_USD: 1_840_000,
  },
]

export const wholesaler: Wholesaler = wholesalers[0]

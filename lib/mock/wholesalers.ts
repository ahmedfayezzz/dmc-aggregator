import type { Wholesaler } from "@/lib/types"

export const wholesalers: Wholesaler[] = [
  {
    id: "wh-001",
    legalName: {
      "zh-CN": "天行国际旅行社有限公司",
      en: "Tianxing International Travel Co., Ltd",
    },
    displayName: {
      "zh-CN": "天行国旅",
      en: "Tianxing Tours",
    },
    subdomain: "tianxing",
    brand: {
      primary: "#1E4D5C",
      accent: "#D4A65A",
      logoUrl: "/brand/wholesaler-tianxing-logo.svg",
      markUrl: "/brand/wholesaler-tianxing-mark.svg",
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

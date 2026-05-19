import type { Metadata } from "next"
import { Fraunces, Geist, Geist_Mono, Noto_Sans_SC, Noto_Serif_SC } from "next/font/google"
import { Toaster } from "sonner"
import { LocaleProvider } from "@/lib/i18n/provider"
import { cn } from "@/lib/utils"
import "./globals.css"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "opsz"],
  display: "swap",
})

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-sc",
  preload: false,
})

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-serif-sc",
  preload: false,
})

export const metadata: Metadata = {
  title: "DMC Aggregator",
  description: "B2B Middle East travel distribution platform",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      className={cn(
        "dark h-full antialiased",
        fraunces.variable,
        geist.variable,
        geistMono.variable,
        notoSansSC.variable,
        notoSerifSC.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg-base text-ink-primary">
        <LocaleProvider>
          {children}
          <Toaster
            position="bottom-left"
            theme="dark"
            toastOptions={{
              style: {
                background: "var(--bg-raised)",
                color: "var(--ink-primary)",
                border: "1px solid var(--border-default)",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
              },
              className: "rounded-lg",
            }}
          />
        </LocaleProvider>
      </body>
    </html>
  )
}

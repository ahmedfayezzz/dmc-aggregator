import { NextResponse, type NextRequest } from "next/server"

/**
 * HTTP Basic Auth gate for the entire site.
 *
 * In Next.js 16, the file convention is `proxy.ts` (was `middleware.ts`).
 * Runs on every request not excluded by the matcher below — checks the
 * `Authorization` header for a matching username/password pair, otherwise
 * returns a 401 with a `WWW-Authenticate` challenge so the browser pops
 * the native login dialog.
 *
 * Credentials come from environment variables. Ship them via .env.local
 * for local dev and via the hosting platform's env-var UI for production.
 * If unset, the gate falls back to "tripon"/"safasoft2026" — change these
 * before the URL is shared with anyone you don't trust.
 */

const AUTH_USERNAME = process.env.AUTH_USERNAME ?? "tripon"
const AUTH_PASSWORD = process.env.AUTH_PASSWORD ?? "safasoft2026"
const REALM = "Safasoft demo"

export function proxy(request: NextRequest) {
  const header = request.headers.get("authorization")

  if (header && header.startsWith("Basic ")) {
    const encoded = header.slice(6).trim()
    let decoded = ""
    try {
      decoded = Buffer.from(encoded, "base64").toString("utf-8")
    } catch {
      // fall through to challenge below
    }
    const idx = decoded.indexOf(":")
    if (idx > 0) {
      const user = decoded.slice(0, idx)
      const pass = decoded.slice(idx + 1)
      if (timingSafeEqual(user, AUTH_USERNAME) && timingSafeEqual(pass, AUTH_PASSWORD)) {
        return NextResponse.next()
      }
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
    },
  })
}

/**
 * Length-independent constant-time string compare. Prevents the obvious
 * timing leak where attackers learn the correct prefix character-by-character.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

export const config = {
  matcher: [
    /*
     * Match every request path EXCEPT:
     * - _next/static  → bundled static assets (don't want to gate these or
     *                   the 401 cascade would break the login UX badly)
     * - _next/image   → optimized image responses
     * - favicon.ico   → browser auto-requests this; 401 here just noises logs
     * - api/health    → reserved for uptime checks if added later
     */
    "/((?!_next/static|_next/image|favicon.ico|api/health).*)",
  ],
}

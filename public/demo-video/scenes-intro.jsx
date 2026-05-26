// ─────────────────────────────────────────────────────────────────────────────
// Scenes — Intro: title statement + agency browse
// Cinematic style. Browser-framed UI. No cursor.
// ─────────────────────────────────────────────────────────────────────────────

// Outer background — the warm "set" behind the browser frame
function SetBackground({ children }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `
        radial-gradient(ellipse at 20% 10%, rgba(212,166,90,0.10) 0%, rgba(250,248,243,0) 55%),
        radial-gradient(ellipse at 80% 90%, rgba(181,138,63,0.08) 0%, rgba(250,248,243,0) 55%),
        linear-gradient(180deg, #F4EFE4 0%, #FAF8F3 50%, #F2EBDB 100%)
      `,
    }}>{children}</div>
  )
}

// Wrapper for an entire scene that fades in/out as a unit
function SceneFrame({ children, entry = 0.25, exit = 0.25 }) {
  const { localTime, duration } = useSprite()
  const alpha = fade({ localTime, duration, entry, exit })
  return (
    <div style={{
      position: 'absolute', inset: 0,
      opacity: alpha,
      willChange: 'opacity',
    }}>{children}</div>
  )
}

// ── Scene 1: Title Statement — Apple-style opener ──────────────────────────

function SceneTitle() {
  return (
    <SetBackground>
      <StatementCard
        eyebrow="SAFASOFT · CUSTOM REQUESTS"
        title="The full pipeline."
        accentWord="pipeline."
        emphasize="italic"
        subtitle={<>An agency&rsquo;s ask travels four parties &mdash; and returns as a priced quote with every margin layer audited.</>}
      />
    </SetBackground>
  )
}

// ── Scene 2: Agency browse → "Beyond the catalog?" CTA ─────────────────────
// Uses REAL itinerary names from /system/lib/mock/itineraries.ts.

const REAL_ITINERARIES = [
  {
    country: 'JORDAN', code: 'JO',
    title: 'Jordan Discovery',
    sub: 'Petra · Wadi Rum · Aqaba',
    price: '$1,420', dur: '4D · 3N',
  },
  {
    country: 'JORDAN', code: 'JO',
    title: 'Aqaba Eid Retreat',
    sub: 'Red Sea getaway',
    price: '$840', dur: '3D · 2N',
  },
  {
    country: 'MOROCCO', code: 'MA',
    title: 'Grand Morocco Tour',
    sub: 'Casablanca · Fes · Sahara · Marrakech',
    price: '$2,640', dur: '12D · 11N',
  },
  {
    country: 'MOROCCO', code: 'MA',
    title: 'North Morocco Discovery',
    sub: 'Chefchaouen · Akchour · Volubilis',
    price: '$1,940', dur: '8D · 7N',
  },
]

function SceneBrowse() {
  const { localTime, duration } = useSprite()
  const t = localTime

  // Phases:
  // 0–1: shell + grid fades in
  // 1–6: itinerary cards stagger in
  // 6–10: "Beyond the catalog?" CTA reveals + brief camera focus
  // 10–14: hold

  const gridOp   = fade({ localTime: t - 0.3, duration: duration - 0.3, entry: 0.4, exit: 0.4 })
  const ctaOp    = fade({ localTime: t - 4.0, duration: duration - 4.0, entry: 0.7, exit: 0.4 })
  const captionVisible = t > 5.5 && t < 12

  const agencyNav = [
    { icon: 'compass', label: 'Browse Destinations' },
    { icon: 'inbox', label: 'Custom requests' },
    { icon: 'shopping', label: 'My Bookings' },
    { icon: 'bookmark', label: 'Quotes' },
    { icon: 'wallet', label: 'Wallet' },
  ]

  return (
    <SetBackground>
      <BrowserFrame url="ub-trip.safasoft.com/agency/browse">
        <CameraZoom keyframes={[
          { t: 0,    scale: 1.0,  fx: 0.5, fy: 0.5 },
          { t: 4,    scale: 1.0,  fx: 0.5, fy: 0.5 },
          { t: 5,    scale: 1.20, fx: 0.5, fy: 0.85 },   // CTA card (bottom of page)
          { t: 12,   scale: 1.22, fx: 0.5, fy: 0.85 },
          { t: 14,   scale: 1.10, fx: 0.5, fy: 0.80 },
        ]}>
          <PortalShell
            brandLetter="U" brandColor={T.brandPrimary} brandText="UB Trip" portalLabel="Agency"
            nav={agencyNav} active="Browse Destinations"
            personaLabel="Enter as Agency"
            personaName="Wang Ming · Beijing Huaxia"
          >
            <div style={{ padding: '28px 32px 0', opacity: gridOp }}>
              <div style={{ ...TextStyle.label, color: T.inkTertiary, marginBottom: 10 }}>BROWSE</div>
              <h1 style={{ ...TextStyle.displayMd, margin: 0, color: T.inkPrimary }}>Middle East Destinations</h1>
              <p style={{ ...TextStyle.body, color: T.inkSecondary, margin: '8px 0 0' }}>Curated tours from our supplier network &middot; 6 results</p>

              {/* Filter chips */}
              <div style={{ display: 'flex', gap: 8, marginTop: 22, marginBottom: 22 }}>
                {['Destination', 'Dates', 'Duration', 'Pax', 'Theme', 'Price'].map(f => (
                  <span key={f} style={{
                    padding: '7px 13px', borderRadius: 6,
                    border: `1px solid ${T.borderSubtle}`,
                    background: T.bgRaised,
                    ...TextStyle.caption, color: T.inkSecondary,
                  }}>{f} <Icon name="chevronDown" size={11} color={T.inkTertiary} style={{ display: 'inline', marginLeft: 4, verticalAlign: '-1px' }} /></span>
                ))}
              </div>

              {/* Itinerary cards — 4 columns */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
                {REAL_ITINERARIES.map((it, i) => (
                  <div key={i} style={{
                    borderRadius: 8, border: `1px solid ${T.borderSubtle}`,
                    background: T.bgRaised, overflow: 'hidden',
                    opacity: fade({ localTime: t - (0.6 + i*0.18), duration: duration - 0.6, entry: 0.5, exit: 0.4 }),
                    transform: `translateY(${(1 - fade({ localTime: t - (0.6 + i*0.18), duration: duration - 0.6, entry: 0.5, exit: 0.4 })) * 6}px)`,
                  }}>
                    <div style={{
                      aspectRatio: '16 / 10',
                      background: `repeating-linear-gradient(135deg, ${T.bgSunken} 0 14px, ${T.bgBase} 14px 28px)`,
                      display: 'grid', placeItems: 'center',
                      color: T.inkTertiary,
                      fontFamily: F.mono, fontSize: 11, letterSpacing: '0.18em',
                    }}>{it.country}</div>
                    <div style={{ padding: 16 }}>
                      <div style={{ ...TextStyle.label, color: T.inkTertiary, marginBottom: 6 }}>{it.country}</div>
                      <div style={{ ...TextStyle.subheading, color: T.inkPrimary, fontSize: 17, fontFamily: F.display, fontWeight: 400, letterSpacing: '-0.01em' }}>{it.title}</div>
                      <div style={{ ...TextStyle.caption, color: T.inkSecondary, marginTop: 4 }}>{it.sub}</div>
                      <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                        <span style={{ ...TextStyle.heading, color: T.accent, fontSize: 18 }}>{it.price}</span>
                        <span style={{ ...TextStyle.caption, color: T.inkTertiary }}>From · {it.dur}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Beyond the catalog CTA */}
              <div style={{
                marginTop: 24,
                padding: '24px 28px',
                borderRadius: 10,
                border: `1.5px dashed ${T.accentBorder}`,
                background: `linear-gradient(to right, ${T.accentSoft}, rgba(251,247,237,0.4))`,
                display: 'flex', alignItems: 'center', gap: 22,
                opacity: ctaOp,
                transform: `translateY(${(1-ctaOp) * 8}px)`,
                boxShadow: ctaOp > 0.6 ? '0 8px 28px rgba(181,138,63,0.12)' : 'none',
                transition: 'box-shadow 600ms ease',
              }}>
                <span style={{
                  width: 50, height: 50, borderRadius: 8,
                  background: T.accentSoftStrong, color: T.accent,
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  <Icon name="lightbulb" size={26} color={T.accent} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ ...TextStyle.subheading, color: T.inkPrimary }}>Beyond the catalog?</div>
                  <div style={{ ...TextStyle.body, color: T.inkSecondary, marginTop: 3 }}>
                    Submit a custom request &mdash; we&rsquo;ll match it to a supplier from our network
                  </div>
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '0 18px', height: 42,
                  borderRadius: 5, background: T.accent, color: '#FAF8F3',
                  ...TextStyle.body, fontWeight: 500,
                }}>
                  Submit a custom request <Icon name="arrowRight" size={16} color="#FAF8F3" />
                </span>
              </div>
            </div>
          </PortalShell>
        </CameraZoom>
      </BrowserFrame>

      <BigCallout
        visible={captionVisible}
        anchor="bottom"
        eyebrow="BEYOND THE CATALOG"
        title="One CTA. Wired into every relevant page."
        accentWord="every relevant page."
        size="lg"
      />
    </SetBackground>
  )
}

Object.assign(window, { SceneTitle, SceneBrowse, SceneFrame, SetBackground, REAL_ITINERARIES })

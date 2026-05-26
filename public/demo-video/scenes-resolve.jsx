// ─────────────────────────────────────────────────────────────────────────────
// Scenes — Markup stack, agency accept, end card
// Cinematic. No cursor.
// ─────────────────────────────────────────────────────────────────────────────

// Wholesaler portal shell — used for the markup-stacking scene
function WholesalerShell({ children, active = 'Custom requests' }) {
  const nav = [
    { icon: 'layout', label: 'Dashboard' },
    { icon: 'map', label: 'Catalog' },
    { icon: 'users', label: 'Agencies' },
    { icon: 'shopping', label: 'Bookings' },
    { icon: 'inbox', label: 'Custom requests' },
    { icon: 'compass', label: 'Reports' },
    { icon: 'settings', label: 'Markup rules' },
  ]
  return (
    <PortalShell
      brandLetter="U" brandColor={T.brandPrimary} brandText="UB Trip" portalLabel="Wholesaler"
      nav={nav} active={active}
      personaLabel="Enter as Wholesaler"
      personaName="Manager Zhang · UB Trip"
    >{children}</PortalShell>
  )
}

// ── Scene: Markup stack on wholesaler view (~20s) ──────────────────────────

function SceneMarkupStack() {
  const { localTime } = useSprite()
  const t = localTime

  // Phases:
  // 0–2: page enters
  // 2–5: row 1 (Supplier net $18,800)
  // 5–8: row 2 (DMC markup +$2,632)
  // 8–11: row 3 (Wholesaler markup +$4,718)
  // 11–14: row 4 (Agency retail $26,150, emphasis)
  // 14–20: hold, camera focused on the pricing card

  const T_NET = 2.5
  const T_DMC_MARKUP = 5.5
  const T_WHO_MARKUP = 8.5
  const T_RETAIL = 11.5

  const auditCount = t < 3 ? 3 : t < 6.5 ? 4 : t < 9.5 ? 5 : 6
  const holderIdx = t < T_RETAIL + 1 ? 1 : 0

  const pricingRows = [
    { key: 'supplier_net',    label: 'Supplier net',      value: '$18,800', visible: t >= T_NET },
    { key: 'dmc_markup',      label: 'DMC markup',        value: '+ $2,632', visible: t >= T_DMC_MARKUP },
    { key: 'wholesaler_mark', label: 'Wholesaler markup', value: '+ $4,718', visible: t >= T_WHO_MARKUP },
    { key: 'agency_retail',   label: 'Agency retail',     value: '$26,150', visible: t >= T_RETAIL, emphasis: true },
  ]

  const allAudit = [
    { actor: 'Agency · Wang Ming', action: 'Submitted', time: '14:22:08' },
    { actor: 'Auto-router', action: 'Forwarded', time: '14:22:09', note: 'Wholesaler rule wr-002', isRule: true },
    { actor: 'Auto-router', action: 'Forwarded', time: '14:22:09', note: 'DMC rule pr-002', isRule: true },
    { actor: 'Supplier · Sahara Caravan', action: 'Supplier quote', time: '14:30:41', amount: '$18,800' },
    { actor: 'Auto-router', action: 'Markup applied', time: '14:30:42', amount: '$2,632', note: 'DMC rule pr-002 · 14%', isRule: true },
    { actor: 'Auto-router', action: 'Markup applied', time: '14:30:42', amount: '$4,718', note: 'Wholesaler rule wr-002 · 22%', isRule: true },
  ]

  const captionA = t > 0.6 && t < 5.5    // wholesaler-only view
  const captionB = t > 5.8 && t < 14     // by rule, not by negotiation
  const captionC = t > 14.5 && t < 20    // everyone sees what they own

  return (
    <SetBackground>
      <BrowserFrame url="ub-trip.safasoft.com/wholesaler/requests/CRQ-2026-1024">
        <CameraZoom keyframes={[
          { t: 0,    scale: 1.0,  fx: 0.5,  fy: 0.5 },
          { t: 0.6,  scale: 1.22, fx: 0.82, fy: 0.45 },   // pricing card (right column)
          { t: 11,   scale: 1.22, fx: 0.82, fy: 0.45 },
          { t: 11.6, scale: 1.32, fx: 0.85, fy: 0.55 },   // closer on retail row
          { t: 16,   scale: 1.32, fx: 0.85, fy: 0.55 },
          { t: 17,   scale: 1.18, fx: 0.78, fy: 0.50 },
          { t: 20,   scale: 1.18, fx: 0.78, fy: 0.50 },
        ]}>
          <WholesalerShell active="Custom requests">
            <div style={{ padding: '18px 32px 6px', borderBottom: `1px solid ${T.borderSubtle}` }}>
              <span style={{ ...TextStyle.caption, color: T.inkSecondary, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="arrowLeft" size={13} color={T.inkSecondary} /> Custom requests · History
              </span>
            </div>
            <PageHeader
              eyebrow="CRQ-2026-1024 · FROM SCRATCH"
              title="MA · Marrakech, Sahara, Fez"
              subtitle="Submitted by: Beijing Huaxia International · Oct 15 → Oct 25 · 4 pax"
              actions={<StatusBadge variant="success">Quoted to agency</StatusBadge>}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28, padding: '24px 32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
                <section>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3 style={{ ...TextStyle.subheading, color: T.inkPrimary, margin: 0 }}>Pipeline timeline</h3>
                    <span style={{ ...TextStyle.caption, color: T.inkTertiary, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Icon name="arrowUp" size={13} color={T.success} /> Quote returning to agency
                    </span>
                  </div>
                  <PipelineStepper holderIdx={holderIdx} direction="backward" />
                </section>

                <AuditLog>
                  {allAudit.slice(0, auditCount).map((e, i) => (
                    <AuditEntry key={i} {...e} opacity={1} />
                  ))}
                </AuditLog>
              </div>

              <aside>
                <div style={{
                  boxShadow: t > T_RETAIL ? '0 0 0 1px rgba(212,166,90,0.6), 0 16px 48px rgba(212,166,90,0.18)' : 'none',
                  transition: 'box-shadow 700ms ease',
                  borderRadius: 10,
                }}>
                  <PricingBreakdown rows={pricingRows} title="Pricing — wholesaler view" />
                </div>
                <div style={{
                  marginTop: 12,
                  padding: '12px 16px',
                  borderRadius: 6,
                  border: `1px solid ${T.borderSubtle}`,
                  background: T.bgRaised,
                  ...TextStyle.caption, color: T.inkSecondary,
                  opacity: t > 14 ? 1 : 0,
                  transition: 'opacity 700ms ease',
                }}>
                  The agency sees only the bottom row.<br />The supplier sees only the top.
                </div>
              </aside>
            </div>
          </WholesalerShell>
        </CameraZoom>
      </BrowserFrame>

      <BigCallout
        visible={captionA}
        anchor="top"
        eyebrow="WHOLESALER VIEW"
        title="The only view where every layer is exposed."
        accentWord="every layer is exposed."
        size="md"
      />
      <BigCallout
        visible={captionB}
        anchor="top"
        eyebrow="BY RULE, NOT BY NEGOTIATION"
        title="DMC 14%. Wholesaler 22%. Stacked."
        accentWord="Stacked."
        size="lg"
      />
      <BigCallout
        visible={captionC}
        anchor="top"
        eyebrow="INFORMATION ASYMMETRY, BY DESIGN"
        title="Each party sees what they own. Nothing more."
        accentWord="Nothing more."
        size="md"
      />
    </SetBackground>
  )
}

// ── Scene: Agency accept (~17s) ────────────────────────────────────────────

function SceneAgencyAccept() {
  const { localTime } = useSprite()
  const t = localTime

  // Phases:
  // 0–4: detail page enters with Accept card prominent
  // 4–9: hold with $26,150 focus + caption
  // 9–11: button hover glow
  // 11–11.4: click; status pulse → Accepted
  // 11.4–17: hold, audit log shows final entry

  const T_ACCEPT_CLICK = 11.0
  const accepted = t > T_ACCEPT_CLICK + 0.4
  const auditCount = accepted ? 7 : 6
  const acceptHover = t > T_ACCEPT_CLICK - 2.0 && t < T_ACCEPT_CLICK + 0.3
  const acceptClicked = t > T_ACCEPT_CLICK - 0.05 && t < T_ACCEPT_CLICK + 0.3
  const statusPulse = t > T_ACCEPT_CLICK + 0.3 && t < T_ACCEPT_CLICK + 2

  const agencyPricingRows = [
    { key: 'your_total', label: 'Your total', value: '$26,150', emphasis: true, visible: true },
  ]

  const captionA = t > 1.0 && t < 9
  const captionB = t > T_ACCEPT_CLICK + 0.5 && t < t + 6

  return (
    <SetBackground>
      <BrowserFrame url="ub-trip.safasoft.com/agency/requests/CRQ-2026-1024">
        <CameraZoom keyframes={[
          { t: 0,    scale: 1.0,  fx: 0.5,  fy: 0.5 },
          { t: 0.6,  scale: 1.22, fx: 0.48, fy: 0.42 },   // Accept card (main column, top)
          { t: 9,    scale: 1.22, fx: 0.48, fy: 0.42 },
          { t: 9.6,  scale: 1.32, fx: 0.62, fy: 0.42 },   // closer on Accept button
          { t: 11.4, scale: 1.32, fx: 0.62, fy: 0.42 },
          { t: 12,   scale: 1.15, fx: 0.50, fy: 0.50 },   // pull back
          { t: 17,   scale: 1.05, fx: 0.5,  fy: 0.5 },
        ]}>
          <AgencyRequestDetail
            holderIdx={accepted ? 0 : 0}
            direction="backward"
            accepted={accepted}
            auditCount={auditCount}
            pricingRows={agencyPricingRows}
            showAcceptCard={!accepted}
            acceptHover={acceptHover}
            acceptClicked={acceptClicked}
            showOriginal={false}
          />
        </CameraZoom>
      </BrowserFrame>

      {statusPulse ? (
        <div style={{
          position: 'absolute',
          top: 145, right: 110, width: 130, height: 28,
          borderRadius: 6,
          boxShadow: `0 0 0 ${12 - (t - T_ACCEPT_CLICK - 0.3) * 12}px rgba(61,122,92,${0.45 - (t - T_ACCEPT_CLICK - 0.3) * 0.3})`,
          pointerEvents: 'none', transition: 'box-shadow 240ms ease',
          zIndex: 7500,
        }} />
      ) : null}

      <Toast visible={t > T_ACCEPT_CLICK + 0.2 && t < T_ACCEPT_CLICK + 4}>
        Quote accepted &middot; booking flow next
      </Toast>

      <BigCallout
        visible={captionA}
        anchor="top"
        eyebrow="AGENCY VIEW"
        title="$26,150. One number. Nothing else."
        accentWord="Nothing else."
        size="lg"
      />
      <BigCallout
        visible={captionB}
        anchor="top"
        eyebrow="ACCEPTED · BOOKING FLOW NEXT"
        title="Lifecycle complete. The booking pipeline takes over."
        accentWord="takes over."
        size="md"
      />
    </SetBackground>
  )
}

// ── Closing statement / end card ───────────────────────────────────────────

function SceneEnd() {
  return (
    <SetBackground>
      <StatementCard
        eyebrow="SAFASOFT · CUSTOM REQUESTS"
        title="Every dollar defended."
        accentWord="defended."
        emphasize="italic"
        subtitle={<>Speed where the rules permit it. Governance where they don&rsquo;t. Transparency for whoever is accountable.</>}
      />
    </SetBackground>
  )
}

Object.assign(window, { SceneMarkupStack, SceneAgencyAccept, SceneEnd, WholesalerShell })

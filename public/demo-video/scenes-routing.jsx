// ─────────────────────────────────────────────────────────────────────────────
// Scenes — Auto-routing pipeline + supplier quote
// Cinematic. Browser-framed. No cursor.
// ─────────────────────────────────────────────────────────────────────────────

// Reusable agency-detail layout (used in routing + accept scenes)
function AgencyRequestDetail({
  holderIdx, direction = 'forward', accepted = false,
  auditCount = 0,
  pricingRows = null,
  showAcceptCard = false,
  acceptHover = false,
  acceptClicked = false,
  showOriginal = true,
}) {
  const agencyNav = [
    { icon: 'compass', label: 'Browse Destinations' },
    { icon: 'inbox', label: 'Custom requests' },
    { icon: 'shopping', label: 'My Bookings' },
    { icon: 'bookmark', label: 'Quotes' },
    { icon: 'wallet', label: 'Wallet' },
  ]

  const allAudit = [
    { actor: 'Agency · Wang Ming', action: 'Submitted', time: 'just now' },
    { actor: 'Auto-router', action: 'Forwarded', time: 'just now', note: 'Wholesaler rule wr-002 — Standard agencies · JO/MA/EG', isRule: true },
    { actor: 'Auto-router', action: 'Forwarded', time: 'just now', note: 'DMC rule pr-002 — Morocco · under $25k net', isRule: true },
    { actor: 'Supplier · Sahara Caravan', action: 'Supplier quote', time: 'just now', amount: '$18,800' },
    { actor: 'Auto-router', action: 'Markup applied', time: 'just now', amount: '$2,632', note: 'DMC rule pr-002 · 14% on Morocco net', isRule: true },
    { actor: 'Auto-router', action: 'Markup applied', time: 'just now', amount: '$4,718', note: 'Wholesaler rule wr-002 · 22% on standard agency', isRule: true },
    { actor: 'Agency · Wang Ming', action: 'Agency accepted', time: 'just now', isAccept: true },
  ]

  const status = accepted ? { v: 'success', label: 'Accepted' }
    : direction === 'backward' ? { v: 'success', label: 'Quoted to agency' }
    : holderIdx === 3 ? { v: 'warning', label: 'Awaiting supplier quote' }
    : holderIdx === 0 ? { v: 'info', label: 'Submitted' }
    : { v: 'info', label: 'In review' }

  return (
    <PortalShell
      brandLetter="U" brandColor={T.brandPrimary} brandText="UB Trip" portalLabel="Agency"
      nav={agencyNav} active="Custom requests"
      personaLabel="Enter as Agency"
      personaName="Wang Ming · Beijing Huaxia"
    >
      <div style={{ padding: '18px 32px 6px', borderBottom: `1px solid ${T.borderSubtle}` }}>
        <span style={{ ...TextStyle.caption, color: T.inkSecondary, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="arrowLeft" size={13} color={T.inkSecondary} /> My custom requests
        </span>
      </div>

      <PageHeader
        eyebrow="CRQ-2026-1024 · FROM SCRATCH"
        title="MA · Marrakech, Sahara, Fez"
        subtitle="Oct 15 → Oct 25 · 10 days · 4 pax"
        actions={<StatusBadge variant={status.v}>{status.label}</StatusBadge>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, padding: '24px 32px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
          {showAcceptCard ? (
            <section style={{
              padding: 28,
              borderRadius: 10,
              border: `1px solid ${T.accentBorder}`,
              background: T.accentSoftStrong,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
                <div>
                  <div style={{ ...TextStyle.label, color: T.accent, marginBottom: 6 }}>YOUR TOTAL</div>
                  <div style={{ ...TextStyle.displayMd, color: T.inkPrimary, fontSize: 48 }}>$26,150</div>
                  <p style={{ ...TextStyle.caption, color: T.inkSecondary, margin: '12px 0 0', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Icon name="clock" size={13} color={T.inkSecondary} />
                    Valid until Oct 12, 2026 &middot; 72h
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Button variant="ghost" icon="x">Decline</Button>
                  <Button variant="primary" size="lg" icon="check"
                    style={{
                      boxShadow: acceptHover ? `0 0 0 6px ${T.accentSoft}, 0 0 28px rgba(212,166,90,0.55)` : 'none',
                      transform: acceptClicked ? 'translateY(1px) scale(0.98)' : acceptHover ? 'translateY(-1px) scale(1.03)' : 'none',
                      transition: 'all 220ms ease',
                    }}>
                    Accept quote
                  </Button>
                </div>
              </div>
            </section>
          ) : null}

          {showOriginal ? (
            <section>
              <h3 style={{ ...TextStyle.subheading, color: T.inkPrimary, margin: '0 0 14px' }}>Original request</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  ['Destination countries', 'MA'],
                  ['Cities to include', 'Marrakech, Sahara, Fez'],
                  ['Themes', 'Cultural · Family'],
                  ['Hotel tier', '4-star'],
                  ['Budget band', 'Standard'],
                  ['Per-pax budget USD', '$2,500'],
                ].map(([k, v]) => (
                  <div key={k} style={{ padding: '10px 14px', borderRadius: 6, border: `1px solid ${T.borderSubtle}`, background: T.bgRaised }}>
                    <p style={{ ...TextStyle.caption, color: T.inkTertiary, margin: 0 }}>{k}</p>
                    <p style={{ ...TextStyle.data, color: T.inkPrimary, margin: '4px 0 0' }}>{v}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ ...TextStyle.subheading, color: T.inkPrimary, margin: 0 }}>Pipeline timeline</h3>
              <span style={{ ...TextStyle.caption, color: T.inkTertiary, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {direction === 'forward'
                  ? <><Icon name="arrowDown" size={13} color={T.accent} /> Forwarding to supplier</>
                  : <><Icon name="arrowUp"   size={13} color={T.success} /> Quote returning to agency</>}
              </span>
            </div>
            <PipelineStepper holderIdx={holderIdx} direction={direction} accepted={accepted} />
          </section>

          <AuditLog>
            {allAudit.slice(0, auditCount).map((e, i) => (
              <AuditEntry key={i} {...e} opacity={1} />
            ))}
          </AuditLog>
        </div>

        <aside style={{ position: 'sticky', top: 80 }}>
          {pricingRows ? (
            <PricingBreakdown rows={pricingRows} title="Pricing" />
          ) : (
            <div style={{
              padding: 18, borderRadius: 8,
              border: `1px solid ${T.borderSubtle}`, background: T.bgRaised,
            }}>
              <div style={{ ...TextStyle.label, color: T.inkTertiary, marginBottom: 8 }}>CURRENTLY WITH</div>
              <div style={{ ...TextStyle.subheading, color: T.inkPrimary }}>
                {['Agency','Wholesaler','DMC','Supplier'][holderIdx]}
              </div>
              <div style={{ ...TextStyle.caption, color: T.inkSecondary, marginTop: 8 }}>
                {direction === 'forward' ? 'Forwarding to supplier' : 'Quote returning to agency'}
              </div>
            </div>
          )}
        </aside>
      </div>
    </PortalShell>
  )
}

// ── Scene: Auto-routing pipeline (~18s) ────────────────────────────────────

function SceneRouting() {
  const { localTime } = useSprite()
  const t = localTime

  // Stage advancement timeline
  // 0–2: page enters, holder = Agency
  // 2–3.5: holder advances to Wholesaler (auto)
  // 3.5–5: holder advances to DMC (auto)
  // 5–6: holder advances to Supplier (final forward state)
  // 6–8: audit log entries appear
  // 8–18: hold with camera focus on audit log

  const holderIdx = t < 2 ? 0 : t < 3.5 ? 1 : t < 5 ? 2 : 3
  const auditCount = t < 6 ? 0 : t < 7.2 ? 1 : t < 8.4 ? 2 : 3

  const captionA = t > 1 && t < 6.5    // pipeline begins
  const captionB = t > 7 && t < 14     // rules fired
  const captionC = t > 14.5 && t < 18  // one human only

  return (
    <SetBackground>
      <BrowserFrame url="ub-trip.safasoft.com/agency/requests/CRQ-2026-1024">
        <CameraZoom keyframes={[
          { t: 0,    scale: 1.0,  fx: 0.5,  fy: 0.5 },
          { t: 1.5,  scale: 1.18, fx: 0.45, fy: 0.55 },   // pipeline timeline
          { t: 6,    scale: 1.18, fx: 0.45, fy: 0.55 },
          { t: 7.5,  scale: 1.22, fx: 0.40, fy: 0.72 },   // pan to audit log
          { t: 16,   scale: 1.22, fx: 0.40, fy: 0.72 },
          { t: 17.5, scale: 1.10, fx: 0.45, fy: 0.60 },
        ]}>
          <AgencyRequestDetail
            holderIdx={holderIdx}
            direction="forward"
            auditCount={auditCount}
            showOriginal={false}
          />
        </CameraZoom>
      </BrowserFrame>

      <BigCallout
        visible={captionA}
        anchor="top"
        eyebrow="4 STAGES · 2 AUTO-SKIPPED"
        title="Agency → Supplier in under a second."
        accentWord="under a second."
        size="lg"
      />
      <BigCallout
        visible={captionB}
        anchor="bottom"
        eyebrow="EVERY AUTO-ROUTE IS NAMED"
        title="Rule wr-002. Rule pr-002."
        accentWord="Rule pr-002."
        size="lg"
      />
      <BigCallout
        visible={captionC}
        anchor="bottom"
        eyebrow="ONE HUMAN IN THE CHAIN"
        title="The supplier is the only party that has to act."
        accentWord="only party that has to act."
        size="md"
      />
    </SetBackground>
  )
}

// ── Scene: Supplier RFQ + quote submission (~22s) ──────────────────────────

function SceneSupplierQuote() {
  const { localTime, duration } = useSprite()
  const t = localTime

  // Timing
  // 0–2: supplier inbox briefly visible
  // 2–4: transition to RFQ detail
  // 4–10: net total $18,800 types in
  // 10–14: per-pax $4,700 highlight; floating caption
  // 14–18: note types in
  // 18–20: submit glow + click
  // 20–22: toast appears, hold

  const T_TO_DETAIL = 2.0
  const T_NET = 4.0
  const T_NOTE = 14.0
  const T_SUBMIT = 19.0

  const onDetailPage = t > T_TO_DETAIL

  const netText = typeOn('18800', t, T_NET, 8)
  const netNum = parseInt(netText, 10) || 0
  const perPaxNum = netNum > 0 ? Math.round(netNum / 4) : 0

  const submitHover = t > T_SUBMIT - 1.0 && t < T_SUBMIT + 0.5
  const toastVisible = t > T_SUBMIT + 0.3 && t < duration

  const dmcNav = [
    { icon: 'layout', label: 'Dashboard' },
    { icon: 'map', label: 'Itineraries' },
    { icon: 'calendar', label: 'Schedules' },
    { icon: 'tag', label: 'Pricing' },
    { icon: 'clipboard', label: 'Allotments' },
    { icon: 'compass', label: 'Bookings' },
    { icon: 'inbox', label: 'Custom requests' },
    { icon: 'receipt', label: 'Statements' },
  ]

  const captionA = !onDetailPage && t > 0.5    // supplier inbox
  const captionB = onDetailPage && t > T_NET + 0.6 && t < T_NET + 6   // one number
  const captionC = onDetailPage && t > T_NET + 6.5 && t < T_NET + 12  // per-pax preview

  return (
    <SetBackground>
      <BrowserFrame url={onDetailPage ? 'sahara-caravan.safasoft.com/dmc/rfqs/CRQ-2026-1024' : 'sahara-caravan.safasoft.com/dmc/rfqs'}>
        <CameraZoom keyframes={onDetailPage ? [
          { t: T_TO_DETAIL,        scale: 1.0,  fx: 0.5,  fy: 0.5 },
          { t: T_TO_DETAIL + 0.6,  scale: 1.20, fx: 0.50, fy: 0.45 },  // quote form area
          { t: T_NET + 5,          scale: 1.20, fx: 0.50, fy: 0.45 },
          { t: T_NET + 6.5,        scale: 1.28, fx: 0.66, fy: 0.45 },  // pan to per-pax field
          { t: T_NET + 9.5,        scale: 1.28, fx: 0.66, fy: 0.45 },
          { t: T_NET + 11,         scale: 1.20, fx: 0.50, fy: 0.55 },  // pan back to note area
          { t: T_SUBMIT - 0.4,     scale: 1.20, fx: 0.50, fy: 0.55 },
          { t: T_SUBMIT + 0.5,     scale: 1.30, fx: 0.70, fy: 0.72 },  // pan to submit
          { t: T_SUBMIT + 2,       scale: 1.30, fx: 0.70, fy: 0.72 },
        ] : [
          { t: 0,             scale: 1.0,  fx: 0.5, fy: 0.5 },
          { t: T_TO_DETAIL,   scale: 1.15, fx: 0.5, fy: 0.45 },
        ]}>
          <PortalShell
            brandLetter="S" brandColor={T.bgSunken} brandText="Sahara Caravan" portalLabel="Supplier"
            nav={dmcNav} active="Custom requests"
            personaLabel="Supplier View"
            personaName="Sahara Caravan Travel"
          >
            {!onDetailPage ? (
              <div>
                <PageHeader
                  eyebrow="SUPPLIER · INBOX"
                  title="Custom request inbox"
                  subtitle="1 request awaiting your net quote"
                />
                <div style={{ padding: '20px 32px' }}>
                  <div style={{ borderRadius: 8, border: `1px solid ${T.borderSubtle}`, background: T.bgRaised, overflow: 'hidden' }}>
                    <div style={{
                      display: 'grid', gridTemplateColumns: '180px 1fr 200px 180px 180px',
                      padding: '14px 24px', borderBottom: `1px solid ${T.borderSubtle}`,
                      ...TextStyle.label, color: T.inkTertiary,
                    }}>
                      <span>REF</span><span>BRIEF</span><span>PAX · DURATION</span><span>WHOLESALER</span><span>STATUS</span>
                    </div>
                    <div style={{
                      display: 'grid', gridTemplateColumns: '180px 1fr 200px 180px 180px',
                      padding: '16px 24px', alignItems: 'center', height: 52,
                      background: T.accentSoft,
                      transition: 'background 240ms ease',
                    }}>
                      <span style={{ ...TextStyle.data, color: T.inkPrimary }}>CRQ-2026-1024</span>
                      <span style={{ ...TextStyle.body, color: T.inkPrimary }}>MA · Marrakech, Sahara, Fez <span style={{ color: T.inkTertiary }}>· Cultural, family</span></span>
                      <span style={{ ...TextStyle.data, color: T.inkSecondary }}>4 pax · 10 days</span>
                      <span style={{ ...TextStyle.caption, color: T.inkSecondary }}>UB Trip</span>
                      <span><StatusBadge variant="warning">Awaiting supplier quote</StatusBadge></span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ padding: '18px 32px 6px', borderBottom: `1px solid ${T.borderSubtle}` }}>
                  <span style={{ ...TextStyle.caption, color: T.inkSecondary, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Icon name="arrowLeft" size={13} color={T.inkSecondary} /> Custom request inbox
                  </span>
                </div>
                <PageHeader
                  eyebrow="CRQ-2026-1024 · FROM SCRATCH"
                  title="MA · Marrakech, Sahara, Fez"
                  subtitle="Oct 15 → Oct 25 · 10 days · 4 pax"
                  actions={<StatusBadge variant="warning">Awaiting supplier quote</StatusBadge>}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, padding: '24px 32px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
                    <section style={{
                      padding: 24,
                      borderRadius: 10,
                      border: `1px solid ${T.accentBorder}`,
                      background: T.accentSoft,
                    }}>
                      <h3 style={{ ...TextStyle.subheading, color: T.inkPrimary, margin: 0 }}>Submit net quote</h3>
                      <p style={{ ...TextStyle.caption, color: T.inkSecondary, margin: '4px 0 18px' }}>
                        Quote the trip&rsquo;s net cost in USD. Markup is applied after on the return leg.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                        <Field label="Net total USD">
                          <TypingInput
                            text="18800" placeholder="0"
                            t={t} startAt={T_NET} cps={6}
                            focused={t > T_NET - 0.2 && t < T_NET + 2.5}
                          />
                        </Field>
                        <Field label="per pax">
                          <div style={{
                            height: 40, padding: '0 12px', display: 'flex', alignItems: 'center',
                            background: T.bgRaised,
                            border: `1px solid ${T.borderSubtle}`,
                            borderRadius: 4,
                            ...TextStyle.data, color: perPaxNum > 0 ? T.accent : T.inkTertiary,
                            fontSize: 16, fontWeight: 500,
                            transition: 'color 240ms ease',
                          }}>
                            {perPaxNum > 0 ? `$${perPaxNum.toLocaleString()}` : '—'}
                          </div>
                        </Field>
                      </div>

                      <Field label="Note (optional)" style={{ marginBottom: 20 }}>
                        <TypingInput
                          multiline rows={3}
                          text="Includes private guide, Sahara luxury camp upgrade, and the horseback Atlas Mountains day with kids' insurance."
                          t={t} startAt={T_NOTE} cps={32}
                          focused={t > T_NOTE - 0.2 && t < T_NOTE + 4}
                        />
                      </Field>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                        <Button variant="ghost" icon="x">Decline with reason</Button>
                        <Button variant="primary" size="lg" icon="send" style={{
                          boxShadow: submitHover ? `0 0 0 6px ${T.accentSoft}, 0 0 28px rgba(212,166,90,0.55)` : 'none',
                          transform: submitHover ? 'translateY(-1px) scale(1.02)' : 'none',
                          transition: 'all 220ms ease',
                        }}>Submit net quote</Button>
                      </div>
                    </section>

                    <section>
                      <h3 style={{ ...TextStyle.subheading, color: T.inkPrimary, margin: '0 0 12px' }}>Original brief</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {[['Destination', 'MA'], ['Cities', 'Marrakech, Sahara, Fez'], ['Themes', 'Cultural · Family'], ['Hotel tier', '4-star']].map(([k,v]) => (
                          <div key={k} style={{ padding: '10px 14px', borderRadius: 6, border: `1px solid ${T.borderSubtle}`, background: T.bgRaised }}>
                            <p style={{ ...TextStyle.caption, color: T.inkTertiary, margin: 0 }}>{k}</p>
                            <p style={{ ...TextStyle.data, color: T.inkPrimary, margin: '4px 0 0' }}>{v}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  <aside>
                    <div style={{ padding: 18, borderRadius: 8, border: `1px solid ${T.borderSubtle}`, background: T.bgRaised }}>
                      <div style={{ ...TextStyle.label, color: T.inkTertiary, marginBottom: 8 }}>CURRENTLY WITH</div>
                      <div style={{ ...TextStyle.subheading, color: T.inkPrimary }}>Supplier</div>
                      <div style={{ ...TextStyle.caption, color: T.inkSecondary, marginTop: 8 }}>Forwarding to supplier</div>
                    </div>
                  </aside>
                </div>
              </div>
            )}
          </PortalShell>
        </CameraZoom>
      </BrowserFrame>

      <Toast visible={toastVisible}>Quote submitted &middot; markup stage entering</Toast>

      <BigCallout
        visible={captionA}
        anchor="top"
        eyebrow="SUPPLIER VIEW"
        title="One tab. One job. Quote the brief."
        accentWord="Quote the brief."
        size="lg"
      />
      <BigCallout
        visible={captionB}
        anchor="top"
        eyebrow="NET COST, USD"
        title="One number. No markup. No noise."
        accentWord="No noise."
        size="lg"
      />
      <BigCallout
        visible={captionC}
        anchor="top"
        eyebrow="AUTO-COMPUTED"
        title="$18,800 ÷ 4 pax = $4,700 per pax."
        accentWord="$4,700 per pax."
        size="md"
      />
    </SetBackground>
  )
}

Object.assign(window, { SceneRouting, SceneSupplierQuote, AgencyRequestDetail })

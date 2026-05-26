// ─────────────────────────────────────────────────────────────────────────────
// Scene — Custom request form (compressed cinematic version, ~22s)
// No cursor. Fields fill themselves. Camera pans down through sections.
// ─────────────────────────────────────────────────────────────────────────────

// Type-on text helper
function typeOn(text, t, startAt, cps = 32) {
  if (t < startAt) return ''
  const chars = Math.floor((t - startAt) * cps)
  return text.slice(0, Math.min(chars, text.length))
}

function TypingInput({ text, t, startAt, cps = 32, placeholder, focused = false, multiline = false, rows = 3, style }) {
  const revealed = typeOn(text, t, startAt, cps)
  const isTyping = t >= startAt && revealed.length < text.length
  const showCursor = isTyping && Math.floor(t * 2) % 2 === 0
  const empty = revealed.length === 0

  if (multiline) {
    return (
      <div style={{
        minHeight: rows * 22 + 16,
        padding: '10px 12px',
        background: T.bgRaised,
        border: `1px solid ${focused ? T.accent : T.borderSubtle}`,
        boxShadow: focused ? `0 0 0 3px ${T.accentSoft}` : 'none',
        borderRadius: 6,
        ...TextStyle.caption,
        color: empty ? T.inkTertiary : T.inkPrimary,
        transition: 'all 200ms ease',
        whiteSpace: 'pre-wrap',
        ...style,
      }}>
        {empty && !isTyping ? placeholder : revealed}
        {showCursor ? <span style={{ color: T.accent }}>▎</span> : null}
      </div>
    )
  }

  return (
    <div style={{
      height: 40, padding: '0 12px',
      display: 'flex', alignItems: 'center',
      background: T.bgRaised,
      border: `1px solid ${focused ? T.accent : T.borderStrong}`,
      boxShadow: focused ? `0 0 0 3px ${T.accentSoft}` : 'none',
      borderRadius: 4,
      ...TextStyle.body,
      color: empty ? T.inkTertiary : T.inkPrimary,
      transition: 'all 200ms ease',
      ...style,
    }}>
      {empty && !isTyping ? placeholder : revealed}
      {showCursor ? <span style={{ color: T.accent, marginLeft: 1 }}>▎</span> : null}
    </div>
  )
}

function Counter({ value, label, style }) {
  return (
    <div style={{ background: T.bgRaised, border: `1px solid ${T.borderSubtle}`, borderRadius: 6, padding: 12, ...style }}>
      {label ? <p style={{ ...TextStyle.caption, color: T.inkTertiary, margin: '0 0 8px' }}>{label}</p> : null}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 14px', borderRadius: 4,
        border: `1px solid ${T.borderSubtle}`, background: T.bgBase,
      }}>
        <span style={{
          width: 26, height: 26, borderRadius: 4,
          display: 'grid', placeItems: 'center',
          border: `1px solid ${T.borderDefault}`, color: T.inkSecondary,
        }}><Icon name="minus" size={12} color={T.inkSecondary} /></span>
        <span style={{ ...TextStyle.data, color: T.inkPrimary, fontSize: 15 }}>{value}</span>
        <span style={{
          width: 26, height: 26, borderRadius: 4,
          display: 'grid', placeItems: 'center',
          border: `1px solid ${T.borderDefault}`, color: T.inkSecondary,
        }}><Icon name="plus" size={12} color={T.inkSecondary} /></span>
      </div>
    </div>
  )
}

// ── Scene: Request form ────────────────────────────────────────────────────

function SceneRequestForm() {
  const { localTime, duration } = useSprite()
  const t = localTime

  // Compressed timing — auto-fill in ~22s
  // 0–2: form enters at top
  // 2–4: Morocco chip selects, cities typed
  // 4–7: cities completing; camera pans down to start of Preferences
  // 7–10: themes Cultural + Family select; hotel 4-star; budget standard
  // 10–13: per-pax 2500 typed; camera pans to Notes
  // 13–17: activities typed
  // 17–20: scroll to Submit; glow on Submit button
  // 20–22: button presses (highlight), toast appears

  const T_DEST    = 2.0
  const T_CITIES  = 3.0
  const T_THEMES  = 7.5
  const T_HOTEL   = 9.0
  const T_BUDGET  = 10.0
  const T_BUDGET_NUM = 11.0
  const T_ACTIVITY = 14.0
  const T_SUBMIT  = 19.5

  const moroccoSelected = t >= T_DEST
  const culturalSelected = t >= T_THEMES
  const familySelected = t >= T_THEMES + 0.6
  const hotel4Selected = t >= T_HOTEL
  const budgetStandardSelected = t >= T_BUDGET
  const submitHover = t > T_SUBMIT - 1.0 && t < T_SUBMIT + 0.5

  // Scroll positions over time — pan down through the form
  const scroll = (() => {
    if (t < 5.5) return 0          // Basics visible
    if (t < 6.5) return (t - 5.5) * 240   // pan to Prefs
    if (t < 12) return 240
    if (t < 13) return 240 + (t - 12) * 280   // pan to Extras
    if (t < 17) return 520
    if (t < 18) return 520 + (t - 17) * 320   // pan to footer
    return 840
  })()

  const toastVisible = t > T_SUBMIT + 0.5 && t < duration

  // Floating caption schedule
  const captionA = t > 0.6 && t < 7.0   // structured fields
  const captionB = t > 7.5 && t < 13   // dimensions rules match on
  const captionC = t > 13.5 && t < 19  // free text only where it matters
  const captionD = t > T_SUBMIT - 0.3 && t < duration  // submit / pipeline

  const agencyNav = [
    { icon: 'compass', label: 'Browse Destinations' },
    { icon: 'inbox', label: 'Custom requests' },
    { icon: 'shopping', label: 'My Bookings' },
    { icon: 'bookmark', label: 'Quotes' },
    { icon: 'wallet', label: 'Wallet' },
  ]

  return (
    <SetBackground>
      <BrowserFrame url="ub-trip.safasoft.com/agency/request/new">
        <CameraZoom keyframes={[
          { t: 0,    scale: 1.0,  fx: 0.5,  fy: 0.5 },
          { t: 1.8,  scale: 1.0,  fx: 0.5,  fy: 0.5 },
          { t: 2.4,  scale: 1.25, fx: 0.30, fy: 0.45 },   // Morocco chip + cities (top of form)
          { t: 7.5,  scale: 1.25, fx: 0.30, fy: 0.45 },
          { t: 8.5,  scale: 1.25, fx: 0.35, fy: 0.50 },   // pan to themes + hotel tier
          { t: 13,   scale: 1.25, fx: 0.35, fy: 0.50 },
          { t: 14.5, scale: 1.20, fx: 0.40, fy: 0.55 },   // pan to notes section
          { t: 18.5, scale: 1.20, fx: 0.40, fy: 0.55 },
          { t: 20,   scale: 1.25, fx: 0.78, fy: 0.92 },   // pan to submit button (bottom-right)
          { t: 22,   scale: 1.25, fx: 0.78, fy: 0.92 },
        ]}>
          <PortalShell
            brandLetter="U" brandColor={T.brandPrimary} brandText="UB Trip" portalLabel="Agency"
            nav={agencyNav} active="Custom requests"
            personaLabel="Enter as Agency"
            personaName="Wang Ming · Beijing Huaxia"
          >
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: -scroll, left: 0, right: 0,
                transition: 'top 700ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}>
                {/* Back link */}
                <div style={{ padding: '20px 32px 6px', borderBottom: `1px solid ${T.borderSubtle}` }}>
                  <span style={{ ...TextStyle.caption, color: T.inkSecondary, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Icon name="arrowLeft" size={13} color={T.inkSecondary} /> My custom requests
                  </span>
                </div>

                <PageHeader
                  eyebrow="CUSTOM REQUESTS"
                  title="Submit a custom request"
                  subtitle={"Describe what your traveller needs \u2014 we\u2019ll route it to the best supplier automatically"}
                />

                <div style={{ maxWidth: 1024, margin: '0 auto', padding: '32px 32px 100px', display: 'flex', flexDirection: 'column', gap: 32 }}>
                  {/* Basics */}
                  <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <h2 style={{ ...TextStyle.heading, color: T.inkPrimary, margin: 0 }}>Basics</h2>

                    <Field label="Destination countries">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {['JO', 'MA', 'EG', 'AE', 'SA', 'OM'].map(c => {
                          const labels = { JO: 'Jordan', MA: 'Morocco', EG: 'Egypt', AE: 'UAE', SA: 'Saudi Arabia', OM: 'Oman' }
                          const active = c === 'MA' && moroccoSelected
                          return <Chip key={c} active={active}>{labels[c]}</Chip>
                        })}
                      </div>
                    </Field>

                    <Field label="Cities to include">
                      <TypingInput
                        text="Marrakech, Sahara, Fez"
                        placeholder="e.g. Petra, Wadi Rum, Dead Sea"
                        t={t} startAt={T_CITIES}
                        cps={30}
                        focused={t > T_CITIES - 0.2 && t < T_CITIES + 1.0}
                      />
                    </Field>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                      <Field label="Travel window">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <Input value="2026-10-15" />
                          <span style={{ color: T.inkTertiary }}>→</span>
                          <Input value="2026-10-25" />
                        </div>
                      </Field>
                      <Field label="Duration (days)">
                        <Counter value={10} />
                      </Field>
                    </div>

                    <Field label="Travellers">
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        <Counter value={4} label="Adults" />
                        <Counter value={0} label="Children" />
                        <Counter value={0} label="Infants" />
                      </div>
                    </Field>
                  </section>

                  {/* Preferences */}
                  <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <h2 style={{ ...TextStyle.heading, color: T.inkPrimary, margin: 0 }}>Preferences &amp; budget</h2>

                    <Field label="Themes">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {['family','luxury','first-time','adventure','cultural','religious'].map(th => {
                          const labels = { family: 'Family', luxury: 'Luxury', 'first-time': 'First-time', adventure: 'Adventure', cultural: 'Cultural', religious: 'Religious' }
                          const active = (th === 'cultural' && culturalSelected) || (th === 'family' && familySelected)
                          return <Chip key={th} active={active}>{labels[th]}</Chip>
                        })}
                      </div>
                    </Field>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Field label="Hotel tier">
                        <div style={{ display: 'flex', gap: 8 }}>
                          {['3','4','5','5+','mixed'].map(tier => (
                            <span key={tier} style={{
                              flex: 1, padding: '10px 0', textAlign: 'center', borderRadius: 6,
                              border: `1px solid ${tier === '4' && hotel4Selected ? T.accentBorder : T.borderSubtle}`,
                              background: tier === '4' && hotel4Selected ? T.accentSoftStrong : T.bgRaised,
                              color: tier === '4' && hotel4Selected ? T.accent : T.inkSecondary,
                              ...TextStyle.caption,
                              transition: 'all 280ms ease',
                            }}>{tier === 'mixed' ? 'Mixed' : `${tier}-star${tier === '5+' ? ' deluxe' : ''}`}</span>
                          ))}
                        </div>
                      </Field>

                      <Field label="Budget band">
                        <div style={{ display: 'flex', gap: 8 }}>
                          {['standard','premium','luxury','unlimited'].map(b => (
                            <span key={b} style={{
                              flex: 1, padding: '10px 0', textAlign: 'center', borderRadius: 6,
                              border: `1px solid ${b === 'standard' && budgetStandardSelected ? T.accentBorder : T.borderSubtle}`,
                              background: b === 'standard' && budgetStandardSelected ? T.accentSoftStrong : T.bgRaised,
                              color: b === 'standard' && budgetStandardSelected ? T.accent : T.inkSecondary,
                              ...TextStyle.caption,
                              textTransform: 'capitalize',
                              transition: 'all 280ms ease',
                            }}>{b}</span>
                          ))}
                        </div>
                      </Field>
                    </div>

                    <Field label="Per-pax budget USD (optional)">
                      <TypingInput
                        text="2500" placeholder="2500"
                        t={t} startAt={T_BUDGET_NUM} cps={12}
                        focused={t > T_BUDGET_NUM - 0.2 && t < T_BUDGET_NUM + 1.5}
                      />
                    </Field>
                  </section>

                  {/* Extras */}
                  <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <h2 style={{ ...TextStyle.heading, color: T.inkPrimary, margin: 0 }}>Special needs &amp; notes</h2>

                    <Field label="Activities / experiences to include">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <TypingInput multiline rows={3} text="" placeholder="中文" t={t} startAt={9999} />
                        <TypingInput
                          multiline rows={3}
                          text="Atlas Mountains horseback ride day for the kids; Marrakech cooking class for the parents"
                          placeholder="English"
                          t={t} startAt={T_ACTIVITY} cps={32}
                          focused={t > T_ACTIVITY - 0.2 && t < T_ACTIVITY + 4}
                        />
                      </div>
                    </Field>

                    <Field label="Anything else">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <TypingInput multiline rows={2} text="" placeholder="中文" t={t} startAt={9999} />
                        <TypingInput
                          multiline rows={2}
                          text="Repeat client from Beijing, third trip with us."
                          placeholder="English"
                          t={t} startAt={T_ACTIVITY + 3} cps={32}
                        />
                      </div>
                    </Field>
                  </section>
                </div>
              </div>

              {/* Always-visible submit footer */}
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                gap: 12, height: 74, padding: '0 32px',
                borderTop: `1px solid ${T.borderSubtle}`,
                background: 'rgba(250,248,243,0.95)',
                backdropFilter: 'blur(8px)',
                zIndex: 2,
              }}>
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary" size="lg" icon="send"
                  style={{
                    boxShadow: submitHover
                      ? `0 0 0 6px ${T.accentSoft}, 0 0 28px rgba(212,166,90,0.55)`
                      : 'none',
                    transform: submitHover ? 'translateY(-1px) scale(1.02)' : 'none',
                    transition: 'all 220ms ease',
                  }}>
                  Submit request
                </Button>
              </div>
            </div>
          </PortalShell>
        </CameraZoom>
      </BrowserFrame>

      <Toast visible={toastVisible}>Request submitted &middot; auto-routing in progress</Toast>

      <BigCallout
        visible={captionA}
        anchor="top"
        eyebrow="STRUCTURED FIELDS"
        title="The supplier needs this. The rules match on this."
        accentWord="The rules match on this."
        size="md"
      />
      <BigCallout
        visible={captionB}
        anchor="top"
        eyebrow="WHAT THE RULES READ"
        title="Theme. Hotel tier. Budget."
        accentWord="Budget."
        size="lg"
      />
      <BigCallout
        visible={captionC}
        anchor="top"
        eyebrow="BILINGUAL BY DEFAULT"
        title="The supplier reads English. The agency types either."
        accentWord="either."
        size="md"
      />
      <BigCallout
        visible={captionD}
        anchor="top"
        eyebrow="SUBMIT · THE PIPELINE OPENS"
        title="Auto-routing in milliseconds."
        accentWord="milliseconds."
        size="lg"
      />
    </SetBackground>
  )
}

Object.assign(window, { SceneRequestForm, TypingInput, Counter, typeOn })

// ─────────────────────────────────────────────────────────────────────────────
// App — Cinematic 2:32 reel for Safasoft custom-request pipeline
// ─────────────────────────────────────────────────────────────────────────────

// ── In-between Statement scenes (Apple/Google launch style) ────────────────

function SceneStatementSubmit() {
  return (
    <SetBackground>
      <StatementCard
        eyebrow="THE PIPELINE OPENS"
        title="Auto-routing in milliseconds."
        accentWord="milliseconds."
        emphasize="italic"
        subtitle={<>Two rules match. Both auto-forward. The supplier holds the brief in under a second.</>}
      />
    </SetBackground>
  )
}

function SceneStatementOneHuman() {
  return (
    <SetBackground>
      <StatementCard
        eyebrow="ONE HUMAN IN THE CHAIN"
        title="The supplier quotes one number."
        accentWord="one number."
        emphasize="italic"
        subtitle={<>Net total in USD. Markups happen on the return leg &mdash; that&rsquo;s not the supplier&rsquo;s concern.</>}
      />
    </SetBackground>
  )
}

function SceneStatementMarkup() {
  return (
    <SetBackground>
      <StatementCard
        eyebrow="ON THE RETURN LEG"
        title="Margins stack by rule."
        accentWord="by rule."
        emphasize="italic"
        subtitle={<>Each party&rsquo;s markup policy lives in the rules engine. Each application is named and timestamped &mdash; no haggling downstream.</>}
      />
    </SetBackground>
  )
}

function SceneStatementRetail() {
  return (
    <SetBackground>
      <StatementCard
        eyebrow="QUOTED TO AGENCY"
        title="$26,150."
        accentWord="$26,150."
        emphasize="plain"
        subtitle={<>One number to the agency. 72 hours to decide. The full breakdown is one click away &mdash; for whoever needs it.</>}
      />
    </SetBackground>
  )
}

// ── Schedule ───────────────────────────────────────────────────────────────

const SCHEDULE = [
  // start, end, component, label
  [   0,   8,   SceneTitle,             '00 Open' ],
  [   8,  22,   SceneBrowse,            '01 Beyond the catalog' ],
  [  22,  44,   SceneRequestForm,       '02 The brief' ],
  [  44,  49,   SceneStatementSubmit,   '· Submit' ],
  [  49,  67,   SceneRouting,           '03 Auto-routing' ],
  [  67,  72,   SceneStatementOneHuman, '· One human' ],
  [  72,  94,   SceneSupplierQuote,     '04 Supplier quote' ],
  [  94, 100,   SceneStatementMarkup,   '· Margins stack' ],
  [ 100, 120,   SceneMarkupStack,       '05 Wholesaler view' ],
  [ 120, 125,   SceneStatementRetail,   '· $26,150' ],
  [ 125, 142,   SceneAgencyAccept,      '06 Accept' ],
  [ 142, 152,   SceneEnd,               '· End' ],
]

const DURATION = SCHEDULE[SCHEDULE.length - 1][1]

function DemoReel() {
  return (
    <Stage
      width={1920}
      height={1080}
      duration={DURATION}
      background="#F4EFE4"
      persistKey="safasoft-demo-reel"
      loop={true}
      autoplay={true}
    >
      {SCHEDULE.map(([start, end, Comp], i) => (
        <Sprite key={i} start={start} end={end}>
          <SceneFrame entry={0.5} exit={0.5}>
            <Comp />
          </SceneFrame>
        </Sprite>
      ))}

      <ChapterRibbon />
    </Stage>
  )
}

function ChapterRibbon() {
  const { time, duration } = useTimeline()
  const pct = (time / duration) * 100
  const idx = SCHEDULE.findIndex(([s, e]) => time >= s && time < e)
  const label = idx >= 0 ? SCHEDULE[idx][3] : ''
  return (
    <>
      <div style={{
        position: 'absolute', top: 0, left: 0, height: 2,
        width: `${pct}%`, background: T.accent,
        transition: 'width 60ms linear',
        zIndex: 10000,
      }} />
      <div style={{
        position: 'absolute', top: 18, right: 28,
        fontFamily: F.mono, fontWeight: 500,
        fontSize: 10, letterSpacing: '0.20em',
        color: 'rgba(26,22,18,0.36)',
        textTransform: 'uppercase',
        zIndex: 10000,
        pointerEvents: 'none',
      }}>
        {label} &middot; {fmtTime(time)} / {fmtTime(duration)}
      </div>
    </>
  )
}

function fmtTime(t) {
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<DemoReel />)

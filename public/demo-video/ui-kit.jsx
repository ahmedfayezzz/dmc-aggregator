// ─────────────────────────────────────────────────────────────────────────────
// UI Kit — mirrors Safasoft's actual product (dark mode default)
// All design tokens lifted from system/app/globals.css and ui-design-guide.md
// ─────────────────────────────────────────────────────────────────────────────

const T = {
  // Surfaces — LIGHT mode
  bgBase:    '#FAF8F3',
  bgRaised:  '#FFFFFF',
  bgSunken:  '#F2EFE8',

  // Ink
  inkPrimary:    '#1A1612',
  inkSecondary:  '#5C564E',
  inkTertiary:   '#8A8278',
  inkQuat:       '#B5AC9F',

  // Borders
  borderSubtle:  '#EEE9DD',
  borderDefault: '#DDD5C5',
  borderStrong:  '#C9C1AC',

  // Accent
  accent:        '#B58A3F',
  accentHover:   '#8A6628',
  accentSoft:    '#FBF7ED',
  accentSoftStrong: '#F4E9CC',
  accentBorder:  '#E5C988',

  // Status
  success:      '#3D7A5C',
  successSoft:  '#E8F0EA',
  successBorder:'#A8C7B4',
  warning:      '#B58A3F',
  warningSoft:  '#FBF7ED',
  danger:       '#A04428',
  dangerSoft:   '#F5E5DF',
  info:         '#4A7C9E',
  infoSoft:     '#E7EFF5',

  // Tenant (UB Trip)
  brandPrimary: '#1E4D5C',

  // Walkthrough panel surfaces (deep card on light bg)
  panelBg:      '#1A1612',
  panelInk:     '#FAF8F3',
  panelInkDim:  'rgba(250, 248, 243, 0.62)',
  panelAccent:  '#E5C988',
}

const F = {
  body:    '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  display: '"Fraunces", Georgia, serif',
  mono:    '"Geist Mono", "SF Mono", Menlo, monospace',
}

// Type scale utilities — match globals.css
const TextStyle = {
  displayXl:  { fontFamily: F.display, fontWeight: 300, fontSize: 64, lineHeight: 1.05, letterSpacing: '-0.04em', fontVariationSettings: '"SOFT" 80, "opsz" 144' },
  displayLg:  { fontFamily: F.display, fontWeight: 300, fontSize: 48, lineHeight: 1.05, letterSpacing: '-0.03em', fontVariationSettings: '"SOFT" 60, "opsz" 100' },
  displayMd:  { fontFamily: F.display, fontWeight: 400, fontSize: 32, lineHeight: 1.1,  letterSpacing: '-0.02em', fontVariationSettings: '"SOFT" 40, "opsz" 80' },
  heading:    { fontFamily: F.body,    fontWeight: 500, fontSize: 22, lineHeight: 1.25, letterSpacing: '-0.01em' },
  subheading: { fontFamily: F.body,    fontWeight: 500, fontSize: 18, lineHeight: 1.3 },
  body:       { fontFamily: F.body,    fontWeight: 400, fontSize: 14, lineHeight: 1.5 },
  caption:    { fontFamily: F.body,    fontWeight: 400, fontSize: 13, lineHeight: 1.4 },
  label:      { fontFamily: F.mono,    fontWeight: 500, fontSize: 11, lineHeight: 1.2, letterSpacing: '0.12em', textTransform: 'uppercase' },
  data:       { fontFamily: F.mono,    fontWeight: 400, fontSize: 14, lineHeight: 1.4, letterSpacing: '-0.005em', fontVariantNumeric: 'tabular-nums' },
}

// ─── Topbar + Sidebar shell ─────────────────────────────────────────────────

function PortalShell({
  brandLetter = 'U',
  brandColor = T.brandPrimary,
  brandText = 'UB Trip',
  portalLabel = 'Agency',
  nav,                 // [{ icon, label, active }]
  active,              // string — matches nav[].label
  personaLabel,        // bottom-of-sidebar persona ("Enter as Agency")
  personaName,         // bottom-of-sidebar entity ("Wang Ming · Beijing Huaxia")
  topbar,              // optional react node for topbar center
  children,
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100%', width: '100%', background: T.bgBase, color: T.inkPrimary, fontFamily: F.body }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0,
        borderRight: `1px solid ${T.borderSubtle}`,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Brand */}
        <div style={{
          height: 60, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px',
          borderBottom: `1px solid ${T.borderSubtle}`,
        }}>
          <span style={{
            width: 28, height: 28, display: 'grid', placeItems: 'center',
            borderRadius: 3,
            background: brandColor,
            color: T.inkPrimary,
            fontSize: 11, fontWeight: 600,
          }}>{brandLetter}</span>
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 4 }}>
            <span style={{ ...TextStyle.body, color: T.inkPrimary }}>{brandText}</span>
            <span style={{ fontSize: 10, fontFamily: F.mono, letterSpacing: '0.16em', color: T.inkTertiary, textTransform: 'uppercase' }}>{portalLabel}</span>
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {nav.map((item, i) => {
            const isActive = item.label === active
            return (
              <div key={i} style={{
                position: 'relative',
                height: 40,
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '0 12px',
                borderRadius: 6,
                background: isActive ? T.accentSoft : 'transparent',
                color: isActive ? T.inkPrimary : T.inkSecondary,
              }}>
                {isActive ? (
                  <span style={{
                    position: 'absolute', left: 0, top: '50%',
                    height: 20, width: 2, background: T.accent,
                    transform: 'translateY(-50%)', borderRadius: 1,
                  }} />
                ) : null}
                <Icon name={item.icon} size={16} color={isActive ? T.accent : T.inkTertiary} />
                <span style={{ ...TextStyle.body, fontSize: 14 }}>{item.label}</span>
              </div>
            )
          })}
        </nav>

        {/* Persona switcher footer */}
        <div style={{ padding: 12, borderTop: `1px solid ${T.borderSubtle}` }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px',
            borderRadius: 6,
            border: `1px solid ${T.borderSubtle}`,
            background: T.bgSunken,
          }}>
            <Icon name={personaLabel?.startsWith('Supplier') ? 'compass' : personaLabel?.startsWith('Wholesaler') ? 'building' : personaLabel?.startsWith('DMC') ? 'shield' : 'store'} size={16} color={T.accent} />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 10, fontFamily: F.mono, letterSpacing: '0.16em', color: T.inkTertiary, textTransform: 'uppercase' }}>{personaLabel}</span>
              <span style={{ ...TextStyle.caption, color: T.inkPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{personaName}</span>
            </div>
            <Icon name="chevronsUpDown" size={13} color={T.inkTertiary} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
        <header style={{
          height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, padding: '0 32px',
          borderBottom: `1px solid ${T.borderSubtle}`,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ flex: 1 }}>{topbar}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ ...TextStyle.label, color: T.inkSecondary, padding: '6px 10px' }}>EN</span>
            <Icon name="sun" size={16} color={T.inkTertiary} />
          </div>
        </header>
        <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>{children}</main>
      </div>
    </div>
  )
}

// Page header — eyebrow + title + subtitle, optional right actions
function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div style={{ padding: '32px 32px 24px', borderBottom: `1px solid ${T.borderSubtle}` }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32 }}>
        <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
          {eyebrow ? <div style={{ ...TextStyle.label, color: T.inkTertiary, marginBottom: 10 }}>{eyebrow}</div> : null}
          <h1 style={{ ...TextStyle.displayMd, color: T.inkPrimary, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
          {subtitle ? <p style={{ ...TextStyle.body, color: T.inkSecondary, margin: '10px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</p> : null}
        </div>
        {actions ? <div style={{ flexShrink: 0 }}>{actions}</div> : null}
      </div>
    </div>
  )
}

// Status badge — pill, tinted bg/border, solid label
function StatusBadge({ variant = 'info', children }) {
  const map = {
    success: { fg: T.success, soft: T.successSoft, border: T.successBorder },
    warning: { fg: T.warning, soft: T.warningSoft, border: T.accentBorder },
    danger:  { fg: T.danger,  soft: T.dangerSoft,  border: 'rgba(194,90,61,0.30)' },
    info:    { fg: T.info,    soft: T.infoSoft,    border: 'rgba(94,143,168,0.30)' },
    accent:  { fg: T.accent,  soft: T.accentSoft,  border: T.accentBorder },
    neutral: { fg: T.inkSecondary, soft: 'rgba(245,239,224,0.04)', border: T.borderDefault },
  }
  const s = map[variant] || map.info
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: 24, padding: '0 10px', borderRadius: 3,
      background: s.soft, border: `1px solid ${s.border}`, color: s.fg,
      ...TextStyle.caption, fontWeight: 500,
    }}>{children}</span>
  )
}

// Button — primary (gold), secondary, ghost
function Button({ variant = 'primary', size = 'md', icon, children, style }) {
  const sizes = {
    sm: { h: 32, px: 12, fs: 13 },
    md: { h: 40, px: 16, fs: 14 },
    lg: { h: 48, px: 20, fs: 14 },
  }
  const sz = sizes[size]
  const variants = {
    primary:   { bg: T.accent, fg: '#FAF8F3', border: 'transparent', weight: 500 },
    secondary: { bg: T.bgRaised, fg: T.inkPrimary, border: T.borderDefault, weight: 400 },
    ghost:     { bg: 'transparent', fg: T.inkSecondary, border: 'transparent', weight: 400 },
    destructive:{ bg: 'transparent', fg: T.danger, border: 'rgba(194,90,61,0.30)', weight: 500 },
  }
  const v = variants[variant] || variants.primary
  return (
    <button style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      height: sz.h, padding: `0 ${sz.px}px`,
      background: v.bg, color: v.fg,
      border: `1px solid ${v.border}`,
      borderRadius: 4,
      fontFamily: F.body, fontSize: sz.fs, fontWeight: v.weight,
      cursor: 'default',
      ...style,
    }}>
      {icon ? <Icon name={icon} size={16} color={v.fg} /> : null}
      {children}
    </button>
  )
}

// Chip — used for country / theme multi-select buttons
function Chip({ active, children, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '6px 12px', borderRadius: 6,
      border: `1px solid ${active ? T.accentBorder : T.borderSubtle}`,
      background: active ? T.accentSoftStrong : T.bgRaised,
      color: active ? T.accent : T.inkSecondary,
      ...TextStyle.caption,
      transition: 'all 220ms ease',
      ...style,
    }}>{children}</span>
  )
}

// Field label + content
function Field({ label, children, style }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      <span style={{ ...TextStyle.caption, color: T.inkTertiary }}>{label}</span>
      {children}
    </label>
  )
}

// Input shell
function Input({ value, placeholder, style }) {
  return (
    <div style={{
      height: 40, padding: '0 12px',
      display: 'flex', alignItems: 'center',
      background: T.bgRaised,
      border: `1px solid ${T.borderStrong}`,
      borderRadius: 4,
      ...TextStyle.body,
      color: value ? T.inkPrimary : T.inkTertiary,
      ...style,
    }}>{value || placeholder || ''}</div>
  )
}

// ─── Cursor (animated arrow that moves around the canvas) ───────────────────

// macOS-style cursor — dark fill for light mode visibility
function Cursor({ x, y, clicked = false, opacity = 1 }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      pointerEvents: 'none', zIndex: 9000,
      transform: `translate(-2px, -2px) scale(${clicked ? 0.92 : 1})`,
      transformOrigin: 'top left',
      opacity,
      filter: 'drop-shadow(0 2px 4px rgba(26,22,18,0.35))',
      transition: 'transform 120ms ease',
      willChange: 'transform, left, top',
    }}>
      <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
        <path d="M2 2 L2 22 L7 17.5 L10 24 L13 23 L10 16.5 L17 16.5 Z"
              fill="#1A1612" stroke="#FAF8F3" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
      {/* Click ripple */}
      {clicked ? (
        <span style={{
          position: 'absolute', left: 11, top: 12,
          width: 30, height: 30, borderRadius: 30,
          marginLeft: -15, marginTop: -15,
          border: `2px solid ${T.accent}`,
          animation: 'cursorRipple 420ms ease-out forwards',
          pointerEvents: 'none',
        }} />
      ) : null}
    </div>
  )
}

// Helpers: smoothstep entry/exit opacity given localTime + duration + entry/exit
function fade({ localTime, duration, entry = 0.4, exit = 0.4, hold = true }) {
  if (localTime < 0) return 0
  if (localTime > duration) return 0
  if (localTime < entry) return Easing.easeOutCubic(clamp(localTime / entry, 0, 1))
  const exitStart = duration - exit
  if (localTime > exitStart) {
    const t = clamp((localTime - exitStart) / exit, 0, 1)
    return 1 - Easing.easeInCubic(t)
  }
  return 1
}

// Toast — appears at top right when an action is taken
function Toast({ children, visible }) {
  return (
    <div style={{
      position: 'absolute', top: 80, right: 32,
      padding: '12px 16px',
      background: T.bgRaised,
      border: `1px solid ${T.accentBorder}`,
      borderRadius: 6,
      ...TextStyle.caption, color: T.inkPrimary,
      display: 'inline-flex', alignItems: 'center', gap: 10,
      boxShadow: '0 12px 32px rgba(26,22,18,0.18)',
      opacity: visible ? 1 : 0,
      transform: `translateY(${visible ? 0 : -10}px)`,
      transition: 'opacity 260ms ease, transform 260ms ease',
      zIndex: 8000,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: 6, background: T.accent, flexShrink: 0,
      }} />
      {children}
    </div>
  )
}

// ─── Pipeline timeline (4-stage stepper) ───────────────────────────────────

// progressIndex: -1 (not started), 0..3 (currently with stage idx),
//                4 = accepted, 5 = declined
// onStages: which stage indexes have a fully-rendered audit-log entry
function PipelineStepper({ holderIdx = 0, direction = 'forward', accepted = false }) {
  const stages = [
    { actor: 'Agency', icon: 'users' },
    { actor: 'Wholesaler', icon: 'store' },
    { actor: 'DMC',  icon: 'building' },
    { actor: 'Supplier', icon: 'plane' },
  ]
  const passed = (i) => {
    if (accepted) return true
    if (direction === 'forward') return i < holderIdx
    return i > holderIdx
  }
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
      padding: 20,
      borderRadius: 8,
      background: T.bgRaised,
      border: `1px solid ${T.borderSubtle}`,
    }}>
      {stages.map((s, i) => {
        const isCurrent = i === holderIdx && !accepted
        const isPassed = passed(i)
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, position: 'relative' }}>
            <span style={{
              width: 40, height: 40, borderRadius: 40,
              display: 'grid', placeItems: 'center',
              border: `2px solid ${
                isCurrent ? T.accent : isPassed ? T.successBorder : T.borderSubtle
              }`,
              background: isCurrent ? T.accentSoft : isPassed ? T.successSoft : T.bgBase,
              color: isCurrent ? T.accent : isPassed ? T.success : T.inkTertiary,
              boxShadow: isCurrent ? `0 0 0 4px ${T.accentSoft}` : 'none',
              transition: 'all 260ms ease',
            }}>
              {isPassed && !isCurrent
                ? <Icon name="check" size={14} color={T.success} />
                : <Icon name={s.icon} size={14} color={isCurrent ? T.accent : T.inkTertiary} />}
            </span>
            <span style={{ ...TextStyle.caption, color: isCurrent ? T.accent : T.inkSecondary }}>{s.actor}</span>
            {isCurrent ? (
              <span style={{ fontSize: 9, fontFamily: F.mono, letterSpacing: '0.12em', color: T.accent, textTransform: 'uppercase' }}>Currently with</span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

// Audit log entry — appended as the pipeline advances
function AuditEntry({ actor, action, time, note, amount, isDecline, isAccept, isRule, opacity = 1 }) {
  const dotColor = isDecline ? T.danger : isAccept ? T.success : isRule ? T.accent : T.inkSecondary
  const dotBg    = isDecline ? T.dangerSoft : isAccept ? T.successSoft : isRule ? T.accentSoft : 'transparent'
  const dotBorder= isDecline ? 'rgba(194,90,61,0.4)' : isAccept ? T.successBorder : isRule ? T.accentBorder : T.borderDefault

  return (
    <li style={{
      position: 'relative', paddingLeft: 0,
      opacity, transform: `translateY(${(1 - opacity) * 6}px)`,
      transition: 'opacity 260ms ease, transform 260ms ease',
    }}>
      <span style={{
        position: 'absolute', left: -22, top: 2,
        width: 16, height: 16, borderRadius: 16,
        display: 'grid', placeItems: 'center',
        background: dotBg, border: `1px solid ${dotBorder}`,
        color: dotColor,
      }}>
        {isAccept ? <Icon name="check" size={9} color={T.success} /> :
         isDecline ? <Icon name="xCircle" size={9} color={T.danger} /> :
         isRule ? <Icon name="cog" size={9} color={T.accent} /> :
         <Icon name="check" size={9} color={T.inkSecondary} />}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ ...TextStyle.caption, color: T.inkPrimary }}>{actor}</span>
        <Icon name="chevronRight" size={11} color={T.inkTertiary} />
        <span style={{ ...TextStyle.caption, color: T.inkSecondary }}>{action}</span>
        {amount ? <span style={{ ...TextStyle.data, color: T.accent }}>{amount}</span> : null}
        <span style={{ marginLeft: 'auto', ...TextStyle.caption, color: T.inkTertiary, fontFamily: F.mono, fontSize: 12 }}>{time}</span>
      </div>
      {note ? <p style={{ margin: '4px 0 0', ...TextStyle.caption, color: T.inkTertiary }}>{note}</p> : null}
    </li>
  )
}

function AuditLog({ children }) {
  return (
    <div>
      <h4 style={{ ...TextStyle.label, color: T.inkTertiary, margin: '0 0 12px' }}>Audit log</h4>
      <ol style={{
        listStyle: 'none', padding: 0, margin: 0,
        paddingLeft: 22, borderLeft: `1px solid ${T.borderSubtle}`,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>{children}</ol>
    </div>
  )
}

// Pricing breakdown card — rows of layer label + USD value, last row emphasized
function PricingBreakdown({ rows, title = 'Pricing' }) {
  return (
    <div>
      <h4 style={{ ...TextStyle.label, color: T.inkTertiary, margin: '0 0 12px' }}>{title}</h4>
      <div style={{ borderRadius: 8, border: `1px solid ${T.borderSubtle}`, background: T.bgRaised, overflow: 'hidden' }}>
        {rows.map((r, i) => (
          <div key={r.key} style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: i < rows.length - 1 ? `1px solid ${T.borderSubtle}` : 'none',
            background: r.emphasis ? T.accentSoftStrong : 'transparent',
            opacity: r.visible === false ? 0 : 1,
            transform: r.visible === false ? 'translateX(8px)' : 'translateX(0)',
            transition: 'opacity 320ms ease, transform 320ms ease, background 240ms ease',
          }}>
            <span style={{ ...TextStyle.caption, color: r.emphasis ? T.inkPrimary : T.inkSecondary }}>{r.label}</span>
            <span style={r.emphasis
              ? { ...TextStyle.heading, color: T.accent }
              : { ...TextStyle.data, color: T.inkPrimary }
            }>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── BrowserFrame — macOS-style window chrome around the UI ────────────────
//
// Wrap the UI in a cinematic browser frame. The frame is sized to leave
// dedicated band space above and below for BigCallout text overlays.
//
// `zoom` simulates browser-level zoom (like Cmd+= in Chrome): the inner
// content renders at a SMALLER logical viewport, then CSS-scales up to fill
// the frame. This makes everything (text, padding, components) appear larger
// without changing component layout.
//
// Default 1700×780 centered on a 1920×1080 canvas: 150px top, 150px bottom,
// 110px left/right. zoom: 1.25 ≈ Cmd+= once in Chrome.
function BrowserFrame({
  url = 'safasoft.com',
  children,
  width = 1700,
  height = 780,
  chromeHeight = 40,
  zoom = 1.0,
  style,
}) {
  const contentH = height - chromeHeight
  // Logical viewport: smaller, then scaled up
  const logicalW = width / zoom
  const logicalH = contentH / zoom

  return (
    <div style={{
      position: 'absolute',
      left: '50%', top: '50%',
      width, height,
      transform: 'translate(-50%, -50%)',
      borderRadius: 14,
      background: T.bgRaised,
      boxShadow: '0 40px 100px -10px rgba(26,22,18,0.32), 0 12px 32px -6px rgba(26,22,18,0.14), inset 0 0 0 1px rgba(26,22,18,0.05)',
      overflow: 'hidden',
      ...style,
    }}>
      {/* Chrome */}
      <div style={{
        height: chromeHeight, display: 'flex', alignItems: 'center', gap: 16,
        padding: '0 18px',
        background: 'rgba(238, 233, 221, 0.6)',
        borderBottom: `1px solid ${T.borderSubtle}`,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: 12, background: '#FF5F57' }} />
          <span style={{ width: 12, height: 12, borderRadius: 12, background: '#FEBC2E' }} />
          <span style={{ width: 12, height: 12, borderRadius: 12, background: '#28C840' }} />
        </div>
        <div style={{
          flex: 1, maxWidth: 580, margin: '0 auto',
          height: 28, padding: '0 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: T.bgBase,
          border: `1px solid ${T.borderSubtle}`,
          borderRadius: 8,
          ...TextStyle.caption, color: T.inkSecondary,
          fontFamily: F.mono, fontSize: 12,
        }}>
          <span style={{ color: T.inkTertiary }}>{'\u{1F512}'}</span> {url}
        </div>
        <div style={{ width: 40 }} />
      </div>
      {/* Content area — browser-zoom: render smaller, scale up */}
      <div style={{
        position: 'relative',
        height: contentH,
        width: '100%',
        overflow: 'hidden',
        background: T.bgBase,
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0,
          width: logicalW, height: logicalH,
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
        }}>{children}</div>
      </div>
    </div>
  )
}

// ─── StatementCard — full-canvas headline takeover (Apple/Google style) ────
//
// A full-screen card with a big editorial statement that appears between
// scenes or as an opening beat. Single thought. Big type. Quiet motion.
function StatementCard({
  eyebrow,
  title,
  subtitle,
  align = 'center',          // 'center' | 'left'
  accentWord,                // optional: a word to highlight in accent
  emphasize = 'italic',      // 'italic' | 'plain' — how accentWord renders
}) {
  const { localTime, duration } = useSprite()
  const t = localTime

  // Each element fades in staggered, holds, fades out
  const op = (delay) => {
    const exitStart = duration - 0.6
    if (t < delay) return 0
    if (t < delay + 0.7) return Easing.easeOutCubic((t - delay) / 0.7)
    if (t > exitStart) return 1 - Easing.easeInCubic(clamp((t - exitStart) / 0.6, 0, 1))
    return 1
  }
  const ty = (delay) => {
    if (t < delay) return 12
    if (t < delay + 0.7) return (1 - Easing.easeOutCubic((t - delay) / 0.7)) * 12
    return 0
  }

  // Subtle ken-burns: drift upward over scene
  const drift = -8 * Easing.easeOutCubic(clamp(t / duration, 0, 1))

  // Build accent-wrapped title
  const renderTitle = (text) => {
    if (!accentWord) return text
    const idx = text.indexOf(accentWord)
    if (idx < 0) return text
    return (
      <>
        {text.slice(0, idx)}
        <span style={{
          color: T.accent,
          fontStyle: emphasize === 'italic' ? 'italic' : 'normal',
          fontWeight: emphasize === 'italic' ? 400 : 500,
        }}>{accentWord}</span>
        {text.slice(idx + accentWord.length)}
      </>
    )
  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(ellipse at 50% 38%, ${T.accentSoftStrong} 0%, rgba(250,248,243,0) 60%), ${T.bgBase}`,
      display: 'flex', flexDirection: 'column', alignItems: align === 'left' ? 'flex-start' : 'center', justifyContent: 'center',
      padding: align === 'left' ? '0 140px' : '0 80px',
      textAlign: align,
      transform: `translateY(${drift}px)`,
    }}>
      {eyebrow ? (
        <div style={{
          ...TextStyle.label,
          color: T.accent,
          fontSize: 12, letterSpacing: '0.22em',
          marginBottom: 28,
          opacity: op(0),
          transform: `translateY(${ty(0)}px)`,
        }}>{eyebrow}</div>
      ) : null}
      <h1 style={{
        fontFamily: F.display,
        fontWeight: 300,
        fontSize: title && (typeof title === 'string' ? title.length : 0) > 26 ? 64 : 84,
        lineHeight: 1.15,
        letterSpacing: '-0.035em',
        color: T.inkPrimary,
        margin: 0,
        maxWidth: 1500,
        whiteSpace: 'nowrap',
        opacity: op(0.25),
        transform: `translateY(${ty(0.25)}px)`,
        fontVariationSettings: '"SOFT" 60, "opsz" 144',
      }}>{renderTitle(title)}</h1>
      {subtitle ? (
        <p style={{
          marginTop: 40,
          ...TextStyle.subheading,
          fontSize: 22, lineHeight: 1.45,
          fontWeight: 400,
          color: T.inkSecondary,
          maxWidth: 900,
          textWrap: 'pretty',
          opacity: op(0.6),
          transform: `translateY(${ty(0.6)}px)`,
        }}>{subtitle}</p>
      ) : null}
    </div>
  )
}

// ─── FloatingCaption — brief overlay annotation, in-canvas ─────────────────
//
// Short caption that appears in a specific spot for a few seconds. Used to
// label a moment ("rule wr-002 fired") without dominating the screen.
function FloatingCaption({
  eyebrow,
  text,
  position = { left: 80, bottom: 80 },   // CSS positioning
  width = 380,
  visible = true,
  variant = 'light',                      // 'light' | 'dark'
}) {
  const isDark = variant === 'dark'
  return (
    <div style={{
      position: 'absolute',
      ...position,
      width,
      padding: '14px 18px',
      background: isDark ? T.inkPrimary : T.bgRaised,
      color: isDark ? T.bgBase : T.inkPrimary,
      border: `1px solid ${isDark ? T.inkPrimary : T.borderDefault}`,
      borderRadius: 8,
      boxShadow: isDark
        ? '0 12px 36px rgba(26,22,18,0.30)'
        : '0 10px 28px rgba(26,22,18,0.10)',
      opacity: visible ? 1 : 0,
      transform: `translateY(${visible ? 0 : 8}px)`,
      transition: 'opacity 320ms ease, transform 320ms ease',
      zIndex: 9500,
      pointerEvents: 'none',
    }}>
      {eyebrow ? (
        <div style={{
          ...TextStyle.label, fontSize: 10,
          color: isDark ? T.accentBorder : T.accent,
          marginBottom: 6,
        }}>{eyebrow}</div>
      ) : null}
      <div style={{
        ...TextStyle.body,
        fontSize: 15, lineHeight: 1.45,
        color: isDark ? T.bgBase : T.inkPrimary,
      }}>{text}</div>
    </div>
  )
}

// ─── CameraZoom — animated focal-point zoom (Apple/Google launch style) ───
//
// Wrap a region of UI to zoom around a focal point. Much simpler than
// scale+translate: just specify (scale, fx, fy) and the transform-origin
// becomes the focal point.
//
//   <CameraZoom keyframes={[
//     { t: 0, scale: 1.0, fx: 0.5, fy: 0.5 },          // wide
//     { t: 1, scale: 1.4, fx: 0.7, fy: 0.3 },          // zoom into top-right
//   ]}>
//     ...UI...
//   </CameraZoom>
//
// fx, fy are 0..1 (fractional position in the wrapped content).
function CameraZoom({ keyframes = [], children, easing = Easing.easeInOutCubic }) {
  const { localTime } = useSprite()
  const t = localTime

  let scale = 1, fx = 0.5, fy = 0.5
  if (keyframes.length === 0) {
    // identity
  } else if (t <= keyframes[0].t) {
    ({ scale = 1, fx = 0.5, fy = 0.5 } = keyframes[0])
  } else if (t >= keyframes[keyframes.length - 1].t) {
    ({ scale = 1, fx = 0.5, fy = 0.5 } = keyframes[keyframes.length - 1])
  } else {
    for (let i = 0; i < keyframes.length - 1; i++) {
      const a = keyframes[i], b = keyframes[i + 1]
      if (t >= a.t && t <= b.t) {
        const local = (b.t - a.t) > 0 ? (t - a.t) / (b.t - a.t) : 1
        const eased = easing(clamp(local, 0, 1))
        scale = (a.scale ?? 1) + ((b.scale ?? 1) - (a.scale ?? 1)) * eased
        fx    = (a.fx    ?? 0.5) + ((b.fx    ?? 0.5) - (a.fx    ?? 0.5)) * eased
        fy    = (a.fy    ?? 0.5) + ((b.fy    ?? 0.5) - (a.fy    ?? 0.5)) * eased
        break
      }
    }
  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      transform: `scale(${scale})`,
      transformOrigin: `${fx * 100}% ${fy * 100}%`,
      willChange: 'transform, transform-origin',
      // No transition — driven by frame loop. Transition CSS would fight the
      // per-frame interpolation and cause jitter, especially when scale and
      // origin change simultaneously.
    }}>{children}</div>
  )
}

// ─── BigCallout — dramatic full-width highlight bar with HUGE text ─────────
//
// Lives in the canvas MARGIN above or below the browser frame, so it never
// covers the UI it's describing. Anchored to canvas top or bottom edge.
//
//   <BigCallout
//     visible={t > 3 && t < 7}
//     anchor="top"
//     eyebrow="AUTO-ROUTING"
//     title="Two rules fired in 1.2 seconds."
//     accentWord="1.2 seconds"
//   />
function BigCallout({
  visible,
  anchor = 'top',          // 'top' | 'bottom'
  eyebrow,
  title,
  accentWord,
  size = 'lg',             // 'md' | 'lg' | 'xl'
}) {
  const op = visible ? 1 : 0
  const sizes = {
    md: { titleSz: 34, eyebrowSz: 11, padBlock: 22, padInline: 110 },
    lg: { titleSz: 44, eyebrowSz: 12, padBlock: 26, padInline: 110 },
    xl: { titleSz: 56, eyebrowSz: 13, padBlock: 32, padInline: 110 },
  }
  const sz = sizes[size] || sizes.lg

  const renderTitle = (text) => {
    if (!accentWord || typeof text !== 'string') return text
    const idx = text.indexOf(accentWord)
    if (idx < 0) return text
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ color: T.accent, fontStyle: 'italic' }}>{accentWord}</span>
        {text.slice(idx + accentWord.length)}
      </>
    )
  }

  const isTop = anchor === 'top'
  return (
    <div style={{
      position: 'absolute',
      left: 0, right: 0,
      [isTop ? 'top' : 'bottom']: 0,
      height: 150,
      padding: `${sz.padBlock}px ${sz.padInline}px`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: isTop ? 'center' : 'center',
      alignItems: 'flex-start',
      pointerEvents: 'none',
      zIndex: 9500,
      opacity: op,
      transform: `translateY(${visible ? 0 : (isTop ? -16 : 16)}px)`,
      transition: 'opacity 200ms ease, transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
    }}>
      {eyebrow ? (
        <div style={{
          fontFamily: F.mono, fontWeight: 500,
          fontSize: sz.eyebrowSz, letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: T.accent,
          marginBottom: 10,
        }}>{eyebrow}</div>
      ) : null}
      <h2 style={{
        fontFamily: F.display, fontWeight: 300,
        fontSize: sz.titleSz, lineHeight: 1.08,
        letterSpacing: '-0.025em',
        color: T.inkPrimary,
        margin: 0,
        maxWidth: 1600,
        textWrap: 'balance',
        fontVariationSettings: '"SOFT" 60, "opsz" 100',
      }}>{renderTitle(title)}</h2>
    </div>
  )
}

// ─── FocusVignette — darken everything outside a region ────────────────────
//
// Spotlight effect: dim the entire canvas except a specified rectangular
// region. Used to direct attention without text annotations.
function FocusVignette({ visible, rect = null }) {
  if (!visible) return null
  const r = rect || { x: 0, y: 0, w: 1920, h: 1080 }
  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none',
      zIndex: 7000,
      opacity: 0.55,
      background: `
        linear-gradient(rgba(26,22,18,0.5), rgba(26,22,18,0.5))
      `,
      // Inverted mask cuts the rect out
      WebkitMask: `
        linear-gradient(#fff, #fff),
        linear-gradient(#fff, #fff)
      `,
      WebkitMaskClip: 'border-box, border-box',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      transition: 'opacity 240ms ease',
    }} />
  )
}

// ─── Spotlight — focus annotation for a specific UI element ────────────────
function Spotlight({
  x, y, w, h,
  eyebrow, label,
  side = 'bottom',          // 'bottom' | 'top' | 'right' | 'left'
  visible = true,
  color = T.accent,
  offset = 24,
  labelWidth = 320,
}) {
  // Animate visibility
  const op = visible ? 1 : 0

  // Calculate annotation anchor
  let labelX, labelY, lineFrom, lineTo
  const cx = x + w / 2
  const cy = y + h / 2

  if (side === 'bottom') {
    labelX = cx - labelWidth / 2
    labelY = y + h + offset + 14
    lineFrom = { x: cx, y: y + h }
    lineTo   = { x: cx, y: labelY - 14 }
  } else if (side === 'top') {
    labelX = cx - labelWidth / 2
    labelY = y - offset - 80
    lineFrom = { x: cx, y: y }
    lineTo   = { x: cx, y: labelY + 84 }
  } else if (side === 'right') {
    labelX = x + w + offset + 14
    labelY = cy - 40
    lineFrom = { x: x + w, y: cy }
    lineTo   = { x: labelX - 14, y: cy }
  } else { // left
    labelX = x - offset - labelWidth - 14
    labelY = cy - 40
    lineFrom = { x: x, y: cy }
    lineTo   = { x: labelX + labelWidth + 14, y: cy }
  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none', zIndex: 7000,
      opacity: op,
      transition: 'opacity 280ms ease',
    }}>
      {/* Glow ring around target */}
      <div style={{
        position: 'absolute',
        left: x - 6, top: y - 6,
        width: w + 12, height: h + 12,
        borderRadius: 10,
        border: `2px solid ${color}`,
        boxShadow: `0 0 0 3px rgba(229, 201, 136, 0.40), 0 0 22px rgba(181, 138, 63, 0.20)`,
        background: 'transparent',
        animation: visible ? 'spotlightPulse 1.8s ease-in-out infinite' : 'none',
        willChange: 'box-shadow',
      }} />

      {/* Leader line via SVG */}
      <svg style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none',
      }}>
        <line x1={lineFrom.x} y1={lineFrom.y} x2={lineTo.x} y2={lineTo.y}
              stroke={color} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
        <circle cx={lineTo.x} cy={lineTo.y} r="3" fill={color} />
      </svg>

      {/* Annotation card */}
      <div style={{
        position: 'absolute', left: labelX, top: labelY,
        width: labelWidth,
        padding: '14px 18px',
        background: T.bgRaised,
        border: `1px solid ${T.accentBorder}`,
        borderRadius: 8,
        boxShadow: '0 10px 28px rgba(26,22,18,0.18)',
      }}>
        {eyebrow ? (
          <div style={{ ...TextStyle.label, color: T.accent, fontSize: 10, marginBottom: 6 }}>
            {eyebrow}
          </div>
        ) : null}
        <div style={{ ...TextStyle.body, color: T.inkPrimary, fontSize: 14, lineHeight: 1.5 }}>
          {label}
        </div>
      </div>
    </div>
  )
}

// ─── WalkthroughPanel — the persistent description card ────────────────────
//
// A small dark card pinned to the bottom-left of the canvas with:
//   STEP indicator (mono eyebrow)
//   Title (display)
//   Body copy (descriptive walkthrough text)
//
//   <WalkthroughPanel step="03 / 11" title="Filling the brief"
//                     body="The agency types the trip facts..."
//                     visible={true} />
function WalkthroughPanel({
  step,
  title,
  body,
  visible = true,
  position = 'bottom-left',  // 'bottom-left' | 'bottom-right' | 'bottom-center'
  accent,
}) {
  const positions = {
    'bottom-left':   { left: 40,   right: 'auto', bottom: 40, transform: 'none' },
    'bottom-right':  { left: 'auto', right: 40,   bottom: 40, transform: 'none' },
    'bottom-center': { left: '50%', right: 'auto', bottom: 40, transform: 'translateX(-50%)' },
  }
  const pos = positions[position] || positions['bottom-left']

  return (
    <div style={{
      position: 'absolute',
      ...pos,
      width: 560,
      padding: '24px 28px 26px',
      background: T.panelBg,
      border: `1px solid ${T.panelBg}`,
      borderRadius: 10,
      boxShadow: '0 20px 48px rgba(26,22,18,0.28)',
      opacity: visible ? 1 : 0,
      transform: `${pos.transform} translateY(${visible ? 0 : 10}px)`,
      transition: 'opacity 380ms ease, transform 380ms ease',
      zIndex: 9500,
      pointerEvents: 'none',
    }}>
      {/* Top row: step indicator + accent rule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <span style={{
          fontFamily: F.mono, fontSize: 11, fontWeight: 500,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: accent || T.panelAccent,
        }}>{step}</span>
        <span style={{ flex: 1, height: 1, background: 'rgba(250,248,243,0.14)' }} />
      </div>

      {title ? (
        <h3 style={{
          ...TextStyle.subheading,
          color: T.panelInk,
          fontSize: 20, fontWeight: 500,
          margin: '0 0 10px',
          letterSpacing: '-0.005em',
        }}>{title}</h3>
      ) : null}

      <div style={{
        ...TextStyle.body,
        color: T.panelInkDim,
        fontSize: 15, lineHeight: 1.55,
      }}>{body}</div>
    </div>
  )
}

Object.assign(window, {
  T, F, TextStyle,
  PortalShell, PageHeader, StatusBadge, Button, Chip, Field, Input,
  Cursor, fade, Toast,
  PipelineStepper, AuditEntry, AuditLog, PricingBreakdown,
  Spotlight, WalkthroughPanel,
  BrowserFrame, StatementCard, FloatingCaption, CameraZoom,
  BigCallout, FocusVignette,
})

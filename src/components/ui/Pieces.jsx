import { FILLS } from '../../styles/tokens.js'
import { useI18n } from '../../lib/i18n.jsx'

/** Filled pill tag — the category marker. Poppins 400, per the style guide. */
export function Tag({ children, tone = 'purple', size = 'lg' }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: FILLS[tone] ?? FILLS.purple,
        border: '1px solid var(--yn-ink)',
        borderRadius: 'var(--yn-r-pill)',
        padding: size === 'sm' ? '5px 16px' : '6px 20px',
        fontFamily: 'var(--yn-display)',
        fontWeight: 400,
        fontSize: size === 'sm' ? 14 : 16,
        lineHeight: 1.3,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

/** Unfilled outline pill — the snapshot badge, in the body face at 13. */
export function Badge({ children, tone = 'ink' }) {
  return (
    <span
      style={{
        display: 'inline-block',
        border: `1px solid ${tone === 'ink' ? 'var(--yn-ink)' : FILLS[tone]}`,
        borderRadius: 'var(--yn-r-pill)',
        padding: '5px 18px',
        fontSize: 'var(--yn-small)',
        lineHeight: 1.3,
      }}
    >
      {children}
    </span>
  )
}

/** The "The Api" pill — Poppins 400 16, fixed width, coloured outline. */
export function PanelBadge({ children, tone = 'purple' }) {
  return (
    <span
      style={{
        border: `1px solid ${FILLS[tone]}`,
        borderRadius: 'var(--yn-r-pill)',
        padding: '6px 12px',
        fontFamily: 'var(--yn-display)',
        fontWeight: 400,
        fontSize: 16,
        width: 110,
        textAlign: 'center',
        flex: '0 0 auto',
      }}
    >
      {children}
    </span>
  )
}

/** The mono chip that labels a turn in the chat transcript. */
export function MonoChip({ children }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: 'var(--yn-white)',
        borderRadius: 4,
        padding: '2px 8px',
        fontFamily: 'var(--yn-mono)',
        fontSize: 10,
        letterSpacing: '0.08em',
      }}
    >
      {children}
    </span>
  )
}

/** A section hairline. Carries data-rule so the motion system draws it. */
export function Rule({ animate = true }) {
  return (
    <hr
      data-rule={animate ? '' : undefined}
      style={{ border: 0, borderTop: '1px solid var(--yn-purple)', margin: 0 }}
    />
  )
}

/** Micro label — 11px, uppercase, tracked. */
export function Micro({ children, style, as: Element = 'div' }) {
  return (
    <Element className="yn-micro" style={style}>
      {children}
    </Element>
  )
}

/** The page frame: 1440 max, 64px gutters. */
export function Frame({ children, as: Element = 'div', style, ...rest }) {
  return (
    <Element
      style={{
        maxWidth: 'var(--yn-frame)',
        margin: '0 auto',
        padding: '0 var(--yn-gutter)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Element>
  )
}

/** A section inside the frame — 96px of vertical rhythm. */
export function Section({ children, style, ...rest }) {
  return (
    <section style={{ padding: 'var(--yn-section) 0', ...style }} {...rest}>
      {children}
    </section>
  )
}

/** Display heading. */
export function Display({ children, size = 'h2', as: Element = 'h2', style }) {
  return (
    <Element
      className="yn-display"
      style={{
        fontSize: `var(--yn-${size})`,
        lineHeight: 1.05,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </Element>
  )
}

/** A page's opening: display title with an optional subline beneath it. */
export function PageHeading({ children, sub, size = 'h1' }) {
  return (
    <header style={{ marginBottom: 48 }}>
      <Display as="h1" size={size}>
        {children}
      </Display>
      {sub ? (
        <p
          className="yn-display"
          style={{ fontSize: 'var(--yn-h3)', lineHeight: 1.2, margin: '10px 0 0' }}
        >
          {sub}
        </p>
      ) : null}
    </header>
  )
}

/**
 * Where photography goes but none is licensed yet — renders at the true aspect
 * ratio with a description of what belongs there, so dropping the real image in
 * needs no change to the layout.
 */
export function PhotoPlaceholder({ ratio = '3 / 1', label, radius = 'band' }) {
  const { t } = useI18n()

  return (
    <div
      role="img"
      aria-label={t('common.photoPlaceholderLabel', { label })}
      style={{
        aspectRatio: ratio,
        width: '100%',
        background: 'var(--yn-grey-dark)',
        borderRadius: `var(--yn-r-${radius})`,
        display: 'grid',
        placeItems: 'center',
        padding: 16,
        textAlign: 'center',
      }}
    >
      <span className="yn-micro" style={{ color: 'var(--yn-white)', opacity: 0.85 }}>
        {t('common.photoPlaceholder', { label })}
      </span>
    </div>
  )
}

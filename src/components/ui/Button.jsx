import { Link } from 'react-router-dom'
import { FILLS } from '../../styles/tokens.js'

/**
 * Every actionable thing is a full pill with a 1px ink outline. The fill
 * carries the meaning; on hover the pill inverts to ink and the fill becomes
 * the label colour. Sizes and colours are the template's, not invented.
 */

const SIZES = {
  lg: { padding: '14px 30px', fontSize: 'var(--yn-small)' },
  sm: { padding: '9px 22px', fontSize: 'var(--yn-micro)' },
}

/**
 * Colour is expressed only as custom properties; `.yn-btn` in tokens.css paints
 * both states from them. An unfilled pill fills purple on hover rather than
 * inverting to ink, which is what the style guide specifies.
 */
function baseStyle(tone, size) {
  const filled = tone !== 'ghost'
  const fill = FILLS[tone] ?? FILLS.white

  return {
    display: 'inline-block',
    border: `1px solid ${filled ? 'var(--yn-ink)' : 'var(--yn-purple)'}`,
    borderRadius: 'var(--yn-r-pill)',
    letterSpacing: '0.09em',
    textTransform: 'uppercase',
    lineHeight: 1.2,
    cursor: 'pointer',
    '--yn-btn-bg': filled ? fill : 'transparent',
    '--yn-btn-fg': 'var(--yn-ink)',
    ...(filled
      ? {}
      : { '--yn-btn-hover-bg': 'var(--yn-purple)', '--yn-btn-hover-fg': 'var(--yn-ink)' }),
    ...SIZES[size],
  }
}

export function Button({ children, tone = 'white', size = 'lg', to, href, style, ...rest }) {
  const merged = { ...baseStyle(tone, size), ...style }
  const className = 'yn-btn'

  if (to) {
    return (
      <Link to={to} className={className} style={merged} {...rest}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a
        href={href}
        className={className}
        style={merged}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
        {...rest}
      >
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={className} style={{ ...merged, font: 'inherit' }} {...rest}>
      {children}
    </button>
  )
}

/** The 44px circular arrow. Inverts to ink like every other control. */
export function ArrowButton({ size = 44 }) {
  return (
    <span
      aria-hidden="true"
      className="yn-btn"
      style={{
        width: size,
        height: size,
        flex: `0 0 ${size}px`,
        border: '1px solid var(--yn-ink)',
        borderRadius: 'var(--yn-r-pill)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        '--yn-btn-bg': 'var(--yn-white)',
      }}
    >
      →
    </span>
  )
}

/** A full-width pill row with a label and a trailing arrow. */
export function PillRow({ children, to, href, meta }) {
  const inner = (
    <>
      <span
        className="yn-display"
        style={{ fontSize: 'var(--yn-h3)', lineHeight: 1.15 }}
      >
        {children}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 20, marginInlineStart: 'auto' }}>
        {meta ? (
          <span style={{ fontSize: 'var(--yn-small)', color: 'var(--yn-grey-dark)' }}>
            {meta}
          </span>
        ) : null}
        <ArrowButton />
      </span>
    </>
  )

  const style = {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    width: '100%',
    padding: '10px 10px 10px 28px',
    border: '1px solid var(--yn-purple)',
    borderRadius: 'var(--yn-r-pill)',
  }

  return href ? (
    <a className="yn-card-hover" href={href} style={style} target="_blank" rel="noreferrer noopener">
      {inner}
    </a>
  ) : (
    <Link className="yn-card-hover" to={to} style={style}>
      {inner}
    </Link>
  )
}

import { FILLS } from '../../styles/tokens.js'
import { Link, useI18n } from '../../lib/i18n.jsx'

/**
 * Every actionable thing is a full pill with a 1px ink outline. The fill
 * carries the meaning; on hover the pill inverts to ink and the fill becomes
 * the label colour. Sizes and colours are the template's, not invented.
 */

/**
 * The vertical padding is deliberately uneven. Type is not centred inside its
 * own line box — the face keeps room under the baseline for descenders that
 * uppercase labels never use — so equal padding leaves the label riding high
 * in the pill. The pixel moved from the bottom to the top on each size puts
 * the letters in the middle of the shape.
 */
const SIZES = {
  lg: { padding: '15px 30px 13px', fontSize: 'var(--yn-small)' },
  sm: { padding: '11px 22px 7px', fontSize: 'var(--yn-micro)' },
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
  const { t } = useI18n()

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
      {t('common.forwardArrow')}
    </span>
  )
}

/**
 * A full-width pill row with a label, what it holds, and the way in.
 *
 * The shape is a grid, and it lives in `tokens.css` under `.yn-pill-row`
 * rather than here — the row changes at a breakpoint, and a breakpoint is
 * something a stylesheet can say and an inline style cannot. It used to be an
 * inline flex row that wrapped, which is exactly what broke it on a phone:
 * the count and the arrow dropped under a long title and the row grew to
 * twice its neighbours' height. Nothing wraps now but the words.
 *
 * The title and its count share a wrapper because on a phone they are one
 * sentence: the count moves inside the title's own text and is bracketed by
 * the stylesheet. The brackets are not in the content — they belong to the
 * layout, and the same words are read out as one line either way.
 */
export function PillRow({ children, to, href, meta }) {
  const inner = (
    <>
      <span className="yn-pill-row__text">
        <span className="yn-display yn-pill-row__title">{children}</span>
        {meta ? <span className="yn-pill-row__meta">{meta}</span> : null}
      </span>
      <span className="yn-pill-row__arrow">
        <ArrowButton />
      </span>
    </>
  )

  return href ? (
    <a
      className="yn-card-hover yn-pill-row"
      href={href}
      target="_blank"
      rel="noreferrer noopener"
    >
      {inner}
    </a>
  ) : (
    <Link className="yn-card-hover yn-pill-row" to={to}>
      {inner}
    </Link>
  )
}

import { useI18n } from '../lib/i18n.jsx'

/**
 * Brand marks, transcribed verbatim from the Claude Design source.
 *
 * The wordmark, the dot, the arch unit and the schematic step glyph are all
 * defined once as SVG <symbol>s and referenced with <use>, exactly as the
 * template does it — one definition, many sizes, no duplicated path data.
 *
 * Mount <BrandDefs /> once near the root; everything else references it.
 */

/* Blocked lowercase "younit", 340 x 80. Square counter in the o. */
const WORDMARK = (
  <g>
    <rect x="0" y="0" width="22" height="50" />
    <rect x="26" y="0" width="22" height="76" />
    <rect x="0" y="44" width="48" height="12" />
    <path fillRule="evenodd" d="M94 0a38 38 0 1 0 0 76 38 38 0 1 0 0-76ZM82 26h24v24H82Z" />
    <rect x="140" y="0" width="22" height="76" />
    <rect x="166" y="0" width="22" height="76" />
    <rect x="140" y="54" width="48" height="22" />
    <rect x="196" y="0" width="22" height="76" />
    <rect x="196" y="0" width="48" height="22" />
    <rect x="222" y="0" width="22" height="76" />
    <rect x="252" y="0" width="22" height="76" />
    <rect x="246" y="0" width="34" height="12" />
    <rect x="246" y="64" width="34" height="12" />
    <rect x="298" y="0" width="22" height="76" />
    <rect x="288" y="10" width="42" height="12" />
    <rect x="288" y="64" width="42" height="12" />
  </g>
)

/** One arch unit in flat isometric, 146 x 176. `fill` is the front face. */
function archUnit(fill) {
  return (
    <>
      <polygon points="0,26 26,0 146,0 120,26" fill="var(--yn-ink)" />
      <polygon points="120,26 146,0 146,150 120,176" fill="var(--yn-ink)" />
      <rect x="0" y="26" width="120" height="150" fill={fill} stroke="var(--yn-ink)" strokeWidth="3" />
      <path d="M37 176 V101 a23 23 0 0 1 46 0 V176 Z" fill="var(--yn-grey)" stroke="var(--yn-ink)" strokeWidth="3" />
    </>
  )
}

export function BrandDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="wm" viewBox="0 0 340 80">
          <g fill="var(--yn-ink)">{WORDMARK}</g>
        </symbol>
        <symbol id="wm-w" viewBox="0 0 340 80">
          <g fill="var(--yn-white)">{WORDMARK}</g>
        </symbol>
        <symbol id="dot" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M12 0a12 12 0 1 0 0 24 12 12 0 1 0 0-24ZM8 8h8v8H8Z"
            fill="currentColor"
          />
        </symbol>
        <symbol id="archunit" viewBox="0 0 146 176">
          {archUnit('var(--yn-blue)')}
        </symbol>
        <symbol id="archunit-p" viewBox="0 0 146 176">
          {archUnit('var(--yn-purple)')}
        </symbol>
      </defs>
    </svg>
  )
}

/** The wordmark. `tone="light"` is the reversed cut, for ink and blue grounds. */
/**
 * The Arabic wordmark — "يونِت" — drawn with the same skeleton and letterforms
 * as the Latin one, traced from the brand PDF's own vector (page 5, "Arabic
 * Logo A"). It takes `currentColor`, so the light and dark variants are the
 * same mark.
 */
const WORDMARK_AR = (
  <>
    <path d="M 140.7 53.1 L 199.6 53.1 L 199.6 0 L 140.7 0 Z M 140.7 53.1 " />
    <path d="M 72.7 53.1 L 131.5 53.1 L 131.5 0 L 72.7 0 Z M 72.7 53.1 " />
    <path d="M 796.4 275.2 L 855.2 275.2 L 855.2 222.2 L 796.4 222.2 Z M 796.4 275.2 " />
    <path d="M 728.3 275.2 L 787.2 275.2 L 787.2 222.2 L 728.3 222.2 Z M 728.3 275.2 " />
    <path d="M 714 139.7 L 714 229.6 C 714 258.4 690.7 281.7 661.9 281.7 L 661.9 139.7 Z M 714 139.7 " />
    <path d="M 431.7 53.1 L 490.6 53.1 L 490.6 0 L 431.7 0 Z M 431.7 53.1 " />
    <path d="M 347.8 29.8 L 347.8 1.9 L 283.4 1.9 L 283.4 208.7 L 347.8 208.7 L 347.8 180.9 L 347.8 180.9 Z M 347.8 29.8 " />
    <path d="M 574.5 281.7 L 664.1 281.7 L 664.1 222.2 L 574.5 222.2 Z M 574.5 281.7 " />
    <path d="M 212.7 58.6 L 212.7 117.1 C 212.7 134.8 198.3 149.2 180.6 149.2 L 91.7 149.2 C 73.9 149.2 59.5 134.8 59.5 117.1 L 59.5 58.6 L 0 58.6 L 0 208.7 L 272.2 208.7 L 272.2 58.6 Z M 212.7 58.6 " />
    <path d="M 503.8 58.6 L 503.8 117.1 C 503.8 134.8 489.4 149.2 471.7 149.2 L 450.6 149.2 C 432.8 149.2 418.5 134.8 418.5 117.1 L 418.5 58.6 L 358.9 58.6 L 358.9 208.7 L 563.3 208.7 L 563.3 58.6 Z M 503.8 58.6 " />
    <path d="M 714 149.2 L 714 208.7 L 855.2 208.7 L 855.2 58.6 L 795.7 58.6 L 795.7 149.2 Z M 714 149.2 " />
    <path d="M 348.1 245.6 L 348.1 221.6 L 283.8 221.6 L 283.8 257.7 L 265.6 257.7 L 265.6 281.7 L 348.1 281.7 L 348.1 257.7 L 327.8 257.7 L 327.8 245.6 Z M 348.1 245.6 " />
    <path d="M 661.9 137.9 C 661.9 147.3 654.3 154.9 644.9 154.9 L 643.7 154.9 C 634.3 154.9 626.6 147.3 626.6 137.9 L 626.6 126.3 C 626.6 116.9 634.3 109.3 643.7 109.3 L 644.9 109.3 C 654.3 109.3 661.9 116.9 661.9 126.3 Z M 574.5 208.7 L 714 208.7 L 714 58.6 L 574.5 58.6 Z M 574.5 208.7 " />
  </>
)

export function Wordmark({ width = 116, tone = 'dark', style }) {
  const { locale } = useI18n()

  // Arabic has its own wordmark, from the brand PDF. It is the same mark, not a
  // transliteration, so the header carries it wherever the page is Arabic.
  if (locale === 'ar') {
    return (
      <svg
        viewBox="0 0 855.2 281.7"
        role="img"
        aria-label="يونِت"
        fill={tone === 'light' ? 'var(--yn-white)' : 'var(--yn-ink)'}
        style={{ width, height: (width / 855.2) * 281.7, display: 'block', ...style }}
      >
        {WORDMARK_AR}
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 340 80"
      role="img"
      aria-label="younit"
      style={{ width, height: (width / 340) * 80, display: 'block', ...style }}
    >
      <use href={tone === 'light' ? '#wm-w' : '#wm'} />
    </svg>
  )
}

/** Icon A — the o alone. */
export function Dot({ size = 24, style, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size, ...style }} {...rest}>
      <use href="#dot" />
    </svg>
  )
}

/** The mark at text size, as the separator inside the tagline. */
export function Bullet() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ width: 9, height: 9, verticalAlign: 'baseline' }}
    >
      <use href="#dot" />
    </svg>
  )
}

/**
 * A schematic mark: the rising step line, or the three bars.
 *
 * These are drawn inline rather than referenced with <use>, because the motion
 * system animates their stroke — and a <use> instance lives in a shadow tree
 * that `querySelectorAll` cannot reach, which silently made the draw a no-op.
 */
export function Glyph({ kind = 'step', width = 52, height = 38, ...rest }) {
  return (
    <svg viewBox="0 0 48 36" style={{ width, height }} aria-hidden="true" {...rest}>
      {kind === 'bar' ? (
        <g fill="none" stroke="var(--yn-ink)" strokeWidth="2">
          <rect x="10" y="20" width="7" height="12" />
          <rect x="21" y="12" width="7" height="20" />
          <rect x="32" y="6" width="7" height="26" />
        </g>
      ) : (
        <>
          <path
            d="M2 32 L10 32 L10 24 L18 24 L18 27 L26 27 L26 14 L34 14 L34 8 L42 8"
            fill="none"
            stroke="var(--yn-ink)"
            strokeWidth="2"
          />
          <path d="M36 4 L44 4 L44 12" fill="none" stroke="var(--yn-ink)" strokeWidth="2" />
        </>
      )}
    </svg>
  )
}

/**
 * The 5-3-2 pyramid. Coordinates are the template's: units are 146 x 176 on a
 * 120 x 150 lattice inside a 626 x 476 frame, so the extrusions interlock.
 * Painted top row first, so each lower row covers the row behind it.
 */
const UNITS = [
  { x: 180, y: 0, delay: 0.62 },
  { x: 300, y: 0, delay: 0.69 },
  { x: 120, y: 150, delay: 0.4 },
  { x: 240, y: 150, delay: 0.47 },
  { x: 360, y: 150, delay: 0.54 },
  { x: 0, y: 300, delay: 0.06 },
  { x: 120, y: 300, delay: 0.13 },
  { x: 240, y: 300, delay: 0.2 },
  { x: 360, y: 300, delay: 0.27 },
  { x: 480, y: 300, delay: 0.34 },
]

export function ArchPyramid({ tone = 'blue', animate = true, style }) {
  const { t } = useI18n()
  const href = tone === 'purple' ? '#archunit-p' : '#archunit'

  return (
    <svg
      viewBox="0 0 626 476"
      role="img"
      aria-label={t('common.artwork')}
      style={{ width: '100%', height: 'auto', display: 'block', ...style }}
    >
      <g>
        {UNITS.map((u) => (
          <use
            key={`${u.x}-${u.y}`}
            data-unit={animate ? '' : undefined}
            href={href}
            x={u.x}
            y={u.y}
            width="146"
            height="176"
            style={
              animate
                ? {
                    animation: `younit-unit-in 0.62s var(--yn-ease) ${u.delay}s both`,
                  }
                : undefined
            }
          />
        ))}
      </g>
    </svg>
  )
}

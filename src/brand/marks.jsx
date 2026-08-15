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
export function Wordmark({ width = 116, tone = 'dark', style }) {
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
  const href = tone === 'purple' ? '#archunit-p' : '#archunit'

  return (
    <svg
      viewBox="0 0 626 476"
      role="img"
      aria-label="Stacked units — the Younit motif"
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

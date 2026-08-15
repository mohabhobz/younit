/**
 * The design system, as the components address it.
 *
 * `tokens.css` is the source of truth — every value lives there once, and the
 * browser resolves it. This file only names the tokens the components pass to
 * inline styles, so a tone is written in one place instead of being restated
 * as a hex in every component that offers one.
 *
 * Nothing here holds a value. If a colour needs changing, it changes in
 * `tokens.css` and everything follows. `tools/audit-tokens.mjs` fails the build
 * if a literal reappears anywhere a token already covers.
 */

/** The four fills a component can be given, plus the unfilled case. */
export const FILLS = {
  amber: 'var(--yn-amber)',
  blue: 'var(--yn-blue)',
  purple: 'var(--yn-purple)',
  white: 'var(--yn-white)',
  none: 'transparent',
}

export const INK = 'var(--yn-ink)'
export const INK_2 = 'var(--yn-ink-2)'
export const WHITE = 'var(--yn-white)'
export const GREY = 'var(--yn-grey)'

/** The hairline every outline in the system is drawn with. */
export const OUTLINE = `1px solid ${INK}`

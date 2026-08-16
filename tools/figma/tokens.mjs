/**
 * Reads tokens.css and writes the same values in the shape a Figma plugin can
 * build variables from.
 *
 * The stylesheet stays the single source of truth. Nothing here invents a
 * value, renames one, or rounds one: if a colour changes in the CSS, the next
 * run changes it in Figma, and there is never a second list to keep in step.
 *
 * The responsive blocks matter as much as the root one. `--yn-hero` is 76px on
 * a desktop, 58 on a tablet and 42 on a phone — three values for one token,
 * which is exactly what a Figma variable mode is. The three media queries
 * become three modes rather than three separate variables.
 *
 *   node tools/figma/tokens.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const CSS = readFileSync(new URL('../../src/styles/tokens.css', import.meta.url), 'utf8')

/** The widths the stylesheet steps at, named as a designer would say them. */
const MODES = [
  { name: 'Desktop', max: Infinity },
  { name: 'Tablet', max: 1100 },
  { name: 'Mobile', max: 700 },
]

/** Every `--yn-*: value` inside one block of CSS. */
function declarations(block) {
  const out = {}
  for (const m of block.matchAll(/--yn-([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]] = m[2].trim()
  }
  return out
}

/** The `:root { … }` block, and each `@media (max-width: N) { :root { … } }`. */
function blocks() {
  const root = /:root\s*\{([\s\S]*?)\n\}/.exec(CSS)
  const found = [{ max: Infinity, values: declarations(root[1]) }]

  for (const m of CSS.matchAll(/@media \(max-width: (\d+)px\)\s*\{\s*:root\s*\{([\s\S]*?)\n\s*\}/g)) {
    found.push({ max: Number(m[1]), values: declarations(m[2]) })
  }
  return found
}

const all = blocks()
const root = all[0].values

/** The value of one token at one breakpoint: the narrowest block that names it. */
function at(name, max) {
  let value = root[name]
  for (const block of all) {
    if (block.max >= max && block.max !== Infinity && block.values[name] !== undefined) {
      value = block.values[name]
    }
  }
  // Blocks are `max-width`, so a narrower screen inherits every wider block
  // that mentions the token. Walking widest-first leaves the narrowest match.
  const ordered = all.filter((b) => b.max >= max).sort((a, b) => b.max - a.max)
  for (const block of ordered) {
    if (block.values[name] !== undefined) value = block.values[name]
  }
  return value
}

const isColour = (v) => /^#[0-9a-f]{3,8}$/i.test(v)
const isSize = (v) => /^-?[\d.]+px$/.test(v)

const COLOURS = {}
const SIZES = {}
const RADII = {}
const SPACE = {}

for (const [name, value] of Object.entries(root)) {
  if (isColour(value)) {
    COLOURS[name] = value
    continue
  }
  if (!isSize(value)) continue

  const perMode = {}
  for (const mode of MODES) perMode[mode.name] = parseFloat(at(name, mode.max))

  if (name.startsWith('r-')) RADII[name] = perMode
  else if (['frame', 'gutter', 'section'].includes(name)) SPACE[name] = perMode
  else SIZES[name] = perMode
}

/**
 * The text styles the site actually uses, each naming the size token it is
 * drawn from. A style bound to a variable follows the mode: switch a frame to
 * Mobile and every heading in it resizes, which is the whole point of doing it
 * this way rather than pasting numbers.
 */
const TEXT = [
  { name: 'Display/Hero', size: 'hero', family: 'display', weight: 300, lh: 'lh-hero' },
  { name: 'Display/H1', size: 'h1', family: 'display', weight: 300, lh: 1.05 },
  { name: 'Display/H2', size: 'h2', family: 'display', weight: 300, lh: 1.1 },
  { name: 'Display/H3', size: 'h3', family: 'display', weight: 300, lh: 1.15 },
  { name: 'Display/Eyebrow', size: 'eyebrow', family: 'display', weight: 300, lh: 'lh-eyebrow' },
  { name: 'Display/Card title', size: 'card-title', family: 'display', weight: 400, lh: 1.2 },
  { name: 'Display/Stat', size: 'stat', family: 'display', weight: 300, lh: 1 },
  { name: 'Body/Regular', size: 'body-size', family: 'body', weight: 400, lh: 1.6 },
  { name: 'Body/Small', size: 'small', family: 'body', weight: 400, lh: 1.5 },
  { name: 'Mono/Label', size: 'mono-size', family: 'mono', weight: 400, lh: 1.4, tracking: 0.08 },
  { name: 'Mono/Micro', size: 'micro', family: 'mono', weight: 400, lh: 1.4, tracking: 0.08 },
]

const FAMILIES = {
  display: { family: 'Poppins', styles: { 300: 'Light', 400: 'Regular' } },
  body: { family: 'Anybody', styles: { 300: 'Light', 400: 'Regular', 348: 'Regular' } },
  mono: { family: 'IBM Plex Mono', styles: { 400: 'Regular', 500: 'Medium' } },
  arabic: { family: 'IBM Plex Sans Arabic', styles: { 400: 'Regular' } },
}

const out = {
  modes: MODES.map((m) => m.name),
  colours: COLOURS,
  sizes: SIZES,
  radii: RADII,
  space: SPACE,
  text: TEXT,
  families: FAMILIES,
  // Anybody is a variable font and the site pins its axes. Figma needs telling,
  // or every line of body copy is drawn at a width the design never uses.
  bodyVariation: root['body-variation'],
}

// Written as source rather than data: a Figma plugin loads exactly one script
// and has no module system, so the values have to arrive inside it.
mkdirSync(new URL('../../figma-plugin/src/', import.meta.url), { recursive: true })
writeFileSync(
  new URL('../../figma-plugin/src/00-tokens.js', import.meta.url),
  '/* Generated by tools/figma/tokens.mjs from src/styles/tokens.css. Do not edit. */\n' +
    `const TOKENS = ${JSON.stringify(out, null, 2)}\n`,
)

console.log(
  `${Object.keys(COLOURS).length} colours, ${Object.keys(SIZES).length} sizes ` +
    `x ${MODES.length} modes, ${Object.keys(RADII).length} radii, ` +
    `${Object.keys(SPACE).length} spacing, ${TEXT.length} text styles ` +
    '→ figma-plugin/src/00-tokens.js',
)

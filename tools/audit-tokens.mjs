/**
 * Design-system and source audit.
 *
 * Asks one question of the source: is a value that the design system already
 * names being written out by hand somewhere instead?
 *
 * It reads `src/styles/tokens.css`, builds a map of every custom property to
 * its value, and then walks the components and pages looking for literals that
 * match one. A colour, a size, a radius or a rhythm value that a token already
 * carries is a failure — that is the definition of drifting off the system. A
 * literal with no matching token is reported as a count only: the template has
 * genuine one-offs, and inventing a token for each would be its own kind of
 * mess.
 *
 * It also counts inline style objects per file, so the balance between
 * components and hand-written style stays visible rather than assumed, and it
 * fails on a comment written in Arabic: the site is bilingual, the source is
 * not — every comment in it is English, so anyone can maintain it.
 *
 *   node tools/audit-tokens.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SRC = join(ROOT, 'src')
const TOKENS = join(SRC, 'styles/tokens.css')

/** Files that are allowed to hold raw values: the token sheet defines them. */
const ALLOWED = new Set(['src/styles/tokens.css'])

/** Brand artwork is drawn in absolute coordinates and colours by definition. */
const ARTWORK = /^src\/brand\//

const tokenSource = readFileSync(TOKENS, 'utf8')
const root = tokenSource.slice(tokenSource.indexOf(':root'), tokenSource.indexOf('@media'))

/**
 * A token only stands in for a value of its own kind: 48px is the h2 size and
 * it is not a 48px gap. So tokens are filed by kind, and each style property
 * is only compared against the kind it could actually be written in.
 */
const KIND = (name) => {
  if (/^--yn-r-/.test(name)) return 'radius'
  if (/^--yn-(frame|gutter|section)$/.test(name)) return 'rhythm'
  if (/^--yn-(hero|h1|h2|h2-journey|eyebrow|h3|card-title|track-title|stat|stat-2|body-size|small|micro|mono-size)$/.test(name))
    return 'type'
  return 'colour'
}

const PROPERTY_KIND = {
  fontSize: 'type',
  borderRadius: 'radius',
  maxWidth: 'rhythm',
  padding: 'rhythm',
  gap: 'rhythm',
}

/** kind → (value → the token that already carries it) */
const byValue = new Map([
  ['colour', new Map()],
  ['type', new Map()],
  ['radius', new Map()],
  ['rhythm', new Map()],
])
for (const [, name, value] of root.matchAll(/(--yn-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
  const clean = value.trim().toLowerCase()
  const bucket = byValue.get(KIND(name))
  if (bucket && !bucket.has(clean)) bucket.set(clean, name)
}
const colours = byValue.get('colour')

const files = []
;(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) walk(path)
    else if (/\.jsx?$/.test(entry)) files.push(path)
  }
})(SRC)

/**
 * Arabic in the source is a string for a reader, not a note for a developer.
 * The dictionary and the translated content are where it belongs; a comment or
 * an identifier is not.
 */
const ARABIC = /[\u0600-\u06FF\u0750-\u077F]/
const SPEAKS_ARABIC = new Set([
  'src/lib/i18n.jsx', // the language's own name, in its own script
  'tools/check-menu.mjs', // asserts on that name
])

const failures = []
const inline = []
let unnamedColours = 0
let unnamedSizes = 0

for (const path of files) {
  const rel = relative(ROOT, path)
  if (ALLOWED.has(rel)) continue
  const source = readFileSync(path, 'utf8')
  const artwork = ARTWORK.test(rel)

  if (!SPEAKS_ARABIC.has(rel)) {
    source.split('\n').forEach((line, i) => {
      const comment = line.match(/\/\/(.*)$|\/\*(.*)$|^\s*\*(.*)$/)
      if (comment && ARABIC.test(comment[0])) {
        failures.push(`${rel}:${i + 1}  comment is not in English`)
      }
    })
  }

  const styleBlocks = source.match(/style={{/g)?.length ?? 0
  if (styleBlocks) inline.push([rel, styleBlocks])

  // Colours, artwork excepted.
  for (const match of source.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g)) {
    const literal = match[0].toLowerCase()
    const expanded =
      literal.length === 4 ? `#${[...literal.slice(1)].map((c) => c + c).join('')}` : literal
    const token = colours.get(expanded) ?? colours.get(literal)
    if (token) {
      const line = source.slice(0, match.index).split('\n').length
      failures.push(`${rel}:${line}  ${match[0]} is ${token}`)
    } else if (!artwork) {
      unnamedColours++
    }
  }

  // Sizes written as a bare number in a style object: fontSize: 15.
  for (const match of source.matchAll(
    /\b(fontSize|borderRadius|padding|gap|maxWidth):\s*'?"?(\d+)(px)?'?"?/g,
  )) {
    const token = byValue.get(PROPERTY_KIND[match[1]])?.get(`${match[2]}px`)
    if (token) {
      const line = source.slice(0, match.index).split('\n').length
      failures.push(`${rel}:${line}  ${match[1]}: ${match[2]} is ${token}`)
    } else {
      unnamedSizes++
    }
  }
}

const totalInline = inline.reduce((sum, [, n]) => sum + n, 0)
const tokenRefs = files.reduce(
  (sum, path) => sum + (readFileSync(path, 'utf8').match(/var\(--yn-/g)?.length ?? 0),
  0,
)

console.log(`${files.length} source files`)
console.log(`${[...byValue.values()].reduce((n, m) => n + m.size, 0)} tokens defined, ${tokenRefs} references to them in the source`)
console.log(`${totalInline} inline style objects across ${inline.length} files`)
console.log(
  `${unnamedColours} colour literals and ${unnamedSizes} size literals with no token to use`,
)
console.log('\ninline style objects, heaviest first:')
for (const [file, count] of inline.sort((a, b) => b[1] - a[1]).slice(0, 8)) {
  console.log(`  ${String(count).padStart(3)}  ${file}`)
}

if (failures.length) {
  console.log(`\n${failures.length} FAILURES:`)
  for (const f of failures.slice(0, 40)) console.log(`  ✗ ${f}`)
  process.exitCode = 1
} else {
  console.log(
    '\nPASS — every value reads its token, and every comment is in English',
  )
}

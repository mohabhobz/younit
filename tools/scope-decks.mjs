/**
 * Turn the standalone lesson decks into page fragments the site can render.
 *
 * Each deck arrived as a complete HTML document with its own reset, its own
 * `body`, `header` and `h1` rules, and its own scripts. Framed in an iframe
 * that was fine. Rendered inside the site it is not: `*{margin:0}` would reset
 * the whole page and `header{text-align:center}` would hit the site's own
 * header.
 *
 * So every selector is rewritten to sit under `.yn-deck`, and the document
 * wrapper is dropped. The markup, the copy and the scripts are untouched —
 * this only changes where the styles are allowed to reach.
 *
 * Run once; already-converted files are left alone, so it is safe to re-run.
 *
 *   node tools/scope-decks.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import postcss from 'postcss'
import parser from 'postcss-selector-parser'

const SCOPE = 'yn-deck'
const ROOT = new URL('..', import.meta.url).pathname
const SESSIONS = join(ROOT, 'public/sessions')

/** `html`, `body` and `:root` all mean "the deck root" once the deck is a div. */
const ROOT_SELECTORS = new Set(['html', 'body'])

/**
 * `weight` is how many times the scope class is repeated. The decks get one;
 * the theme sheet gets two.
 *
 * The theme used to win collisions by loading after each deck's own <style>.
 * Rendered inside the site the deck's styles travel with its markup, so they
 * land last in the document and that ordering is gone. Repeating the class
 * makes the theme outrank the deck on a tie, which is what "loads after" meant
 * in the first place — and it no longer depends on where anything is inserted.
 */
const makeScoper = (weight) =>
  parser((selectors) => {
    selectors.each((selector) => {
      const first = selector.first
      if (!first) return

      const isRoot =
        (first.type === 'tag' && ROOT_SELECTORS.has(first.value)) ||
        (first.type === 'pseudo' && first.value === ':root')

      // `body{...}` becomes the scope itself; `body .card{...}` keeps the rest.
      if (isRoot) first.remove()
      else if (first.type === 'class' && first.value === SCOPE) return // already scoped
      else if (selector.first) selector.prepend(parser.combinator({ value: ' ' }))

      for (let i = 0; i < weight; i++) {
        selector.prepend(parser.className({ value: SCOPE }))
      }
    })
  })

const scopers = { 1: makeScoper(1), 2: makeScoper(2) }

/** Rules inside these at-rules describe frames or faces, not elements. */
const OPAQUE_AT_RULES = new Set(['keyframes', 'font-face', 'property'])

function scopeCss(css, from, weight = 1) {
  const root = postcss.parse(css, { from })
  const scope = scopers[weight]

  root.walkRules((rule) => {
    for (let node = rule.parent; node; node = node.parent) {
      if (node.type === 'atrule' && OPAQUE_AT_RULES.has(node.name.replace(/^-\w+-/, ''))) {
        return
      }
    }
    // Rejoin through `selectors` rather than rewriting the raw string: it
    // splits on top-level commas only, and it drops the source's line breaks,
    // which would otherwise land between the scope and the selector it scopes.
    rule.selectors = rule.selectors.map((one) => scope.processSync(one.trim()))
  })

  return root.toString()
}

/**
 * A `next session` button was written for the iframe: it set `window.top`
 * directly. Inside the site it should be a link, so the router can handle it
 * and so it reads as a link to a keyboard and a screen reader.
 */
function buttonsToLinks(html) {
  return html.replace(
    /<button([^>]*?)onclick="window\.top\.location='([^']+)'"([^>]*)>([\s\S]*?)<\/button>/g,
    (_, before, href, after, label) => `<a${before}href="${href}"${after}>${label}</a>`,
  )
}

function convert(file) {
  const source = readFileSync(file, 'utf8')

  if (!/<!DOCTYPE/i.test(source)) return { file, skipped: true }

  const style = source.match(/<style>([\s\S]*?)<\/style>/)
  const body = source.match(/<body>([\s\S]*?)<\/body>/)
  if (!style || !body) throw new Error(`${file}: expected one <style> and one <body>`)

  // Everything the head pulled in, in the order it pulled it in. The loader
  // re-creates these; a <link> or <script> set through innerHTML does not run.
  const head = source.slice(0, source.indexOf('<style>'))
  const assets = [...head.matchAll(/<(?:link|script)\b[^>]*>(?:<\/script>)?/g)]
    .map((m) => m[0])
    .filter((tag) => !/<meta|<title/i.test(tag))
  const late = [...source.matchAll(/<link\b[^>]*>/g)]
    .map((m) => m[0])
    .filter((tag) => !assets.includes(tag))

  const scoped = scopeCss(style[1], file)
  const markup = buttonsToLinks(body[1]).trim()

  const fragment = `<!-- Younit lesson deck — a fragment, not a document.

     Rendered into the site by src/pages/SessionDeck.jsx. Every style below is
     scoped to .yn-deck, so nothing here reaches the page around it and nothing
     out there reaches in. Generated from the original standalone deck by
     tools/scope-decks.mjs; the markup and the copy are as they were written. -->
${[...assets, ...late].join('\n')}
<style>
${scoped.trim()}
</style>
<div class="${SCOPE}">
${markup}
</div>
`

  writeFileSync(file, fragment)
  return { file, assets: assets.length + late.length, bytes: fragment.length }
}

const files = readdirSync(SESSIONS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) =>
    readdirSync(join(SESSIONS, d.name))
      .filter((f) => f.endsWith('.html'))
      .map((f) => join(SESSIONS, d.name, f)),
  )

let converted = 0
for (const file of files) {
  const result = convert(file)
  if (result.skipped) console.log(`· already a fragment  ${file.replace(ROOT, '')}`)
  else {
    converted++
    console.log(`✓ ${file.replace(ROOT, '')}  (${result.assets} assets)`)
  }
}

// The theme sheet carries the same document-level selectors, so it needs the
// same treatment — otherwise loading it would restate the site's own tokens.
const theme = join(ROOT, 'public/vendor/deck.css')
const themeCss = readFileSync(theme, 'utf8')
if (!themeCss.includes(`.${SCOPE}`)) {
  writeFileSync(theme, scopeCss(themeCss, theme, 2))
  console.log('✓ public/vendor/deck.css scoped')
}

console.log(`\n${converted} decks converted, ${files.length - converted} already fragments`)

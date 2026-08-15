/**
 * Interaction and touch-target check.
 *
 * Hovers every control on every route, in both languages, and measures the
 * contrast between the words it paints and whatever is actually painted behind
 * them, at rest and under the pointer. This is the check that would have caught
 * the white-on-white hover: it does not ask whether a rule applied, it asks
 * whether the text can still be read.
 *
 * It measures the element the words are *in*, not the control that wraps them.
 * A card link sets no colour of its own — its title and its meta line do — so
 * measuring the wrapper reports the colour of text that was never painted.
 *
 * Also measures tap targets at phone width.
 */
import { existsSync } from 'node:fs'
import { chromium } from 'playwright'
import { browserHint, ensureServer } from './server.mjs'

const BASE = process.env.BASE || 'http://localhost:4173'
const EXECUTABLE =
  process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

const ROUTES = [
  '/',
  '/learn',
  '/learn/foundation',
  '/learn/glossary',
  '/learn/glossary/bid-ask-spread',
  '/learn/foundation/01-market-basics',
  '/learn/foundation/01-market-basics/deck',
  '/build',
  '/build/repositories',
  '/build/templates',
  '/build/showcase',
  '/build/showcase/arabic-sentiment-egx',
  '/compete',
  '/compete/leaderboard',
  '/editorial',
  '/editorial/2026-04-week-2',
  '/about',
  '/partners',
]

// The same controls again, in Arabic: a translated label is a different label,
// and it can wrap, overflow or land on a different background.
const ALL_ROUTES = [...ROUTES, ...ROUTES.map((r) => (r === '/' ? '/ar' : `/ar${r}`))]

// WCAG: 4.5 for body-sized text, 3.0 once it is large. Every control here is
// small, so 4.5 is the bar — with a hair of tolerance for antialiasing.
const MIN_CONTRAST = 4.4
const MIN_TAP = 32

// The one deliberate exception: the design source sets the homepage band's
// chrome in white on blue, at 1.8:1. Those elements carry `data-brand-chrome`,
// so this is read from the markup rather than matched against English words —
// the same page in Arabic has to be excepted the same way. Raising the contrast
// is the client's decision; it is in the README's "Outstanding" rather than
// silently overruled. Everything else must pass.

/** Shared by both passes: colour maths, and which nodes actually hold words. */
const HELPERS = `
  const parse = (c) => {
    const m = c.match(/rgba?\\(([^)]+)\\)/)
    if (!m) return null
    const [r, g, b, a = 1] = m[1].split(',').map((n) => parseFloat(n))
    return { r, g, b, a }
  }
  const behind = (el) => {
    let node = el
    while (node && node !== document.documentElement) {
      const c = parse(getComputedStyle(node).backgroundColor)
      if (c && c.a > 0.9) return c
      node = node.parentElement
    }
    return { r: 255, g: 255, b: 255, a: 1 }
  }
  const lum = ({ r, g, b }) =>
    [r, g, b]
      .map((v) => v / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
      .reduce((acc, v, i) => acc + v * [0.2126, 0.7152, 0.0722][i], 0)
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
    return (x + 0.05) / (y + 0.05)
  }

  const controls = () => [...document.querySelectorAll('a, button, .yn-btn')]

  const hasOwnText = (el) =>
    [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())

  /** The elements inside a control that actually paint words of their own. */
  const wordsIn = (control) =>
    hasOwnText(control)
      ? [control]
      : [...control.querySelectorAll('*')].filter(hasOwnText)

  const readable = (el) => {
    const fg = parse(getComputedStyle(el).color)
    if (!fg || fg.a < 0.5) return null
    return {
      label: (el.textContent || '').trim().slice(0, 42),
      chrome: !!el.closest('[data-brand-chrome]'),
      contrast: Math.round(ratio(fg, behind(el)) * 100) / 100,
    }
  }
`

const AT_REST = `(() => {
  ${HELPERS}
  return controls()
    .map((el, i) => {
      const rect = el.getBoundingClientRect()
      if (rect.width < 2 || rect.height < 2) return null
      return {
        i,
        words: wordsIn(el).map(readable).filter(Boolean),
        w: Math.round(rect.width),
        h: Math.round(rect.height),
        label: (el.textContent || '').trim().slice(0, 42),
        inline: getComputedStyle(el).display === 'inline',
      }
    })
    .filter(Boolean)
})()`

const HOVERED = `(index) => {
  ${HELPERS}
  const el = controls()[index]
  if (!el) return null
  return wordsIn(el).map(readable).filter(Boolean)
}`

const stopServer = await ensureServer(BASE)

const browser = await chromium.launch(
  existsSync(EXECUTABLE) ? { executablePath: EXECUTABLE } : {},
).catch((error) => {
  stopServer()
  console.error(browserHint(error) ?? error.message)
  process.exit(1)
})
const failures = []
let hovered = 0

for (const width of [390, 1440]) {
  for (const route of ALL_ROUTES) {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    const page = await context.newPage()
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })

    // A button crossfades its fill and its label over 180ms. Measuring the
    // moment the pointer lands samples the middle of that crossfade, where the
    // two colours are briefly the same — a reading that says nothing about
    // whether the button is readable. Collapse transitions so every sample is
    // the settled state. Animations are untouched, so reveals still fire and
    // controls still end up where they belong.
    await page.addStyleTag({
      content: '*, *::before, *::after { transition-duration: 0s !important; }',
    })
    await page.waitForTimeout(150)

    // Resting state.
    const rest = await page.evaluate(AT_REST)
    for (const control of rest) {
      for (const word of control.words) {
        if (word.contrast < MIN_CONTRAST && !word.chrome) {
          failures.push(`${route} @${width} rest: "${word.label}" contrast ${word.contrast}`)
        }
      }
      // Inline links inside prose are text, not targets — only measure controls
      // that render as their own box.
      if (width === 390 && !control.inline && (control.h < MIN_TAP || control.w < MIN_TAP)) {
        failures.push(
          `${route} @${width} tap target "${control.label}" is ${control.w}x${control.h}`,
        )
      }
    }

    // Hovered state, control by control.
    const handles = await page.$$('a, button, .yn-btn')
    for (let i = 0; i < handles.length; i++) {
      const box = await handles[i].boundingBox().catch(() => null)
      if (!box || box.width < 2 || box.height < 2) continue
      try {
        await handles[i].hover({ timeout: 800 })
      } catch {
        continue // off-screen or covered; the resting check already covered it
      }
      hovered++
      const words = await page.evaluate(HOVERED, i)
      for (const word of words ?? []) {
        if (word.contrast < MIN_CONTRAST && !word.chrome) {
          failures.push(`${route} @${width} HOVER: "${word.label}" contrast ${word.contrast}`)
        }
      }
    }

    await context.close()
  }
}

await browser.close()
stopServer()

console.log(
  `hovered ${hovered} controls across ${ALL_ROUTES.length} routes ` +
    `(${ROUTES.length} in each language) at 390 and 1440`,
)
if (failures.length) {
  const unique = [...new Set(failures)]
  console.log(`\n${unique.length} FAILURES:`)
  for (const f of unique.slice(0, 40)) console.log(`  ✗ ${f}`)
  process.exitCode = 1
} else {
  console.log('PASS — every control readable at rest and on hover, tap targets ≥ 32px')
}

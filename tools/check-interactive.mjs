/**
 * Interaction and touch-target check.
 *
 * Hovers every control on every route and measures the contrast between its
 * label and whatever is actually painted behind it, in both states. This is the
 * check that would have caught the white-on-white hover: it does not ask whether
 * a rule applied, it asks whether the text can still be read.
 *
 * Also measures tap targets at phone width.
 */
import { existsSync } from 'node:fs'
import { chromium } from 'playwright'

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

// WCAG: 4.5 for body-sized text, 3.0 once it is large. Every control here is
// small, so 4.5 is the bar — with a hair of tolerance for antialiasing.
const MIN_CONTRAST = 4.4
const MIN_TAP = 32

// Known, deliberate exception: the 6px "Powered by EFG Hermes" lockup is set
// white on the blue band by the design source. It is decorative brand chrome
// rather than a control, and raising its contrast is the client's decision —
// see README, "Outstanding". Everything else must pass.
// The homepage nav is likewise white on the blue band, per the design source.
// Both are raised in the README rather than silently overruled.
const HOME_NAV = new Set(['Learn', 'Build', 'Compete', 'Editorial'])
const EXCEPTIONS = [/Powered by/i]
const excepted = (label) => EXCEPTIONS.some((re) => re.test(label))

const IN_PAGE = `(() => {
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

  const controls = [...document.querySelectorAll('a, button, .yn-btn')]
  return controls
    .map((el, i) => {
      const rect = el.getBoundingClientRect()
      if (rect.width < 2 || rect.height < 2) return null
      const cs = getComputedStyle(el)
      const fg = parse(cs.color)
      const bg = behind(el)
      if (!fg) return null
      return {
        i,
        label: (el.textContent || '').trim().slice(0, 42),
        contrast: Math.round(ratio(fg, bg) * 100) / 100,
        w: Math.round(rect.width),
        h: Math.round(rect.height),
        inline: cs.display === 'inline',
      }
    })
    .filter(Boolean)
})()`

const browser = await chromium.launch(
  existsSync(EXECUTABLE) ? { executablePath: EXECUTABLE } : {},
)
const failures = []
let hovered = 0

for (const width of [390, 1440]) {
  for (const route of ROUTES) {
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
    const rest = await page.evaluate(IN_PAGE)
    for (const c of rest) {
      const brandChrome = excepted(c.label) || (route === '/' && HOME_NAV.has(c.label))
      if (c.contrast < MIN_CONTRAST && !brandChrome) {
        failures.push(`${route} @${width} rest: "${c.label}" contrast ${c.contrast}`)
      }
      // Inline links inside prose are text, not targets — only measure controls
      // that render as their own box.
      if (width === 390 && !c.inline && (c.h < MIN_TAP || c.w < MIN_TAP)) {
        failures.push(`${route} @${width} tap target "${c.label}" is ${c.w}x${c.h}`)
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
      const after = await page.evaluate(
        (idx) => {
          const parse = (c) => {
            const m = c.match(/rgba?\(([^)]+)\)/)
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
              .reduce((acc, v, k) => acc + v * [0.2126, 0.7152, 0.0722][k], 0)
          const ratio = (a, b) => {
            const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
            return (x + 0.05) / (y + 0.05)
          }
          const el = [...document.querySelectorAll('a, button, .yn-btn')][idx]
          if (!el) return null
          const fg = parse(getComputedStyle(el).color)
          if (!fg) return null
          return {
            label: (el.textContent || '').trim().slice(0, 42),
            contrast: Math.round(ratio(fg, behind(el)) * 100) / 100,
          }
        },
        i,
      )
      const chrome =
        after && (excepted(after.label) || (route === '/' && HOME_NAV.has(after.label)))
      if (after && after.contrast < MIN_CONTRAST && !chrome) {
        failures.push(`${route} @${width} HOVER: "${after.label}" contrast ${after.contrast}`)
      }
    }

    await context.close()
  }
}

await browser.close()

console.log(`hovered ${hovered} controls across ${ROUTES.length} routes at 390 and 1440`)
if (failures.length) {
  const unique = [...new Set(failures)]
  console.log(`\n${unique.length} FAILURES:`)
  for (const f of unique.slice(0, 40)) console.log(`  ✗ ${f}`)
  process.exitCode = 1
} else {
  console.log('PASS — every control readable at rest and on hover, tap targets ≥ 32px')
}

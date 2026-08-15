/**
 * Lesson-deck check.
 *
 * The thirteen decks are the client's own teaching material, re-themed rather
 * than rewritten, and now rendered inside the site rather than framed in an
 * iframe. This walks each deck at its real route and fails on anything either
 * change could plausibly have broken:
 *
 *   - unreadable text at rest or under the pointer, a stray colour from the
 *     previous brand, a chart that did not draw, a page that scrolls sideways;
 *   - a deck style leaking out — the header and footer around the deck are
 *     compared, property by property, against the same chrome on a page with
 *     no deck on it;
 *   - a request leaving the machine, or a script throwing.
 */
import { existsSync } from 'node:fs'
import { chromium } from 'playwright'
import { browserHint, ensureServer } from './server.mjs'
import { deckMaps } from '../src/lib/sessions.js'

const BASE = process.env.BASE || 'http://localhost:4173'
const EXECUTABLE =
  process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const MIN_CONTRAST = 4.4

/** A route with the site chrome and no deck, to measure the chrome against. */
const CONTROL = '/learn/foundation/01-market-basics'
const CONTROL_AR = '/ar/learn/foundation/01-market-basics'

// Hues that belonged to the previous brand. None may survive anywhere.
const RETIRED = [
  'rgb(201, 168, 76)', 'rgb(45, 212, 191)', 'rgb(129, 140, 248)',
  'rgb(10, 14, 20)', 'rgb(17, 24, 39)', 'rgb(30, 45, 66)', 'rgb(226, 232, 240)',
]

// Each deck twice: it is translated, so the Arabic one is its own page with
// its own scripts, its own charts and its own direction.
const decks = Object.entries(deckMaps).flatMap(([collection, { map }]) =>
  Object.keys(map).flatMap((slug) =>
    ['', '/ar'].map((prefix) => ({
      route: `${prefix}/learn/${collection}/${slug}/deck`,
      name: `${prefix ? 'ar ' : ''}${collection}/${slug}`,
    })),
  ),
)

/** The site's own chrome, as the browser resolves it. */
const CHROME = `(() => {
  const pick = (el, props) => {
    if (!el) return null
    const cs = getComputedStyle(el)
    return Object.fromEntries(props.map((p) => [p, cs[p]]))
  }
  const box = ['backgroundColor', 'padding', 'display', 'gap', 'fontSize', 'fontFamily']
  const header = document.body.querySelector(':scope > div > header')
  const footer = document.body.querySelector(':scope > div > footer')
  const link = header?.querySelector('a')
  return {
    header: pick(header, box),
    footer: pick(footer, box),
    link: pick(link, ['color', 'fontSize', 'letterSpacing', 'textTransform']),
    headerHeight: header ? Math.round(header.getBoundingClientRect().height) : 0,
  }
})()`

const PROBE = `(() => {
  const parse = (c) => {
    const m = c.match(/rgba?\\(([^)]+)\\)/)
    if (!m) return null
    const [r, g, b, a = 1] = m[1].split(',').map((n) => parseFloat(n))
    return { r, g, b, a }
  }
  const behind = (el) => {
    let n = el
    while (n && n !== document.documentElement) {
      const c = parse(getComputedStyle(n).backgroundColor)
      if (c && c.a > 0.9) return c
      n = n.parentElement
    }
    return { r: 255, g: 255, b: 255, a: 1 }
  }
  const lum = ({ r, g, b }) =>
    [r, g, b].map((v) => v / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
      .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0)
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
    return (x + 0.05) / (y + 0.05)
  }

  const deck = document.querySelector('.yn-deck')
  if (!deck) return { missing: true }

  const bad = []
  const seen = new Set()
  deck.querySelectorAll('*').forEach((el) => {
    const txt = (el.textContent || '').trim()
    if (!txt || el.childElementCount) return
    const cs = getComputedStyle(el)
    const fg = parse(cs.color)
    if (!fg || fg.a < 0.5) return
    const r = ratio(fg, behind(el))
    if (r < ${MIN_CONTRAST}) {
      const key = txt.slice(0, 30) + cs.color
      if (!seen.has(key)) { seen.add(key); bad.push({ txt: txt.slice(0, 30), color: cs.color, r: Math.round(r * 100) / 100 }) }
    }
  })

  const palette = new Set()
  deck.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el)
    palette.add(cs.color)
    palette.add(cs.backgroundColor)
    palette.add(cs.borderTopColor)
  })

  const heading = deck.querySelector('h1, h2, .section-title')
  const rect = deck.getBoundingClientRect()

  return {
    bad,
    palette: [...palette],
    ground: getComputedStyle(deck).backgroundColor,
    displayFont: (getComputedStyle(heading || deck).fontFamily || '').split(',')[0],
    canvases: deck.querySelectorAll('canvas').length,
    blankCanvases: [...deck.querySelectorAll('canvas')].filter((c) => !c.width || !c.height).length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    // The opening screen reads from the left gutter now, like every other page.
    headingLeft: heading ? Math.round(heading.getBoundingClientRect().left) : null,
    headingAlign: heading ? getComputedStyle(heading).textAlign : null,
    left: Math.round(rect.left),
  }
})()`

/** One control's label against whatever is painted behind it, right now. */
const HOVERED = `(index) => {
  const parse = (c) => {
    const m = c.match(/rgba?\\(([^)]+)\\)/)
    if (!m) return null
    const [r, g, b, a = 1] = m[1].split(',').map((n) => parseFloat(n))
    return { r, g, b, a }
  }
  const behind = (el) => {
    let n = el
    while (n && n !== document.documentElement) {
      const c = parse(getComputedStyle(n).backgroundColor)
      if (c && c.a > 0.9) return c
      n = n.parentElement
    }
    return { r: 255, g: 255, b: 255, a: 1 }
  }
  const lum = ({ r, g, b }) =>
    [r, g, b].map((v) => v / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
      .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0)
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
    return (x + 0.05) / (y + 0.05)
  }

  const el = [...document.querySelectorAll('.yn-deck a, .yn-deck button')][index]
  if (!el) return null
  const fg = parse(getComputedStyle(el).color)
  if (!fg) return null
  return {
    label: (el.textContent || '').trim().slice(0, 34),
    contrast: Math.round(ratio(fg, behind(el)) * 100) / 100,
  }
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

for (const width of [390, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: 1000 } })
  const page = await context.newPage()

  // The chrome as it looks with no deck on the page, in each language.
  await page.goto(`${BASE}${CONTROL}`, { waitUntil: 'networkidle' })
  const controlEn = await page.evaluate(CHROME)
  await page.goto(`${BASE}${CONTROL_AR}`, { waitUntil: 'networkidle' })
  const controlAr = await page.evaluate(CHROME)
  await context.close()

  for (const deck of decks) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } })
    const page = await context.newPage()
    const external = []
    const errors = []
    page.on('request', (r) => {
      const u = r.url()
      if (!u.startsWith(BASE) && !u.startsWith('data:')) external.push(u.slice(0, 60))
    })
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 90)))
    page.on('pageerror', (e) => errors.push(e.message.slice(0, 90)))

    await page.goto(`${BASE}${deck.route}`, { waitUntil: 'networkidle' })
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.9
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 40))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(400)

    // Hovered state, control by control. A deck's controls are the client's
    // own markup restyled, so this is where a half-applied hover shows up: a
    // rule that repaints the label without repainting the fill leaves the two
    // the same colour. Transitions are collapsed so each sample is settled.
    await page.addStyleTag({
      content: '*, *::before, *::after { transition-duration: 0s !important; }',
    })
    const controls = await page.$$('.yn-deck a, .yn-deck button')
    for (let i = 0; i < controls.length; i++) {
      const box = await controls[i].boundingBox().catch(() => null)
      if (!box || box.width < 2 || box.height < 2) continue
      try {
        await controls[i].hover({ timeout: 700 })
      } catch {
        continue // covered or off-screen; the resting pass already saw it
      }
      const after = await page.evaluate(HOVERED, i)
      if (after && after.contrast < MIN_CONTRAST) {
        failures.push(
          `${deck.name} @${width} HOVER: "${after.label}" contrast ${after.contrast}`,
        )
      }
    }

    // Back to a resting page: the last control is still under the pointer, and
    // its hover state would otherwise be read as how the page normally looks.
    await page.mouse.move(1, 1)
    await page.evaluate(() => window.scrollTo(0, 0))

    const r = await page.evaluate(PROBE)
    const chrome = await page.evaluate(CHROME)
    const name = `${deck.name} @${width}`

    if (r.missing) {
      failures.push(`${name}: the deck did not render`)
      await context.close()
      continue
    }

    for (const b of r.bad.slice(0, 4)) {
      failures.push(`${name}: "${b.txt}" ${b.color} contrast ${b.r}`)
    }
    const retired = r.palette.filter((c) => RETIRED.includes(c))
    if (retired.length) failures.push(`${name}: retired colour still painted ${retired.join(', ')}`)
    if (r.ground !== 'rgb(215, 215, 215)') failures.push(`${name}: ground is ${r.ground}, expected the grey`)
    if (r.displayFont && !/Poppins/.test(r.displayFont)) failures.push(`${name}: headings set in ${r.displayFont}`)
    if (r.overflow > 1) failures.push(`${name}: horizontal overflow ${r.overflow}px`)
    if (r.blankCanvases) failures.push(`${name}: ${r.blankCanvases} chart canvases never drew`)
    if (r.headingAlign === 'center') failures.push(`${name}: the opening heading is still centred`)
    if (external.length) failures.push(`${name}: reached ${[...new Set(external)].join(', ')}`)
    if (errors.length) failures.push(`${name}: ${errors[0]}`)

    // Nothing in the deck may reach the site's own header and footer.
    const control = deck.route.startsWith('/ar') ? controlAr : controlEn
    for (const part of ['header', 'footer', 'link']) {
      for (const [prop, value] of Object.entries(control[part] ?? {})) {
        if (chrome[part]?.[prop] !== value) {
          failures.push(`${name}: site ${part} ${prop} is ${chrome[part]?.[prop]}, not ${value}`)
        }
      }
    }

    await context.close()
  }
}

await browser.close()
stopServer()

console.log(
  `${decks.length} deck pages checked in place ` +
    `(${decks.length / 2} in each language) at 390 and 1440`,
)
if (failures.length) {
  const unique = [...new Set(failures)]
  console.log(`\n${unique.length} FAILURES:`)
  for (const f of unique.slice(0, 40)) console.log(`  ✗ ${f}`)
  process.exitCode = 1
} else {
  console.log(
    'PASS — Younit ground and faces, left-aligned, charts drawn, chrome untouched, nothing external',
  )
}

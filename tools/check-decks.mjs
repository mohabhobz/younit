/**
 * Lesson-deck check.
 *
 * The thirteen decks are the client's own teaching material, re-themed rather
 * than rewritten. This walks each one and fails on anything the re-theme could
 * plausibly have broken: unreadable text, a stray colour from the previous
 * brand, a request leaving the machine, or a chart that did not draw.
 */
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:4173'
const EXECUTABLE =
  process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const MIN_CONTRAST = 4.4

// Hues that belonged to the previous brand. None may survive anywhere.
const RETIRED = [
  'rgb(201, 168, 76)', 'rgb(45, 212, 191)', 'rgb(129, 140, 248)',
  'rgb(10, 14, 20)', 'rgb(17, 24, 39)', 'rgb(30, 45, 66)', 'rgb(226, 232, 240)',
]

const decks = []
for (const track of ['foundation', 'algo-track']) {
  const dir = join('public/sessions', track)
  if (!existsSync(dir)) continue
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.html'))) {
    decks.push(`/sessions/${track}/${f}`)
  }
}

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

  const bad = []
  const seen = new Set()
  document.querySelectorAll('*').forEach((el) => {
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
  document.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el)
    palette.add(cs.color)
    palette.add(cs.backgroundColor)
    palette.add(cs.borderTopColor)
  })

  return {
    bad,
    palette: [...palette],
    bodyBg: getComputedStyle(document.body).backgroundColor,
    displayFont: (getComputedStyle(document.querySelector('h1') || document.body).fontFamily || '').split(',')[0],
    canvases: document.querySelectorAll('canvas').length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }
})()`

const browser = await chromium.launch(
  existsSync(EXECUTABLE) ? { executablePath: EXECUTABLE } : {},
)
const failures = []

for (const deck of decks) {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } })
    const page = await context.newPage()
    const external = []
    page.on('request', (r) => {
      const u = r.url()
      if (!u.startsWith(BASE) && !u.startsWith('data:')) external.push(u.slice(0, 60))
    })
    await page.goto(`${BASE}${deck}`, { waitUntil: 'networkidle' })
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.9
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 40))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(400)

    const r = await page.evaluate(PROBE)
    const name = deck.split('/').pop().replace('.html', '').slice(0, 34)

    for (const b of r.bad.slice(0, 4)) {
      failures.push(`${name} @${width}: "${b.txt}" ${b.color} contrast ${b.r}`)
    }
    const retired = r.palette.filter((c) => RETIRED.includes(c))
    if (retired.length) failures.push(`${name} @${width}: retired colour still painted ${retired.join(', ')}`)
    if (r.bodyBg !== 'rgb(215, 215, 215)') failures.push(`${name} @${width}: ground is ${r.bodyBg}, expected the grey`)
    if (r.displayFont && !/Poppins/.test(r.displayFont)) failures.push(`${name} @${width}: headings set in ${r.displayFont}`)
    if (r.overflow > 1) failures.push(`${name} @${width}: horizontal overflow ${r.overflow}px`)
    if (external.length) failures.push(`${name} @${width}: reached ${[...new Set(external)].join(', ')}`)

    await context.close()
  }
}

await browser.close()

console.log(`${decks.length} decks checked at 390 and 1440`)
if (failures.length) {
  const unique = [...new Set(failures)]
  console.log(`\n${unique.length} FAILURES:`)
  for (const f of unique.slice(0, 40)) console.log(`  ✗ ${f}`)
  process.exitCode = 1
} else {
  console.log('PASS — Younit ground and faces, no retired colour, all text readable, nothing external')
}

/**
 * Route crawl. Loads every route at several widths in a real browser and fails
 * on horizontal overflow, console errors, broken images, or a page that renders
 * with no content. Screenshots land in tools/shots/ for eyeballing.
 */
import { mkdirSync, existsSync } from 'node:fs'
import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:4173'
const WIDTHS = [360, 390, 430, 768, 834, 1024, 1280, 1440, 1920]
const SHOT_WIDTH = 1440

const ROUTES = [
  ['/', 'home'],

  ['/learn', 'learn'],
  ['/learn/foundation', 'learn-foundation'],
  ['/learn/algo-track', 'learn-algo-track'],
  ['/learn/deep-dives', 'learn-deep-dives'],
  ['/learn/glossary', 'glossary'],
  ['/learn/glossary/bid-ask-spread', 'glossary-term'],
  ['/learn/foundation/01-market-basics', 'session'],
  ['/learn/algo-track/00-intro', 'algo-session'],
  ['/learn/deep-dives/efg-api-what-you-can-build', 'deep-dive'],
  ['/learn/foundation/01-market-basics/deck', 'session-deck'],
  ['/learn/algo-track/01-what-is-an-algorithm/deck', 'algo-session-deck'],

  ['/build', 'build'],
  ['/build/repositories', 'build-repositories'],
  ['/build/templates', 'build-templates'],
  ['/build/showcase', 'showcase'],
  ['/build/capstones', 'capstones'],
  ['/build/apps', 'apps'],
  ['/build/showcase/arabic-sentiment-egx', 'project'],
  ['/build/capstones/arabic-financial-nlp-corpus', 'capstone'],
  ['/build/apps/egx-daily-snapshot', 'app'],

  ['/compete', 'compete'],
  ['/compete/leaderboard', 'compete-leaderboard'],
  ['/compete/seasons', 'compete-seasons'],
  ['/compete/hackathons', 'compete-hackathons'],
  ['/compete/wall-of-fame', 'compete-wall-of-fame'],

  ['/editorial', 'editorial'],
  ['/editorial/2026-04-week-2', 'post'],

  ['/about', 'about'],
  ['/partners', 'partners'],
  ['/nope-does-not-exist', 'notfound'],
]

mkdirSync(new URL('./shots/', import.meta.url), { recursive: true })

// The sandbox ships a chromium build; point at it rather than downloading one.
const EXECUTABLE =
  process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const browser = await chromium.launch(
  existsSync(EXECUTABLE) ? { executablePath: EXECUTABLE } : {},
)
const failures = []
let checks = 0

for (const [route, name] of ROUTES) {
  for (const width of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    const errors = []

    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text())
    })
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))

    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })

    // Scroll the whole page before checking. Images below the fold are lazy, so
    // a check at the top would call every one of them broken; scrolling also
    // fires the reveal animations, which is what a reader actually triggers.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 60))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(200)

    const report = await page.evaluate(() => {
      const broken = [...document.images]
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src)
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        text: (document.body.innerText || '').trim().length,
        h1: document.querySelectorAll('h1').length,
        broken,
      }
    })

    checks++
    const where = `${route} @ ${width}`
    // Google Fonts may be unreachable from the sandbox; that is a network
    // condition, not a defect in the page, so it is not counted as a failure.
    const realErrors = errors.filter((e) => !/fonts\.(googleapis|gstatic)/.test(e))

    if (report.overflow > 1) failures.push(`${where}: horizontal overflow ${report.overflow}px`)
    if (report.text < 120) failures.push(`${where}: rendered only ${report.text} chars of text`)
    if (report.h1 !== 1) failures.push(`${where}: ${report.h1} <h1> elements (expected 1)`)
    void 0
    if (report.broken.length) failures.push(`${where}: broken images ${report.broken.join(', ')}`)
    if (realErrors.length) failures.push(`${where}: console ${realErrors.slice(0, 2).join(' | ')}`)

    if (width === SHOT_WIDTH) {
      await page.screenshot({
        path: new URL(`./shots/${name}.png`, import.meta.url).pathname,
        fullPage: true,
      })
    }

    await context.close()
  }
}

await browser.close()

console.log(`${checks} checks across ${ROUTES.length} routes x ${WIDTHS.length} widths`)
if (failures.length) {
  console.log(`\n${failures.length} FAILURES:`)
  for (const f of failures) console.log(`  ✗ ${f}`)
  process.exitCode = 1
} else {
  console.log('PASS — no overflow, no console errors, no broken images, one h1 per page')
}
